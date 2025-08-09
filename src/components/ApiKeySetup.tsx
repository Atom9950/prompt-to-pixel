import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Key, ExternalLink, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ApiDiagnostics } from "./ApiDiagnostics";

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeySetup = ({ onApiKeySet }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your Hugging Face API key");
      return;
    }
    
    // Store in localStorage for persistence
    localStorage.setItem("hf_api_key", apiKey);
    onApiKeySet(apiKey);
    toast.success("API key saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Gradient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary-glow/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4">
        <Card className="max-w-md mx-auto bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
          <div className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Key className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Setup Required</h2>
              <p className="text-muted-foreground">
                Enter your Hugging Face API key to start generating images
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-left block">
                  Hugging Face API Key
                </label>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="hf_xxxxxxxxxxxxxxxxxxxxxx"
                    className="bg-muted/30 border-border/50 focus:border-primary pr-10"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Save API Key
                </Button>
                
                {apiKey.trim() && (
                  <Button
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                    variant="outline"
                    className="w-full border-border/50 hover:border-primary transition-colors"
                  >
                    {showDiagnostics ? "Hide" : "Test"} API Key
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Don't have a Hugging Face account?
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary transition-colors"
                onClick={() => window.open("https://huggingface.co/settings/tokens", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Get Free API Key
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>🔒 Your API key is stored locally and never shared</p>
              <p>🎨 Free tier includes 1000 API calls per month</p>
            </div>
          </div>
        </Card>
        
        {showDiagnostics && apiKey.trim() && (
          <div className="max-w-md mx-auto mt-6">
            <ApiDiagnostics apiKey={apiKey} />
          </div>
        )}
      </div>
    </div>
  );
};