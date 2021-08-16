import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { setView, View } from '@state/shared';

const container = css`
  display: flex;
  flex-direction: column;
`;

const Send = () => {

  return (
    <div>
      SEND LOADED
    </div>
  );
};

export default Send;
