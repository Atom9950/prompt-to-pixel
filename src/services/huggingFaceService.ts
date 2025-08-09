// List of models to try in order of preference
const HUGGING_FACE_MODELS = [
  "stabilityai/stable-diffusion-xl-base-1.0",
  "runwayml/stable-diffusion-v1-5",
  "stabilityai/stable-diffusion-2-1",
  "CompVis/stable-diffusion-v1-4"
];

const getModelUrl = (modelId: string) => `https://api-inference.huggingface.co/models/${modelId}`;

export interface GenerateImageRequest {
  inputs: string;
  parameters?: {
    negative_prompt?: string;
    num_inference_steps?: number;
    guidance_scale?: number;
    width?: number;
    height?: number;
  };
}

const tryGenerateWithModel = async (
  modelId: string,
  prompt: string,
  apiKey: string,
  options?: {
    negative_prompt?: string;
    num_inference_steps?: number;
    guidance_scale?: number;
    width?: number;
    height?: number;
  }
): Promise<Blob> => {
  const requestBody: GenerateImageRequest = {
    inputs: prompt,
    parameters: {
      num_inference_steps: 50,
      guidance_scale: 7.5,
      width: 512,
      height: 512,
      ...options,
    },
  };

  const response = await fetch(getModelUrl(modelId), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Failed to generate image with ${modelId} (${response.status}: ${response.statusText})`;
    
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // If JSON parsing fails, include the raw error text if it's not too long
      if (errorText && errorText.length < 200) {
        errorMessage += ` - ${errorText}`;
      }
    }
    
    // Add specific guidance for common errors
    if (response.status === 404) {
      errorMessage += ". The model may not be available or your API key may not have access to it.";
    } else if (response.status === 401) {
      errorMessage += ". Please check your API key is valid and has the necessary permissions.";
    } else if (response.status === 503) {
      errorMessage += ". The model is currently loading, please try again in a few moments.";
    }
    
    throw new Error(errorMessage);
  }

  return await response.blob();
};

export const generateImage = async (
  prompt: string,
  apiKey: string,
  options?: {
    negative_prompt?: string;
    num_inference_steps?: number;
    guidance_scale?: number;
    width?: number;
    height?: number;
  }
): Promise<Blob> => {
  if (!apiKey) {
    throw new Error("Hugging Face API key is required");
  }

  const errors: string[] = [];

  // Try each model in order
  for (const modelId of HUGGING_FACE_MODELS) {
    try {
      console.log(`Trying to generate image with model: ${modelId}`);
      const result = await tryGenerateWithModel(modelId, prompt, apiKey, options);
      console.log(`Successfully generated image with model: ${modelId}`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Unknown error with ${modelId}`;
      console.warn(`Model ${modelId} failed:`, errorMessage);
      errors.push(errorMessage);
      
      // If it's an auth error, don't try other models
      if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
        throw new Error(errorMessage);
      }
    }
  }

  // If all models failed, throw a comprehensive error
  throw new Error(
    `All models failed to generate image. Errors:\n${errors.map((err, i) => `${i + 1}. ${err}`).join('\n')}`
  );
};

// Helper function to check which models are available
export const checkModelAvailability = async (apiKey: string): Promise<{ modelId: string; available: boolean; error?: string }[]> => {
  const results = [];
  
  for (const modelId of HUGGING_FACE_MODELS) {
    try {
      const response = await fetch(getModelUrl(modelId), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: "test",
          parameters: { width: 512, height: 512 }
        }),
      });
      
      results.push({
        modelId,
        available: response.ok || response.status === 503, // 503 means model is loading but available
        error: response.ok ? undefined : `${response.status}: ${response.statusText}`
      });
    } catch (error) {
      results.push({
        modelId,
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
};