import { useState, useRef, useEffect } from "react";
import { Canvas as FabricCanvas, FabricImage as FabricImageClass, Rect, Group, FabricText } from "fabric";
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

const DocumentViewer = ({ documentUrl, documentName, signature, onSave }: DocumentViewerProps) => {
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

    // Load the document image
    FabricImageClass.fromURL(documentUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
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
    }).catch(() => {
      // Fallback for non-image files - create a document placeholder
      const documentRect = new Rect({
        left: 50,
        top: 50,
        width: 700,
        height: 900,
        fill: 'white',
        stroke: '#e5e7eb',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      
      canvas.add(documentRect);
      canvas.renderAll();
      
      // Add document name text
      const text = new FabricText(documentName, {
        left: 100,
        top: 100,
        fontSize: 24,
        fill: '#374151',
        selectable: false,
        evented: false,
      });
      
      canvas.add(text);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [documentUrl, documentName]);

  useEffect(() => {
    setSavedDocumentUrl(null);
  }, [signature, documentUrl]);

  useEffect(() => {
    if (!fabricCanvas || !signature) return;

    // Remove existing signature if any
    if (signatureObject) {
      fabricCanvas.remove(signatureObject);
    }

    // Add new signature
    FabricImageClass.fromURL(signature, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      // Create a background for the signature
      const signatureBg = new Rect({
        width: img.width! + 20,
        height: img.height! + 10,
        fill: 'white',
        stroke: '#e5e7eb',
        strokeWidth: 1,
        left: -10,
        top: -5,
      });

      // Create a group with background and signature
      const signatureGroup = new Group([signatureBg, img], {
        left: 200,
        top: 400,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        lockScalingX: false,
        lockScalingY: false,
      });

      // Add resize handles
      signatureGroup.setControlsVisibility({
        mt: false, // middle top
        mb: false, // middle bottom
        ml: false, // middle left
        mr: false, // middle right
        tl: true,  // top left
        tr: true,  // top right  
        bl: true,  // bottom left
        br: true,  // bottom right
        mtr: false, // middle top rotate handle
      });

      fabricCanvas.add(signatureGroup);
      setSignatureObject(signatureGroup);
      fabricCanvas.setActiveObject(signatureGroup);
      fabricCanvas.renderAll();
      
      toast.success("Signature added! Drag and resize as needed.");
    });
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

    // Deselect all objects before saving
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    const finalDocument = fabricCanvas.toDataURL({
      format: 'png',
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

    if (onSave) {
      onSave(finalDocument);
    }

    toast.success("Document saved successfully! You can now download it.");
  };

  const handleDownload = () => {
    if (!savedDocumentUrl) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [fabricCanvas?.width || 800, fabricCanvas?.height || 1000],
    });

    pdf.addImage(
      savedDocumentUrl,
      "PNG",
      0,
      0,
      fabricCanvas?.width || 800,
      fabricCanvas?.height || 1000
    );
    pdf.save(`signed-${documentName}.pdf`);

    toast.success("Document downloaded successfully!");
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
            {savedDocumentUrl ? (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Document
              </Button>
            )}
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
              💡 <strong>Tip:</strong> Click on your signature to move it around the document.
              Use the corner handles to resize it. Click "Save Document" when you're satisfied with the placement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;