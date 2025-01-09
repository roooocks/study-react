import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// 인스턴스 메서드
// 모델을 통해 생성된 인스턴스에서 사용 가능
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  // compare: 비번이 DB에 저장된 해시와 일치하는지 확인
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result; // true or false
};

UserSchema.methods.serialize = function () {
  // 응답할 데이터에 hashedPassword 제거
  const data = this.toJSON();
  delete data.hashedPassword;

  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫번째 파라미터. 토큰에 넣을 데이터 설정
    {
      _id: this.id,
      username: this.username,
    },
    // 두번째 파라미터. JWt 암호 설정
    process.env.JWT_SECRET,
    // 세번째 파라미터. 그외 옵션들. 작성한 expiresIn은 유효 기간이다.
    {
      expiresIn: '7d',
    },
  );

  return token;
};

// 스태틱 메서드
// 모델 자체에서 사용 가능
UserSchema.statics.findByUsername = function (username) {
  // findOne: username에 맞는 값들 중 첫번째 값을 가져온다.
  return this.findOne({ username });
};

const User = mongoose.model('User', UserSchema);

export default User;
