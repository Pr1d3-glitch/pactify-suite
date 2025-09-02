import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SignaturePad from "@/components/SignaturePad";
import { ArrowLeft, FileText, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";

interface DocumentData {
  id: string;
  name: string;
  size: number;
}

const SignatureEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [signature, setSignature] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get documents from navigation state
    const docsFromState = location.state?.documents;
    if (docsFromState && docsFromState.length > 0) {
      setDocuments(docsFromState);
    } else {
      // Fallback - redirect back if no documents
      navigate("/");
      toast.error("No documents found for signing");
    }
  }, [location.state, navigate]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSignatureChange = (newSignature: string) => {
    setSignature(newSignature);
  };

  const handleNextDocument = () => {
    if (currentDocIndex < documents.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1);
      setSignature(""); // Clear signature for next document
    }
  };

  const handlePreviousDocument = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1);
      setSignature(""); // Clear signature for previous document
    }
  };

  const handleFinalizeSigning = async () => {
    if (!signature) {
      toast.error("Please provide your signature before finalizing");
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Documents signed successfully!");
      navigate("/", { 
        state: { 
          message: "Your documents have been signed and processed successfully!" 
        } 
      });
    }, 2000);
  };

  if (documents.length === 0) {
    return null; // Will redirect in useEffect
  }

  const currentDocument = documents[currentDocIndex];
  const isLastDocument = currentDocIndex === documents.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Documents
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold">Document Signature</h1>
              <Badge variant="outline">
                {currentDocIndex + 1} of {documents.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Current Document Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Current Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{currentDocument.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(currentDocument.size)}
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Document Preview Placeholder */}
          <Card>
            <CardContent className="p-8">
              <div className="aspect-[8.5/11] bg-white border border-border rounded-lg shadow-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
                    <p className="text-muted-foreground">
                      {currentDocument.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      In a real implementation, this would show the actual document content
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signature Section */}
          <SignaturePad onSignatureChange={handleSignatureChange} />

          {/* Navigation & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreviousDocument}
                disabled={currentDocIndex === 0}
              >
                Previous Document
              </Button>
              
              {!isLastDocument && (
                <Button
                  onClick={handleNextDocument}
                  disabled={!signature}
                >
                  Next Document
                </Button>
              )}
            </div>

            {isLastDocument && (
              <Button
                onClick={handleFinalizeSigning}
                disabled={!signature || isProcessing}
                className="min-w-[140px]"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isProcessing ? "Processing..." : "Finalize Signing"}
              </Button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Signing Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentDocIndex + 1} of {documents.length} documents
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentDocIndex + 1) / documents.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureEditor;