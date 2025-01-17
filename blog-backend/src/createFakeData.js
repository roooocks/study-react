import Post from './models/post.js';

export default function createFakeData() {
  // 0 ~ 39으로 이루어진 배열을 생성 후 포스트 데이터로 변환
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트 #${i}`,
    body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    tags: ['가짜', '데이터'],
  }));

  // 책에 있던 insertMany는 현재 사용하지 않는 방법이니 .then, .catch 사용
  Post.insertMany(posts).then((docs) => {
    console.log(docs);
  });
}
