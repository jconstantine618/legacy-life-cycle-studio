import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/40 bg-[#f3ebde] text-slate-600">
      <div className="container py-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif font-bold text-slate-950 mb-3">
              Legacy Life Cycle Studio
            </h3>
            <p className="text-sm leading-relaxed">
              Interactive planning tools built from the Legacy Life Cycle framework. Educational, reflective, and designed for guided conversations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-950 mb-3 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explorer" className="hover:text-slate-950 transition-colors">Explorer</Link></li>
              <li><Link to="/profile" className="hover:text-slate-950 transition-colors">Profile</Link></li>
              <li><Link to="/roadmap" className="hover:text-slate-950 transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-950 mb-3 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/disclaimer" className="hover:text-slate-950 transition-colors">Educational Disclaimer</Link></li>
              <li><Link to="/terms" className="hover:text-slate-950 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-slate-950 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-900/10 mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {currentYear} Legacy Life Cycle Studio. All rights reserved.</p>
          <p>
            This prototype is for educational and planning purposes only.{" "}
            <Link to="/disclaimer" className="underline hover:text-slate-950">
              See full disclaimer
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
