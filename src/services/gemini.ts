
import { Message, Source } from "../types/chat";

// Updated Gemini API key
const API_KEY = "AIzaSyC9Yaru_7LSlFf_XCbRsOKwwHOgGVI8gFs";
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const generateTaxResponse = async (messages: Message[]): Promise<{ content: string; sources: Source[] }> => {
  try {
    // Extract only the content from previous messages to build context
    const conversationHistory = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Add system prompt to guide the AI
    const systemPrompt = `You are TaxBot, a helpful tax assistant specialized in providing accurate tax information. 
      Always provide detailed, accurate tax information. 
      Include sources for your information in a special format at the end like this:
      SOURCES:
      [1] Title: Source title
      Content: Brief excerpt from source
      URL: url (if available)
      
      [2] Title: Another source title
      Content: Brief excerpt from another source
      URL: another url (if available)
      
      Always give at least 2 sources.
      Focus specifically on tax-related queries and provide the most up-to-date information.
      Use a professional, friendly tone.`;
    
    // Get the last user message
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop()?.content || "";
    
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser query: ${lastUserMessage}` }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    };

    console.log("Sending request to Gemini API:", JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Parse out the sources from the response
    let mainContent = textResponse;
    const sources: Source[] = [];
    
    if (textResponse.includes('SOURCES:')) {
      const [content, sourcesText] = textResponse.split('SOURCES:');
      mainContent = content.trim();
      
      // Parse sources into structured format
      const sourceRegex = /\[(\d+)\]\s+Title:\s+(.*?)(?:\s+Content:\s+(.*?)(?:\s+URL:\s+(.*?))?)?(?=\s+\[\d+\]|$)/gs;
      let match;
      
      while ((match = sourceRegex.exec(sourcesText)) !== null) {
        sources.push({
          id: match[1],
          title: match[2].trim(),
          content: match[3] ? match[3].trim() : '',
          url: match[4] ? match[4].trim() : undefined
        });
      }
      
      // If no sources were found but SOURCES: was present, create a generic source
      if (sources.length === 0 && sourcesText.trim()) {
        sources.push({
          id: '1',
          title: 'Tax Information',
          content: sourcesText.trim(),
        });
      }
    }

    return {
      content: mainContent,
      sources: sources
    };
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};
