import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

console.log(key);

async function makeRequest(question) {
  const body = {
    contents: [{ parts: [{ text: question }] }],
  };
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-goog-api-key': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const text = data.candidates[0].content;
  console.log(text);
}

makeRequest('JavaScript를 배우기위한 방법을 1줄로 설명해줘');
makeRequest('오저추');
