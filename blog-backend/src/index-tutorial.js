import Koa from 'koa';

const app = new Koa();

// koa 미들웨어
// next를 써야 다음 미들웨어로 넘어갈 수 있다.
//  - next 인자를 생략한 미들웨어 함수는 무시한다.
app.use(async (ctx, next) => {
  console.log(`요청 경로: ${ctx.url}`);
  console.log(1);

  if (ctx.query.authorized !== '1') {
    ctx.status = 401; // Unauthorized
    return;
  }

  // next 인자는 Promise를 반환한다.
  // next().then(() => {
  //   console.log('1 END');
  // });

  // async, await으로도 사용 가능하다.
  await next();
  console.log('1 END');
});

app.use((ctx, next) => {
  console.log(2);
  next();
});

app.use((ctx) => {
  ctx.body = 'hello world!';
});

// 실행
app.listen(4000, () => {
  console.log('Listening to port 4000');
});
