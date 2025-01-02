import Router from 'koa/router';

const api = new Router();

api.get('/test', (ctx) => {
  console.log('hi!');
  ctx.body = 'test 성공!!';
});

// 라우터를 내보냅니다.
export default api;
