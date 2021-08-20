import React from 'react';

export const isNil = (value: any) => value == null;

export const formatActiveAddressString = (value: string = '') => value.length > 0 ? value.substring(0, 6) 
  + "..." + value.substring(value.length - 6, value.length) : '';