import { AnalysisResults } from "@/context/ImageContext";

// This is a mock API service that would normally call external APIs
// In a real app, you would replace these with actual API calls

export async function analyzeImage(imageFile: File): Promise<AnalysisResults> {
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    console.log("FormData TSX:" + formData);

    const response = await fetch("http://localhost:8000/analyze-image/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to analyze image");
    }

    const data = await response.json();
    console.log(data);
    return {
      objects: data.objects,
      scenery: data.scenery,
      description: data.description,
      poem: data.poem,
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      objects: [],
      scenery: "Error retrieving scenery.",
      description: "Error retrieving description.",
      poem: "Error in retriving poem."
    };
  }
}
