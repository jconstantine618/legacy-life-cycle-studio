import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="container max-w-3xl py-16">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8">Educational Disclaimer</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
        <p className="text-foreground font-semibold">
          Last updated: February 15, 2026
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Not Professional Advice</h2>
        <p>
          The information provided on this website, including lifecycle maps, profile results, and roadmap suggestions, is for <strong>educational and informational purposes only</strong>. It does not constitute legal, financial, tax, medical, mental health, or spiritual direction.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">No Professional Relationship</h2>
        <p>
          Use of this website does not create a fiduciary, attorney-client, financial advisor-client, or any other professional relationship between you and the operators of this site. The content is not a substitute for professional advice tailored to your specific circumstances.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Accuracy of Information</h2>
        <p>
          While we strive to provide thoughtful and accurate educational material, the information on this website may not reflect your individual context. We make no representations or warranties about completeness, accuracy, reliability, or suitability for any personal decision.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Roadmaps and Projections</h2>
        <p>
          Any season scores, transition windows, or suggested actions are <strong>illustrative planning tools only</strong>. Real outcomes depend on your circumstances, relationships, health, resources, and the quality of professional guidance you receive.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Consult a Professional</h2>
        <p>
          Before making financial, legal, medical, or family-governance decisions, consult qualified professionals who can evaluate your specific circumstances.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">Limitation of Liability</h2>
        <p>
          In no event shall the operators of this website be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of or reliance on any information provided on this website.
        </p>
      </div>
    </div>
  );
}
