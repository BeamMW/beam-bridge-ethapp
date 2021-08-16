import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import { css } from '@linaria/core';

import { Connect, Balance, Send } from '@pages/main';
import { $view, View } from '@state/shared';
import { initApp } from '@state/init';

const ViewCompomentMap = {
  [View.CONNECT]: Connect,
  [View.BALANCE]: Balance,
  [View.SEND]: Send
};

css`
  :global() {
    @font-face {
      font-family: 'ProximaNova';
      src: url('assets/fonts/ProximaNova-Regular.ttf');
      font-weight: 400;
      font-style: normal;
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('assets/fonts/ProximaNova-RegularIt.ttf');
      font-weight: 400;
      font-style: italic;
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('assets/fonts/ProximaNova-Semibold.ttf');
      font-weight: 600;
      font-style: normal;
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('assets/fonts/ProximaNova-Bold.ttf');
      font-weight: 700;
      font-style: normal;
    }

    * {
      box-sizing: border-box;
      outline: none;
    }

    html,
    body, #root, #root>div {
      margin: 0;
      padding: 0;
    }

    body {
      font-size: 14px;
      color: white;
      background-image: url(assets/bg.png);
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    html * {
      font-family: 'ProximaNova', sans-serif;
    }

    h1,h2 {
      margin: 0;
    }
  }
`;

const background = css`
 
`;

const App = () => {
  useEffect(() => {
    initApp();
  }, []);

  const view = useStore($view);
  const ViewComponent = ViewCompomentMap[view];

  return (
    <div className={background}>
      <ViewComponent />
    </div>
  );
};

export default App;
