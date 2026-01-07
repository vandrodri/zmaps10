import { AnalysisResult, PostResult, ReviewResponseResult, FaqResult } from "../types";
import { translateToEnglish } from '../utils/translatePrompt';

const GROQ_FUNCTION_URL = '/.netlify/functions/groq';

async function callGroq(prompt: string, jsonMode: boolean = false): Promise<string> {
  try {
    const response = await fetch(GROQ_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, jsonMode })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate content');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error calling Groq:', error);
    throw error;
  }
}

// --- 1. Análise de Negócio ---
export const analyzeBusiness = async (
  businessName: string,
  location: string
): Promise<AnalysisResult> => {
  try {
    const prompt = `
ATUE COMO: Um Gerente de Google Business Profile (GBP) Senior.
TAREFA: Auditar o negócio "${businessName}" em "${location}".

GERE UM RELATÓRIO MARKDOWN COM:
1. Diagnóstico do Perfil (estimativa de Nota, Reviews, Status típico).
2. Comparativo com 2 concorrentes típicos do setor.
3. 3 Ideias rápidas de melhoria aplicáveis.

Seja direto, profissional e use emojis quando apropriado.
    `;

    const markdown = await callGroq(prompt);

    return {
      markdown: markdown || "Erro ao analisar.",
      groundingMetadata: undefined
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Falha na análise do perfil.");
  }
};

// --- 2. Gerador de Posts (CORRIGIDO) ---
export const generatePost = async (
  topic: string,
  tone: string,
  platform: string
): Promise<PostResult> => {
  try {
    const prompt = `
ATUE COMO: Um Copywriter Especialista e Diretor de Arte.
TAREFA: Criar um post para ${platform} sobre "${topic}" com tom "${tone}".

REGRAS PARA O CONTEÚDO DO POST:
- Texto do post em PORTUGUÊS com emojis apropriados
- 5 hashtags relevantes

REGRAS PARA O PROMPT DE IMAGEM (CRITICAL - MUST BE IN ENGLISH):
1. The imagePrompt MUST be written ENTIRELY IN ENGLISH - no Portuguese words allowed
2. Avoid cartoon or generic 3D styles. Use terms like "professional food photography", "macro shot", "cinematic lighting", "8k resolution"
3. For food (e.g., burger), specify "realistic proportions", "appetizing", "steam rising"
4. For 'Smash Burger', specify: "flat patty", "crispy edges", "melted cheese", "not too tall", "authentic street food style"
5. Focus on photorealistic details and professional photography terms

SAÍDA ESPERADA (JSON válido):
{
  "content": "O texto do post em português (com emojis)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "imagePrompt": "A highly detailed visual prompt in PURE ENGLISH for photorealistic image generation"
}

EXAMPLE OUTPUT:
{
  "content": "🍔 Que tal um hambúrguer delicioso hoje? Venha experimentar!",
  "hashtags": ["#burger", "#food", "#delicious", "#lunch", "#foodporn"],
  "imagePrompt": "Professional food photography of a gourmet smash burger with flat patty, crispy caramelized edges, melted cheddar cheese, fresh lettuce and tomato on a toasted brioche bun, shot from 45 degree angle with cinematic lighting, shallow depth of field, steam rising, appetizing presentation, 8k resolution, hyper realistic"
}

IMPORTANTE: 
- O "content" e "hashtags" devem estar em PORTUGUÊS
- O "imagePrompt" DEVE estar COMPLETAMENTE EM INGLÊS
- Retorne APENAS o JSON, sem texto adicional antes ou depois
    `;

    const text = await callGroq(prompt, true);
    console.log('Raw Groq response:', text); // Debug
    
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanText);
    
    // Validação e garantia de estrutura correta
    return {
      content: parsed.content || '',
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
      imagePrompt: parsed.imagePrompt || ''
    };
  } catch (error) {
    console.error("Post Generation Error:", error);
    console.error("Failed text:", error);
    throw new Error("Falha ao gerar o post.");
  }
};

