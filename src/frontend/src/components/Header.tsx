import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from './LoginButton';
import { Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/logo.dim_200x200.png" alt="Bongo Feed" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bongo Feed
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/documents"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  My Documents
                </Link>
              </>
            )}
            <LoginButton />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <nav className="flex flex-col gap-4">
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/documents"
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Documents
                  </Link>
                </>
              )}
              <div className="pt-2">
                <LoginButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
