import mongoose from 'mongoose';
import Joi from 'joi';

import Post from '../../models/post.js';

const { ObjectId } = mongoose.Types;

// 기능
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.state.post = post;

    return next();
  } catch (e) {
    ctx.throw(500, e);
  }

  // 현재 작업은 Koa에서 하는걸 잊으면 안된다.
  // 현재 기능 미들웨어가 끝나면 관련 라우터의 미들웨어가 작동해야 하므로 next()를 사용해 다음 작업이 가능하게 해줘야 한다.
  return next();
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }

  return next();
};

// 라우터
/**
 * POST /api/posts
 * {
 *  title: '제목',
 *  body: '내용'
 *  tags: ['태그1', '태그2']
 * }
 */
export const write = async (ctx) => {
  // 객체의 필드 검증 설계
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  // 설계한 검증에 실패 시 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  // 검증이 제대로 되었다면 그대로 진행
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * GET /api/posts?username=&tag=&page=
 */
export const list = async (ctx) => {
  // query는 문자열! 숫자로! 변환한다!
  // 근데 값 없으면 1 사용하자
  const page = parseInt(ctx.query.page || '1', 10);
  if (page < 1) {
    ctx.status = 404;
    return;
  }

  // tag, username 값이 유효하면 객체 값으로 설정! 아니면 패스
  const { tag, username } = ctx.query;
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    // 여기서 사용한 lean() 함수는 가져온 객체 값을 바로 json으로 사용할 수 있게 해주는 함수다.
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount = await Post.countDocuments(query).exec();

    ctx.set('Last-page', Math.ceil(postCount / 10)); // 커스텀 헤더
    // 내용 길이 제한하는 방법 1
    // toJSON()으로 json으로 한번 포맷 시킨다.
    // ctx.body = posts
    //   .map((post) => post.toJSON())
    //   .map((post) => ({
    //     ...post,
    //     body:
    //       post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    //   }));

    // 내용 길이 제한하는 방법 2
    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * GET /api/posts/:id
 */
export const read = async (ctx) => {
  ctx.body = ctx.state.post;
};

/**
 * DELETE /api/posts/:id
 */
export const remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndDelete(id).exec();
    ctx.status = 204; // 결과는 성공이지만 응답 데이터X
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * POST /api/posts/:id
 * {
 *  title: '수정',
 *  body: '수정 내용'
 *  tags: ['수정', '태그']
 * }
 */
export const update = async (ctx) => {
  const { id } = ctx.params;

  // 객체의 필드 검증 설계
  // write와 다르게 required가 없다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 설계한 검증에 실패 시 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // true = 업데이트 후 데이터 반환, false = 업데이트 전 데이터 반환
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
