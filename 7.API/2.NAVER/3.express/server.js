import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({ quiet: true });
const app = express();

app.use(express.json());
app.use(express.static('public'));
// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//   })
// );

const url = `https://openapi.naver.com/v1/search/blog`;
const naverClientID = process.env.NAVER_CLIENT_ID;
const naverClientSecret = process.env.NAVER_CLIENT_SECRET;

if (!naverClientID || !naverClientSecret) {
  console.log('네이버 클라이언트 아이디 또는 시크릿이 설정되지 않음');
  process.exit(1);
}

const header = {
  'X-Naver-Client-Id': naverClientID,
  'X-Naver-Client-Secret': naverClientSecret,
};

async function fetchSearch(query, page, display) {
  const start = (page - 1) * display + 1;
  const resNaver = await fetch(`${url}?query=${query}&display=${display}&start=${start}`, {
    headers: header,
  });
  if (!resNaver.ok) throw new Error(`요청실패: ${resNaver.status} ${resNaver.statusText}`);
  const data = await resNaver.json();
  return data;
}
//curl -G "127.0.0.1:3000/api/search" --data-urlencode "query=자바스크립트" -d "display=10" -d "page=1"
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  const page = req.query.page || 1;
  const display = req.query.display || 10;
  try {
    const data = await fetchSearch(query, page, display);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: '네이버 api 오류' });
  }
});

app.listen(3000, () => {
  console.log('server is running');
});
