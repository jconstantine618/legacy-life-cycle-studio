import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="container max-w-3xl py-16">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8">Terms of Service</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
        <p className="text-foreground font-semibold">
          Last updated: February 15, 2026
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Legacy Life Cycle Studio website ("Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">2. Description of Service</h2>
        <p>
          The Service provides educational lifecycle maps, self-assessment tools, downloadable PDFs, and personalized planning prompts. The Service is intended for informational and reflective purposes only and does not constitute professional advice.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">3. User Accounts</h2>
        <p>
          You may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Interfere with or disrupt the Service or its infrastructure</li>
          <li>Reproduce, distribute, or create derivative works from the Service content without permission</li>
        </ul>

        <h2 className="text-xl font-bold font-serif text-foreground">5. Intellectual Property</h2>
        <p>
          All content, features, and functionality of the Service, including lifecycle frameworks, text, graphics, logos, and software, are the property of the Service operators or their licensors and are protected by applicable intellectual property laws.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">6. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">7. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">8. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
        </p>

        <h2 className="text-xl font-bold font-serif text-foreground">9. Contact</h2>
        <p>
          If you have questions about these Terms, please contact us through the information provided on the website.
        </p>
      </div>
    </div>
  );
}
