import { Link } from "react-router-dom";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <Link to="/" className="font-semibold text-lg">Business Card Creator</Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p>
            Welcome to BusinessCard Templates. By accessing our site, you agree to these terms:
          </p>
          <h2>Digital License:</h2>
          <p>
            Purchased templates are for personal or client use only. You may customize them, but reselling or redistributing is strictly prohibited.
          </p>
          <h2>No Returns or Refunds:</h2>
          <p>
            Since all files are digital, purchases are final. Please review product details before buying.
          </p>
          <h2>Intellectual Property:</h2>
          <p>
            All content, logos, and designs on this website belong to BusinessCard Templates. Unauthorized copying or resale will result in legal action.
          </p>
          <h2>Limitation of Liability:</h2>
          <p>
            We are not liable for any loss or damage resulting from use or inability to use our templates or website.
          </p>
          <h2>Policy Updates:</h2>
          <p>
            We may revise our terms at any time. Continued use of the site means you accept the current version.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUse;
