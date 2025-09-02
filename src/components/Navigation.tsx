
import { Button } from "@/components/ui/button";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">DocuFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <a href="#industries" className="text-foreground/80 hover:text-primary transition-colors">Industries</a>
              <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">Features</a>
              <a href="#security" className="text-foreground/80 hover:text-primary transition-colors">Security</a>
              <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-4">
              <a href="#industries" className="text-foreground/80 hover:text-primary transition-colors py-2">Industries</a>
              <a href="#features" className="text-foreground/80 hover:text-primary transition-colors py-2">Features</a>
              <a href="#security" className="text-foreground/80 hover:text-primary transition-colors py-2">Security</a>
              <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors py-2">Pricing</a>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/20">
                <Button variant="ghost" className="justify-start">Sign In</Button>
                <Button className="justify-start">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
