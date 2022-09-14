import { CURRENCIES } from '@app/shared/constants';

const CID =  '';

import React from 'react';
import { toast } from 'react-toastify';
import { encode } from 'js-base64';

export function connectToMetamask() {
    window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(accounts => console.log('success!'))
}