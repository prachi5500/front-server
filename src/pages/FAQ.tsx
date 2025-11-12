import { Link } from "react-router-dom";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <Link to="/" className="font-semibold text-lg">Business Card Creator</Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions (FAQ)</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <ol className="space-y-6">
            <li>
              <h2 className="text-xl font-semibold">1. What is BusinessCard Templates?</h2>
              <p>
                BusinessCard Templates is a platform where you can browse, customize, and download ready-made business card designs.
                All templates are digital files that you can edit using software like Canva, Photoshop, or Illustrator.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">2. How do I receive my template after purchase?</h2>
              <p>
                Once your payment is completed, you’ll get instant access to download your business card template.
                You’ll also receive a confirmation email with the download link.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">3. Can I customize the template?</h2>
              <p>
                Yes! All our templates are fully editable. You can change text, colors, fonts, and images to match your brand.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">4. Do you offer printed business cards?</h2>
              <p>
                No. We currently sell digital design files only, not physical printed cards. You can use our templates to print your cards locally or through an online printing service.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">5. Can I resell or share the templates?</h2>
              <p>
                No. Each purchase is for personal or client use only. Redistribution, resale, or sharing of our files or designs is not allowed.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">6. What if I face a problem with my file?</h2>
              <p>
                If you have trouble opening or using the file, contact us at
                <a className="underline ml-1" href="mailto:hello.gixtechnologies@gmail.com">hello.gixtechnologies@gmail.com</a>.
                We’ll help you resolve the issue or replace the file if necessary.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">7. Are refunds available?</h2>
              <p>
                Since our products are digital, we don’t offer refunds once a file has been downloaded.
                If you received a corrupted or incorrect file, we’ll replace it at no extra cost.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">8. What payment methods do you accept?</h2>
              <p>
                We accept all major payment methods — credit/debit cards, UPI, and wallet payments through our secure payment gateway.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">9. Can I request a custom design?</h2>
              <p>
                Yes! We do take custom design requests. Just email
                <a className="underline ml-1" href="mailto:hello.gixtechnologies@gmail.com">hello.gixtechnologies@gmail.com</a>
                with your requirements, and we’ll get back to you with pricing and timelines.
              </p>
            </li>

            <li>
              <h2 className="text-xl font-semibold">10. How can I contact support?</h2>
              <p>
                You can reach us anytime at
                <a className="underline ml-1" href="mailto:hello.gixtechnologies@gmail.com">hello.gixtechnologies@gmail.com</a>.
                We usually respond within 24 hours.
              </p>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
