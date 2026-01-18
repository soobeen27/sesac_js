import express from 'express';
import session from 'express-session';
import axios from 'axios';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ quite: true });

const app = express();
const PORT = 3000;

let user = [];

// 가상으로 __dirname 굳이 만들어야하나 (ESM에선 __dirname 존재 x)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_AUTH_URL = 'https://nid.naver.com/oauth2.0/authorize';
const NAVER_AUTH_REDIRECT_URL = process.env.NAVER_AUTH_REDIRECT_URL;
const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
const NAVER_USERINFO_URL = 'https://openapi.naver.com/v1/nid/me';

app.use(morgan('dev'));
app.use(express.static('public'));
//express 세션 설정
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

function checkLogin(req, res, next) {
  if (req.session.user) return next();
  res.status(403).sendFile(path.join(__dirname, 'public', 'error.html'));
}

/*********************** 
       페이지 요청
************************/
app.get('/login', (req, res) => {
  //1. 사용자를 네이버로 보냄
  const authURL = `${NAVER_AUTH_URL}?response_type=code&client_id=${NAVER_CLIENT_ID}&state=SESAC&redirect_uri=${NAVER_AUTH_REDIRECT_URL}`;

  res.redirect(authURL);
});

app.get('/dashboard', checkLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/user', checkLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.get('/logout', (req, res) => {
  //로그아웃 처리
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 삭제 실패', err);
      return res.status(500).json({ message: '로그아웃 실패' });
    }
    res.redirect('/');
  });
});

// 루트에 접속 ->
// 네이버 로그인 성공시 대시보드로 보내기 ->
// 사용자 페이지 가보기 ->
// 대시보드에 있는 로그아웃 하기 (/) ->
// 로그인 안한 상태에서 대시보드 가보기 ->
// 미들웨어를 통해 xxx페이지로 갈때마다 미들웨어로 세션 유무 판단 ->
// 없으면 에러로 보내기
/*********************** 
       API 요청
************************/
app.get('/api/user', async (req, res) => {
  // 세션에 저장해둔 사용자 정보 전달
  if (req.session?.user) {
    res.json(req.session.user);
  }
});

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
  try {
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
    // 3. 확인된 최종 토큰(access token)을 사용해 사용자 정보 받아옴
    // 이거 세션에 저장 ㄱㄱ
    const userInfoRes = await axios.get(NAVER_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
    const userInfo = userInfoRes.data.response;
    req.session.user = {
      id: userInfo.id,
      name: userInfo.name || userInfo.nickname || 'Unknown',
      nickname: userInfo.nickname || 'Unknown',
      email: userInfo.email || 'Unknown',
      age: userInfo.age || 'Unknown',
      gender: userInfo.gender === 'M' ? '남' : userInfo.gender === 'F' ? '여' : '미동의',
      birthdate: userInfo.birthday || 'N/A',
    };
    // res.json(userInfoRes.data);
    res.redirect('/dashboard');
  } catch (e) {
    res.status(500).json({ error: `에러에여${e}` });
  }
});

app.listen(PORT, () => {
  console.log('server running');
});
