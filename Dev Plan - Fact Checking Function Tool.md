## 1. Project Overview

*   **Description:** This project involves creating a TypingMind plugin that enables an LLM to fact-check a user-provided list of claims. The plugin will act as a function tool, which the LLM will call sequentially for each claim. The function tool will utilize the Perplexity API to search the internet for information related to each claim and return the results, including citations, to the LLM.
*   **Main Goal:** To develop a tool that automates the process of fact-checking claims by leveraging the search capabilities of the Perplexity API and the analytical abilities of an LLM.
*   **Expected End Result:** A functional TypingMind plugin that can receive claims from an LLM, query the Perplexity API, process the results, and signal the LLM to generate a comprehensive report on the validity of each claim with supporting citations.
*   **Intended User:** Hobbyist users of TypingMind interested in enhancing their ability to verify information using LLMs.
*   **Rough Scope:** Small, designed to be completed within a weekend or a few short coding sessions.

## 2. Core Features/Tasks

*   **Main Functionality:**
    *   Process a single claim at a time by querying the Perplexity API.
    *   Receive a claim from the LLM, along with its position in the list.
    *   Send the fact-checking results back to the LLM, including analysis and citations.
    *   Signal the LLM when all claims have been processed, indicating it's time to generate the final report.
    *   Visualize the sequence of interactions between the User, LLM, Function Tool, and Perplexity API are described in the visualizations section.

*   **Must-have Features:**
    *   **Parallel Claim Processing:** Handle multiple claims simultaneously
    *   **Result Aggregation:** Combine results from parallel calls into final report
    *   **State Tracking:** Track progress of multiple concurrent fact checks
    *   **Perplexity API Integration:** Successfully query the API with a given claim and retrieve relevant results.
    *   **Result Handling:** Extract the analysis and citations from the API response.
    *   **LLM Communication:** Properly send results to the LLM and interpret instructions for the next action.
    *   **Report Generation Signal:** Accurately indicate to the LLM when to produce the final report.

*   **Nice-to-have Features:**
    *   **Error Handling and Retries:** Implement robust error handling for API call failures, with potential retry mechanisms.
    *   **User Customization:** Allow users to configure settings like the Perplexity model or system message.
    *   **Token Efficient Output:** Ensure the LLM doesn't output unnecessary or repeating content during the fact checking process.

*   **Task Breakdown:**
    *   **TypingMind Plugin Setup:** Create the basic plugin structure according to the provided development guide.
    *   **Function Specification:** Define the OpenAI function spec for `fact_check_claim`.
    *   **Perplexity API Interaction:**
        *   Build the API request with the appropriate parameters.
        *   Send the request and handle the response.
        *   Extract the relevant information (analysis, citations).
    *   **LLM Communication Logic:**
        *   Receive and parse the claim and other parameters from the LLM.
        *   Format and send the results back to the LLM.
        *   Determine the `next_action` based on the current claim's position and the total number of claims.
    *   **Report Generation Logic:**
        *   Store the results of each claim as they are processed.
        *   When signaled, format the collected results into a comprehensive report.

*   **Natural Ordering/Dependencies:**
    *   Start by setting up the TypingMind plugin and defining the function specification.
    *   Implement the Perplexity API interaction before handling the LLM communication.
    *   Develop the single-claim processing logic before implementing the sequential flow and report generation.
    *   Thoroughly test each component before integrating them.

## 3. Technical Details

*   **Programming Language:** JavaScript (due to the browser-based nature of TypingMind plugins).
*   **Key Libraries/Frameworks:**
    *   Standard JavaScript built-in `fetch` API for making HTTP requests to the Perplexity API.
    *   No other external libraries are required.
*   **Data Storage Requirements:**
    *   No persistent data storage is needed. All data will be handled in-memory during the execution of the function.
*   **API Integrations:**
    *   **Perplexity API:** Used to perform internet searches and retrieve fact-checking information. The function tool will need to authenticate with the API using a user-provided API key.
    *   **OpenAI Function Calling API:** The structure and parameters of the `fact_check_claim` function will be defined according to this specification, allowing the LLM to call it correctly.
