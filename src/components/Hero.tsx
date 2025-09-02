
import { Button } from "@/components/ui/button";
import { Shield, FileText, Users, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-white/10 rounded-full animate-float delay-2000"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-white/10 rounded-full animate-float delay-4000"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Enterprise-Grade Security & Compliance</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-slide-up">
            Document Management
            <br />
            <span className="text-gradient bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-slide-up delay-200">
            The modern alternative to DocuSign and PandaDoc. Built for Legal, HR, Real Estate, and Fintech with industry-specific workflows and legally binding e-signatures.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-slide-up delay-300">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">eIDAS & ESIGN Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">AES-256 Encryption</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Blockchain Validation</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up delay-400">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
              Book Demo
            </Button>
          </div>

          {/* Industry Icons */}
          <div className="flex justify-center items-center gap-8 opacity-80 animate-slide-up delay-500">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm">Legal</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm">HR</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-sm">Real Estate</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm">Fintech</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
