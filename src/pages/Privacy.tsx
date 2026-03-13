import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="container max-w-3xl py-16">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
        <p className="text-foreground font-semibold">
          Last updated: February 15, 2026
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account Information:</strong> Email address and password when you create an account.</li>
          <li><strong>Profile Data:</strong> Lifecycle information you voluntarily provide, such as age, worldview, priorities, focus domains, notes, and planning horizon.</li>
          <li><strong>Export Preferences:</strong> Choices related to PDFs, map layouts, and roadmap generation.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our Service, collected automatically.</li>
        </ul>

        <h2 className="text-xl font-bold font-serif text-foreground">2. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide personalized lifecycle roadmap recommendations</li>
          <li>Create and manage your account</li>
          <li>Communicate with you about our services</li>
          <li>Improve and optimize our Service</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-bold font-serif text-foreground">3. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information. All data is encrypted in transit using SSL/TLS and at rest. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">4. Data Sharing</h2>
        <p>
          We do not sell your personal information. We may share your information only in the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>With your explicit consent</li>
          <li>To comply with legal obligations or valid legal processes</li>
          <li>With service providers who assist in operating our Service, under strict confidentiality agreements</li>
        </ul>

        <h2 className="text-xl font-bold font-serif text-foreground">5. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">6. Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability</li>
        </ul>

        <h2 className="text-xl font-bold font-serif text-foreground">7. Cookies</h2>
        <p>
          We use essential cookies to maintain your session and preferences. We do not use third-party tracking cookies for advertising purposes.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">8. Children's Privacy</h2>
        <p>
          The Service is not intended for individuals under 18. We do not knowingly collect personal information from children.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a revised "Last updated" date.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">10. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy or your data, please contact us through the information provided on the website.
        </p>
      </div>
    </div>
  );
}
