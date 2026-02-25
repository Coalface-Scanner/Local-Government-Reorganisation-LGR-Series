/**
 * AI Response Stub - Ready for Eleven Labs Canary Integration
 * 
 * TODO: Replace these stub functions with Eleven Labs Canary API calls
 * Environment variable: VITE_ELEVEN_LABS_API_KEY
 */

import { marked } from 'marked';
import { Council } from '../data/surreyHubData';

/**
 * Generate a strategic brief for a council
 * TODO: Replace with Eleven Labs Canary API call
 */
export async function generateBrief(council: Council): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Stub response - replace with actual API call
  const stubResponse = `## Strategic Brief: ${council.name} Council

${council.name} represents a **${council.risk || 'Medium'}** risk profile within the ${council.cohort === 'WEST' ? 'West' : 'East'} Surrey unitary structure.

### Key Asset
${council.asset} provides a foundational strength, though operational integration challenges remain significant.

### Primary Liability
${council.liability} creates immediate pressure points that will require strategic management during the transition period.

### Strategic Context
${council.desc}

### Recommendations
1. Establish clear integration protocols for ${council.asset.toLowerCase()}
2. Develop mitigation strategies for ${council.liability.toLowerCase()}
3. Create cross-council working groups to manage transition risks

*Note: This is a stub response. Connect to Eleven Labs Canary API for live intelligence generation.*`;

  return marked.parse(stubResponse);
}

/**
 * Simulate a planning objection letter
 * TODO: Replace with Eleven Labs Canary API call
 */
export async function simulateObjection(council: Council): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Stub response
  const politicalContext = council.cohort === 'EAST' ? 'Residents Association/Conservative' : 'Lib Dem';
  const stubResponse = `"We strongly object to any development that fails to account for ${council.liability.toLowerCase()}. Our community has consistently raised concerns about the impact on local infrastructure, and this proposal appears to ignore those legitimate fears. The ${politicalContext} administration must prioritize resident interests over developer profits."`;
  
  return stubResponse;
}

/**
 * Generate AI chat response based on user query
 * TODO: Replace with Eleven Labs Canary API call
 */
export async function generateChatResponse(
  query: string, 
  _context: Array<{ n: string; r?: string; a: string; l: string }>
): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Stub response based on query context
  const queryLower = query.toLowerCase();
  let stubResponse = '';
  
  if (queryLower.includes('debt') || queryLower.includes('woking')) {
    stubResponse = 'Woking\'s £1.5bn debt represents the single largest risk to West Surrey\'s financial stability. The debt burden will require careful management and may impact service delivery across the new unitary authority.';
  } else if (queryLower.includes('harmonis') || queryLower.includes('tax')) {
    stubResponse = 'Tax harmonisation across 12 councils will create significant political friction, particularly in high-tax areas like Elmbridge and Runnymede. The transition period will require careful communication and phased implementation.';
  } else if (queryLower.includes('housing') || queryLower.includes('green belt')) {
    stubResponse = 'With 94% Green Belt coverage, Tandridge faces the greatest housing delivery challenge. Grey Belt re-designation offers potential solutions but will require strong political will and community engagement.';
  } else if (queryLower.includes('risk') || queryLower.includes('liability')) {
    stubResponse = 'Critical risk councils include Woking (debt), Tandridge (structural deficit), and Surrey Heath (commercial exposure). These require immediate attention in the transition planning process.';
  } else {
    stubResponse = `Based on the strategic intelligence database, I can provide analysis on debt, harmonisation, housing, and risk profiles. Could you clarify which specific aspect of Surrey's reorganisation you'd like me to focus on?

*Note: This is a stub response. Connect to Eleven Labs Canary API for live AI-powered analysis.*`;
  }
  
  return marked.parse(stubResponse);
}
