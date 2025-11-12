import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <Link to="/" className="font-semibold text-lg">Business Card Creator</Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p>
            At BusinessCard Templates, we value your privacy and are committed to protecting your personal information.
          </p>
          <h2>Information We Collect:</h2>
          <ul>
            <li>Your name, email, and payment details during checkout.</li>
            <li>Basic analytics such as browser, device type, and IP address.</li>
          </ul>
          <h2>How We Use It:</h2>
          <ul>
            <li>To deliver purchased templates.</li>
            <li>To communicate order updates and respond to inquiries.</li>
            <li>To improve our website’s performance and user experience.</li>
          </ul>
          <p>We never sell or rent your personal information to any third party.</p>
          <p>Payments are processed securely through trusted gateways.</p>
          <p>
            For questions, contact: {" "}
            <a className="underline" href="mailto:hello.gixtechnologies@gmail.com">hello.gixtechnologies@gmail.com</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
