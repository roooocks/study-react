import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';

import './index.css';
import reportWebVitals from './reportWebVitals';
import router from './router';
import rootReducer from './modules';

const store = configureStore({
  reducer: rootReducer,
  // 나중에 미들웨어 들어가면 쓸 예정
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(logger, thunk, sagaMiddleware),
  devTools: composeWithDevTools(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
