import { AnalysisResult, PostResult, ReviewResponseResult, FaqResult } from "../types";

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

// --- 2. Gerador de Posts ---
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
3. Para 'Smash Burger', especifique: "flat patty", "crispy edges", "melted cheese", "not too tall", "authentic street food style".

SAÍDA ESPERADA (JSON válido):
{
  "content": "O texto do post (com emojis)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "imagePrompt": "Um prompt visual extremamente detalhado focado em realismo fotográfico"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional antes ou depois.
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
export const generateAiImage = async (prompt: string): Promise<string> => {
  throw new Error("Função de imagem ainda não implementada.");
};

export const remixImage = async (base64Image: string, promptInstruction: string): Promise<string> => {
  throw new Error("Função de imagem ainda não implementada.");
};