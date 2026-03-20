import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, LogIn, LogOut, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  { to: "/topics", label: "Topics" },
  { to: "/practice", label: "Practice" },
  { to: "/quiz", label: "Quiz" },
  { to: "/progress", label: "Progress" },
];

export default function Navbar() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Math<span className="text-primary">Easy</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = currentPath.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {identity ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground"
              data-ocid="nav.logout_button"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="hidden md:flex items-center gap-2"
              data-ocid="nav.login_button"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          )}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1"
        >
          {navLinks.map((link) => {
            const active = currentPath.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border mt-1">
            {identity ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                className="w-full justify-start gap-2 text-muted-foreground"
                data-ocid="nav.logout_button"
              >
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  login();
                  setMobileOpen(false);
                }}
                disabled={isLoggingIn}
                className="w-full gap-2"
                data-ocid="nav.login_button"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
