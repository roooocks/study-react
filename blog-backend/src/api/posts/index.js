import Router from '@koa/router';

import * as postsCtrl from './posts.ctrl.js';

const posts = new Router();
posts.get('/', postsCtrl.list); // koa-bodyparser 필요X
posts.post('/', postsCtrl.write);

const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read); // koa-bodyparser 필요X
post.delete('/', postsCtrl.remove); // koa-bodyparser 필요X
post.patch('/', postsCtrl.update);

// posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read); // 만약 라우터를 나누기 귀찮으면 이런식으로 인자 3개를 넣자!
posts.use('/:id', postsCtrl.checkObjectId, post.routes()); // post로 묶어서 검증을 사용할 라우터들만 지정

export default posts;
