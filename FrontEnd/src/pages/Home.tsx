import { Link } from "react-router-dom";
import { ArrowRight, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import AnimatedChip from "@/components/AnimatedChip";

export default function Home() {
  // Sample image URL for the showcase - using the uploaded example image
  const sampleImageUrl =
    "/lovable-uploads/5845a27d-747d-4e0d-a735-d2cf821c6ea2.png";

  return (
    <PageLayout>
      <div className="text-center">
        <div className="flex justify-center gap-2 mb-4">
          <AnimatedChip delay={0}>AI-Powered</AnimatedChip>
          <AnimatedChip delay={100}>Visual Analysis</AnimatedChip>
          <AnimatedChip delay={200}>Simple & Fast</AnimatedChip>
        </div>

        <h1
          className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-up"
          style={{
            animationDelay: "300ms",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          Image Analyzer
        </h1>

        <p
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-up"
          style={{
            animationDelay: "500ms",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          Upload any image and our AI will analyze it to identify objects,
          describe the scenery, and generate a detailed description.
        </p>

        <div
          className="mt-10 animate-fade-up"
          style={{
            animationDelay: "700ms",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <Link to="/upload">
            <Button
              size="lg"
              className="mr-3 group px-6 transition-all duration-300 hover:pl-8 hover:pr-6"
            >
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          {/* 
          <Link to="/upload">
            <Button
              size="lg"
              className="group px-6 transition-all duration-300 hover:pl-8 hover:pr-6 bg-grey-300"
            >
              <span>Read Document</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link> */}
        </div>

        <div
          className="mt-20 mx-auto max-w-md glass-card p-4 rounded-2xl animate-fade-up overflow-hidden"
          style={{
            animationDelay: "900ms",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div className="aspect-video rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
            {sampleImageUrl ? (
              <img
                src={sampleImageUrl}
                alt="Sample image analysis"
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
            ) : (
              <Image className="h-16 w-16 text-gray-300" />
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-2 bg-gray-100 rounded"></div>
            <div className="h-2 bg-gray-100 rounded"></div>
            <div className="h-2 bg-gray-100 rounded"></div>
            <div className="h-2 bg-gray-100 rounded col-span-2"></div>
            <div className="h-2 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