*   **Basic Architecture Decisions:**
    *   The core of the plugin will be a single function, `fact_check_claim`, which will be called by the LLM for each claim.
    *   Helper functions will be used to encapsulate specific tasks, such as:
        *   `queryPerplexity`: Handles the interaction with the Perplexity API.
        *   `determineTruthStatus`: Analyzes the Perplexity response to determine if a claim is true, partially true, or false.
        *   `formatReport`: (Potentially handled by the LLM) Formats the final report with all claims, their statuses, and citations.
    *   Flow control logic will manage the sequence of claims and determine when to signal the LLM to generate the report.
*   **Handling User Settings:**
    *   The plugin will allow users to input their Perplexity API Key through the TypingMind plugin settings interface.
    *   Optional settings, such as the Perplexity model and system message, can also be configured by the user.
*   **Security Considerations:**
    *   API keys must be handled securely within the TypingMind environment and should never be exposed in the client-side code. TypingMind's plugin architecture should provide mechanisms for secure storage of sensitive information.
    *   Due to the plugin running in the user's browser, be mindful of Cross-Origin Resource Sharing (CORS) limitations when making requests to external APIs. The Perplexity API must allow requests from the TypingMind domain.

### Parallel Processing Capabilities
- **Implementation:** Leverages TypingMind's support for parallel function calls
- **Benefits:** 
  - Process multiple claims simultaneously rather than sequentially
  - Reduces total processing time
  - Improves user experience with faster results
- **Requirements:**
  - Each function call must be independent
  - Claims need unique identifiers (`claim_number`) 
  - System needs to track total claims (`total_claims`)

## 4. Constraints and Preferences

*   **Coding Style Preferences:**
    *   Employ ES6+ syntax and features where applicable (e.g., arrow functions, `async/await`, template literals).
    *   Write clear, concise, and well-structured code.
    *   Include comments to explain complex logic or non-obvious code sections.
    *   Follow consistent naming conventions (e.g., camelCase for variables and functions).
*   **Performance Requirements:**
    *   While performance is not the primary concern for a small hobby project, aim for reasonably efficient code.
    *   Prioritize code readability and maintainability over micro-optimizations unless significant performance bottlenecks are identified.
    *   Minimize unnecessary API calls or computations.
    *   Focus on token efficiency. Minimize token usage for the user LLM. Token efficient meaning that we don't want the LLM to output repeating content until the final it generates the final report. Quality should not be materially diminshed to achieve this.
*   **Platform Constraints:**
    *   The plugin must function correctly within the TypingMind environment and adhere to its plugin architecture guidelines.
    *   Since the code will execute in the user's browser, be aware of and work within the limitations of a browser-based JavaScript environment, particularly regarding CORS.
*   **Personal Learning Goals:**
    *   Gain practical experience with integrating external APIs into a project.
    *   Develop a deeper understanding of the TypingMind plugin architecture.
    *   Learn how to manage state effectively in asynchronous operations, especially across multiple function calls.
*   **Time Limitations:**
    *   The project should be scoped appropriately for completion within a weekend or a few short coding sessions.
    *   Focus on the core functionality first and add nice-to-have features only if time permits.

## 5. Visualizations

### 5.1 Sequence Diagram

*   **Title:** Claim Fact-Checking Sequence
*   **Type:** Sequence Diagram
*   **Purpose:** To illustrate the interaction sequence between the User, LLM, Function Tool, and Perplexity API during the fact-checking process. This helps visualize the flow of data and the order of operations.
*   **Data:** Interactions between User, LLM, Function Tool, and Perplexity API, including sending claims, querying the API, returning results, and generating the report.
*   **Tool:** Mermaid.js
*   **Code:**

