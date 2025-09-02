
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, FileCheck, Globe, Award, Users } from "lucide-react";

const trustMetrics = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    description: "Trusted by professionals worldwide"
  },
  {
    icon: FileCheck,
    value: "2M+",
    label: "Documents Signed",
    description: "Legally binding signatures processed"
  },
  {
    icon: Shield,
    value: "99.99%",
    label: "Uptime SLA",
    description: "Enterprise-grade reliability"
  },
  {
    icon: Globe,
    value: "45+",
    label: "Countries",
    description: "Global compliance coverage"
  }
];

const certifications = [
  {
    icon: Shield,
    title: "SOC 2 Type II",
    description: "Certified for security controls"
  },
  {
    icon: Lock,
    title: "ISO 27001",
    description: "Information security standard"
  },
  {
    icon: FileCheck,
    title: "eIDAS Compliant",
    description: "EU digital signature regulation"
  },
  {
    icon: Award,
    title: "ESIGN Act",
    description: "US electronic signature law"
  }
];

const TrustSection = () => {
  return (
    <section id="security" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium security-badge">
            <Shield className="w-4 h-4" />
            Enterprise-Grade Security
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Built for <span className="text-gradient">Maximum Trust</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your documents are protected with military-grade encryption, blockchain validation, and comprehensive compliance frameworks
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustMetrics.map((metric, index) => (
            <Card 
              key={index} 
              className="text-center document-card animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="font-semibold mb-1">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Features */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold mb-6">Uncompromising Security</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AES-256 Encryption</h4>
                  <p className="text-muted-foreground">End-to-end encryption for all documents and communications, ensuring your data remains private and secure.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Blockchain Validation</h4>
                  <p className="text-muted-foreground">Optional blockchain timestamping provides immutable proof of document integrity and signature authenticity.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tamper-Proof Audit Trails</h4>
                  <p className="text-muted-foreground">Complete audit logs with digital forensics capability for legal compliance and dispute resolution.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <Card 
                key={index} 
                className="text-center p-6 document-card animate-slide-in-right"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center mx-auto mb-4">
                  <cert.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2">{cert.title}</h4>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
