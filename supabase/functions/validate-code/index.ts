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
  
  // Check for missing semicolons (simple heuristic)
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && 
        !line.endsWith('{') && 
        !line.endsWith('}') && 
        !line.endsWith(';') && 
        !line.startsWith('//') &&
        !line.startsWith('/*') &&
        !line.startsWith('*') &&
        !line.includes('if') &&
        !line.includes('else') &&
        !line.includes('for') &&
        !line.includes('while') &&
        !line.includes('class') &&
        line.length > 2) {
      // Could be missing semicolon
    }
  }

  if (errors.length > 0) {
    return { success: false, errors, hints };
  }

  // Simulate output detection
  let simulatedOutput = "";
  
  // Extract println statements
  const printlnPattern = /System\.out\.println\s*\(\s*(.+?)\s*\)/g;
  const printPattern = /System\.out\.print\s*\(\s*(.+?)\s*\)/g;
  
  let match;
  const outputs: string[] = [];
  
  while ((match = printlnPattern.exec(code)) !== null) {
    let content = match[1];
    
    // Handle string literals
    if (content.startsWith('"') && content.endsWith('"')) {
      outputs.push(content.slice(1, -1));
    } 
    // Handle simple numeric expressions
    else if (/^\d+\s*[\+\-\*\/]\s*\d+$/.test(content)) {
      try {
        outputs.push(String(eval(content)));
      } catch {
        outputs.push(content);
      }
    }
    // Handle variable references with values in code
    else {
      // Try to find variable value
      const varMatch = code.match(new RegExp(`(int|String|double|float|long)\\s+${content.trim()}\\s*=\\s*(.+?);`));
      if (varMatch) {
        let value = varMatch[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          outputs.push(value.slice(1, -1));
        } else {
          try {
            outputs.push(String(eval(value)));
          } catch {
            outputs.push(value);
          }
        }
      } else {
        // Check for expressions
        try {
          // Very simple expression evaluation
          const numericContent = content.replace(/[a-zA-Z_]+/g, (v) => {
            const m = code.match(new RegExp(`(int|double|float|long)\\s+${v}\\s*=\\s*(\\d+)`));
            return m ? m[2] : '0';
          });
          outputs.push(String(eval(numericContent)));
        } catch {
          outputs.push(`[${content}]`);
        }
      }
    }
  }
  
  simulatedOutput = outputs.join('\n');
  
  // Check if output matches expected
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
    
    console.log("Validating code:", { language, codeLength: code.length, expectedOutput });

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
      errors: [error instanceof Error ? error.message : "Validation failed"] 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
