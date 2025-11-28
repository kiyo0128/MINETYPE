import { GoogleGenAI, Type } from "@google/genai";
import { WordItem } from "../types";
import { FALLBACK_WORDS } from "../constants";

export const fetchWordsFromGemini = async (): Promise<WordItem[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found. Using fallback words.");
    return Promise.resolve([...FALLBACK_WORDS]);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We request a JSON response with a specific schema
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of 25 Minecraft-related words for a typing game. 
      Mix easy and hard words. 
      Includes Mobs, Items, Biomes, and general terms.
      Ensure the 'romaji' is strictly lowercase.
      IMPORTANT: If the Japanese word contains the long vowel mark 'ー', you MUST represent it as a hyphen '-' in the romaji (e.g., 'kuri-pa-' for 'クリーパー'). Do not double the vowel.
      Do not include spaces in the romaji.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              japanese: { type: Type.STRING, description: "The word in Japanese (Kanji/Kana)" },
              romaji: { type: Type.STRING, description: "The word in Romaji (English letters)" },
              category: { type: Type.STRING, enum: ["MOB", "ITEM", "BIOME", "OTHER"] }
            },
            required: ["japanese", "romaji", "category"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as WordItem[];
      // Validate data roughly
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
    
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Graceful fallback
    return [...FALLBACK_WORDS].sort(() => 0.5 - Math.random());
  }
};