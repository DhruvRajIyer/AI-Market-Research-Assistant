/**
 * Structured prompt for company market research analysis
 * @param {string} companyName - Name of the company to research
 * @returns {string} - Formatted prompt for OpenRouter
 */
function companyPrompt(companyName) {
  return `Deliver an expert market research brief for ${companyName} with an actionable SWOT. Use concise bullets, quantify where possible, avoid fabrications, and mark unknowns as "Unknown/Not disclosed".

Please structure the response as follows:

1. COMPANY OVERVIEW:
   - Brief description, founded year, HQ, employees
   - Core segments, geographies, and key executives

2. BUSINESS MODEL:
   - Primary products/services and monetization
   - Customer segments and key use cases
   - Distribution/go-to-market approach

3. MARKET POSITION:
   - Category, subcategory; main competitors
   - Differentiators/moat (data, distribution, brand, IP)
   - Share/traction signals (users, ARR, growth rate if known)

4. FINANCIAL SNAPSHOT:
   - Revenue, growth, profitability, gross margin (ranges if needed)
   - Unit economics highlights (LTV:CAC, payback, NRR if known)

5. SWOT ANALYSIS:
   - Strengths: 4–6 bullets, specific advantages tied to outcomes
   - Weaknesses: 4–6 bullets, internal gaps/constraints
   - Opportunities: 4–6 bullets, quantifiable market openings
   - Threats: 4–6 bullets, competitive/regulatory/tech risks

6. FUTURE OUTLOOK (12–24 MONTHS):
   - Key growth drivers, product/market bets, dependencies
   - Leading indicators/KPIs to track

7. RECOMMENDATIONS:
   - 3–5 strategic actions with expected impact and timing

Formatting:
- Use ALL-CAPS section headings and numbered sections exactly as above.
- Prefer short, decision-oriented bullets with metrics where possible.
- End with "Sources to verify" (e.g., filings, earnings calls, credible press).`;
}

/**
 * Structured prompt for sector/industry market research analysis
 * @param {string} sectorName - Name of the sector/industry to research
 * @returns {string} - Formatted prompt for OpenRouter
 */
function sectorPrompt(sectorName) {
  return `Produce an executive-grade trends analysis for the ${sectorName} sector. Be specific, include magnitudes/ranges where possible, and clearly label uncertainties.

Please structure the response as follows:

1. SECTOR SNAPSHOT:
   - Size (TAM/SAM where credible), growth rate, key segments
   - Geographic distribution and demand centers

2. STRUCTURE AND COMPETITION:
   - Major players and concentration (HHI/oligopoly vs. fragmented)
   - Barriers to entry and switching costs
   - Value chain and where margins accrue

3. KEY TRENDS AND DRIVERS:
   - 5–8 macro and micro trends shaping ${sectorName}
   - Underlying drivers and evidence (policy, technology, consumer, capital)

4. HEADWINDS AND RISKS:
   - Regulatory, supply, competitive, and macro risks
   - Leading indicators and potential triggers

5. TECHNOLOGY IMPACT (INCLUDING AI):
   - Most material technologies and adoption timelines
   - Business model shifts and productivity effects

6. OUTLOOK AND SCENARIOS (3–5 YEARS):
   - Base, bull, bear with assumptions and catalysts

7. OPPORTUNITY MAP:
   - 5–8 opportunity areas by segment with rationale and beneficiaries

8. KPI FRAMEWORK:
   - Metrics to monitor sector health and trend progression

Formatting:
- Use ALL-CAPS headings and numbered sections as above.
- Use concise bullets; quantify impacts and provide ranges when precise data is unknown.
- End with "Sources to monitor" (e.g., industry reports, regulator portals, earnings).`;
}

module.exports = {
  companyPrompt,
  sectorPrompt
};