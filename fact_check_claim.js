async function fact_check_claim(params, userSettings) {
  // Parameter validation
  const { claim, claim_number, total_claims } = params;
  
  // Validate claim
  if (!claim?.trim()) {
    throw new Error("Invalid claim provided");
  }

  // Validate claim_number and total_claims are integers
  if (!Number.isInteger(claim_number) || claim_number < 1) {
    throw new Error("claim_number must be a positive integer");
  }
  
  if (!Number.isInteger(total_claims) || total_claims < 1) {
    throw new Error("total_claims must be a positive integer");
  }

  if (claim_number > total_claims) {
    throw new Error("claim_number cannot be greater than total_claims");
  }
  
  const { apiKey, model, systemMessage } = userSettings;
  if (!apiKey) {
    throw new Error("Perplexity API key is missing");
  }

  // Build fact-checking prompt
  const prompt = `Carefully analyze this claim and determine if it is true, false, or partially true. Provide evidence and citations:
  
  "${claim}"
  
  Format your response to clearly state the verdict and explain the reasoning.`;

  try {
    // Query Perplexity API
    const response = await queryPerplexity(prompt, model, systemMessage, apiKey);
    
    // Analyze response to determine truth status
    const status = determineTruthStatus(response.content);
    
    // Format result with next action signal
    const result = {
      claim,
      claim_number,
      status,
      analysis: response.content,
      citations: response.citations || [],
      next_action: claim_number < total_claims ? "next_claim" : "generate_report"
    };

    // Format the response for the LLM
    return formatResponse(result);
  } catch (error) {
    throw new Error(`Fact-checking failed: ${error.message}`);
  }
}

function formatResponse(result) {
  const { claim, status, analysis, citations, next_action } = result;
  
  const citationsText = citations.length > 0 
    ? '\n\nCitations:\n' + citations.map((c, i) => `[${i + 1}] ${c}`).join('\n')
    : '';

  // Enhanced instructions for final report
  const reportInstructions = `
Please compile a comprehensive fact-checking report with the following structure:

1. Executive Summary:
   - Brief overview of all claims checked
   - Overall assessment summary

2. Detailed Analysis (for each claim):
   - Claim statement
   - Verdict (true/false/partially true)
   - Reasoning for the verdict
   - Supporting citations
   

Format the report in clear, professional language using Markdown for better readability.`;

  return `Claim: ${claim}
Status: ${status}
Analysis: ${analysis}${citationsText}

Next Action: ${next_action === 'generate_report' ? 
  reportInstructions : 
  'Continue with next claim'}`;
}

function determineTruthStatus(analysis) {
  analysis = analysis.toLowerCase();
  
  // Check for explicit verdicts first
  if (analysis.includes('verdict: true') || analysis.includes('claim is true')) {
    return 'true';
  }
  if (analysis.includes('verdict: false') || analysis.includes('claim is false')) {
    return 'false';
  }
  if (analysis.includes('verdict: partially true') || analysis.includes('claim is partially true')) {
    return 'partially true';
  }

  // Fallback to content analysis
  const trueIndicators = ['correct', 'accurate', 'verified'];
  const falseIndicators = ['incorrect', 'inaccurate', 'false'];
  const partialIndicators = ['partially', 'somewhat', 'not entirely'];

  let score = {
    true: trueIndicators.filter(i => analysis.includes(i)).length,
    false: falseIndicators.filter(i => analysis.includes(i)).length,
    partial: partialIndicators.filter(i => analysis.includes(i)).length
  };

  if (score.partial > 0) return 'partially true';
  return score.true > score.false ? 'true' : 'false';
}
