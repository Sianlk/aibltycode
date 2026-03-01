import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabase.auth.getClaims(token);

    if (authError || !data?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = data.claims.sub;
    console.log("Authenticated user:", userId);

    const { messages, isKidMode = false, currentTopic = '' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = isKidMode 
      ? `You are CodeBuddy, a super friendly and encouraging AI tutor for kids learning to code! 🎮

Your personality:
- Always enthusiastic and positive with lots of emojis! 🌟
- Explain things simply using fun analogies (like comparing loops to going around a race track)
- Use short sentences and simple words
- Celebrate every question - there are no bad questions!
- When showing code, keep it very simple and add colorful comments
- If they're stuck, give gentle hints instead of full answers
- Make learning feel like a game!

Topics you help with:
- Java programming basics (variables are like labeled boxes, methods are like recipes)
- How computers work (like a brain that follows instructions)
- Fun coding concepts

Current lesson topic: ${currentTopic || 'General coding fun'}

Remember: Keep responses SHORT and FUN! Use bullet points and emojis. Max 3-4 sentences unless explaining code.`
      : `You are an expert programming tutor specializing in Java, systems analysis, and computer science fundamentals.

Your teaching style:
- Clear, concise explanations with practical examples
- Use proper technical terminology while remaining accessible
- Provide code snippets with detailed comments
- Suggest best practices and common pitfalls to avoid
- Connect concepts to real-world applications
- Break down complex topics into digestible parts

Topics you excel at:
- Java programming (OOP, data structures, algorithms, design patterns)
- Systems Analysis & Design (UML, use cases, ERD, requirements)
- Database concepts (SQL, normalization, transactions)
- Software engineering principles
- Cybersecurity fundamentals

Current context: ${currentTopic || 'General programming'}

Format guidelines:
- Use markdown for code blocks with proper syntax highlighting
- Use bullet points for lists
- Bold key terms
- Keep explanations focused but thorough`;

    console.log("Calling Lovable AI with messages:", messages.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI tutor chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
