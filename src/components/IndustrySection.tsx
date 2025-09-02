
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Building2, Shield, ArrowRight, CheckCircle, Gavel, UserCheck, Home, CreditCard } from "lucide-react";

const industries = [
  {
    id: "legal",
    icon: Gavel,
    title: "Legal",
    description: "Streamline legal workflows with clause libraries, case bundles, and notarization support",
    features: [
      "Clause libraries & templates",
      "Case bundle management",
      "Notarization support",
      "Court-ready audit trails",
      "Legal compliance tracking"
    ],
    className: "industry-legal"
  },
  {
    id: "hr",
    icon: UserCheck,
    title: "Human Resources",
    description: "Automate HR processes from onboarding to exit documentation with bulk operations",
    features: [
      "Bulk offer letter sending",
      "Onboarding automation",
      "NDA & contract management",
      "Exit documentation",
      "HRMS integrations"
    ],
    className: "industry-hr"
  },
  {
    id: "realestate",
    icon: Home,
    title: "Real Estate",
    description: "Manage property transactions with lease agreements, sales contracts, and KYC integration",
    features: [
      "Lease agreement automation",
      "Sales contract workflows",
      "Digital stamping",
      "KYC document processing",
      "Property transaction tracking"
    ],
    className: "industry-realestate"
  },
  {
    id: "fintech",
    icon: CreditCard,
    title: "Fintech",
    description: "Ensure compliance with loan agreements, KYC processes, and regulatory requirements",
    features: [
      "Loan agreement automation",
      "KYC document workflows",
      "RBI compliance modules",
      "GDPR compliance tools",
      "Financial audit trails"
    ],
    className: "industry-fintech"
  }
];

const IndustrySection = () => {
  return (
    <section id="industries" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            Industry-Specific Solutions
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Built for Your <span className="text-gradient">Industry</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tailored workflows and compliance features designed specifically for Legal, HR, Real Estate, and Fintech sectors
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {industries.map((industry, index) => (
            <Card 
              key={industry.id} 
              className={`document-card ${industry.className} border-2 hover:shadow-strong animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center">
                    <industry.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{industry.title}</CardTitle>
                    <CardDescription className="text-base">{industry.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {industry.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <button className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustrySection;
