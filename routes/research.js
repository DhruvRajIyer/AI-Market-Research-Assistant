const express = require('express');
const router = express.Router();
const { sendPrompt } = require('../services/openrouterService');
const { companyPrompt, sectorPrompt } = require('../prompts/swotPrompt');
const { getProfilePrompt } = require('../prompts/profilePrompt');
const { getCompanyAIImpactPrompt, getSectorAIImpactPrompt } = require('../prompts/aiImpactPrompt');
const { formatResponse, toHTML } = require('../services/formatOutput');

/**
 * POST /research
 * Accepts a query string and mode, and returns research information using OpenRouter
 * @param {Object} req.body
 * @param {string} req.body.query - Company or sector name to research
 * @param {string} req.body.mode - Research mode: 'profile', 'swot', 'trends', or 'aiImpact'
 */
router.post('/research', async (req, res) => {
  try {
    const { query, mode } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }
    
    if (!mode) {
      return res.status(400).json({ error: 'Missing mode parameter' });
    }
    
    let prompt;
    let isCompany = true; // Default to company research
    
    // Select prompt based on mode
    switch (mode) {
      case 'profile':
        prompt = getProfilePrompt(query);
        break;
      case 'swot':
        prompt = companyPrompt(query);
        break;
      case 'trends':
        prompt = sectorPrompt(query);
        isCompany = false;
        break;
      case 'aiImpact':
        // Check if this is for a company or sector
        if (req.body.entityType === 'sector') {
          prompt = getSectorAIImpactPrompt(query);
          isCompany = false;
        } else {
          prompt = getCompanyAIImpactPrompt(query);
        }
        break;
      default:
        return res.status(400).json({ error: `Invalid mode: ${mode}. Must be one of: profile, swot, trends, aiImpact` });
    }
    
    const response = await sendPrompt(prompt, {
      maxTokens: 1500,
      temperature: 0.7
    });
    
    // Get the raw content from the AI response
    const rawContent = response.choices[0].message.content;
    
    // Format the response for UI display using both formatters
    const formattedContent = formatResponse(rawContent);
    const htmlContent = toHTML(rawContent, { addTableOfContents: true, addStyling: true });
    
    res.json({
      query: query,
      mode: mode,
      entityType: isCompany ? 'company' : 'sector',
      analysis: rawContent,
      formatted_analysis: htmlContent, // Use the more comprehensive HTML formatter
      basic_formatted: formattedContent, // Keep the basic formatter as a backup
      full_response: response
    });
  } catch (error) {
    console.error('Error in /research route:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;