export const GROTHS_IN_BEAM = 100000000;
export const BEAMX_TVL = 100000000;
export const BEAMX_TVL_STR = '100 000 000';

export const ethId = 4;
export const ETH_RATE_ID = 'ethereum';

export const MAX_ALLOWED_VALUE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const REVOKE_VALUE = '0';

export const CURRENCIES = [
    {
        name: "BEAM",
        rate_id: 'beam',
        id: 1,
        decimals: 8,
        validator_dec: 8,
        ethTokenContract: '0x073A4409eFb1b3DAf244123DB0450643726dE7B0',
        ethPipeContract: '0x41962c547A9D834ab06492A02691fe2c8a9Da86C',       
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