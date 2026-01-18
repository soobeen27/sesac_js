import express from 'express';
import session from 'express-session';
import axios from 'axios';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config({ quite: true });

const app = express();
const PORT = 3000;

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize';
const NAVER_AUTH_REDIRECT_URL = process.env.NAVER_AUTH_REDIRECT_URL;
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
const NAVER_USERINFO_URL = 'https://openapi.naver.com/v1/nid/me';

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(
  session({
    secret: 'do-not-steal-it-is-my-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  })
);
/*********************** 
       페이지 요청
************************/
app.get('/login', (req, res) => {
  //1. 사용자를 네이버로 보냄
  const authURL = `${NAVER_AUTH_URL}?response_type=code&client_id=${NAVER_CLIENT_ID}&state=SESAC&redirect_uri=${NAVER_AUTH_REDIRECT_URL}`;

  res.redirect(authURL);
});
/*********************** 
       API 요청
************************/
app.get('/api/oauth/callback', async (req, res) => {
  //2. 사용자가 받아온 코드를 검증
  const { code, state } = req.query;
  const tokenURL = new URL(NAVER_TOKEN_URL);
  tokenURL.search = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: NAVER_CLIENT_ID,
    client_secret: NAVER_CLIENT_SECRET,
    code,
    state,
  });
  //위 정보를 담아서 다시 네이버에게 토큰 요청
  console.log('네이버가 확인중', tokenURL.toString());
  const token = await axios.get(NAVER_TOKEN_URL, {
    params: {
      grant_type: 'authorization_code',
      client_id: NAVER_CLIENT_ID,
      client_secret: NAVER_CLIENT_SECRET,
      code,
      state,
    },
  });
  console.log('------------------------------', token);
  // 3. 확인된 최종 토큰(access token)을 사용해 사용자 정보 받아옴
  const userInfo = await axios.get(NAVER_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${token.data.access_token}`,
    },
  });
  res.json(userInfo.data);
});

app.listen(PORT, () => {
  console.log('server running');
});
