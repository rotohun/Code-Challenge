import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLM_CONFIG } from '../config/llm';

const genAI = new GoogleGenerativeAI(LLM_CONFIG.API_KEY);

export const analyzeLLM = async (content: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: content }],
        },
      ],
      systemInstruction: 'You are a therapist that analyzes journal for the mood and provides just an emoji that represents the mood.',
    });
    const response = await result.response;
    const text: string = response.text();
    console.log(text);
    if (!text) {
      throw new Error('No response from LLM');
    }
    return text
  } catch (error) {
    console.error('Error analyzing LLM:', error);
    throw error;
  }
};

