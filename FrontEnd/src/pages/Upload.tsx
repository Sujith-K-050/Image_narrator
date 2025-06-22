import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon,
  X,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import { useImageContext } from "@/context/ImageContext";
import { analyzeImage } from "@/services/imageAnalysis";
import { Link } from "react-router-dom";
import CameraCapture from "@/components/CameraCapture";
import { log } from "console";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setImageUrl, setAnalysisResults, setIsLoading } = useImageContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleCameraCapture = (imageDataUrl: string, file: File) => {
    setPreviewUrl(imageDataUrl);
    setSelectedFile(file);
    console.log("capture");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 0.5;
      });
    }, 100);
    return interval;
  };

  const handleAnalyze = async () => {
    console.log("FileUpload TSX:" + selectedFile);
    if (!selectedFile) {
      toast.error("Please upload an image first");
      return;
    }

    try {
      setIsLoading(true);
      setImageUrl(previewUrl);

      // Show progress animation
      const progressInterval = simulateProgress();

      // Pass the actual File object to analyzeImage()
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:8000/analyze-image/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const results = await response.json();
      setAnalysisResults(results);

      clearInterval(progressInterval);
      setUploadProgress(1000);

      setTimeout(() => {
        navigate("/results");
      }, 500);
    } catch (error) {
      toast.error("Failed to analyze the image");
      console.error(error);
      setIsLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <PageLayout className="py-12">
      <div className="relative animate-fade-up">
        <Link
          to="/"
          className="absolute -top-12 left-0 text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Upload Image</h1>
          <p className="mt-3 text-gray-600">
            Upload an image to analyze and identify objects, scenery, and
            generate a description
          </p>
        </div>

        <div className="mt-8">
          {!previewUrl ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Image Section */}
              <div
                className={`border-2 border-dashed rounded-xl transition-all duration-300 text-center
          ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200"}
        `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex flex-col items-center justify-center py-6 p-8 h-full">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-pulse-subtle">
                    <UploadIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">
                    Drag & drop your image here
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    or click to browse
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="transition-all duration-300 hover:bg-gray-100"
                  >
                    Browse Files
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Camera Capture Section */}
              <div className="h-full">
                <CameraCapture
                  onCapture={handleCameraCapture}
                  onClear={clearImage}
                  hasImage={!!previewUrl}
                />
              </div>
            </div>
          ) : (
            <div className="relative border rounded-xl p-6 bg-gray-50 text-center">
              <Button
                size="icon"
                variant="outline"
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-96 mx-auto object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {uploadProgress !== null && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={!previewUrl || uploadProgress !== null}
            className="px-8 py-6 text-lg transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Analyze Image
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
