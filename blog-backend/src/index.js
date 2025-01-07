// node.js의 경우 require를 기본으로 쓴다.
// 만약 import의 파일 경로 쓰는게 보기 싫다면 require를 쓰자!
import 'dotenv/config.js'; // require('dotenv').config();

import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api/index.js'; // import { api } from './api'; 이건 에러가 걸리니 조심
// import createFakeData from './createFakeData.js';

/// DB 관련
const { PORT, MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connect to MongoDB');
    // createFakeData(); // DB에 데이터가 없을 때 사용
  })
  .catch((e) => {
    console.log(e);
  });

/// 라우터 관련
const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api/index.js의 라우터 적용

// app 인스턴스에 라우터 적용 전 설정
app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// 시작!
const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port %d.\nGo to http://localhost:%d', port, port);
});
