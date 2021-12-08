import React, { useEffect } from 'react';
import { getRateFx } from '@state/shared';

const Loader = () => {
  useEffect(() => {
    getRateFx();
  }, []);

  return (
    <></>
  );
};

export default Loader;
