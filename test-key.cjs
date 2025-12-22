const fetch = require('node-fetch');

async function test() {
  const key = 'sk-1b6fbe6594794e5d84afd874c720b80b';
  
  console.log('Testando chave:', key.substring(0, 10) + '...');
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'hello' }]
    })
  });

  console.log('Status:', response.status);
  const text = await response.text();
  console.log('Response:', text);
}

test();