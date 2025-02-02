async function factCheckViaPerplexity(params, userSettings) {
  // Extract parameters
  const { claim, claim_number, total_claims } = params;
  const { apiKey, model = 'sonar', systemMessage = 'Fact check the following claim and provide citations to support your analysis.' } = userSettings;

  // Validate inputs
  if (!apiKey) {
    throw new Error('Please set the Perplexity API Key in the plugin settings.');
  }

  if (!claim) {
    throw new Error('No claim provided for fact checking.');
  }

  try {
    // Make API request
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: claim,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    const content = result.choices.map(c => c.message.content).join(' ');
    const citations = result.citations || [];

    // Format response with progress tracking
    const isLastClaim = claim_number === total_claims;
    
    return {
      analysis: content,
      citations: citations.map((c, i) => `[${i + 1}] ${c}`).join('\n'),
      claim_number: claim_number,
      total_claims: total_claims,
      next_action: isLastClaim ? 'Generate final report based on instructions.' : 'Wait for instruction at last claim.',
      original_claim: claim,
      // Add report instructions only for the last claim
      ...(isLastClaim && {
        report_instructions: `Please compile a comprehensive fact-checking report with the following structure:

1. Executive Summary:
   - Brief overview of all claims checked
   - Overall assessment summary

2. Detailed Analysis (for each claim):
   - Original claim
   - Verdict (true/false/partially true)
   - Supporting analysis
   - Citations

Format using Markdown for readability.`
      })
    };

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error while connecting to Perplexity API. Please check your internet connection.');
    }
    throw error;
  }
}
