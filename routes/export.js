/**
 * Export Routes
 * Handles file export functionality for the market research app
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const os = require('os');

/**
 * POST /export
 * Accepts filename, content, and format, returns a downloadable file
 * @param {Object} req.body
 * @param {string} req.body.filename - Name for the downloaded file
 * @param {string} req.body.content - Content to be written to the file
 * @param {string} req.body.format - Format of the export: 'txt' or 'pdf'
 * @param {string} req.body.htmlContent - HTML content for PDF export (optional)
 */
router.post('/', async (req, res) => {
  try {
    const { filename, content, format = 'txt', htmlContent } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ error: 'Missing filename or content parameter' });
    }
    
    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    
    // Handle based on requested format
    if (format === 'pdf') {
      // For PDF export, we need HTML content
      const contentToRender = htmlContent || `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${sanitizedFilename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #333; }
            h3 { margin-top: 20px; color: #444; }
            ul { margin-left: 20px; }
            .content { max-width: 800px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>${sanitizedFilename}</h1>
            <div class="report-content">
              ${content.replace(/\n/g, '<br>')}
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Ensure filename has .pdf extension
      const pdfFilename = sanitizedFilename.endsWith('.pdf') ? sanitizedFilename : `${sanitizedFilename}.pdf`;
      
      try {
        // Build robust Puppeteer launch options for hosted environments (e.g., Render)
        const baseArgs = [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--single-process'
        ];
        
        const launchAttempt = async (extra = {}) => {
          const opts = {
            headless: 'new',
            args: baseArgs,
            timeout: 60000,
            ...extra
          };
          return puppeteer.launch(opts);
        };

        // Prefer an explicit executable path if provided by the platform/user
        const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || (typeof puppeteer.executablePath === 'function' ? puppeteer.executablePath() : undefined);

        let browser;
        try {
          browser = await launchAttempt(execPath ? { executablePath: execPath } : {});
        } catch (primaryErr) {
          console.warn('Puppeteer primary launch failed, retrying with minimal options:', primaryErr?.message);
          // Retry with minimal options (no executablePath override)
          browser = await launchAttempt({});
        }

        // Create a new page with increased default timeout
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);

        // Set content directly instead of navigating to a file (more reliable)
        await page.setContent(contentToRender, { waitUntil: 'networkidle0', timeout: 60000 });

        // Generate PDF
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
        });

        await browser.close();

        // Set headers for PDF download
        res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        return res.send(pdfBuffer);
      } catch (pdfError) {
        console.error('Error generating PDF (Puppeteer):', pdfError?.message || pdfError);
        // If PDF generation fails, fall back to text
        console.log('Falling back to text export');
        // Continue to text export
      }
    }
    
    // Default: Text export
    // Ensure filename has .txt extension
    const txtFilename = sanitizedFilename.endsWith('.txt') ? sanitizedFilename : `${sanitizedFilename}.txt`;
    
    // Set headers for text file download
    res.setHeader('Content-Disposition', `attachment; filename="${txtFilename}"`);
    res.setHeader('Content-Type', 'text/plain');
    
    // Send the content directly as the response
    res.send(content);
    
  } catch (error) {
    console.error('Error in /export route:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
