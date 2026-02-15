import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground/70">
      <div className="container py-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif font-bold text-primary-foreground mb-3">
              Estate Planning Blueprint™
            </h3>
            <p className="text-sm leading-relaxed">
              Educational tools to help you understand estate planning strategies. Not financial advice.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blueprint" className="hover:text-primary-foreground transition-colors">Blueprint</Link></li>
              <li><Link to="/assessment" className="hover:text-primary-foreground transition-colors">Assessment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-3 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/disclaimer" className="hover:text-primary-foreground transition-colors">Financial Disclaimer</Link></li>
              <li><Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-primary-foreground/15 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {currentYear} Estate Planning Blueprint™. All rights reserved.</p>
          <p>
            This site is for educational purposes only.{" "}
            <Link to="/disclaimer" className="underline hover:text-primary-foreground">
              See full disclaimer
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
