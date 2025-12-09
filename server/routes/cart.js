// import express from 'express';
// import mongoose from 'mongoose';
// import Cart from '../models/Cart.js';
// import { authRequired } from '../middleware/auth.js';

// const router = express.Router();

// // Helper function to handle errors
// const handleError = (res, error, status = 500) => {
//   console.error('Cart Error:', error);
//   res.status(status).json({
//     success: false,
//     message: error.message || 'An error occurred while processing your request',
//     ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
//   });
// };

// // Get user's cart
// router.get('/', authRequired, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user._id });
    
//     if (!cart) {
//       // Return empty array if no cart exists yet
//       return res.json([]);
//     }
    
//     res.json({
//       success: true,
//       data: cart.items,
//       lastUpdated: cart.updatedAt
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// // Add or update item in cart
// router.post('/items', authRequired, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     const { item } = req.body;
    
//     if (!item || !item.id) {
//       throw new Error('Invalid item data');
//     }
    
//     let cart = await Cart.findOne({ userId: req.user._id }).session(session);
    
//     if (!cart) {
//       cart = new Cart({
//         userId: req.user._id,
//         items: [item]
//       });
//     } else {
//       // Check if item already exists
//       const itemIndex = cart.items.findIndex(i => i.id === item.id);
      
//       if (itemIndex > -1) {
//         // Update existing item
//         cart.items[itemIndex] = { ...cart.items[itemIndex].toObject(), ...item };
//       } else {
//         // Add new item
//         cart.items.push(item);
//       }
//     }
    
//     await cart.save({ session });
//     await session.commitTransaction();
    
//     res.status(200).json({
//       success: true,
//       data: cart.items,
//       message: 'Cart updated successfully'
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     handleError(res, error, 400);
//   } finally {
//     session.endSession();
//   }
// });

// // Remove item from cart
// router.delete('/items/:itemId', authRequired, async (req, res) => {
//   try {
//     const { itemId } = req.params;
    
//     const cart = await Cart.findOneAndUpdate(
//       { userId: req.user._id },
//       { $pull: { items: { id: itemId } } },
//       { new: true }
//     );
    
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cart not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: cart.items,
//       message: 'Item removed from cart'
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// // Update user's cart (replace all items)
// router.put('/', authRequired, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
  
//   try {
//     const { items } = req.body;
    
//     if (!Array.isArray(items)) {
//       throw new Error('Items must be an array');
//     }
    
//     let cart = await Cart.findOne({ userId: req.user._id }).session(session);
    
//     if (!cart) {
//       cart = new Cart({
//         userId: req.user._id,
//         items
//       });
//     } else {
//       cart.items = items;
//     }
    
//     await cart.save({ session });
//     await session.commitTransaction();
    
//     res.json({
//       success: true,
//       data: cart.items,
//       message: 'Cart updated successfully'
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     handleError(res, error, 400);
//   } finally {
//     session.endSession();
//   }
// });

// // Clear user's cart
// router.delete('/', authRequired, async (req, res) => {
//   try {
//     const cart = await Cart.findOneAndUpdate(
//       { userId: req.user._id },
//       { $set: { items: [] } },
//       { new: true }
//     );
    
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: 'Cart not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Cart cleared successfully',
//       data: []
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// });

// export default router;

// routes/cart.js mein yeh changes karein

import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// ✅ Get user's cart (with full item data)
router.get('/', authRequired, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      // Create empty cart if doesn't exist
      const newCart = new Cart({
        userId: req.user._id,
        items: []
      });
      await newCart.save();
      return res.json({ success: true, data: [] });
    }
    
    res.json({
      success: true,
      data: cart.items || [],
      cartId: cart._id
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Add or update item in cart
router.post('/items', authRequired, async (req, res) => {
  try {
    const { item } = req.body;
    
    if (!item || !item.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item data'
      });
    }
    
    // Add timestamps
    const itemWithTimestamps = {
      ...item,
      createdAt: item.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: req.user._id,
        items: [itemWithTimestamps]
      });
    } else {
      // Check if item exists
      const existingIndex = cart.items.findIndex(i => i.id === item.id);
      
      if (existingIndex > -1) {
        // Update existing item
        cart.items[existingIndex] = {
          ...cart.items[existingIndex].toObject(),
          ...itemWithTimestamps,
          updatedAt: new Date()
        };
      } else {
        // Add new item
        cart.items.push(itemWithTimestamps);
      }
    }
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart.items,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Remove item from cart
router.delete('/items/:itemId', authRequired, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { items: { id: itemId } } },
      { new: true }
    );
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    res.json({
      success: true,
      data: cart.items,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    });
  }
});

// ✅ Update entire cart (replace all items)
router.put('/', authRequired, async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array'
      });
    }
    
    // Add timestamps to each item
    const itemsWithTimestamps = items.map(item => ({
      ...item,
      createdAt: item.createdAt || new Date(),
      updatedAt: new Date()
    }));
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: itemsWithTimestamps
      });
    } else {
      cart.items = itemsWithTimestamps;
    }
    
    await cart.save();
    
    res.json({
      success: true,
      data: cart.items,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart'
    });
  }
});

// ✅ Clear user's cart
router.delete('/', authRequired, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } },
      { new: true }
    );
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
});

export default router;