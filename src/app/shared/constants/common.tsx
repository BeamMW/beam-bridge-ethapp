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
        ethTokenContract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        ethPipeContract: '0x2d3CA609D422d80D042891aDA53b36e4EA501bC8',       
    },
    {
        name:'WBTC',
        rate_id: 'wrapped-bitcoin',
        id: 2,
        decimals: 8,
        validator_dec: 6,
        ethTokenContract: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        ethPipeContract: '0x20A396Ba1097aB87edD158c5fd472F44b67c32Ae',
    },
    {
        name:'DAI',
        rate_id: 'dai',
        id: 3,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '0x6b175474e89094c44da98b954eedeac495271d0f',
        ethPipeContract: '0xca0904f93E9BA490582dFe2AC1CA9c4060f3B795',
    },
    {
        name: 'ETH',
        rate_id: 'ethereum',
        id: ethId,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '',
        ethPipeContract: '0x410B145EfeA2699b5C2799931e9cAEa9dBa585cE',
    }
];