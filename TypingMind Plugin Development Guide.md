# **TypingMind Plugin Development Guide for LLMs**

This guide provides a comprehensive overview of creating plugins for the TypingMind platform. It leverages the OpenAI Function Calling API specification to extend the capabilities of AI models within TypingMind.

---

## **1. Introduction to TypingMind Plugins**

TypingMind Plugins empower you to enhance the functionality of AI models within the TypingMind platform. They act as external tools that can be invoked by the AI to perform specific tasks, retrieve information, or interact with external services.

**Key Features:**
- **Extensibility:** Augment the AI's capabilities beyond standard text generation.
- **Customization:** Tailor the AI's behavior to specific needs and workflows.
- **Integration:** Connect with external APIs, databases, and services.
- **Two Implementation Methods:**
  - **JavaScript:** Execute code directly within the user's browser.
  - **HTTP Action:** Send HTTP requests to external services.

---

## **2. Development Prerequisites**

To develop TypingMind plugins, you should have a basic understanding of:
- **JavaScript (for JavaScript implementation):** Familiarity with JavaScript syntax and asynchronous programming.
- **HTTP Requests (for HTTP Action implementation):** Knowledge of HTTP methods (GET, POST, etc.), headers, and request bodies.
- **OpenAI Function Calling API:** Understanding the structure of function definitions, parameters, and how to handle function calls.

---

## **3. Plugin Structure**

A TypingMind plugin consists of the following essential components:

### **3.1 Plugin Name**
- A user-friendly name to identify the plugin.

### **3.2 Overview**
- A brief description of the plugin's purpose and usage instructions, supporting Markdown format.

### **3.3 OpenAI Function Spec (JSON)**
The core definition of the plugin's functionality. This is a crucial part.
- **`name`:** A unique identifier for the function. *Must be unique across all your plugins.*
- **`description`:** A clear explanation of the function's purpose, guiding the AI in choosing when to use it.
- **`parameters`:** A JSON schema defining the input parameters that the function accepts.
  - **`type`:** The type of the parameter (e.g., `string`, `number`, `object`, `boolean`, `array`, `enum`, `null`).
  - **`properties` (for objects):** Defines the nested properties within an object parameter.
  - **`items` (for arrays):** Specifies the type of items within an array parameter.
  - **`enum` (for enums):** Lists the allowed values for an enumerated parameter.
  - **`required`:** An array of parameter names that are mandatory.
  - **`additionalProperties`:** (In Strict Mode) Set to `false` to disallow extra properties.

**Example:**
```json
{
  "name": "get_weather",
  "description": "Get current temperature for a given location.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and country e.g. Bogotá, Colombia"
      }
    },
    "required": ["location"],
    "additionalProperties": false
  }
}
```

### **3.4 Plugin User Settings (JSON) (Optional)**
Defines input fields for users to provide plugin-specific data (e.g., API keys, configuration options).
- **`name`:** The identifier to access the user's input.
- **`label`:** The label displayed to the user.
- **`required` (optional):** Boolean. Indicate whether the field is required or not. Default `false`.
- **`description` (optional):** Additional details about the field.
- **`type` (optional):** `text`, `password`, `email`, `number`, `enum`. Default: `text`.
- **`placeholder` (optional):** The placeholder text in the input field.
- **`values` (optional):** Allowed values for `enum` type.
- **`defaultValue` (optional):** Default value if not provided by user.

**Example:**
```json
[
  {
    "name": "api_key",
    "label": "API Key",
    "type": "password",
    "required": true
  },
  {
    "name": "quality",
    "label": "Quality",
    "type": "enum",
    "values": ["standard", "hd"],
    "defaultValue": "standard"
  }
]
```

### **3.5 Implementation**
The actual code or HTTP action definition that performs the plugin's task.

#### **3.5.1 JavaScript Code**
- Must define a top-level function with the same name as specified in the `name` field of the Function Spec.
- Accepts two parameters:
  - `params`: An object containing the parameters provided by the AI.
  - `userSettings`: An object containing the user-provided settings.
- Runs in a sandboxed iframe within the user's browser.
- Be aware of CORS (Cross-Origin Resource Sharing) limitations.
- **Error Handling:** Throw errors with user-friendly messages using: `throw new Error("User friendly message here")`.

**Example:**
```javascript
function generate_random_number_in_range({ a, b }) {
  var min = Math.ceil(a);
  var max = Math.floor(b);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
```

