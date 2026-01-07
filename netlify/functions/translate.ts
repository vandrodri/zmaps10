import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Aceita apenas POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { text } = JSON.parse(event.body || "{}");

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Texto não fornecido" })
      };
    }

    // Token fica SEGURO no backend (não exposto no frontend)
    const HF_API_TOKEN = process.env.HUGGINGFACE_API_KEY;

    if (!HF_API_TOKEN) {
      console.error("HUGGINGFACE_API_KEY não configurada!");
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: "Configuração inválida",
          translation: text // Fallback: retorna o original
        })
      };
    }

    const API_URL = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-tc-big-pt-en";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const resultado = await response.json();

    // Modelo ainda carregando
    if (resultado.error?.includes("loading")) {
      return {
        statusCode: 503,
        body: JSON.stringify({ 
          error: "Modelo carregando",
          translation: text,
          retry: true
        })
      };
    }

    // Sucesso
    const translation = resultado[0]?.translation_text || text;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        translation,
        original: text
      })
    };

  } catch (error) {
    console.error("Erro na função de tradução:", error);
    
    // Em caso de erro, retorna o texto original como fallback
    const { text } = JSON.parse(event.body || "{}");
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Erro ao traduzir",
        translation: text || "",
        fallback: true
      })
    };
  }
};