import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedSignaturePad from "@/components/EnhancedSignaturePad";
import DocumentViewer from "@/components/DocumentViewer";
import { ArrowLeft, FileText, CheckCircle2, Send, Eye } from "lucide-react";
import { toast } from "sonner";

interface DocumentData {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

const EnhancedSignatureEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [signature, setSignature] = useState("");
  const [finalDocuments, setFinalDocuments] = useState<{[key: string]: string}>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("sign");

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

  const handleDocumentSave = (documentId: string, finalDocumentUrl: string) => {
    setFinalDocuments(prev => ({
      ...prev,
      [documentId]: finalDocumentUrl
    }));
  };

  const handleNextDocument = () => {
    if (currentDocIndex < documents.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1);
      // Keep the signature for next document
    }
  };

  const handlePreviousDocument = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1);
    }
  };

  const handleFinalizeSigning = async () => {
    if (!signature) {
      toast.error("Please create your signature first");
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("All documents signed successfully!");
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
  const currentDocumentSigned = finalDocuments[currentDocument.id];

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
              <h1 className="text-2xl font-bold">Enhanced Document Signature</h1>
              <Badge variant="outline">
                {currentDocIndex + 1} of {documents.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Current Document Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Current Document: {currentDocument.name}
                </div>
                {currentDocumentSigned && (
                  <Badge variant="default" className="bg-success text-success-foreground">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Signed
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{currentDocument.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(currentDocument.size)} • {currentDocument.type}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Create Signature
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!signature}>
                <Eye className="w-4 h-4" />
                Preview & Place
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sign" className="space-y-6">
              {/* Document Preview (Static) */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[8.5/11] bg-white border border-border rounded-lg shadow-sm overflow-hidden">
                    {currentDocument.dataUrl ? (
                      <img 
                        src={currentDocument.dataUrl} 
                        alt={currentDocument.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-4">
                          <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
                            <p className="text-muted-foreground">
                              {currentDocument.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Signature Pad */}
              <EnhancedSignaturePad onSignatureChange={handleSignatureChange} />
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              {/* Interactive Document Viewer */}
              <DocumentViewer 
                documentUrl={currentDocument.dataUrl}
                documentName={currentDocument.name}
                signature={signature}
                onSave={(finalDoc) => handleDocumentSave(currentDocument.id, finalDoc)}
              />
            </TabsContent>
          </Tabs>

          {/* Navigation & Actions */}
          <div className="flex items-center justify-between mt-8">
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
                {isProcessing ? "Processing..." : "Finalize All Documents"}
              </Button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Signing Progress</span>
              <span className="text-sm text-muted-foreground">
                {Object.keys(finalDocuments).length} of {documents.length} documents completed
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.keys(finalDocuments).length / documents.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSignatureEditor;
