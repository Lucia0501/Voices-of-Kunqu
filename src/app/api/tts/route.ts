import { NextRequest, NextResponse } from "next/server";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

interface TTSRequest {
  text: string;
  paragraphId: string;
  operaSlug: string;
  voice?: string;
  speed?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { text, paragraphId, operaSlug, voice = 'alloy', speed = 1.0 }: TTSRequest = await request.json();

    if (!text || !paragraphId || !operaSlug) {
      return NextResponse.json(
        { error: "Text, paragraphId, and operaSlug are required" },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file" },
        { status: 500 }
      );
    }

    try {
      // Flexible proxy configuration - use environment variable or fallback
      const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
      let agent;
      
      if (proxyUrl) {
        agent = new HttpsProxyAgent(proxyUrl);
        console.log('Using proxy:', proxyUrl);
      } else {
        console.log('No proxy configured, making direct connection');
      }
      
      console.log('Calling OpenAI TTS API...');
      
      // Call OpenAI TTS API with proxy
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          input: preprocessText(text),
          voice: voice, // Options: alloy, echo, fable, onyx, nova, shimmer
          response_format: 'mp3',
          speed: speed,
          instructions: `You are a master storyteller performing classical literature. 
          
          Voice Guidelines:
          - Speak in a poetic, elevated tone befitting classical opera narration
          - Use a slightly higher register to convey the ethereal quality of the text
          
          Pacing and Pauses:
          - Insert natural breathing pauses between phrases (0.3-0.5 seconds)
          - Pause briefly after commas (0.2 seconds)
          - Pause longer after periods and semicolons (0.5-0.7 seconds)
          - Add dramatic pauses before important revelations or emotional peaks (0.8-1 second)
          - Slow down slightly on descriptive passages to let imagery sink in
          
          Emotional Expression:
          - Match the emotion of each sentence precisely - melancholy, joy, longing, wonder
          - Let your voice tremble slightly on sorrowful passages
          - Brighten your tone on hopeful or beautiful descriptions
          - Use subtle voice modulation to convey the depth of feeling
          
          Emphasis and Rhythm:
          - Emphasize key poetic words and metaphors with slight volume increases
          - Create a musical rhythm that matches the literary cadence
          - Speed up slightly during exciting or urgent passages
          - Slow down and soften during reflective moments
          
          Remember: You're not just reading - you're bringing ancient poetry to life for modern listeners.`,
        }),
        ...(agent && { agent }),
      } as Parameters<typeof fetch>[1];
      
      const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', fetchOptions);

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.text();
        console.error("OpenAI TTS API error:", errorData);
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const audioBuffer = await openaiResponse.buffer();
      
      return new NextResponse(audioBuffer as any, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=3600',
          'Content-Disposition': `inline; filename="${operaSlug}-${paragraphId}.mp3"`,
        },
      });

    } catch (openaiError) {
      console.error("OpenAI API failed:", openaiError);
      
      // Fallback: Return instructions for client-side Web Speech API
      return NextResponse.json({
        useWebSpeech: true,
        text: preprocessText(text),
        voice: voice,
        speed: speed,
        message: "OpenAI API failed, using browser's built-in speech synthesis"
      }, { status: 200 });
    }

  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Preprocess text for better British pronunciation
function preprocessText(text: string): string {
  return text
    // Normalize quotes and apostrophes
    .replace(/[""]/g, '"')
    .replace(/'/g, "'")
    // Add pauses for better pacing
    .replace(/[.!?]/g, '$&,')
    // Enhance British pronunciation hints
    .replace(/\bcan't\b/g, "cannot")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bdance\b/g, "dahnce")
    .replace(/\bask\b/g, "ahsk")
    .replace(/\bafter\b/g, "ahfter")
    .trim();
}