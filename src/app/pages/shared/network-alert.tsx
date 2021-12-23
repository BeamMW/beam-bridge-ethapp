import React, { useRef } from 'react';
import { styled } from '@linaria/react';

const BackdropStyled = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(3, 36, 68, 0.3);
`;

const Alert = styled.div`
  transform: translateX(-50%) translateY(-50%);
  position: absolute;
  top: 50%;
  left: 50%;
  width: 660px;
  padding: 30px 30px 50px 50px;
  border-radius: 10px;
  background-color: var(--color-popup);
  color: white;
  display: flex;
  flex-direction: column;
  font-size: 30px;
`;

const NetworkAlert = ({

}) => {
  return (
    <BackdropStyled>
        <Alert>
            <p>Wrong network!</p>
            <p>Looks like you connected to unsupported network.</p>
            <p>Change network to Ropsten.</p>
        </Alert>
    </BackdropStyled>
  );
};

export default NetworkAlert;