```mermaid
sequenceDiagram
    User->>LLM: Submit multiple claims
    par Parallel Processing
        LLM->>Function: fact_check_claim(claim 1)
         Function->>Perplexity: API Call
        Perplexity-->>Function: Fact-check Result with Citations
        LLM->>Function: fact_check_claim(...)
         Function->>Perplexity: API Call
        Perplexity-->>Function: Fact-check Result with Citations
    end
    Function-->>LLM: All results + Citations + Final Action: generate_report
    LLM->>User: Compiled report
```

### 5.2 State Diagram

*   **Title:** Claim Processing States
*   **Type:** State Diagram
*   **Purpose:** To model the different states of the claim processing workflow. This helps visualize how the system transitions between states based on events and conditions.
*   **Data:** States such as "Idle," "Processing Claim," "Awaiting API Response," and "Generating Report," along with the transitions between them.
*   **Tool:** Mermaid.js
*   **Code:**

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> ProcessingClaim: Receive claim from LLM
    ProcessingClaim --> AwaitingAPIResponse: Query Perplexity API
    AwaitingAPIResponse --> ProcessingClaim: API Response, next_claim
    AwaitingAPIResponse --> GeneratingReport: API Response, generate_report
    GeneratingReport --> Idle: Report generated
```

## 6. Code Skeletons/Boilerplate Code

*Note: The following code is preliminary and subject to change as the project progresses.*

### File Structure:

```
fact-check-plugin/
└── index.js
```

### `index.js`:

```javascript
// OpenAI Function Spec
const openAIFunctionSpec = {
  "name": "fact_check_claim",
  "description": "Fact-checks a single claim using the Perplexity API and provides the result.",
  "parameters": {
    "type": "object",
    "properties": {
      "claim": { "type": "string", "description": "The claim to be fact-checked." },
      "claim_number": { "type": "integer", "description": "The current claim's position in the list." },
      "total_claims": { "type": "integer", "description": "Total number of claims to process." }
    },
    "required": ["claim", "claim_number", "total_claims"]
  }
};

// Main function called by the LLM
async function fact_check_claim(params, userSettings) {
  const { claim, claim_number, total_claims } = params;
  const { apiKey, model, systemMessage } = userSettings;

  // Validate parameters (e.g., check if claim is a non-empty string, etc.)
  if (!claim || typeof claim !== 'string' || claim.trim().length === 0) {
    throw new Error("Invalid claim provided.");
  }

  if (!apiKey) {
    throw new Error("Perplexity API key is missing. Please provide it in the plugin settings.");
  }
  
  // Build prompt for Perplexity API
  const prompt = `Fact-check the following claim: ${claim}`;

  // Query Perplexity API
  let response;
  try {
    response = await queryPerplexity(prompt, model, systemMessage, apiKey);
  } catch (error) {
    console.error("Error querying Perplexity API:", error);
    // Handle API errors appropriately (e.g., retry, return error message to LLM)
    throw new Error("Failed to query Perplexity API: " + error.message);
  }

  // Extract analysis and citations
  const analysis = response.content;
  const citations = response.citations;

  // Determine the truth status of the claim
  const status = determineTruthStatus(analysis);

  // Determine next action
  const next_action = claim_number < total_claims ? 'next_claim' : 'generate_report';

  // Return the result to the LLM
  return {
    claim,
    status,
    analysis,
    citations,
    next_action
  };
}