#### **3.5.2 HTTP Action**
- Defines an HTTP request to be sent when the plugin is invoked.
- **HTTP Method:** GET, POST, PUT, DELETE, etc.
- **Endpoint URL:** The URL to send the request to.
- **Headers (optional):** HTTP headers to include in the request.
- **Body (optional):** The request body (e.g., JSON data).
- **Post-Processing (optional):** Transform the HTTP response using:
  - **JMESPath:** Filter a JSON response.
  - **Handlebars.js:** Rewrite the response (e.g., to Markdown or HTML).
- **Accessing Parameters:** Use template parameters within the URL, headers, and body to access values from the AI (`{param1}`, `{param2}`, etc.) and user settings (`{settingName}`).
- **Built-in Server-Side Variables (Server Plugins Only):**
  - `CHAT_ID`
  - `USER_ID`
  - `OAUTH_USER_ID_TOKEN`
  - `OAUTH_USER_ACCESS_TOKEN`
  - `OAUTH_PLUGIN_ACCESS_TOKEN`

**Example:**
```json
{
  "method": "POST",
  "url": "https://api.example.com/generate",
  "headers": {
    "Authorization": "Bearer {api_key}"
  },
  "body": {
    "prompt": "{prompt}",
    "quality": "{quality}"
  }
}
```

#### **3.5.3 Error Handling for HTTP Actions**
- Handle HTTP errors (e.g., 4xx or 5xx responses) and retries.
- Example:
  ```javascript
  if (response.status >= 400) {
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
  }
  ```

---

## **4. Output Options**

You can configure how the plugin's output is handled:
- **Give plugin output to the AI:** The output is passed to the AI for further processing and incorporation into its response.
- **Render plugin output as markdown:** The output is rendered directly to the user as Markdown.
- **Render plugin output as interactive HTML:** The output is rendered directly to the user as interactive HTML.

---

## **5. Server Plugins (TypingMind Custom)**

Server plugins are available in the Team version of TypingMind (TypingMind Custom).
- **Execution:** Run on the server side, not in the user's browser.
- **Security:** Hide code, API keys, and credentials from the user.
- **Implementation:** Only support HTTP Actions.
- **Built-in Variables:** Provide access to server-side variables like `CHAT_ID`, `USER_ID`, and OAuth tokens.

---

## **6. Advanced Features**

### **6.1 Strict Mode**
- Ensures function calls adhere strictly to the defined schema.
- Enabled by setting `additionalProperties: false` and marking all fields as `required`.
- Example:
  ```json
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and country e.g. Bogotá, Colombia"
      }
    },
    "required": ["location"],
    "additionalProperties": false
  }
  ```

### **6.2 Parallel Function Calling**
- Allows the model to call multiple functions in a single turn.
- Configured using the `tool_choice` parameter:
  - `auto`: (Default) The model decides.
  - `required`: The model calls at least one function.
  - Forced Function: The model calls exactly the specified function.
- Example:
  ```json
  "tool_choice": "required"
  ```

### **6.3 Streaming**
- Provides real-time updates as the model fills function arguments.
- Example:
  ```javascript
  const stream = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: "What's the weather like in Paris today?" }],
    tools: tools,
    stream: true,
  });
  ```

---

## **7. Best Practices**

- **Clear and Concise Function Definitions:** Use descriptive names and detailed descriptions in the Function Spec.
- **Meaningful Parameter Names:** Choose parameter names that accurately reflect their purpose.
- **Error Handling:** In JavaScript implementations, throw errors with user-friendly messages to provide feedback to the AI and the user.
- **CORS Awareness (JavaScript):** Ensure that external services you interact with allow CORS requests from TypingMind.
- **Post-Processing (HTTP Actions):** Use JMESPath or Handlebars.js to transform responses into a more usable format.
- **Testing:** Thoroughly test your plugin with various prompts to ensure it behaves as expected.
- **Security (Server Plugins):** Leverage server plugins to protect sensitive information.

---

## **8. Example Implementations**

The following examples demonstrate real-world implementations of TypingMind plugins using different approaches and functionalities.

### **8.1 DALL-E 3 Image Generation (HTTP Action - Server Plugin)**

**OpenAI Function Spec (JSON):**
```json
{
  "name": "generate_dalle_image",
  "description": "Generates an image using DALL-E 3 based on a text prompt.",
  "parameters": {
    "type": "object",
    "properties": {
      "prompt": {
        "type": "string",
        "description": "A text description of the desired image."
      }
    },
    "required": ["prompt"]
  }
}
```

**User Settings (JSON):**
```json
[
  {
    "name": "openaikey",
    "label": "OpenAI API Key",
    "type": "password"
  },
  {
    "name": "resolution",
    "label": "Image Resolution",
    "type": "enum",
    "values": ["1024x1024", "1792x1024", "1024x1792"],
    "defaultValue": "1024x1024"
  },
  {
    "name": "quality",
    "label": "Quality",
    "description": "Optional, default: \"standard\"",
    "type": "enum",
    "values": ["standard", "hd"],
    "defaultValue": "standard"
  }
]
```

