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

    let mounted = true;
    let canvas: FabricCanvas | null = null;

    const initCanvas = async () => {
      try {
        canvas = new FabricCanvas(canvasRef.current!, {
          width: 800,
          height: 1000,
          backgroundColor: "#ffffff",
        });

        if (!mounted) {
          canvas.dispose();
          return;
        }

        console.log("Loading document:", documentUrl);

        // Load the document image
        try {
          const img = await FabricImageClass.fromURL(documentUrl, { crossOrigin: "anonymous" });
          
          if (!mounted || !canvas) return;
          
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
        } catch (error) {
          console.log("Image loading failed, creating placeholder:", error);
          
          if (!mounted || !canvas) return;
          
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
        }

        if (mounted && canvas) {
          setFabricCanvas(canvas);
        }
      } catch (error) {
        console.error("Canvas initialization error:", error);
      }
    };

    initCanvas();
    
    return () => {
      console.log("Cleaning up canvas");
      mounted = false;
      
      if (canvas) {
        try {
          // Clear all objects first
          canvas.clear();
          // Then dispose
          canvas.dispose();
        } catch (error) {
          console.warn("Canvas disposal error (expected):", error);
        }
      }
      
      setFabricCanvas(null);
      setSignatureObject(null);
    };
  }, [documentUrl, documentName]);

  useEffect(() => {
    // New doc/signature → clear saved preview so user must save again
    setSavedDocumentUrl(null);
  }, [signature, documentUrl]);

  useEffect(() => {
    if (!fabricCanvas || !signature) return;

    let mounted = true;

    const addSignature = async () => {
      try {
        // Remove existing signature if any
        if (signatureObject && fabricCanvas) {
          fabricCanvas.remove(signatureObject);
          setSignatureObject(null);
        }

        if (!mounted || !fabricCanvas) return;

        // Add new signature
        const img = await FabricImageClass.fromURL(signature, { crossOrigin: "anonymous" });
        
        if (!mounted || !fabricCanvas) return;

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
          mt: true,  // middle top - vertical resize
          mb: true,  // middle bottom - vertical resize
          ml: true,  // middle left - horizontal resize
          mr: true,  // middle right - horizontal resize
          tl: false, // disable diagonal corners
          tr: false,
          bl: false,
          br: false,
          mtr: false, // disable rotation
        });

        if (mounted && fabricCanvas) {
          fabricCanvas.add(signatureGroup);
          setSignatureObject(signatureGroup);
          fabricCanvas.setActiveObject(signatureGroup);
          fabricCanvas.renderAll();

          toast.success("Signature added! Drag and resize as needed.");
        }
      } catch (error) {
        console.error("Error adding signature:", error);
        toast.error("Failed to add signature");
      }
    };

    addSignature();

    return () => {
      mounted = false;
    };
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

    console.log("Starting save process...");
    
    // Deselect objects before rendering
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();

    // Wait for render to complete
    setTimeout(() => {
      console.log("Canvas objects count:", fabricCanvas.getObjects().length);
      
      const finalDocument = fabricCanvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });

      console.log("Final document data URL length:", finalDocument.length);
      setSavedDocumentUrl(finalDocument);

      if (signatureObject) {
        signatureObject.set({
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
        });
        fabricCanvas.renderAll();
        console.log("Signature locked in place");
      }

      onSave?.(finalDocument);
      
      // Automatically download the signed document
      setTimeout(() => {
        handleDownload();
      }, 500);
      
      toast.success("Document saved and downloading...");
    }, 200);
  };

  const handleDownload = () => {
    if (!fabricCanvas) {
      console.error("No canvas available for download");
      toast.error("Canvas not ready");
      return;
    }

    console.log("Starting download process...");
    console.log("Canvas dimensions:", fabricCanvas.getWidth(), "x", fabricCanvas.getHeight());
    console.log("Canvas objects:", fabricCanvas.getObjects().length);
    
    // Force a final render
    fabricCanvas.renderAll();
    
    // Wait for rendering and then capture the canvas
    setTimeout(() => {
      // Use saved document URL if available, otherwise capture current state
      let canvasDataUrl;
      
      if (savedDocumentUrl && savedDocumentUrl.length > 1000) {
        canvasDataUrl = savedDocumentUrl;
        console.log("Using saved document URL");
      } else {
        canvasDataUrl = fabricCanvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2,
        });
        console.log("Generated new canvas data URL");
      }
      
      console.log("Canvas data URL length:", canvasDataUrl.length);
      
      if (canvasDataUrl.length < 1000) {
        console.error("Canvas appears to be empty, data URL too short");
        toast.error("Cannot create PDF - document appears empty");
        return;
      }

      const width = fabricCanvas.getWidth();
      const height = fabricCanvas.getHeight();

      try {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px", 
          format: [width, height],
        });

        pdf.addImage(canvasDataUrl, "PNG", 0, 0, width, height);
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `signed-${documentName.replace(/\.[^/.]+$/, '')}-${timestamp}.pdf`;
        
        console.log("Saving PDF as:", filename);
        pdf.save(filename);
        toast.success("Document downloaded successfully!");
      } catch (error) {
        console.error("Error creating PDF:", error);
        toast.error("Error creating PDF");
      }
    }, 500);
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
              around the document. Use the side handles to resize horizontally/vertically. Click
              "Save Document" when you're satisfied with the placement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
