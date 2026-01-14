// const request = require('request');
// const dotenv = require('dotenv');
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const text = '자바스크립트';
const encText = encodeURIComponent(text);

const url = `https://openapi.naver.com/v1/search/blog`;

const header = {
  'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
  'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
};

function run(search, start, display) {
  const encSearch = encodeURIComponent(search);
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${url}?query=${encSearch}&display=${display}&start=${start}`, {
        method: 'get',
        headers: header,
      });
      const data = await res.json();
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

async function runPage(search, page, limit) {
  const start = (page - 1) * limit + 1;
  const data = await run(search, start, limit);
  return data;
}

console.log(runPage(1, 10));
