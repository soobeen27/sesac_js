import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
dotenv.config({ quiet: true });

const key = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: key });

async function run() {
  const res = await ai.models.list();
  const names = res.pageInternal.map((m) => m.name);
  console.log(names);
}

run();
