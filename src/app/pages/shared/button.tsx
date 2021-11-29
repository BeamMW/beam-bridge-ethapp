import React from 'react';
import { styled } from '@linaria/react';

interface ButtonProps {
  color?: 'send' | 'receive';
  icon?: string;
  onClick?: (param: any) => void;
  disabled?: boolean;
}

const ButtonStyled = styled.button<ButtonProps>`
  display: block;
  padding: 10px 30px;
  border: none;
  border-radius: 50px;
  background-color: ${({ color }) => `var(--color-${color})`};
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #032e49;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => disabled ? "0.5" : ""};

  &:hover,
  &:active {
    box-shadow: ${({ disabled }) => disabled ? "none" : "0 0 8px white"};
  }
`;

const Button: React.FC<ButtonProps> = ({
  color,
  icon,
  children,
  disabled,
  ...rest
}) => (
  <ButtonStyled disabled={disabled} color={color} {...rest}>
    {children}
  </ButtonStyled>
);

export default Button;
