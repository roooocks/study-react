import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import PostListPage from './pages/PostListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>존재하지 않는 페이지입니다.</div>, // 에러 발생시 표시할 컴포넌트
    children: [
      // Router v5의 경우 path={['/@:username', '/']}로 사용
      {
        path: '',
        element: <PostListPage />,
      },
      {
        path: '/:username',
        element: <PostListPage />,
      },
      {
        path: '/:username/:postId',
        element: <PostPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/write',
        element: <WritePage />,
      },
    ],
  },
]);

export default router;
