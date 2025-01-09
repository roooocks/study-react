import Router from '@koa/router';

import * as postsCtrl from './posts.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';

const posts = new Router();
posts.get('/', postsCtrl.list); // koa-bodyparser 필요X
posts.post('/', checkLoggedIn, postsCtrl.write);

const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read); // koa-bodyparser 필요X
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove); // koa-bodyparser 필요X
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

// posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read); // 만약 라우터를 나누기 귀찮으면 이런식으로 인자 3개를 넣자!
posts.use('/:id', postsCtrl.getPostById, post.routes()); // post로 묶어서 검증을 사용할 라우터들만 지정

export default posts;
