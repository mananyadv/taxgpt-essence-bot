
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, Source } from "../types/chat";

// Use the provided API key
const API_KEY = "AIzaSyD9nyPo2MswHHASsdKYkLFdhw9ViJC6S7U";

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateTaxResponse = async (messages: Message[]): Promise<{ content: string; sources: Source[] }> => {
  try {
    // Get the model - using gemini-1.5-flash for better performance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Extract only the content from previous messages to build context
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop()?.content || "";
    
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
    
    const prompt = `${systemPrompt}\n\nUser query: ${lastUserMessage}`;
    
    console.log("Sending request to Gemini API with prompt:", prompt);
    
    // Generate content using the new API
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
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
