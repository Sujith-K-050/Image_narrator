
import { createContext, useContext, useState, ReactNode } from "react";

interface ImageContextType {
  imageUrl: string | null;
  imageFile: File | null;
  analysisResults: AnalysisResults | null;
  setImageFile: (file: File | null) => void;
  setImageUrl: (url: string | null) => void;
  setAnalysisResults: (results: AnalysisResults | null) => void;
  clearAll: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface AnalysisResults {
  objects: string[];
  scenery: string;
  description: string;
  poem: string;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearAll = () => {
    setImageUrl(null);
    setImageFile(null);
    setAnalysisResults(null);
  };

  return (
    <ImageContext.Provider
      value={{
        imageUrl,
        imageFile,
        analysisResults,
        setImageFile,
        setImageUrl,
        setAnalysisResults,
        clearAll,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
