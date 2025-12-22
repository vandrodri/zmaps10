const fetch = require('node-fetch');

exports.handler = async (event) => {
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

    console.log('Calling DeepSeek API...');


    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-1b6fbe6594794e5d84afd874c720b80b'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
        ...(jsonMode && { response_format: { type: 'json_object' } })
      }),
    
    });


    const responseText = await response.text();
    console.log('DeepSeek Response Status:', response.status);
    console.log('DeepSeek Response:', responseText.substring(0, 200));

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'DeepSeek API error',
          details: responseText
        })
      };
    }

    const data = JSON.parse(responseText);
    const text = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text, usage: data.usage })
    };
  } catch (error) {
    console.error('DeepSeek Error:', error.message);
    
    if (error.name === 'AbortError') {
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({ error: 'Request timeout', details: 'API demorou mais de 30s' })
      };
    }

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