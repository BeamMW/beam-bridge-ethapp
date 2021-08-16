import React from 'react';
import { styled } from '@linaria/react';

const CardStyled = styled.div`

`;

const Card: React.FC = ({
  children,
  ...rest
}) => (
  <CardStyled {...rest}>
    {children}
  </CardStyled>
);

export default Card;
