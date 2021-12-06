import React, { useEffect } from 'react';
import { useStore } from 'effector-react';
import { css } from '@linaria/core';

import { $view, View } from '@state/shared';
import { getCurrentView } from '@core/router';
import { initApp } from '@state/init';

css`
  :global() {
    :root {
      --color-send: #da68f5;
      --color-receive: #0bccf7;
      --color-usdt-from: rgba(80, 175, 149, .3);
      --color-eth-from: rgba(94, 123, 242, .3);
      --color-wbtc-from: rgba(247, 147, 26, .3);
      --color-dai-from: rgba(245, 172, 55, .3);
    }

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

    p {
      margin: 0;
    }

    tr, th, table {
      border: none;
      border-spacing: 0;
      padding: 0;
      margin: 0;
      border-collapse: inherit;
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
  const ViewComponent = getCurrentView(view);

  return (
    <div className={background}>
      <ViewComponent />
    </div>
  );
};

export default App;
