export async function translateToEnglish(textoPtBr: string): Promise<string> {
  // Se vazio ou já em inglês, retorna direto
  if (!textoPtBr || /^[a-zA-Z\s.,!?]+$/.test(textoPtBr)) {
    return textoPtBr;
  }

  try {
    const response = await fetch("/.netlify/functions/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: textoPtBr })
    });

    const data = await response.json();

    // Se modelo está carregando, aguarda e tenta novamente
    if (data.retry) {
      console.log("Modelo carregando, aguardando 20s...");
      await new Promise(resolve => setTimeout(resolve, 20000));
      return translateToEnglish(textoPtBr);
    }

    // Retorna tradução ou fallback
    return data.translation || textoPtBr;

  } catch (error) {
    console.error("Erro na tradução, usando texto original:", error);
    return textoPtBr;
  }
}