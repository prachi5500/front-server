import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { authRequired, adminRequired } from '../middleware/auth.js';
import Payment from '../models/Payment.js';
import Template from '../models/Template.js';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import { PDFDocument } from 'pdf-lib';

// Node 18+ has global fetch; if running older Node, ensure `node-fetch` is available.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

const paymentNotifier = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post('/create-order', authRequired, async (req, res) => {
  try {
    const { amount } = req.body || {};
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'amount (number, in rupees) required' });
    }

    const options = {
      amount: Math.round(amount * 100), // rupees -> paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ order });
  } catch (e) {
    console.error('Razorpay create-order error', e);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
router.post('/verify', authRequired, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment data' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Fetch full payment details from Razorpay
    let paymentDetails = null;
    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (fetchErr) {
      console.error('Failed to fetch Razorpay payment details', fetchErr);
    }

    const method = paymentDetails?.method || null; // card, upi, netbanking, wallet
    let payment_type = null;
    if (method === 'upi') payment_type = 'UPI';
    else if (method === 'card') payment_type = 'Card';
    else if (method === 'netbanking') payment_type = 'Netbanking';
    else if (method === 'wallet') payment_type = 'Wallet';

    const acquirer = paymentDetails?.acquirer_data || {};
    const bank_reference_id =
      acquirer.upi_transaction_id ||
      acquirer.bank_transaction_id ||
      acquirer.rrn ||
      null;

    const card_last4 = paymentDetails?.card?.last4 || null;
    const issuer_bank = paymentDetails?.bank || paymentDetails?.card?.issuer || null;

    const status = paymentDetails?.status || 'success';

    const amountFromGateway = paymentDetails?.amount != null
      ? Math.round(paymentDetails.amount / 100)
      : null;

    const amount = req.body.amount || amountFromGateway;

    const customer_name = req.body.customer_name || null;
    const customer_phone = req.body.customer_phone || paymentDetails?.contact || null;
    const live_location = req.body.live_location || null;

    const address_line1 = req.body.address_line1 || null;
    const address_line2 = req.body.address_line2 || null;
    const city = req.body.city || null;
    const state = req.body.state || null;
    const pincode = req.body.pincode || null;

    // Frontend se aane wale ordered cards
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    // Save successful payment in DB
    try {
      const createdPayment = await Payment.create({
        user: req.user._id,
        email: req.user.email,
        amount: amount || null,
        currency: 'INR',
        razorpay_order_id,
        razorpay_payment_id,
        status,
        customer_name,
        customer_phone,
        live_location,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        payment_type,
        payment_method: method,
        bank_reference_id,
        card_last4,
        issuer_bank,
        items,
        payment_method_details: paymentDetails || null,
      });

      // After payment create: generate combined PDF for each item (front+back) asynchronously
      (async function generatePdfsAndSave() {
        try {
          if (!(Array.isArray(items) && items.length > 0)) return;

          // fetch the created payment doc fresh
          const paymentDoc = await Payment.findById(createdPayment._id);
          if (!paymentDoc) return;

          let modified = false;

          for (let i = 0; i < paymentDoc.items.length; i++) {
            const it = paymentDoc.items[i];
            if ((it.frontImageUrl || it.backImageUrl) && !it.pdfUrl) {
              try {
                const pdfDoc = await PDFDocument.create();

                const addImagePage = async (imageUrl) => {
                  if (!imageUrl) return false;
                  try {
                    const resp = await fetch(imageUrl);
                    if (!resp.ok) return false;
                    const arrayBuffer = await resp.arrayBuffer();
                    const bytes = new Uint8Array(arrayBuffer);
                    // detect simple image type from headers
                    const ct = resp.headers.get('content-type') || '';
                    let img;
                    if (ct.includes('png')) img = await pdfDoc.embedPng(bytes);
                    else img = await pdfDoc.embedJpg(bytes);

                    const page = pdfDoc.addPage();
                    const { width, height } = img.scale(1);
                    const pageWidth = page.getWidth();
                    const pageHeight = page.getHeight();
                    // scale image to fit page
                    const scale = Math.min(pageWidth / width, pageHeight / height);
                    const imgWidth = width * scale;
                    const imgHeight = height * scale;
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2;
                    page.drawImage(img, { x, y, width: imgWidth, height: imgHeight });
                    return true;
                  } catch (e) {
                    console.error('Failed to embed image for pdf', imageUrl, e);
                    return false;
                  }
                };

                let addedFront = false;
                let addedBack = false;
                if (it.frontImageUrl) addedFront = await addImagePage(it.frontImageUrl);
                if (it.backImageUrl) addedBack = await addImagePage(it.backImageUrl);

                // If no images embedded, skip
                if (!addedFront && !addedBack) continue;

                const pdfBytes = await pdfDoc.save();
                const b64 = Buffer.from(pdfBytes).toString('base64');
                const dataUri = `data:application/pdf;base64,${b64}`;

                // upload to cloudinary
                try {
                  const uploadRes = await cloudinary.uploader.upload(dataUri, {
                    folder: 'purchased_cards',
                    resource_type: 'raw',
                    overwrite: true,
                  });
                  if (uploadRes && uploadRes.secure_url) {
                    it.pdfUrl = uploadRes.secure_url;
                    modified = true;
                  }
                } catch (uploadErr) {
                  console.error('Failed to upload pdf to cloudinary', uploadErr);
                }
              } catch (itmErr) {
                console.error('Error generating PDF for item', it, itmErr);
              }
            }
          }

          if (modified) {
            try {
              await paymentDoc.save();
            } catch (saveErr) {
              console.error('Failed to save paymentDoc with pdfUrls', saveErr);
            }
          }
        } catch (outerErr) {
          console.error('Error in generatePdfsAndSave background task', outerErr);
        }
      })();

      // Sirf success/captured par hi email bhejo
      if (status === 'captured' || status === 'success') {
        // Admin ko email notification
        try {
          const subject = `New payment from ${customer_name || req.user.email}`;
          const lines = [
            `User: ${req.user.email}`,
            `Amount: ₹${amount || '-'} ${'INR'}`,
            `Status: ${status}`,
            `Customer: ${customer_name || '-'} (${customer_phone || '-'})`,
            `Payment type: ${payment_type || '-'} (${method || '-'})`,
            `Order ID: ${razorpay_order_id}`,
            `Payment ID: ${razorpay_payment_id}`,
            `Bank Ref / UPI: ${bank_reference_id || '-'}`,
            `Card last4: ${card_last4 || '-'}`,
            `Issuer: ${issuer_bank || '-'}`,
            `Location: ${live_location || '-'}`,
            `Address: ${[address_line1, address_line2, city, state, pincode].filter(Boolean).join(', ') || '-'}`,
            `Created at: ${new Date().toISOString()}`,
          ];

          await paymentNotifier.sendMail({
            from: process.env.CONTACT_FROM,
            to: process.env.CONTACT_TO, // yahi admin email hoga
            subject,
            text: lines.join('\n'),
          });
        } catch (mailErr) {
          console.error('Failed to send payment notification email', mailErr);
        }

        // Agar frontend ne kisi item ko `saveAsTemplate` mark kiya hai, to woh templates ke roop me save kar do
        try {
          if (Array.isArray(items) && items.length > 0) {
            for (const it of items) {
              try {
                if (it && it.saveAsTemplate) {
                  await Template.create({
                    name: it.templateName || `Custom card ${Date.now()}`,
                    status: 'published',
                    config: it.data?.frontData || it.data || {},
                    background_url: it.frontImageUrl || null,
                    back_background_url: it.backImageUrl || null,
                    thumbnail_url: it.frontImageUrl || it.backImageUrl || null,
                    price: it.price || 0,
                    created_by: req.user._id,
                  });
                }
              } catch (tplErr) {
                console.error('Failed to save custom template for item', it, tplErr);
              }
            }
          }
        } catch (tplLoopErr) {
          console.error('Error while attempting to save custom templates', tplLoopErr);
        }
      }
    } catch (dbErr) {
      console.error('Failed to save payment record', dbErr);
    }

    res.json({ success: true });
  } catch (e) {
    console.error('Razorpay verify error', e);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// User: list own payments (orders)
router.get('/my', authRequired, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ payments });
  } catch (e) {
    console.error('Error fetching user payments', e);
    res.status(500).json({ error: 'Failed to load your payments' });
  }
});

// Admin: list all payments
router.get('/admin-list', authRequired, adminRequired, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();
    res.json({ payments });
  } catch (e) {
    console.error('Error fetching payments', e);
    res.status(500).json({ error: 'Failed to load payments' });
  }
});

export default router;