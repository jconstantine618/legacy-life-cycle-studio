import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="container max-w-3xl py-16">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8">Financial Disclaimer</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
        <p className="text-foreground font-semibold">
          Last updated: February 15, 2026
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Not Financial Advice</h2>
        <p>
          The information provided on this website, including the Periodic Table of Estate Planning Elements™, assessment results, and strategy recommendations, is for <strong>educational and informational purposes only</strong>. It does not constitute financial, legal, tax, or investment advice.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">No Professional Relationship</h2>
        <p>
          Use of this website does not create a fiduciary, attorney-client, financial advisor-client, or any other professional relationship between you and the operators of this site. The content is not a substitute for professional advice tailored to your specific circumstances.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Accuracy of Information</h2>
        <p>
          While we strive to provide accurate and up-to-date information, tax laws, regulations, and financial strategies change frequently. We make no representations or warranties about the completeness, accuracy, reliability, or suitability of the information contained on this website.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Estimated Savings & Projections</h2>
        <p>
          Any estimated savings ranges, tax projections, or financial calculations presented are <strong>hypothetical illustrations only</strong>. Actual results will vary based on your individual financial situation, applicable tax laws, and other factors. Past performance or projected performance is not indicative of future results.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Consult a Professional</h2>
        <p>
          Before making any financial, legal, or tax-related decisions, you should consult with a qualified financial advisor, attorney, certified public accountant, or other appropriate professional who can evaluate your specific circumstances.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Limitation of Liability</h2>
        <p>
          In no event shall the operators of this website be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of or reliance on any information provided on this website.
        </p>
      </div>
    </div>
  );
}
