import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <Link to="/" className="font-semibold text-lg">Business Card Creator</Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p>
            All our products are digital downloads, so once a file has been purchased and accessed, it cannot be refunded.
          </p>
          <p>
            We do not offer cancellations, returns, or exchanges after purchase.
          </p>
          <p>
            However, if you face a technical issue (like a broken file or incorrect download link), please contact us within 48 hours of purchase at
            <a className="underline ml-1" href="mailto:hello.gixtechnologies@gmail.com">hello.gixtechnologies@gmail.com</a>, and we’ll help you fix the problem or provide a replacement file.
          </p>
        </div>
      </main>
    </div>
  );
};

export default RefundPolicy;
