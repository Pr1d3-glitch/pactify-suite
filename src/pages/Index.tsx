
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import IndustrySection from "@/components/IndustrySection";
import DocumentUpload from "@/components/DocumentUpload";
import TrustSection from "@/components/TrustSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <IndustrySection />
      <DocumentUpload />
      <TrustSection />
    </div>
  );
};

export default Index;