// --- 2b. Gerador de Frases para Imagem ---
export const generateImageOverlays = async (topic: string): Promise<string[]> => {
  try {
    const prompt = `
ATUE COMO: Especialista em Design e Marketing Visual.
TAREFA: Criar 5 frases curtas e impactantes (Headlines) para colocar SOBRE uma imagem de anúncio.
TEMA: "${topic}"

REGRAS:
1. Máximo 5 palavras por frase.
2. Devem ser chamativas (ex: "50% OFF", "O Melhor da Cidade", "Experimente Agora").
3. Não use aspas na saída.

SAÍDA: Apenas um Array JSON de strings.
Exemplo: ["Frase 1", "Frase 2", "Frase 3", "Frase 4", "Frase 5"]

IMPORTANTE: Retorne APENAS o JSON array, sem texto adicional.
    `;

    const text = await callGroq(prompt, true);
    console.log('Raw overlays response:', text); // Debug
    
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanText);
    
    // Garante que retorna array
    return Array.isArray(parsed) ? parsed : ["Oferta Especial", "Confira!", "Qualidade Premium", "Não Perca", "Visite Hoje"];
  } catch (error) {
    console.error("Overlay Gen Error:", error);
    return ["Oferta Especial", "Confira!", "Qualidade Premium", "Não Perca", "Visite Hoje"];
  }
};
// --- 3. Resposta de Reviews ---
export const generateReviewResponse = async (
  reviewText: string,
  starRating: number
): Promise<ReviewResponseResult> => {
  try {
    const prompt = `
ATUE COMO: Especialista em Customer Success.
TAREFA: Responder a uma avaliação de cliente no Google.

AVALIAÇÃO DO CLIENTE:
"${reviewText}"
NOTA: ${starRating}/5 estrelas.

REGRAS:
1. Seja empático e profissional.
2. Se a nota for baixa, peça desculpas e ofereça solução offline.
3. Se a nota for alta, agradeça e convide para voltar.
4. Assine como "Equipe de Atendimento".

SAÍDA ESPERADA (JSON válido):
{
  "responseText": "A resposta pronta para copiar",
  "strategy": "Uma frase curta explicando por que essa resposta funciona"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
    `;

    const text = await callGroq(prompt, true);
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Review Response Error:", error);
    throw new Error("Falha ao gerar resposta.");
  }
};

// --- 4. Consultor de Negócios ---
export const askBusinessConsultant = async (question: string): Promise<string> => {
  try {
    const prompt = `
ATUE COMO: Um Consultor de Negócios Sênior especializado em Pequenas e Médias Empresas (PMEs), Marketing Local e Publicidade.

CONTEXTO: O usuário é dono de um negócio local e tem uma dúvida específica.
DÚVIDA DO USUÁRIO: "${question}"

DIRETRIZES DA RESPOSTA:
1. Seja prático e direto. Evite jargões corporativos desnecessários.
2. Foque em estratégias de baixo custo e alto impacto (Growth Hacking Local).
3. Se a pergunta for sobre anúncios (Ads), sugira segmentação geográfica.
4. Se a pergunta for sobre gestão, foque em eficiência e atendimento.
5. Formate a resposta usando Markdown (títulos, listas, negrito) para fácil leitura.
6. Use um tom encorajador e profissional.
    `;

    const response = await callGroq(prompt);
    return response || "Não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Consultant Error:", error);
    throw new Error("Falha ao consultar o especialista.");
  }
};

// --- 6. Gerador de FAQ ---
export const generateFaqAnswer = async (
  question: string, 
  tone: string
): Promise<FaqResult> => {
  try {
    const prompt = `
ATUE COMO: O Dono/Gerente de um Negócio Local atencioso.
TAREFA: Escrever uma resposta para uma pergunta frequente (FAQ) de um cliente.

PERGUNTA DO CLIENTE: "${question}"
TOM DE VOZ DESEJADO: "${tone}"

OBJETIVO:
1. Responder a dúvida de forma clara e precisa.
2. Ser convidativo e incentivar uma visita ou contato.
3. Usar emojis adequados.
4. Manter o texto curto (ideal para Q&A do Google ou Social Media).

SAÍDA ESPERADA (JSON válido):
{
  "answer": "O texto da resposta",
  "tone": "O tom utilizado"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.
    `;

    const text = await callGroq(prompt, true);
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("FAQ Gen Error:", error);
    throw new Error("Falha ao gerar resposta do FAQ.");
  }
};

// Funções de imagem (implementar Hugging Face depois)
// --- GERAÇÃO DE IMAGENS COM HUGGING FACE ---

const HF_IMAGE_FUNCTION_URL = '/.netlify/functions/huggingface-image';

export const generateAiImage = async (prompt: string): Promise<string> => {
  try {
    console.log('Generating image with HuggingFace...');
    const promptIngles = await translateToEnglish(prompt);
    console.log(`Prompt traduzido: "${prompt}" → "${promptIngles}"`);
    
    const response = await fetch(HF_IMAGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: promptIngles,
        action: 'generate',
        model: 'stabilityai/stable-diffusion-xl-base-1.0'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Se o modelo estiver carregando, espera e tenta novamente
      if (response.status === 503) {
        console.log('Model is loading, retrying in 15 seconds...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        return generateAiImage(prompt); // Retry
      }
      
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const remixImage = async (
  base64Image: string, 
  promptInstruction: string
): Promise<string> => {
  try {
    console.log('Remixing image with HuggingFace...');
    const promptIngles = await translateToEnglish(promptInstruction);
    console.log(`Prompt remix traduzido: "${promptInstruction}" → "${promptIngles}"`);
    
    const response = await fetch(HF_IMAGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: promptIngles,
        base64Image: base64Image,
        action: 'remix'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (response.status === 503) {
        console.log('Model is loading, retrying in 15 seconds...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        return remixImage(base64Image, promptInstruction);
      }
      
      throw new Error(errorData.error || 'Failed to remix image');
    }

    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error('Error remixing image:', error);
    throw error;
  }
};