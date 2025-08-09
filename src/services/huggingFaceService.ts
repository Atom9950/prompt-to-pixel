const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";

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

  const response = await fetch(HUGGING_FACE_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Failed to generate image";
    
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Use default error message if parsing fails
    }
    
    throw new Error(errorMessage);
  }

  return await response.blob();
};