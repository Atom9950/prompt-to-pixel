import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ApiHelp() {
  const navigate = useNavigate();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, stepNumber: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary-glow/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 border-border/50 hover:border-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </Button>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              How to Get Your Hugging Face API Key
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to create your free Hugging Face account and generate an API key for unlimited image generation.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">1</span>
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-semibold">Create a Hugging Face Account</h3>
                  <p className="text-muted-foreground">
                    Visit Hugging Face and sign up for a free account. You'll get access to thousands of AI models and 1000 free API calls per month.
                  </p>
                  <Button
                    variant="outline"
                    className="border-border/50 hover:border-primary transition-colors"
                    onClick={() => window.open("https://huggingface.co/join", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Sign Up at Hugging Face
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">2</span>
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-semibold">Navigate to Access Tokens</h3>
                  <p className="text-muted-foreground">
                    After logging in, go to your profile settings and click on "Access Tokens" to manage your API keys.
                  </p>
                  <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                    <p className="text-sm font-mono">Profile → Settings → Access Tokens</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border/50 hover:border-primary transition-colors"
                    onClick={() => window.open("https://huggingface.co/settings/tokens", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Go to Access Tokens
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">3</span>
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-semibold">Create a New Token</h3>
                  <p className="text-muted-foreground">
                    Click "New token" and give it a descriptive name like "AI Image Generator". Select "Read" permissions for basic usage.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-semibold mb-2">Token Name:</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-background/50 px-2 py-1 rounded">AI Image Generator</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard("AI Image Generator", 3)}
                        >
                          {copiedStep === 3 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                      <p className="text-sm font-semibold mb-2">Permission:</p>
                      <code className="text-sm bg-background/50 px-2 py-1 rounded">Read</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 4 */}
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">4</span>
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-semibold">Copy Your API Key</h3>
                  <p className="text-muted-foreground">
                    Once created, copy your API key. It will start with "hf_" followed by a long string of characters. Keep this secure!
                  </p>
                  <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                    <p className="text-sm font-semibold mb-2">Your API key will look like:</p>
                    <code className="text-sm bg-background/50 px-2 py-1 rounded">hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Important:</strong> Copy your API key immediately as you won't be able to see it again. If you lose it, you'll need to create a new one.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 5 */}
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-glass">
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold">5</span>
                </div>
                <div className="space-y-4 flex-1">
                  <h3 className="text-xl font-semibold">Enter Your API Key</h3>
                  <p className="text-muted-foreground">
                    Return to the setup page and paste your API key. It will be stored securely in your browser and never shared.
                  </p>
                  <Button
                    onClick={() => navigate(-1)}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Setup
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200 shadow-lg">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-sky-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4 text-sky-800">
                <div>
                  <h4 className="font-semibold mb-2">Is it really free?</h4>
                  <p className="text-sm">Yes! Hugging Face provides 1000 free API calls per month, which is plenty for personal use.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is my API key secure?</h4>
                  <p className="text-sm">Your API key is stored locally in your browser and never sent to our servers. Only you have access to it.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What if I exceed the free limit?</h4>
                  <p className="text-sm">You can upgrade to a paid plan on Hugging Face for unlimited usage, or wait for the monthly reset.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I change my API key later?</h4>
                  <p className="text-sm">Yes! You can update your API key anytime by clicking the settings button in the app.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}