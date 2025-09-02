
import { useState, useRef, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  file?: File;
  dataUrl?: string;
}

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFileUpload(selectedFiles);
    }
  };

  const handleFileUpload = (uploadFiles: File[]) => {
    uploadFiles.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        file
      };

      setFiles(prev => [...prev, newFile]);

      // Convert file to data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, dataUrl, status: 'success' } : f
        ));
        toast.success(`${file.name} uploaded successfully`);
      };
      
      reader.onerror = () => {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'error' } : f
        ));
        toast.error(`Failed to upload ${file.name}`);
      };

      reader.readAsDataURL(file);
    });
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Secure Document <span className="text-gradient">Upload</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Drag and drop your documents or click to browse. All files are encrypted and stored securely.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Supported formats: PDF, DOC, DOCX, PNG, JPG (Max 10MB per file)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`upload-zone rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragOver ? 'dragover' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileSelect}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
                <p className="text-muted-foreground mb-4">
                  Upload multiple documents at once for batch processing
                </p>
                <Button variant="outline">Select Files</Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files ({files.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-scale-in"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {file.status === 'uploading' && (
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                        {file.status === 'success' && (
                          <CheckCircle2 className="w-6 h-6 text-success" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="w-6 h-6 text-destructive" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {files.some(f => f.status === 'success') && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        const successfulFiles = files.filter(f => f.status === 'success');
                        navigate("/signature-editor", { 
                          state: { 
                            documents: successfulFiles.map(f => ({
                              id: f.id,
                              name: f.name,
                              size: f.size,
                              type: f.type,
                              dataUrl: f.dataUrl
                            }))
                          } 
                        });
                      }}
                    >
                      Process Documents for E-Signature
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default DocumentUpload;
