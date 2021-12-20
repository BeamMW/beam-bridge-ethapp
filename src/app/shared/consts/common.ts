export const ethId = 4;

export const MAX_ALLOWED_VALUE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const REVOKE_VALUE = '0';

export const currencies = [
    {
        name: "USDT",
        rate_id: 'tether',
        id: 1,
        decimals: 6,
        validator_dec: 6,
        ethTokenContract: '0xfdb6ba93e0b3A760bCD36140C20F96eE4A636f7B',
        ethPipeContract: '0x1E5b95e08d2F382D9b35Ab1a8ba1443Cf767Ae5c'
    },
    {
        name:'WBTC',
        rate_id: 'wrapped-bitcoin',
        id: 2,
        decimals: 8,
        validator_dec: 6,
        ethTokenContract: '0x9acDE598dd6e8D29eCCe8FbE58e3190Ab7302179',
        ethPipeContract: '0xdbfe9643dB5f967643d8481BA2A8b7752061453d'
    },
    {
        name:'DAI',
        rate_id: 'dai',
        id: 3,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '0xB786c676A626D0abB616beF59056291fC84F4Bc4',
        ethPipeContract: '0x2822659F502aE977b4bA62D9a43d389b22E56b04'
    },
    {
        name: 'ETH',
        rate_id: 'ethereum',
        id: ethId,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '',
        ethPipeContract: '0xc6120F6102416040F7FA9c2333715713Dd77Ef09'
    }
];