import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText,
  Eye,
  Tag,
  ArrowLeft,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PageLayout from "@/components/PageLayout";
import { useImageContext } from "@/context/ImageContext";
import TransitionImage from "@/components/TransitionImage";
import AnimatedChip from "@/components/AnimatedChip";
import { speakText } from "@/utils/textToSpeech";

export default function Results() {
  const navigate = useNavigate();
  const { imageUrl, analysisResults, clearAll, setIsLoading } =
    useImageContext();
  const [isSpeakingDescription, setIsSpeakingDescription] = useState(false);
  const [isSpeakingPoem, setIsSpeakingPoem] = useState(false);

  useEffect(() => {
    // Redirect if no image is available
    if (!imageUrl || !analysisResults) {
      navigate("/upload");
    }

    // Reset loading state
    setIsLoading(false);
  }, [imageUrl, analysisResults, navigate, setIsLoading]);

  if (!imageUrl || !analysisResults) {
    return null;
  }

  const handleReset = () => {
    clearAll();
    navigate("/upload");
  };

  console.log(analysisResults);
  // Extract the first scenery tag for the one-word answer
  const sceneryWord = analysisResults.scenery
    ?.split(" ")[0]
    .replace(/[.,;\n]/g, "");

  const handleReadDescription = () => {
    if (isSpeakingDescription) {
      window.speechSynthesis.cancel();
      setIsSpeakingDescription(false);
      return;
    }

    setIsSpeakingDescription(true);
    setIsSpeakingPoem(false);

    if (isSpeakingPoem) {
      window.speechSynthesis.cancel();
    }

    const speech = speakText(analysisResults.description);
    speech.stop = () => {
      window.speechSynthesis.cancel();
      setIsSpeakingDescription(false);
    };

    // When speech ends
    speechSynthesis.addEventListener(
      "end",
      () => {
        setIsSpeakingDescription(false);
      },
      { once: true }
    );
  };

  const handleReadPoem = () => {
    if (isSpeakingPoem) {
      window.speechSynthesis.cancel();
      setIsSpeakingPoem(false);
      return;
    }

    setIsSpeakingPoem(true);
    setIsSpeakingDescription(false);

    if (isSpeakingDescription) {
      window.speechSynthesis.cancel();
    }

    const speech = speakText(analysisResults.poem);
    speech.stop = () => {
      window.speechSynthesis.cancel();
      setIsSpeakingPoem(false);
    };

    // When speech ends
    speechSynthesis.addEventListener(
      "end",
      () => {
        setIsSpeakingPoem(false);
      },
      { once: true }
    );
  };

  return (
    <PageLayout className="py-12">
      <div className="relative">
        <Link
          to="/upload"
          className="absolute -top-12 left-0 text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>

        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold">Analysis Results</h1>
          <p className="mt-3 text-gray-600">
            Our AI has analyzed your image and identified the following details
          </p>

          {/* Text-to-speech buttons */}
          <div className="flex justify-center gap-4 mt-5">
            <Button
              onClick={handleReadDescription}
              variant="outline"
              className={`flex items-center gap-2 ${
                isSpeakingDescription ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              {isSpeakingDescription ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span>
                {isSpeakingDescription ? "Stop Reading" : "Read Description"}
              </span>
            </Button>

            <Button
              onClick={handleReadPoem}
              variant="outline"
              className={`flex items-center gap-2 ${
                isSpeakingPoem ? "bg-purple-50 border-purple-200" : ""
              }`}
            >
              {isSpeakingPoem ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span>{isSpeakingPoem ? "Stop Reading" : "Read Poem"}</span>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div
            className="animate-slide-right flex flex-col justify-center"
            style={{ opacity: 0, animationFillMode: "forwards" }}
          >
            {/* Scenery one-word */}
            <div className="mt-4 mb-3 glass-card rounded-xl p-4 text-center">
              <h3 className="text-lg font-semibold mb-1">Scenery</h3>
              <p className="text-2xl font-bold text-blue-600">
                {sceneryWord.toUpperCase()}
              </p>
            </div>

            {/* Objects detected */}
            <div className="glass-card rounded-xl p-6 shadow-sm mt-3">
              <div className="flex items-center mb-3">
                <Tag className="h-5 w-5 mr-2 text-blue-500" />
                <h3 className="text-lg font-semibold">Objects Detected</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResults.objects.map((object, index) => (
                  <AnimatedChip key={index} delay={index * 100}>
                    {object}
                  </AnimatedChip>
                ))}
              </div>
            </div>
          </div>
          <div
            className="animate-slide-right flex flex-col"
            style={{ opacity: 0, animationFillMode: "forwards" }}
          >
            <TransitionImage
              src={imageUrl}
              alt="Analyzed image"
              className="aspect-square w-full object-cover rounded-xl shadow-lg"
            />
          </div>

          <div
            className="flex flex-col animate-slide-left"
            style={{ opacity: 0, animationFillMode: "forwards" }}
          >
            <div className="glass-card rounded-xl p-6 shadow-sm mb-4 flex-1">
              <div className="flex items-center mb-3">
                <Eye className="h-5 w-5 mr-2 text-indigo-500" />
                <h3 className="text-lg font-semibold">Image Description</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {analysisResults.description}
              </p>
            </div>
          </div>
          <div
            className="flex flex-col animate-slide-left"
            style={{ opacity: 0, animationFillMode: "forwards" }}
          >
            <div className="glass-card rounded-xl p-6 shadow-sm flex-1">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 mr-2 text-violet-500" />
                <h3 className="text-lg font-semibold">Poem</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {analysisResults.poem}
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex justify-center animate-fade-up"
          style={{
            animationDelay: "900ms",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <Button
            onClick={handleReset}
            className="group flex items-center gap-2 px-6 py-6 text-lg transition-all duration-300 hover:pl-5 hover:pr-7"
          >
            <RefreshCw className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
            <span>Try Another Image</span>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
