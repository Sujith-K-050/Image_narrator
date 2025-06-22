import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, CircleSlash } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string, file: File) => void;
  onClear: () => void;
  hasImage: boolean;
}

export default function CameraCapture({
  onCapture,
  onClear,
  hasImage,
}: CameraCaptureProps) {
  const [isActive, setIsActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(newStream);
      setIsActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please grant camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
  };

  const captureImage = () => {
    if (!videoElement) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPreviewUrl(dataUrl);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", {
            type: "image/jpeg",
          });
          onCapture(dataUrl, file);
        }
      },
      "image/jpeg",
      0.92
    );

    stopCamera();
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className={`relative flex-1 flex items-center justify-center border-2 border-dashed rounded-xl p-2 transition-all duration-300 ${
          isActive || previewUrl ? "" : "border-gray-200 hover:border-gray-300"
        } ${isActive && !previewUrl ? "border-blue-400 bg-blue-50" : ""} ${
          previewUrl ? "border-transparent" : ""
        }`}
      >
        {!isActive && !previewUrl && (
          <div className="flex flex-col items-center text-center p-4">
            <Camera className="h-12 w-12 text-gray-500 mb-3 animate-pulse-subtle" />
            <h3 className="text-lg font-medium">Capture from Camera</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Use your device's camera
            </p>
            <Button
              onClick={startCamera}
              variant="outline"
              className="flex items-center gap-2 px-4"
            >
              <Camera className="h-4 w-4" />
              <span>Open Camera</span>
            </Button>
          </div>
        )}

        {isActive && !previewUrl && (
          <>
            <video
              ref={(video) => {
                if (video && !videoElement) {
                  video.srcObject = stream;
                  setVideoElement(video);
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              onClick={captureImage}
              size="icon"
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 h-12 w-12 rounded-full"
            >
              <div className="h-6 w-6 bg-white rounded-full border-2 border-primary" />
            </Button>
          </>
        )}

        {previewUrl && (
          <div className="relative w-full h-full">
            <Button
              size="icon"
              variant="outline"
              className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
              onClick={() => setPreviewUrl(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
