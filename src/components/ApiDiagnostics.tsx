import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { checkModelAvailability } from "@/services/huggingFaceService";

interface ApiDiagnosticsProps {
  apiKey: string;
}

export const ApiDiagnostics = ({ apiKey }: ApiDiagnosticsProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<{ modelId: string; available: boolean; error?: string }[]>([]);

  const runDiagnostics = async () => {
    setIsChecking(true);
    try {
      const modelResults = await checkModelAvailability(apiKey);
      setResults(modelResults);
    } catch (error) {
      console.error("Error running diagnostics:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (available: boolean, error?: string) => {
    if (available) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (error?.includes("503")) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (available: boolean, error?: string) => {
    if (available) {
      return "Available";
    } else if (error?.includes("503")) {
      return "Loading";
    } else {
      return "Unavailable";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">API Diagnostics</h3>
          <Button
            onClick={runDiagnostics}
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Run Diagnostics"
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Model Availability:</h4>
            {results.map((result) => (
              <div
                key={result.modelId}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.available, result.error)}
                  <div>
                    <p className="text-sm font-medium">{result.modelId}</p>
                    {result.error && (
                      <p className="text-xs text-muted-foreground">{result.error}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {getStatusText(result.available, result.error)}
                </span>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-400">
                <strong>Tip:</strong> If models show as "Loading", they may take a few moments to become available. 
                Models marked as "Unavailable" might not be accessible with your current API key.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};