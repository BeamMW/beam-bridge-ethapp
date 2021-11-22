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

export const ethId = 4;

export const currencies : Currency[] = [
    {
        name: "USDT",
        id: 1,
        decimals: 6,
        ethTokenContract: '0xC9A07C43f05eA5ad147d5cC4176DF6481287e3AD',
        ethPipeContract: '0x950eedbEa0A4267028EAceAAb229633E5A9cC226'
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
