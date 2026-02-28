import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidationResult {
  success: boolean;
  output?: string;
  errors?: string[];
  hints?: string[];
}

// Safe numeric expression evaluator - NO eval()
function safeEvaluateNumeric(expr: string): string | null {
  // Only allow digits, whitespace, and basic math operators
  const sanitized = expr.trim();
  if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(sanitized)) {
    return null;
  }
  // Tokenize and compute using a simple recursive descent parser
  try {
    const result = parseExpression(sanitized, { pos: 0 });
    if (result === null) return null;
    return String(result.value);
  } catch {
    return null;
  }
}

interface ParseState { pos: number; }
interface ParseResult { value: number; }

function skipWhitespace(s: string, state: ParseState) {
  while (state.pos < s.length && s[state.pos] === ' ') state.pos++;
}

function parseExpression(s: string, state: ParseState): ParseResult | null {
  let left = parseTerm(s, state);
  if (!left) return null;
  skipWhitespace(s, state);
  while (state.pos < s.length && (s[state.pos] === '+' || s[state.pos] === '-')) {
    const op = s[state.pos];
    state.pos++;
    const right = parseTerm(s, state);
    if (!right) return null;
    left = { value: op === '+' ? left.value + right.value : left.value - right.value };
    skipWhitespace(s, state);
  }
  return left;
}

function parseTerm(s: string, state: ParseState): ParseResult | null {
  let left = parseFactor(s, state);
  if (!left) return null;
  skipWhitespace(s, state);
  while (state.pos < s.length && (s[state.pos] === '*' || s[state.pos] === '/')) {
    const op = s[state.pos];
    state.pos++;
    const right = parseFactor(s, state);
    if (!right) return null;
    left = { value: op === '*' ? left.value * right.value : left.value / right.value };
    skipWhitespace(s, state);
  }
  return left;
}

function parseFactor(s: string, state: ParseState): ParseResult | null {
  skipWhitespace(s, state);
  if (state.pos >= s.length) return null;
  
  // Handle parentheses
  if (s[state.pos] === '(') {
    state.pos++;
    const result = parseExpression(s, state);
    if (!result) return null;
    skipWhitespace(s, state);
    if (state.pos < s.length && s[state.pos] === ')') {
      state.pos++;
    }
    return result;
  }
  
  // Handle negative numbers
  let negative = false;
  if (s[state.pos] === '-') {
    negative = true;
    state.pos++;
    skipWhitespace(s, state);
  }
  
  // Parse number
  const start = state.pos;
  while (state.pos < s.length && (s[state.pos] >= '0' && s[state.pos] <= '9' || s[state.pos] === '.')) {
    state.pos++;
  }
  if (start === state.pos) return null;
  const num = parseFloat(s.substring(start, state.pos));
  if (isNaN(num)) return null;
  return { value: negative ? -num : num };
}

function validateJavaCode(code: string, expectedOutput: string): ValidationResult {
  const errors: string[] = [];
  const hints: string[] = [];
  
  // Basic syntax checks
  if (!code.includes("class")) {
    errors.push("Missing class declaration");
    hints.push("Java programs need a class. Try: public class Main { ... }");
  }
  
  if (!code.includes("public static void main")) {
    errors.push("Missing main method");
    hints.push("Every Java program needs a main method: public static void main(String[] args) { ... }");
  }
  
  // Check for common syntax errors
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} opening, ${closeBraces} closing`);
    hints.push("Make sure every { has a matching }");
  }
  
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Mismatched parentheses: ${openParens} opening, ${closeParens} closing`);
  }

  if (errors.length > 0) {
    return { success: false, errors, hints };
  }

  // Simulate output detection
  const printlnPattern = /System\.out\.println\s*\(\s*(.+?)\s*\)/g;
  
  let match;
  const outputs: string[] = [];
  
  while ((match = printlnPattern.exec(code)) !== null) {
    let content = match[1];
    
    // Handle string literals
    if (content.startsWith('"') && content.endsWith('"')) {
      outputs.push(content.slice(1, -1));
    } 
    // Handle safe numeric expressions only
    else if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(content)) {
      const result = safeEvaluateNumeric(content);
      if (result !== null) {
        outputs.push(result);
      } else {
        outputs.push(content);
      }
    }
    // Handle variable references
    else {
      const varMatch = code.match(new RegExp(`(int|String|double|float|long)\\s+${content.trim()}\\s*=\\s*(.+?);`));
      if (varMatch) {
        let value = varMatch[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          outputs.push(value.slice(1, -1));
        } else {
          const result = safeEvaluateNumeric(value);
          if (result !== null) {
            outputs.push(result);
          } else {
            outputs.push(value);
          }
        }
      } else {
        // Try numeric substitution for variables
        const numericContent = content.replace(/[a-zA-Z_]+/g, (v) => {
          const m = code.match(new RegExp(`(int|double|float|long)\\s+${v}\\s*=\\s*(\\d+)`));
          return m ? m[2] : '0';
        });
        const result = safeEvaluateNumeric(numericContent);
        if (result !== null) {
          outputs.push(result);
        } else {
          outputs.push(`[${content}]`);
        }
      }
    }
  }
  
  const simulatedOutput = outputs.join('\n');
  
  const normalizedExpected = expectedOutput.trim().toLowerCase();
  const normalizedOutput = simulatedOutput.trim().toLowerCase();
  
  if (normalizedOutput === normalizedExpected) {
    return { success: true, output: simulatedOutput };
  } else if (simulatedOutput.length > 0) {
    return { 
      success: false, 
      output: simulatedOutput,
      errors: [`Expected output: "${expectedOutput}", but got: "${simulatedOutput}"`],
      hints: ["Check your logic and make sure you're printing the correct value"]
    };
  } else {
    return {
      success: false,
      errors: ["No output detected"],
      hints: ["Make sure you're using System.out.println() to print your result"]
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language = 'java', expectedOutput = '', testCases = [] } = await req.json();
    
    // Input validation
    if (typeof code !== 'string' || code.length > 50000) {
      return new Response(JSON.stringify({ 
        success: false, 
        errors: ["Invalid or too large code input"] 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log("Validating code:", { language, codeLength: code.length });

    let result: ValidationResult;

    if (language === 'java') {
      result = validateJavaCode(code, expectedOutput);
    } else {
      result = { 
        success: false, 
        errors: [`Language ${language} validation not yet supported`] 
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Code validation error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      errors: ["Validation failed"] 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
