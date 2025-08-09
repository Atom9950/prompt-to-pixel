import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Download, RefreshCw, Settings } from "lucide-react";
import { toast } from "sonner";
import { generateImage } from "@/services/huggingFaceService";
import { ApiKeySetup } from "./ApiKeySetup";

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
}

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);

  useEffect(() => {
    // Check for existing API key in localStorage
    const savedApiKey = localStorage.getItem("hf_api_key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeySetup(true);
    }
  }, []);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    if (!apiKey) {
      toast.error("Please set up your Hugging Face API key first");
      setShowApiKeySetup(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      const imageBlob = await generateImage(prompt, apiKey);
      const imageUrl = URL.createObjectURL(imageBlob);
      
      setGeneratedImage({
        url: imageUrl,
        prompt,
        timestamp: new Date(),
      });
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiKeySetup(false);
  };

  const handleSettingsClick = () => {
    setShowApiKeySetup(true);
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage.url;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Show API key setup if no API key is set
  if (showApiKeySetup || !apiKey) {
    return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary-glow/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSettingsClick}
            className="absolute top-0 right-4 border-border/50 hover:border-primary transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            API Settings
          </Button>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your imagination into stunning visuals with the power of artificial intelligence.
            Enter a description and watch as AI brings your ideas to life.
          </p>
        </div>

        {/* Generation Card */}
        <Card className="max-w-4xl mx-auto bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
          <div className="p-8">
            {/* Input Section */}
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Describe your image
                </label>
                <div className="flex gap-4">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A majestic mountain landscape at sunset..."
                    className="flex-1 bg-muted/30 border-border/50 focus:border-primary transition-colors"
                    onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerateImage()}
                  />
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Image Display Section */}
            <div className="space-y-4">
              {isGenerating && (
                <Card className="aspect-square bg-muted/20 border-dashed border-border/50 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin-slow" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Creating your masterpiece...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  </div>
                </Card>
              )}

              {generatedImage && !isGenerating && (
                <div className="space-y-4">
                  <Card className="overflow-hidden bg-gradient-card border-border/50">
                    <img
                      src={generatedImage.url}
                      alt={generatedImage.prompt}
                      className="w-full h-auto rounded-lg"
                    />
                  </Card>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Generated from:</p>
                      <p className="text-sm text-muted-foreground italic">"{generatedImage.prompt}"</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateImage()}
                        className="border-border/50 hover:border-primary transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadImage}
                        className="border-border/50 hover:border-primary transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!generatedImage && !isGenerating && (
                <Card className="aspect-square bg-muted/10 border-dashed border-border/30 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50" />
                    <p className="text-muted-foreground">Your generated image will appear here</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Powered by Hugging Face AI • Built with ❤️ using Lovable
          </p>
        </div>
      </div>
    </div>
  );
};