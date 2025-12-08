import { GoogleGenAI } from "@google/genai";

// Ensure we get the key from the correct environment variable injected by Vite
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are SuiCare Assistant, a helpful AI integrated into a decentralized health and insurance platform. 
Your goal is to help users understand their health records, explain insurance terms, and guide them on how to file a claim on the Sui blockchain.
Keep answers concise, empathetic, and mobile-friendly. 
If asked about medical advice, provide general information but strictly advise seeing a doctor.
Key context: SuiCare uses the Sui blockchain for immutable records and instant insurance payouts. MyHealthBox is the personal data vault.`;

export const sendMessageToAssistant = async (
  message: string, 
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    if (!apiKey) {
      return "⚠️ API Key missing. Please check your .env.local file.";
    }

    // Use a stable model version available today
    const model = 'gemini-1.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      // Map history to the format expected by the SDK
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    // Send the new message
    const result = await chat.sendMessage({ 
      parts: [{ text: message }] 
    });

    // Extract text safely
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the SuiCare AI node right now. Please try again later.";
  }
};