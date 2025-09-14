/**
 * Company Profile Prompt Generator
 * Generates a formatted prompt for detailed company profile analysis
 */

/**
 * Generates a formatted prompt for company profile analysis
 * @param {string} companyName - Name of the company to analyze
 * @returns {string} - Formatted prompt for company profile
 */
function getProfilePrompt(companyName) {
  return `Create an expert-grade company profile for ${companyName}. Use concise bullets, quantify where possible, cite public signals, and avoid fabrications. If data is not available, write "Unknown/Not disclosed".

Please structure the response as follows:

1. COMPANY SNAPSHOT:
   - Founded year, HQ, employees, ticker (if public)
   - Mission and core value proposition in one sentence
   - Primary business segments and geographies

2. PRODUCTS AND CUSTOMERS:
   - Core products/services and pricing/packaging model
   - Target customer personas and use cases
   - Top distribution channels and partnerships

3. MARKET POSITIONING:
   - Category and subcategory; primary competitors
   - Differentiators and moat drivers (data, distribution, brand, IP)
   - Market share/signals of traction (users, ARR, growth rates if known)

4. FINANCIAL OVERVIEW:
   - Revenue, growth, profitability, gross margin trends (ranges if necessary)
   - Unit economics highlights (LTV:CAC, payback, contribution margin if known)
   - Capitalization (funding rounds/investors or market cap if public)

5. OPERATIONS AND GO-TO-MARKET:
   - Sales motion (PLG, SLG, channel), sales cycle length, average deal size
   - Customer retention/expansion signals; churn risks
   - Supply chain/operations notes if relevant

6. TECHNOLOGY AND INNOVATION:
   - Key technologies and IP (patents, proprietary data, AI usage)
   - R&D focus areas and recent launches
   - Platform/ecosystem strategy (APIs, marketplaces, integrations)

7. RISK FACTORS:
   - Regulatory, competitive, operational, and concentration risks
   - Mitigations in place or needed

8. STRATEGIC PRIORITIES (NEXT 12–24 MONTHS):
   - 3–5 priorities with rationale, expected impact, dependencies

9. KPI DASHBOARD:
   - Suggested KPIs for this business model (e.g., ARR growth %, NRR, ARPU, CAC payback, gross margin)

Formatting:
- Use ALL-CAPS section headings exactly as titled above with numbers.
- Prefer short bullets and quantitative statements.
- End with "Sources to verify" (e.g., 10-K/press releases/analyst notes).`;
}

module.exports = { getProfilePrompt };
