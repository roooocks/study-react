import Joi from 'joi';
import User from '../../models/user.js';

/**
 * POST /api/auth/register
 * {
 *  username: 'velopert',
 *  password: 'mypass123'
 * }
 */
export const register = async (ctx) => {
  // Request Body 검증
  // alphanum => 알파벳, 숫자 검사
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 404;
    ctx.body = result.error;
    return;
  }

  // 검증 완료 시 진행
  const { username, password } = ctx.request.body;
  try {
    // 이미 이름이 존재하는지 확인
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // Conflict (요청이 현재 서버의 상태와 충돌될 때)
      return;
    }

    // 아래 user가 모델을 통해 생성된 인스턴스다.
    const user = new User({
      username,
    });
    await user.setPassword(password);
    await user.save();

    // 내용 설정(Json)
    ctx.body = user.serialize();

    // 설정된 내용을 쿠키에 넣는다.
    // 가입 후 바로 로그인되게 하는 형식
    const token = user.generateToken();
    ctx.cookies.set('access-token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      httpOnly: true, // xss 공격 예방. 쿠키에서 사용하는 옵션
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * POST /api/auth/login
 * {
 *  username: 'velopert',
 *  password: 'mypass123'
 * }
 */
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;

  // username, password가 없으면 에러 처리
  if (!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    // 계정이 없을 경우
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }

    // 비밀번호가 잘못 되었을 경우
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }

    // 내용 설정
    ctx.body = user.serialize();

    // 설정된 내용을 쿠키에 넣는다.
    const token = user.generateToken();
    ctx.cookies.set('access-token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.thrwo(500, e);
  }
};

export const check = async (ctx) => {
  const { user } = ctx.state; // api가 호출될 때 state에 JWT 값들을 저장시킨다.

  if (!user) {
    ctx.status = 401; // Unauthorized
    return;
  }

  ctx.body = user;
};

export const logout = async (ctx) => {
  ctx.cookies.set('access-token', null);
  ctx.status = 204;
};
