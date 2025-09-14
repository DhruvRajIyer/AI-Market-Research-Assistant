/**
 * Market Research Agent - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Company Research Form
  const companyForm = document.getElementById('company-form');
  if (companyForm) {
    companyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleResearch('company');
    });
  }
  
  // Sector Research Form
  const sectorForm = document.getElementById('sector-form');
  if (sectorForm) {
    sectorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleResearch('sector');
    });
  }
  
  // AI Impact Form
  const aiImpactForm = document.getElementById('ai-impact-form');
  if (aiImpactForm) {
    aiImpactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleResearch('ai-impact');
    });
  }
  
  // Format switching buttons
  const formatButtons = document.querySelectorAll('.format-button');
  formatButtons.forEach(button => {
    button.addEventListener('click', () => {
      const resultId = button.closest('.result').id;
      const format = button.getAttribute('data-format');
      const resultContent = document.querySelector(`#${resultId} .result-content`);
      const currentData = window[`${resultId}Data`]; // Get stored data from window object
      
      // Update active button
      document.querySelectorAll(`#${resultId} .format-button`).forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Update content based on format
      if (format === 'raw') {
        resultContent.innerHTML = currentData.analysis;
      } else if (format === 'markdown') {
        resultContent.innerHTML = currentData.markdownAnalysis || currentData.analysis;
      } else if (format === 'html') {
        resultContent.innerHTML = currentData.htmlAnalysis || currentData.analysis;
      }
    });
  });
});

/**
 * Handle research form submission
 * @param {string} type - Type of research (company, sector, ai-impact)
 */
async function handleResearch(type) {
  const queryInput = document.getElementById(`${type}-query`);
  const submitBtn = document.getElementById(`${type}-submit`);
  const loadingEl = document.getElementById(`${type}-loading`);
  const resultEl = document.getElementById(`${type}-result`);
  const resultContent = document.querySelector(`#${type}-result .result-content`);
  const errorEl = document.getElementById(`${type}-error`);
  
  const query = queryInput.value.trim();
  if (!query) return;
  
  // Show loading, hide results, disable button
  submitBtn.disabled = true;
  loadingEl.style.display = 'block';
  resultEl.style.display = 'none';
  errorEl.style.display = 'none';
  
  try {
    // Determine endpoint based on type and additional parameters
    let endpoint = `/api/${type}`;
    let additionalParams = {};
    
    if (type === 'ai-impact') {
      const targetType = document.getElementById('ai-impact-type').value;
      endpoint = `/api/${targetType}-ai-impact`;
    }
    
    // Format selection
    const formatSelect = document.getElementById(`${type}-format`);
    if (formatSelect) {
      additionalParams.format = formatSelect.value;
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        query: query,
        ...additionalParams
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store data in window object for format switching
      window[`${type}-resultData`] = data;
      
      // Display result
      let displayContent = data.analysis;
      
      // Set title
      const resultTitle = document.querySelector(`#${type}-result h2`);
      if (resultTitle) {
        resultTitle.textContent = `Research Results: ${data.query || query}`;
      }
      
      // Display content
      resultContent.innerHTML = displayContent;
      resultEl.style.display = 'block';
      
      // Set active format button
      const formatButtons = document.querySelectorAll(`#${type}-result .format-button`);
      formatButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-format') === 'raw') {
          btn.classList.add('active');
        }
      });
    } else {
      errorEl.textContent = `Error: ${data.error || 'Something went wrong'}`;
      errorEl.style.display = 'block';
    }
  } catch (error) {
    errorEl.textContent = `Error: ${error.message}`;
    errorEl.style.display = 'block';
  } finally {
    // Hide loading, enable button
    submitBtn.disabled = false;
    loadingEl.style.display = 'none';
  }
}
