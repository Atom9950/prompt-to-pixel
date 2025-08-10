import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Download, RefreshCw, Settings } from "lucide-react";
import { toast } from "sonner";
import { generateImage } from "@/services/huggingFaceService";
import { ApiKeySetup } from "./ApiKeySetup";
import { ApiDiagnostics } from "./ApiDiagnostics";

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
  const [showDiagnostics, setShowDiagnostics] = useState(false);

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
      {/* Red Blue Golden gradient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-background via-blue-500/10 to-yellow-500/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
      
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
            {/* <Sparkles className="w-8 h-8 text-black animate-pulse-glow" /> */}
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
              Prompt to Pixel
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your imagination into stunning visuals with the power of artificial intelligence.
            Enter a description and watch as AI brings your ideas to life.
          </p>
        </div>

        {/* Two Grid Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Prompt Input Grid */}
            <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Describe your image
                    </label>
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A majestic mountain landscape at sunset..."
                      className="bg-muted/30 border-border/50 focus:border-primary transition-colors"
                      onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerateImage()}
                    />
                  </div>
                  
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>

                  {/* Generated Image Info */}
                  {generatedImage && !isGenerating && (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Generated from:</p>
                        <p className="text-sm text-muted-foreground italic">"{generatedImage.prompt}"</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {generatedImage.timestamp.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateImage()}
                          className="flex-1 border-border/50 hover:border-primary transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadImage}
                          className="flex-1 border-border/50 hover:border-primary transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Pro Tips Grid */}
            <Card className="bg-gradient-to-br from-red-50 via-blue-50 to-yellow-50 border-red-200 shadow-lg">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-red-300 via-blue-300 to-yellow-300 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💡</span>
                    </div>
                    <h3 className="text-lg font-semibold bg-black bg-clip-text text-transparent">Pro Tips</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <p>Be specific: Include details like lighting, style, colors, and mood for better results.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <p>Add style keywords: Try <strong>photorealistic</strong>, <strong>oil painting</strong>, <strong>digital art</strong>, or <strong>watercolor</strong>.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold">•</span>
                      <p>Describe composition: Use terms like <strong>close-up</strong>, <strong>wide shot</strong>, <strong>bird's eye view</strong>.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <p>Set the mood: Words like <strong>dramatic</strong>, <strong>calm</strong>, <strong>vibrant</strong>, or <strong>mysterious</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Grid - Image Preview */}
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
            <div className="p-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Image Preview</h3>
                
                {isGenerating && (
                  <div className="aspect-square bg-muted/20 border-dashed border-border/50 flex items-center justify-center rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin-slow" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Creating your masterpiece...</p>
                        <p className="text-sm text-muted-foreground">This may take a few moments</p>
                      </div>
                    </div>
                  </div>
                )}

                {generatedImage && !isGenerating && (
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-lg bg-gradient-card border-border/50">
                      <img
                        src={generatedImage.url}
                        alt={generatedImage.prompt}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {!generatedImage && !isGenerating && (
                  <div className="aspect-square bg-muted/10 border-dashed border-border/30 flex items-center justify-center rounded-lg">
                    <div className="text-center space-y-2">
                      <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50" />
                      <p className="text-muted-foreground">Your generated image will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Diagnostics Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center mb-4">
            <Button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              variant="outline"
              size="sm"
              className="border-border/50 hover:border-primary transition-colors"
            >
              {showDiagnostics ? "Hide" : "Show"} API Diagnostics
            </Button>
          </div>
          
          {showDiagnostics && apiKey && (
            <ApiDiagnostics apiKey={apiKey} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            
          </p>
        </div>
      </div>
    </div>
  );
};