/**
 * AI Impact Analysis Prompt Generator
 * Generates a formatted prompt for analyzing AI's impact on a company or industry
 */

/**
 * Generates a formatted prompt for AI impact analysis on a company
 * @param {string} companyName - Name of the company to analyze
 * @returns {string} - Formatted prompt for AI impact analysis
 */
function getCompanyAIImpactPrompt(companyName) {
  return `Conduct a rigorous, practitioner-grade analysis of how ARTIFICIAL INTELLIGENCE impacts ${companyName} across strategy, product, operations, and economics. Use concise bullets, quantify where possible, and avoid fabrications. If information is unknown, state "Unknown/Not disclosed".

Please structure the response as follows:

1. CURRENT AI FOOTPRINT:
   - Publicly known AI products/features and monetization (with launch years if known)
   - Internal AI use cases (e.g., forecasting, personalization, automation)
   - Data assets leveraged for AI (first-party, third-party, partnerships)
   - Notable AI partnerships, M&A, open-source contributions

2. TECH STACK AND CAPABILITIES:
   - Model approach (foundation models, fine-tuning, retrieval-augmented, on-device, etc.)
   - Infrastructure (cloud/provider, accelerators, inference strategy, cost considerations)
   - Safety, evaluation, and governance practices (responsible AI, red-teaming)

3. COMPETITIVE BENCHMARK:
   - Primary competitors and their AI positioning
   - Relative advantages/disadvantages for ${companyName} (data, distribution, talent, IP)
   - Differentiation durability and risk of commoditization

4. VALUE CREATION AND ECONOMICS:
   - Revenue impact (new products, ARPU uplift, upsell, pricing power)
   - Cost impact (COGS reduction, opex efficiency, margin effects; include rough ranges if credible)
   - Unit economics implications (inference cost per user/task, scale curves)

5. BUSINESS MODEL AND GO-TO-MARKET SHIFTS:
   - Packaging/pricing changes (tiering, seats, usage-based, bundles)
   - Channel implications (sales enablement, partner ecosystem)
   - Impact on customer lifecycle (acquisition, activation, retention, expansion)

6. RISKS AND COMPLIANCE:
   - Technical risks (hallucination, latency, reliability, security)
   - Legal/regulatory (privacy, copyright, sector regulations)
   - Operational and reputational risks; mitigations in place or required

7. ORGANIZATION AND TALENT:
   - AI org structure (central platform vs. embedded pods)
   - Headcount/talent gaps; hiring priorities
   - Build/buy/partner decisions and rationale

8. ROADMAP AND INVESTMENT OUTLOOK (12–24 MONTHS):
   - Key milestones and dependencies
   - Investment areas and expected ROI horizons
   - Leading indicators/KPIs to monitor

9. KPI SCORECARD:
   - Suggested metrics to track (e.g., AI feature adoption %, inference cost/user, model quality metrics, time-to-value)

10. STRATEGIC RECOMMENDATIONS:
   - 3–5 actionable priorities with rationale and expected impact

Formatting:
- Use clear section headings exactly as titled above in ALL CAPS.
- Prefer short bullets with numbers/percentages when available.
- Include "Sources to verify" at the end with suggested public filings/press/benchmark datasets if relevant.`;
}

/**
 * Generates a formatted prompt for AI impact analysis on an industry sector
 * @param {string} sectorName - Name of the industry sector to analyze
 * @returns {string} - Formatted prompt for AI impact analysis
 */
function getSectorAIImpactPrompt(sectorName) {
  return `Produce an expert industry analysis of AI's impact on the ${sectorName} sector, suitable for executives and investors. Be specific, quantify where possible, and note "Unknown/Not disclosed" when information is unavailable.

Please structure the response as follows:

1. ADOPTION LANDSCAPE:
   - Core AI use cases in ${sectorName}
   - Adoption by subsegments and regions; maturity curve
   - Notable leaders/laggards and why

2. VALUE CHAIN IMPACT:
   - Where value accrues (data, models, apps, distribution)
   - Shifts in bargaining power and margin pools
   - Disintermediation/rebundling dynamics

3. ECONOMIC EFFECTS:
   - Productivity/cost impact ranges by activity
   - Revenue growth vectors (new products, price mix)
   - Capex/opex implications (compute, data, compliance)

4. COMPETITIVE DYNAMICS:
   - Incumbents vs. challengers; barriers to entry/economies of scale
   - Open vs. closed ecosystems; platform risks
   - Data/network effects durability

5. REGULATORY AND TRUST:
   - Active/pending regulations relevant to ${sectorName}
   - Compliance hotspots (privacy, copyright, safety)
   - Standards/assurance, audits, certifications

6. DATA AND INFRASTRUCTURE:
   - Critical datasets (availability, ownership, quality)
   - Infra patterns (cloud, edge/on-device, specialized hardware)
   - Model approaches (generalist vs. vertical; RAG; fine-tuning)

7. WORKFORCE AND ORGANIZATION:
   - Role transformation, reskilling needs, talent supply
   - Productivity tools impact; union/HR considerations

8. OUTLOOK AND SCENARIOS (3–5 YEARS):
   - Base case, bull, bear with triggers and leading indicators
   - Potential black swans/disruptions

9. OPPORTUNITIES AND RISKS:
   - Top opportunity areas by segment with rationale
   - Key risks and mitigations

10. KPI FRAMEWORK:
   - Suggested sector KPIs to monitor (adoption %, model performance, unit economics, regulatory milestones)

11. STRATEGIC RECOMMENDATIONS:
   - 4–6 actionable moves for incumbents and for entrants

Formatting:
- Use ALL-CAPS headings exactly as titled above with numbered sections.
- Use concise bullets and include magnitudes/percentages when possible.
- End with "Sources to monitor" (e.g., filings, regulator portals, industry trackers).`;
}

module.exports = {
  getCompanyAIImpactPrompt,
  getSectorAIImpactPrompt
};
