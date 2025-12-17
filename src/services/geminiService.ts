import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, PostResult, ReviewResponseResult, FaqResult } from "../types";

// Initialize Gemini Client - CORRIGIDO para usar import.meta.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY não está configurada nas variáveis de ambiente");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Modelo padrão
const MODEL_ID = "gemini-2.5-flash";
const IMAGE_MODEL_ID = "gemini-2.5-flash-image";

// --- 1. Análise de Negócio (Existente) ---
export const analyzeBusiness = async (
  businessName: string,
  location: string
): Promise<AnalysisResult> => {
  try {
    const prompt = `
      ATUE COMO: Um Gerente de Google Business Profile (GBP) Senior.
      TAREFA: Auditar o negócio "${businessName}" em "${location}".
      FERRAMENTA: Use Google Maps para achar dados reais.
      
      GERE UM RELATÓRIO MARKDOWN COM:
      1. Diagnóstico do Perfil (Nota, Reviews, Status).
      2. Comparativo com 2 concorrentes reais.
      3. 3 Ideias rápidas de melhoria.
      
      Seja direto, profissional e use emojis.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: { tools: [{ googleMaps: {} }] },
    });

    return {
      markdown: response.text || "Erro ao analisar.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Falha na análise do perfil.");
  }
};

// --- 2. Gerador de Posts (Atualizado para Imagens Reais) ---
export const generatePost = async (
  topic: string,
  tone: string,
  platform: string
): Promise<PostResult> => {
  try {
    const prompt = `
      ATUE COMO: Um Copywriter Especialista e Diretor de Arte.
      TAREFA: Criar um post para ${platform} sobre "${topic}" com tom "${tone}".

      REGRAS PARA O PROMPT DE IMAGEM:
      1. Evite estilos cartoon ou 3D genéricos. Use termos como "professional food photography", "macro shot", "cinematic lighting", "8k resolution".
      2. Se for comida (ex: hamburguer), especifique "realistic proportions", "appetizing", "steam rising". 
      3. Para 'Smash Burger', especifique: "flat patty", "crispy edges", "melted cheese", "not too tall", "authentic street food style". Evite "stacked high" ou "perfect studio lighting" que pareça falso.

      SAÍDA ESPERADA (JSON):
      - content: O texto do post (com emojis).
      - hashtags: Lista de 5-10 hashtags relevantes.
      - imagePrompt: Um prompt visual extremamente detalhado, focado em realismo fotográfico, descrevendo iluminação, ângulo e textura.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Post Generation Error:", error);
    throw new Error("Falha ao gerar o post.");
  }
};

// --- 2b. Gerador de Frases para Imagem (Novo) ---
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
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
      },
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Overlay Gen Error:", error);
    return ["Oferta Especial", "Confira!", "Qualidade Premium", "Não Perca", "Visite Hoje"];
  }
};

// --- 3. Resposta de Reviews (Novo) ---
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

      SAÍDA ESPERADA (JSON):
      - responseText: A resposta pronta para copiar.
      - strategy: Uma frase curta explicando por que essa resposta funciona.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            responseText: { type: Type.STRING },
            strategy: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Review Response Error:", error);
    throw new Error("Falha ao gerar resposta.");
  }
};

// --- 4. Consultor de Negócios (Novo) ---
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

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 1024 } },
    });

    return response.text || "Não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Consultant Error:", error);
    throw new Error("Falha ao consultar o especialista.");
  }
};

// --- 5. Gerador de Imagem (Novo) ---
export const generateAiImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_ID,
      contents: {
        parts: [{ text: prompt + ", photorealistic, 8k, highly detailed, professional food photography" }],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0]?.content?.parts;
      if (!parts) {
        throw new Error("Resposta sem conteúdo de imagem");
      }
      
      for (const part of parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("Nenhuma imagem gerada.");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw new Error("Falha ao gerar imagem.");
  }
};

// --- 5b. Remix de Imagem (Novo - Anti-Copyright) ---
export const remixImage = async (base64Image: string, promptInstruction: string): Promise<string> => {
  try {
    // Remove header data URL se existir
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_ID,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data
            }
          },
          { text: `Create a new, unique variation of this image. Keep the main subject (like the burger or product) but change the background and lighting to be professional and cinematic. Ensure realistic proportions. ${promptInstruction}` }
        ],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0]?.content?.parts;
      if (!parts) {
        throw new Error("Resposta sem conteúdo de imagem");
      }
      
      for (const part of parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("Nenhuma imagem remixada gerada.");
  } catch (error) {
    console.error("Image Remix Error:", error);
    throw new Error("Falha ao remixar imagem.");
  }
};

// --- 6. Gerador de FAQ (Novo) ---
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

      SAÍDA ESPERADA (JSON):
      - answer: O texto da resposta.
      - tone: O tom utilizado (apenas para confirmação).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            tone: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("FAQ Gen Error:", error);
    throw new Error("Falha ao gerar resposta do FAQ.");
  }
};