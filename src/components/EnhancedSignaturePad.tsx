import { useRef, useEffect, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Download, Pen, Palette } from "lucide-react";
import { toast } from "sonner";

interface EnhancedSignaturePadProps {
  onSignatureChange?: (signature: string) => void;
}

const EnhancedSignaturePad = ({ onSignatureChange }: EnhancedSignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#1e293b");
  const [strokeWidth, setStrokeWidth] = useState(3);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 200,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    // Configure the pencil brush for smooth drawing
    const brush = new PencilBrush(canvas);
    brush.color = strokeColor;
    brush.width = strokeWidth;
    brush.strokeLineCap = "round";
    brush.strokeLineJoin = "round";
    canvas.freeDrawingBrush = brush;

    // Add event listeners
    canvas.on("path:created", () => {
      setHasSignature(true);
      if (onSignatureChange) {
        setTimeout(() => {
          const signature = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2
          });
          onSignatureChange(signature);
        }, 100);
      }
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = strokeColor;
      fabricCanvas.freeDrawingBrush.width = strokeWidth;
    }
  }, [strokeColor, strokeWidth, fabricCanvas]);

  const clearSignature = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    setHasSignature(false);
    
    if (onSignatureChange) {
      onSignatureChange("");
    }
    toast.success("Signature cleared");
  };

  const downloadSignature = () => {
    if (!fabricCanvas || !hasSignature) return;

    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement("a");
    link.download = "signature.png";
    link.href = dataURL;
    link.click();
    toast.success("Signature downloaded");
  };

  const colors = [
    "#1e293b", // Default dark
    "#0f172a", // Darker
    "#1e40af", // Blue
    "#dc2626", // Red
    "#059669", // Green
  ];

  const widths = [1, 2, 3, 4, 5];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="w-5 h-5" />
          Create Your Signature
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Draw your signature smoothly using your mouse or finger
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drawing Controls */}
        <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">Color:</span>
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setStrokeColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    strokeColor === color ? 'border-ring scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Width:</span>
            <div className="flex gap-1">
              {widths.map((width) => (
                <button
                  key={width}
                  onClick={() => setStrokeWidth(width)}
                  className={`w-8 h-6 rounded border transition-all flex items-center justify-center text-xs ${
                    strokeWidth === width ? 'bg-primary text-primary-foreground' : 'bg-background border-border'
                  }`}
                >
                  {width}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} className="block" />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-lg font-medium">
                Draw your signature here
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={!hasSignature}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSignature}
            disabled={!hasSignature}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSignaturePad;