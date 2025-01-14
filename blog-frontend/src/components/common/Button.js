import React from "react";
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

const StyledButton = styled.button`
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.25rem 1rem;
  color: white;
  outline: none;
  cursor: pointer;

  background: ${palette.gray[8]};
  &:hover {
    background: ${palette.gray[6]};
  }
`;

// 리액트 컴포넌트로 만들어 그 안에 렌더링을 안해주고 바로 내보내도 된다.
// 다만 import가 정상작동을 안하니 그냥 해주자
const Button = props => <StyledButton {...props} />;

export default Button;