// Helper function to query the Perplexity API
async function queryPerplexity(prompt, model, systemMessage, apiKey) {
  // Implement the logic to send a request to the Perplexity API
  // and return the response
  const url = 'https://api.perplexity.ai/chat/completions';
  const perplexityModel = model || 'sonar-medium-latest'; // Default model if not provided by user.

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: perplexityModel,
      messages: [
        { role: 'system', content: systemMessage || 'Be precise and concise.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Perplexity API request failed with status ${response.status}`);
  }

  const data = await response.json();

  const content = data.choices[0].message.content; // Assuming the response structure
  const citations = data.choices[0].citations || []; // Assuming the response structure

  return { content, citations };
}

// Helper function to determine the truth status of a claim based on the Perplexity API response
function determineTruthStatus(analysis) {
  // Implement the logic to analyze the Perplexity API response
  // and return a string indicating whether the claim is "true", "partially true", or "false"
  // This is a placeholder - you'll need to refine this based on how you want to interpret the Perplexity response
  if (analysis.toLowerCase().includes("true")) {
    return "true";
  } else if (analysis.toLowerCase().includes("false")) {
    return "false";
  } else {
    return "partially true";
  }
}

// Example of parallel function calls
const claims = [
  "The Earth is flat",
  "Water boils at 100°C",
  "Humans cannot breathe underwater"
];

// Parallel function calls
const tool_calls = claims.map((claim, index) => ({
  name: "fact_check_claim",
  arguments: {
    claim,
    claim_number: index + 1,
    total_claims: claims.length
  }
}));
```

## 7. Testing Requirements

*   **Testing Focus:**
    *   Verify that each claim is correctly fact-checked and assigned the appropriate status ("true," "partially true," or "false").
    *   Ensure that citations are correctly extracted from the Perplexity API response and included in the results.
    *   Test the sequential processing of claims to ensure the correct flow and communication with the LLM.
    *   Verify that the final report is generated correctly when the `generate_report` signal is sent.
*   **Edge Cases:**
    *   Network failures or timeouts during Perplexity API calls.
    *   Unexpected or malformed responses from the Perplexity API.
    *   Invalid input parameters (e.g., missing claim, incorrect claim number).
    *   Empty or excessively long claims.
    *   Claims that are ambiguous or difficult to fact-check.
*   **Validation Approaches:**
    *   Implement comprehensive error handling using `try-catch` blocks to catch and handle potential exceptions during API calls and data processing.
    *   Use mock data to simulate different types of Perplexity API responses during development and testing, allowing you to test various scenarios without making actual API calls.
    *   Validate the input parameters at the beginning of the `fact_check_claim` function to ensure they are of the correct type and format.
*   **Manual Testing Checkpoints:**
    *   Test the plugin with a single claim input and verify that the result is correct.
    *   Test with multiple claims and verify that they are processed sequentially and the final report is accurate.
    *   Test with an invalid or missing Perplexity API key and verify that the plugin displays an appropriate error message.
    *   Manually inspect the generated report to ensure it is formatted correctly and includes all the necessary information (claim, status, analysis, citations).

## 8. Deployment Plan

*   **Execution Environment:** The plugin will run entirely within the user's browser as part of the TypingMind platform.
*   **Hosting Requirements:** No external hosting is required since the code executes client-side within the TypingMind environment.
*   **Packaging/Distribution:**
    *   Package the plugin according to the TypingMind plugin development guidelines. This will likely involve creating a single JavaScript file (`index.js`) containing all the necessary code.
    *   Provide clear instructions to users on how to install the plugin within their TypingMind workspace.
*   **Setup Instructions:**
    *   Users will need to obtain a Perplexity API Key from the Perplexity website ( [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api) ) and input it into the plugin settings within TypingMind.
    *   Optionally, users can configure the Perplexity model and system message they want to use in the plugin settings.
*   **User Documentation:**
    *   Include a comprehensive README file or overview section within the plugin itself that explains its purpose, functionality, and usage.
    *   Provide clear, step-by-step instructions on how to install and configure the plugin.
    *   Include examples of how to input claims and interpret the generated report.
    *   Explain any limitations or known issues.

## Conclusion

This document provides a comprehensive plan for developing a fact-checking plugin for TypingMind. It outlines the project's goals, core features, technical details, constraints, visualizations, code structure, testing requirements, and deployment plan. This plan serves as a guide for both the developer and an LLM coding assistant throughout the development process. The LLM can use this document to understand the project's context, generate code snippets, suggest improvements, and help with debugging. By following this plan and collaborating with an LLM, the developer can effectively create a functional and useful TypingMind plugin that enhances the platform's fact-checking capabilities. Remember that this plan is a starting point and may be refined as the project evolves. The key is to maintain clear communication between the developer and the LLM to ensure a successful outcome.
