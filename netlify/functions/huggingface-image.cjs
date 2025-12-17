const { HfInference } = require('@huggingface/inference');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt, action = 'generate', base64Image, model = 'stabilityai/stable-diffusion-xl-base-1.0' } = JSON.parse(event.body);
    
    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    console.log(`HuggingFace: ${action} image with model ${model}`);

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    let blob;

    if (action === 'generate') {
      // Geração de imagem do zero
      const enhancedPrompt = `${prompt}, photorealistic, 8k resolution, highly detailed, professional photography, sharp focus, vivid colors`;
      
      blob = await hf.textToImage({
        model: model,
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt: "blurry, bad quality, distorted, ugly, watermark, text, cartoon, 3d render",
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      });
    } else if (action === 'remix') {
      // Image-to-Image (remix)
      if (!base64Image) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'base64Image is required for remix' })
        };
      }

      const base64Data = base64Image.split(',')[1] || base64Image;
      const imageBuffer = Buffer.from(base64Data, 'base64');

      blob = await hf.imageToImage({
        model: 'stabilityai/stable-diffusion-xl-refiner-1.0',
        inputs: {
          image: imageBuffer,
          prompt: `${prompt}, professional quality, cinematic lighting, realistic, high detail`
        },
        parameters: {
          strength: 0.7,
          guidance_scale: 7.5
        }
      });
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action. Use "generate" or "remix"' })
      };
    }

    // Converte o Blob para base64
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log('HuggingFace: Image generated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        image: dataUrl,
        model: model
      })
    };

  } catch (error) {
    console.error('HuggingFace API Error:', error);
    
    // Tratamento de erros específicos
    if (error.message && error.message.includes('Model is currently loading')) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'Model is loading, please try again in 10-20 seconds',
          details: error.message
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate image',
        details: error.message 
      })
    };
  }
};