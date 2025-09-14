const axios = require('axios');
require('dotenv').config();

/**
 * Sends a prompt to OpenRouter using the specified model (defaults to deepseek/deepseek-r1-0528-qwen3-8b:free)
 * @param {string} prompt - The prompt to send to the model
 * @param {Object} options - Optional parameters
 * @param {string} options.model - Model to use (default: 'deepseek/deepseek-r1-0528-qwen3-8b:free')
 * @param {number} options.maxTokens - Maximum number of tokens to generate (default: 1000)
 * @param {number} options.temperature - Temperature for response generation (default: 0.7)
 * @returns {Promise<Object>} - The response from OpenRouter
 */
async function sendPrompt(prompt, options = {}) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not defined in .env file');
  }

  const {
    model = 'deepseek/deepseek-r1-0528-qwen3-8b:free',
    maxTokens = 1000,
    temperature = 0.7
  } = options;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.HTTP_REFERER || 'https://localhost',
          'X-Title': process.env.X_TITLE || 'Market Research Agent'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`OpenRouter API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from OpenRouter API');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error making request to OpenRouter API: ${error.message}`);
    }
  }
}

module.exports = { sendPrompt };