**HTTP Action:**
- **Method:** `POST`
- **Endpoint URL:** `https://api.openai.com/v1/images/generations`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer {openaikey}"
  }
  ```
- **Body:**
  ```json
  {
    "model": "dall-e-3",
    "prompt": "{prompt}",
    "n": 1,
    "size": "{resolution}",
    "quality": "{quality}"
  }
  ```
- **Post-Processing (Handlebars.js):**
  ```
  ![Image generated by DALL-E]({{{data.0.url}}})
  Revised prompt: {{{data.0.revised_prompt}}}
  ```
- **Output Option:** `Render plugin output as markdown`

### **8.2 Perplexity Sonar Search (JavaScript/HTTP Action - Dual Implementation)**

**OpenAI Function Spec (JSON):**
```json
{
  "name": "search_via_perplexity_sonar",
  "description": "Search for information from the internet using Perplexity.",
  "parameters": {
    "type": "object",
    "properties": {
      "keyword": {
        "type": "string",
        "description": "The search keyword"
      }
    },
    "required": ["keyword"]
  }
}
```

**User Settings (JSON):**
```json
[
  {
    "name": "apiKey",
    "type": "password",
    "label": "Perplexity API Key",
    "required": true,
    "description": "Get your API Key from Perplexity: https://www.perplexity.ai/settings/api"
  },
  {
    "name": "model",
    "label": "Model",
    "description": "Optional, default: \"sonar\"",
    "defaultValue": "sonar"
  },
  {
    "name": "systemMessage",
    "label": "System Message",
    "description": "Optional, default: \"Be precise and concise\"",
    "defaultValue": "Be precise and concise"
  }
]
```

**JavaScript Implementation:**
```javascript
function search_via_perplexity_sonar(params, userSettings) {
  const keyword = params.keyword;
  const model = userSettings.model || 'sonar';
  const systemMessage = userSettings.systemMessage || 'Be precise and concise.';
  const key = userSettings.apiKey;
 
  if (!key) {
    throw new Error(
      'Please set the Perplexity API Key in the plugin settings.'
    );
  }
 
  return fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      authorization: 'Bearer ' + key,
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
          content: keyword,
        },
      ],
    }),
  })
    .then((r) => r.json())
    .then((response) => {
      const content = response.choices.map((c) => c.message.content).join(' ');
      const citations = response.citations;
 
      const citationsText = citations
        ? '\n\n Citations:\n' + citations.map((c, index) => `[${index + 1}] ${c}`).join('\n')
        : '';

      return (
        content +
        citationsText +
        '\n\nIMPORTANT: When using this information in your response, you must include the citations provided above. Place citation numbers [X] immediately after the information they support and include the complete Citations section at the end of your response.'
      );
    });
}
```

**Alternative HTTP Action Implementation:**
```json
{
  "method": "POST",
  "url": "https://api.perplexity.ai/chat/completions",
  "headers": {
    "accept": "application/json",
    "authorization": "Bearer {apiKey}"
  },
  "body": {
    "model": "{model}",
    "messages": [
      {
        "role": "system",
        "content": "{systemMessage}"
      },
      {
        "role": "user",
        "content": "{keyword}"
      }
    ]
  },
  "resultTransform": {
    "engine": "jmes",
    "expression": "choices[*].message.content | join(' ', @)"
  }
}
```

**Overview Markdown:**
```markdown
This plugin allows the AI assistant to search for information from the internet using Perplexity Sonar.

