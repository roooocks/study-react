import Koa from 'koa';
import Router from '@koa/router';

import api from './api/index.js'; // import { api } from './api'; 이건 에러가 걸리니 조심

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api/index.js의 라우터 적용

// app 인스턴스에 라우터 적용
router.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Listening to port 4000.\nGo to http://localhost:4000');
});
