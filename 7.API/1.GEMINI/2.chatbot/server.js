import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import morgan from 'morgan';

dotenv.config({ quiet: true });
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let history = [];

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  history = history.slice(-20);
  history.push({ role: 'user', parts: [{ text: message }] });
  console.log('--------질문 시작--------');
  console.log(history);
  console.log('--------질문 끝--------');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: history,
    });
    const reply = response.text;
    history.push({ role: 'model', parts: [{ text: reply }] });
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '알수없는 오류' });
  }
});

app.listen(3000, () => {
  console.log('서버레디');
});
