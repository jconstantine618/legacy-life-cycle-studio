import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Grid3X3, ClipboardList, BarChart3, Home, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/periodic-table", label: "Planning Elements", icon: Grid3X3 },
  { path: "/assessment", label: "Assessment", icon: ClipboardList },
  { path: "/recommendations", label: "Recommendations", icon: BarChart3 },
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
      <header className="sticky top-0 z-50 border-b bg-primary text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight">
              Financial Services
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
                    className={`text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 ${
                      isActive ? "bg-primary-foreground/15 text-primary-foreground" : ""
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
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
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
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
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
