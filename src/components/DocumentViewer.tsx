import { useState, useRef, useEffect } from "react";
import {
  Canvas as FabricCanvas,
  FabricImage as FabricImageClass,
  Rect,
  Group,
  FabricText,
} from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCcw, Save, Download } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface DocumentViewerProps {
  documentUrl: string;
  documentName: string;
  signature?: string;
  onSave?: (finalDocumentUrl: string) => void;
}

const DocumentViewer = ({
  documentUrl,
  documentName,
  signature,
  onSave,
}: DocumentViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const [signatureObject, setSignatureObject] = useState<Group | null>(null);
  const [savedDocumentUrl, setSavedDocumentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 1000,
      backgroundColor: "#ffffff",
    });

    console.log("Loading document:", documentUrl);

    // Load the document image
    FabricImageClass.fromURL(documentUrl, { crossOrigin: "anonymous" })
      .then((img) => {
        console.log("Image loaded successfully", img.width, img.height);
        // Scale image to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width! / img.width!,
          canvas.height! / img.height!
        );

        img.scale(scale);
        img.set({
          left: (canvas.width! - img.width! * scale) / 2,
          top: 0,
          selectable: false,
          evented: false,
        });

        canvas.add(img);
        canvas.renderAll();
        console.log("Document added to canvas");
      })
      .catch((error) => {
        console.log("Image loading failed, creating placeholder:", error);
        // Fallback for non-image files - create a document placeholder
        const documentRect = new Rect({
          left: 50,
          top: 50,
          width: 700,
          height: 900,
          fill: "white",
          stroke: "#e5e7eb",
          strokeWidth: 2,
          selectable: false,
          evented: false,
        });

        canvas.add(documentRect);

        // Add document name text
        const text = new FabricText(documentName, {
          left: 100,
          top: 100,
          fontSize: 24,
          fill: "#374151",
          selectable: false,
          evented: false,
        });

        canvas.add(text);
        canvas.renderAll();
        console.log("Placeholder document created");
      });

    setFabricCanvas(canvas);
    
    return () => {
      console.log("Disposing canvas");
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [documentUrl, documentName]);

  useEffect(() => {
    // New doc/signature → clear saved preview so user must save again
    setSavedDocumentUrl(null);
  }, [signature, documentUrl]);

  useEffect(() => {
    if (!fabricCanvas || !signature) return;

    // Remove existing signature if any
    if (signatureObject) {
      fabricCanvas.remove(signatureObject);
    }

    // Add new signature
    FabricImageClass.fromURL(signature, { crossOrigin: "anonymous" }).then(
      (img) => {
        // Background around signature for clarity
        const signatureBg = new Rect({
          width: img.width! + 20,
          height: img.height! + 10,
          fill: "white",
          stroke: "#e5e7eb",
          strokeWidth: 1,
          left: -10,
          top: -5,
        });

        const signatureGroup = new Group([signatureBg, img], {
          left: 200,
          top: 400,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          lockScalingX: false,
          lockScalingY: false,
        });

        signatureGroup.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
          tl: true,
          tr: true,
          bl: true,
          br: true,
          mtr: false,
        });

        fabricCanvas.add(signatureGroup);
        setSignatureObject(signatureGroup);
        fabricCanvas.setActiveObject(signatureGroup);
        fabricCanvas.renderAll();

        toast.success("Signature added! Drag and resize as needed.");
      }
    );
  }, [signature, fabricCanvas]);

  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const newZoom = Math.max(zoom / 1.2, 0.3);
    setZoom(newZoom);
    fabricCanvas.setZoom(newZoom);
    fabricCanvas.renderAll();
  };

  const handleResetZoom = () => {
    if (!fabricCanvas) return;
    setZoom(1);
    fabricCanvas.setZoom(1);
    fabricCanvas.renderAll();
  };

  const handleSave = () => {
    if (!fabricCanvas) return;

    // Deselect objects before rendering
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    const finalDocument = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });

    setSavedDocumentUrl(finalDocument);

    if (signatureObject) {
      signatureObject.set({
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
      });
      fabricCanvas.renderAll();
    }

    onSave?.(finalDocument);
    
    // Automatically download the signed document
    setTimeout(() => {
      handleDownload();
    }, 500);
    
    toast.success("Document saved and downloading...");
  };

  const handleDownload = () => {
    if (!fabricCanvas) {
      console.error("No canvas available for download");
      return;
    }
    
    // Ensure canvas is rendered properly
    fabricCanvas.renderAll();
    
    // Wait a bit for rendering to complete, then capture
    setTimeout(() => {
      const canvasDataUrl = fabricCanvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });
      
      console.log("Canvas data URL length:", canvasDataUrl.length);
      
      if (canvasDataUrl.length < 1000) {
        console.error("Canvas appears to be empty");
        toast.error("Canvas is empty - cannot create PDF");
        return;
      }

      const width = fabricCanvas.getWidth();
      const height = fabricCanvas.getHeight();

      const pdf = new jsPDF({
        orientation: "portrait", 
        unit: "px",
        format: [width, height],
      });

      pdf.addImage(canvasDataUrl, "PNG", 0, 0, width, height);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `signed-${documentName.replace(/\.[^/.]+$/, '')}-${timestamp}.pdf`;
      
      console.log("Saving PDF:", filename);
      pdf.save(filename);
      toast.success("Document downloaded successfully!");
    }, 300);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          {!savedDocumentUrl && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetZoom}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {savedDocumentUrl && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={!!savedDocumentUrl}>
              <Save className="w-4 h-4 mr-2" />
              {savedDocumentUrl ? "Saved" : "Save Document"}
            </Button>
          </div>
        </div>

        {/* Canvas or Preview */}
        <div className="border border-border rounded-lg overflow-hidden bg-gray-50 flex justify-center">
          {savedDocumentUrl ? (
            <img
              src={savedDocumentUrl}
              alt="Signed document preview"
              className="max-w-full max-h-[600px]"
            />
          ) : (
            <canvas ref={canvasRef} className="max-w-full max-h-[600px]" />
          )}
        </div>

        {signature && !savedDocumentUrl && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Click on your signature to move it
              around the document. Use the corner handles to resize it. Click
              "Save Document" when you're satisfied with the placement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
