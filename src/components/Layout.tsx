import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Compass, Route, BarChart3, Home, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/explorer", label: "Explorer", icon: Compass },
  { path: "/profile", label: "Profile", icon: Route },
  { path: "/roadmap", label: "Roadmap", icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-white/40 bg-[#f7f1e7]/90 text-slate-900 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-slate-900">
              Legacy Life Cycle Studio
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`text-slate-600 hover:bg-white/60 hover:text-slate-950 ${
                      isActive ? "bg-white/70 text-slate-950" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            {user ? (
              <Button
                variant="ghost"
                className="text-slate-600 hover:bg-white/60 hover:text-slate-950"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="text-slate-600 hover:bg-white/60 hover:text-slate-950"
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-white/60">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => { handleSignOut(); setOpen(false); }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