**🔑 Perplexity API Key needed**. Click the Settings tab and enter your API Key. Get your Perplexity API Key from [here](https://www.perplexity.ai/settings/api)

Example usage:

> What's the gold price?

> How's the weather at HCMC at the moment?
```

### **8.3 Enhanced Reasoning Tool (JavaScript Implementation)**

**OpenAI Function Spec (JSON):**
```json
{
  "name": "enhanced_reasoning_v3",
  "description": "A tool that guides through a detailed reasoning process, particularly for word analysis tasks like counting letters. It emphasizes careful breakdown of words, accurate counting of specific letters including consecutive occurrences, and thorough verification steps to ensure precision.",
  "parameters": {
    "type": "object",
    "required": [
      "step",
      "originalQuestion",
      "previousAnswer",
      "magicBoolean"
    ],
    "properties": {
      "step": {
        "type": "string",
        "description": "The current step number in the reasoning process."
      },
      "magicBoolean": {
        "enum": [
          "true",
          "false"
        ],
        "type": "string",
        "description": "Set to 'true' if you are absolutely certain of the answer. Use with caution as it will stop the reasoning process immediately."
      },
      "previousAnswer": {
        "type": "string",
        "description": "Your detailed answer to the previous step."
      },
      "originalQuestion": {
        "type": "string",
        "description": "The original question or problem to be analyzed."
      }
    }
  }
}
```

**JavaScript Implementation:**
```javascript
async function enhanced_reasoning_v3(params) {
    const steps = [
        "Carefully restate the original question and identify the key elements or tasks required.",
        "Break down the word into individual letters, listing each letter with its position in the word. Ensure all letters are included.",
        "Identify the specific letter or element to be counted and note each occurrence, including positions. Pay special attention to repeated and consecutive letters.",
        "Count the total number of occurrences of the specific letter or element. Double-check your count for accuracy.",
        "Reflect on your counting process. Have you included all occurrences? Re-express the importance of careful counting.",
        "Provide a final answer that directly addresses the original question, explaining your reasoning clearly."
    ];

    const currentStep = parseInt(params.step) || 0;
    const previousAnswer = params.previousAnswer || '';
    const originalQuestion = params.originalQuestion || '';
    const magicBoolean = params.magicBoolean === 'true';

    if (magicBoolean || currentStep >= steps.length) {
        return JSON.stringify({
            status: 'complete',
            message: `Reasoning process complete. ${magicBoolean ? 'You have indicated that you are definitely sure of the answer. ' : ''}Please provide a final response that directly answers the original question: ${originalQuestion} Ensure your answer is accurate and includes a clear explanation of how you arrived at the conclusion.`,
            previousAnswer: previousAnswer,
            originalQuestion: originalQuestion
        });
    }

    const summary = `Step ${currentStep + 1}: ${steps[currentStep]}`;
    const instruction = `Original question: ${originalQuestion}\n\n${summary}\n\nEnsure you carefully follow this step. Pay close attention to details, especially repeated or consecutive letters. Double-check your work for accuracy.\n\nReflection: How does this step help you answer the original question? Make sure your analysis directly contributes to finding the correct and accurate answer.`;

    return JSON.stringify({
        status: 'in_progress',
        currentStep: (currentStep + 1).toString(),
        instruction: instruction,
        summary: summary,
        nextAction: 'After completing this step, call the enhanced_reasoning_v3 again with the next step number, your detailed answer for this step, and set magicBoolean to \'true\' if you are certain of the answer. Remember to carry forward any important insights from previous steps. Always keep the original question in mind.',
        previousAnswer: previousAnswer,
        originalQuestion: originalQuestion
    });
}
```

**Overview Markdown:**
```markdown
# Enhanced Reasoning Tool V3 🧩

This tool provides a structured approach to reasoning, applicable to any type of question or problem. It guides the LLM through a step-by-step process to analyze, evaluate, and refine it's thinking. This ATTEMPTS to help the AI reason, but it only promotes reflective chain of thought, and WILL NOT work if the model is not advanced enough for the reasoning task.

It can be fun to watch an LLM attempt to reason through reflection, and that's what this plugin provides, a means for automated reflection chain of thought promoting that the LLM uses when you ask it to use enhanced reasoning. 

Just remember, it's not magic, and it won't make an incapable LLM capable. 

Have fun!!
```

**Implementation Highlights:**

1. **DALL-E 3 Example (8.1):**
   - Demonstrates server-side plugin implementation
   - Shows image generation capabilities
   - Illustrates handling of multiple configuration options
   - Uses Handlebars.js for response formatting

2. **Perplexity Search Example (8.2):**
   - Shows both JavaScript and HTTP Action implementations
   - Demonstrates API authentication handling
   - Includes response processing and citation formatting
   - Uses JMESPath for result transformation
   - Implements error handling
   - Shows optional parameter handling with defaults

3. **Enhanced Reasoning Example (8.3):**
   - Implements complex state management across multiple steps
   - Demonstrates structured thinking process guidance
   - Shows JSON-based response formatting with context preservation
   - Features zero-configuration design pattern
   - Includes built-in validation and reflection mechanisms
   - Demonstrates flexible early-exit strategy with magicBoolean   

These examples showcase different approaches to plugin implementation, from simple API integrations to more complex data processing and formatting scenarios.

---

## **9. Conclusion**

This guide provides a comprehensive and accurate resource for developing TypingMind Plugins. It covers all essential aspects, including plugin structure, implementation methods, advanced features, and best practices. With this guide, LLMs can confidently assist in creating fully functioning TypingMind Plugins tailored to specific needs.