
import { GoogleGenAI } from "@google/genai";
import { MENU_ITEMS } from "../constants";

// Corrected initialization to strictly follow GenAI SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getCuisineAdvice = async (userMessage: string, chatHistory: {role: 'user' | 'model', text: string}[]) => {
  const menuContext = MENU_ITEMS.map(item => `${item.name}: ${item.description} (${item.category}, R${item.price})`).join('\n');

  const systemInstruction = `
    You are 'Aunty Mzansi', an expert in South African cuisine and the virtual host of Mzantsi Bites restaurant.
    Your tone is warm, motherly, and proud of South African heritage. 
    Use South African slang occasionally (e.g., 'lekker', 'howzit', 'yebo', 'jol').
    
    The restaurant menu includes:
    ${menuContext}
    
    Your goal:
    1. Recommend dishes based on user's mood, hunger, or dietary preferences.
    2. Explain what traditional South African dishes are (e.g., explaining Bunny Chow or Chakalaka).
    3. Be encouraging and helpful.
    
    If someone asks for something not on the menu, suggest the closest alternative we have.
  `;

  try {
    // Filter history to ensure it starts with 'user' and alternates correctly
    // The first message in ChatBot is a model greeting, which we should skip for the API call
    // as chat history must start with a 'user' message.
    const history = chatHistory
      .filter((h, i) => i > 0 || h.role === 'user')
      .map(h => ({
        role: h.role === 'user' ? 'user' : 'model' as 'user' | 'model',
        parts: [{ text: h.text }]
      }));

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: history
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "Sorry, I'm feeling a bit bashful right now. Ask me again about our lekker food!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a little technical hiccup, my friend. Why not try our Bobotie while I fix this?";
  }
};
