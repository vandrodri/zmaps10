const Groq = require('groq-sdk');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  try {
    const { prompt } = JSON.parse(event.body);

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        text: completion.choices[0]?.message?.content || ''
      })
    };
  } catch (error) {
    console.error('Groq Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};