import mongoose from 'mongoose';

const { Schema } = mongoose;

// 스키마
//  - 데이터의 구조, 내용을 정의(JSON 타입의 객체)
//  - 컬렉션(테이블)에 들어가는 문서(레코드) 내부의 각 필드가 어떤식으로 되어 있는지 정의하는 객체
const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});

// 모델(스키마를 통해 만든 인스턴스) 생성
// 좀 햇갈리는 용어인데, 이 모델을 만들어두면 "DB에 실제 작업(검색, 추가, 수정, 삭제 등)이 가능"하다고 생각하면 편하다.
// 첫번째 인자: 스키마 이름
// 두번째 인자: 스키마 객체
const Post = mongoose.model('Post', PostSchema);

export default Post;
