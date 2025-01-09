import jwt from 'jsonwebtoken';

import User from '../models/user.js';

// api 사용 시 해당 미들웨어가 우선적으로 작동한다.
// 여기서는 JWT를 복호화 시켜 상태에 저장시킨다.
const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access-token');

  if (!token) {
    return next();
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // iat, exp가 무조건 들어있을거다. iat는 토큰 생성 시기, exp는 만료 시기이다.
    // console.log(decode);
    ctx.state.user = {
      _id: decode._id,
      username: decode.username,
    };

    // 만료일이 3.5일 미만이면 토큰 재발급
    const now = Math.floor(Date.now() / 1000);
    if (decode.exp - now < 60 * 60 * 24 * 35) {
      const user = await User.findById(decode._id);
      const token = user.generateToken();

      ctx.cookies.set('access-token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
    }

    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
