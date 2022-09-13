export const GROTHS_IN_BEAM = 100000000;
export const BEAMX_TVL = 100000000;
export const BEAMX_TVL_STR = '100 000 000';

export const ethId = 4;

export const MAX_ALLOWED_VALUE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const REVOKE_VALUE = '0';

export const CURRENCIES = [
    {
        name: "USDT",
        rate_id: 'tether',
        id: 1,
        decimals: 6,
        validator_dec: 6,
        ethTokenContract: '0x2226014269E1A64DA3E50FBb9ba7d4bc947386B3',
        ethPipeContract: '0x653Ffac2cee2f53bb0e0822b8a57cd8697eD9862',       
    },
    {
        name:'WBTC',
        rate_id: 'wrapped-bitcoin',
        id: 2,
        decimals: 8,
        validator_dec: 6,
        ethTokenContract: '0x1Fd73527b778224CF2F900a27C493d243C43f796',
        ethPipeContract: '0x02e95B7459cED6Bb8e6246c62E01eCd5831E53DC',
    },
    {
        name:'DAI',
        rate_id: 'dai',
        id: 3,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '0x6662aFde33a3B2ac14Cd176cA21c5A5E153868fa',
        ethPipeContract: '0xb79f094De32A4ed800f2470D5D698B2a3CF6E7B4',
    },
    {
        name: 'ETH',
        rate_id: 'ethereum',
        id: ethId,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '',
        ethPipeContract: '0x5187e411a19bbe79e9c53b52f94f7321fed22e4b',
    }
];