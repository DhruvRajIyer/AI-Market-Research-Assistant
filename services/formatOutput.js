/**
 * Format Output Service
 * Formats AI responses into different output formats (Markdown, HTML)
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats response text for UI display
 * - Replaces **Header**: with styled h3 elements
 * - Converts bullet points to HTML list items
 * - Escapes dangerous HTML
 * - Wraps output in a styled div
 * 
 * @param {string} rawText - Raw text from AI response
 * @returns {string} - Formatted HTML for UI display
 */
function formatResponse(rawText) {
  if (!rawText) return '';
  
  // Escape HTML to prevent XSS
  let text = escapeHTML(rawText);
  
  // Replace **Header**: with styled h3 elements that are permanently black
  text = text.replace(/\*\*([^:]+)\*\*:/g, '<h3 class="text-lg font-bold text-black">$1</h3>');
  
  // Process bullet points
  let lines = text.split('\n');
  let inList = false;
  let result = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if line is a bullet point
    if (line.trim().startsWith('- ')) {
      // If not already in a list, start a new list
      if (!inList) {
        result.push('<ul class="list-disc pl-5 space-y-2">');
        inList = true;
      }
      // Add the bullet point as a list item
      result.push(`<li>${line.trim().substring(2)}</li>`);
    } else {
      // If not a bullet point and we were in a list, close the list
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      // Add the line as is
      result.push(line);
    }
  }
  
  // Close any open list
  if (inList) {
    result.push('</ul>');
  }
  
  // Join the lines back together
  text = result.join('\n');
  
  // Convert line breaks to <br> tags
  text = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  
  // Wrap the output in a styled div with permanently black text
  return `<div class="market-research-output p-4 bg-white dark:bg-gray-800 text-black rounded-lg shadow">
    <p>${text}</p>
  </div>`;
}

/**
 * Converts plain text to Markdown format with proper formatting
 * @param {string} text - Raw text from AI response
 * @param {Object} options - Formatting options
 * @param {boolean} options.addTableOfContents - Whether to add a table of contents (default: false)
 * @param {boolean} options.enhanceHeadings - Whether to enhance heading formatting (default: true)
 * @returns {string} - Formatted markdown text
 */
function toMarkdown(text, options = {}) {
  const { 
    addTableOfContents = false,
    enhanceHeadings = true 
  } = options;
  
  if (!text) return '';
  
  // Process the text to enhance markdown formatting
  let markdown = text;
  
  // Enhance headings if requested (e.g., "1. SECTION:" becomes "## 1. SECTION")
  if (enhanceHeadings) {
    // Match numbered sections like "1. SECTION:" or "1. SECTION"
    markdown = markdown.replace(/^(\d+)\.\s+([A-Z][A-Z\s]+):?$/gm, '## $1. $2');
    
    // Match unnumbered sections in all caps with or without colon
    markdown = markdown.replace(/^([A-Z][A-Z\s]+):?$/gm, '## $1');
  }
  
  // Add table of contents if requested
  if (addTableOfContents) {
    const headings = [];
    const headingRegex = /^## (.+)$/gm;
    let match;
    
    // Extract all headings
    while ((match = headingRegex.exec(markdown)) !== null) {
      headings.push(match[1]);
    }
    
    // Generate table of contents if headings exist
    if (headings.length > 0) {
      const toc = "## Table of Contents\n\n" + 
        headings.map((heading, index) => {
          // Create anchor from heading (lowercase, replace spaces with hyphens)
          const anchor = heading.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          return `${index + 1}. [${heading}](#${anchor})`;
        }).join('\n');
      
      markdown = toc + '\n\n---\n\n' + markdown;
    }
  }
  
  return markdown;
}

/**
 * Converts plain text or markdown to HTML format
 * @param {string} text - Raw text or markdown from AI response
 * @param {Object} options - Formatting options
 * @param {boolean} options.addTableOfContents - Whether to add a table of contents (default: false)
 * @param {boolean} options.addStyling - Whether to add basic CSS styling (default: true)
 * @returns {string} - Formatted HTML
 */
function toHTML(text, options = {}) {
  const { 
    addTableOfContents = false,
    addStyling = true 
  } = options;
  
  if (!text) return '';
  
  // First convert to enhanced markdown
  const markdown = toMarkdown(text, { 
    addTableOfContents: false, // We'll handle TOC separately for HTML
    enhanceHeadings: true 
  });
  
  // Simple markdown to HTML conversion
  let html = markdown
    // Convert headers
    .replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>')
    
    // Convert bullet points
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>')
    
    // Convert paragraphs (text blocks separated by blank lines)
    .replace(/^(?!<[uo]l>|<li>|<h[1-6]>)(.+)$/gm, '<p>$1</p>')
    
    // Convert bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Add table of contents if requested
  if (addTableOfContents) {
    const headings = [];
    const headingRegex = /<h[1-2] id="(.+?)">(.+?)<\/h[1-2]>/g;
    let match;
    
    // Extract all headings
    let tempHtml = html;
    while ((match = headingRegex.exec(tempHtml)) !== null) {
      headings.push({ id: match[1], text: match[2] });
    }
    
    // Generate table of contents if headings exist
    if (headings.length > 0) {
      const toc = '<div class="toc"><h2>Table of Contents</h2><ul>' + 
        headings.map(heading => `<li><a href="#${heading.id}">${heading.text}</a></li>`).join('') +
        '</ul></div><hr>';
      
      html = toc + html;
    }
  }
  
  // Add basic styling if requested
  if (addStyling) {
    html = `
      <div class="formatted-content">
        <style>
          .formatted-content {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #000000; /* Permanently black text */
            max-width: 800px;
            margin: 0 auto;
          }
          .formatted-content h1, .formatted-content h2 {
            color: #2c3e50;
            margin-top: 1.5em;
          }
          .formatted-content ul, .formatted-content ol {
            padding-left: 2em;
          }
          .formatted-content li {
            margin-bottom: 0.5em;
          }
          .formatted-content .toc {
            background-color: #f8f9fa;
            padding: 1em;
            border-radius: 5px;
          }
          .formatted-content hr {
            border: 0;
            height: 1px;
            background-color: #ddd;
            margin: 2em 0;
          }
        </style>
        ${html}
      </div>
    `;
  }
  
  return html;
}

module.exports = {
  formatResponse,
  toMarkdown,
  toHTML
};
