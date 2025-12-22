const fetch = require('node-fetch');

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
      
    const { prompt, jsonMode = false } = JSON.parse(event.body);
  
    
    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    console.log('Calling Groq API...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Modelo mais completo e rápido
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        max_tokens: 4000,
        temperature: 0.7,
        ...(jsonMode && { response_format: { type: 'json_object' } })
      })
    });

    const responseText = await response.text();
    console.log('Groq Response Status:', response.status);

    if (!response.ok) {
      console.error('Groq Error:', responseText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Groq API error',
          details: responseText
        })
      };
    }

    const data = JSON.parse(responseText);
    const text = data.choices[0].message.content;

    console.log('Groq response received successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        text, 
        usage: data.usage 
      })
    };

  } catch (error) {
    console.error('Groq Error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate content',
        details: error.message 
      })
    };
  }
};