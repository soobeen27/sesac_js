import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
dotenv.config({ quiet: true });

const key = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: key });

async function askQuestion(question) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: question,
  });
  console.log(response.text);
}

askQuestion('인공지능이 무엇인지 3문장으로 답변하시오');
