export interface FunctionDefinition {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export interface ChatCompletionTool {
  function: FunctionDefinition;
  type: "function";
}

export interface OpenAITool {
  function: {
    name: string;
    description: string;
    parameters?: Record<string, any>;
  };
  type: "function";
}
