import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });
const app = express();

const url = `https://openapi.naver.com/v1/search/blog`;
const header = {
  'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
  'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
};

app.use(express.json());

//curl "127.0.0.1:3000/api/search?query=javascript&display=10&start=1"
app.get('/api/search', async (req, res) => {
  const { query, display, start } = req.query;
  console.log(query, display, start);

  try {
    const res = await fetch(`${url}?query=${query}&display=${display}&start=${start}`, {
      headers: header,
    });
    const data = await res.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: '네이버 api 오류' });
  }
});

app.listen(3000, () => {
  console.log('server is running');
});
// %EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8
