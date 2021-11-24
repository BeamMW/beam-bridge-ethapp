export interface SendParams {
    selectedCurrency: Currency,
    amount: number,
    address: string,
    fee: number,
    account: string
}

export interface Currency {
    id: number,
    decimals: number,
    name: string,
    ethPipeContract: string,
    ethTokenContract: string
}

export interface Balance {
    value: number,
    curr_id: number,
    icon: string
}

export const ethId = 4;

export const currencies : Currency[] = [
    {
        name: "USDT",
        id: 1,
        decimals: 6,
        ethTokenContract: '0x7Ee66bc8BA7F38fe34E404c3399f9E221e4B8b0D',
        ethPipeContract: '0xeb0BA1544f4175c34C884c2CfD684e83e033B7ED'
    },
    {
        name:'WBTC',
        id: 2,
        decimals: 8,
        ethTokenContract: '',
        ethPipeContract: ''
    },
    {
        name:'DAI',
        id: 3,
        decimals: 18,
        ethTokenContract: '0x373e337F18977237fB2e33E028F51dfDfA576B20',
        ethPipeContract: '0xFF8713638b73b371D6a28C7C7852Aa57a0C9A3D2'
    },
    {
        name: 'ETH',
        id: ethId,
        decimals: 18,
        ethTokenContract: '',
        ethPipeContract: '0x2eCD75b34d4732FE9e991132085D829A7D8c3dE7'
    }
];
