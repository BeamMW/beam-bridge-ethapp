export const GROTHS_IN_BEAM = 100000000;
export const BEAMX_TVL = 100000000;
export const BEAMX_TVL_STR = '100 000 000';

export const ethId = 4;
export const ETH_RATE_ID = 'ethereum';

export const MAX_ALLOWED_VALUE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const REVOKE_VALUE = '0';

export const CURRENCIES = [
    {
        name: "USDT",
        rate_id: 'tether',
        id: 1,
        decimals: 6,
        validator_dec: 6,
        ethTokenContract: '0x7D5D7c75d60BcaCD948cf3aCdEa164986b1f0755',
        ethPipeContract: '0xE1843841d03C46BFBf7ae027640fD921dE5F8f53',       
    },
    {
        name:'WBTC',
        rate_id: 'wrapped-bitcoin',
        id: 2,
        decimals: 8,
        validator_dec: 6,
        ethTokenContract: '0xFf42D250DC5111E58FD7e43e400097f3fDE65b18',
        ethPipeContract: '0x8a7F12320052f20A40fD6815509A17236b8C7A0E',
    },
    {
        name:'DAI',
        rate_id: 'dai',
        id: 3,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '0xAC7CD333aC49A98C0C18A550ac03e4935B8d1CBE',
        ethPipeContract: '0xb8cA4dCe56f895eEEe65f88945cf379166844bc1',
    },
    {
        name: 'ETH',
        rate_id: 'ethereum',
        id: ethId,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '',
        ethPipeContract: '0xF0860856D305803bF2adbEF064CC38bE94A9d006',
    }
];