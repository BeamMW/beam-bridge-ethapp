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
        decimals: 8,
        ethTokenContract: '0x6110971432e2A27386F92A7a6c0fa9be9B7DbD65',
        ethPipeContract: '0xB346d832724f4991cEE31c0C43982DA24C6C5214'
    },
    {
        name:'WBTC',
        id: 2,
        decimals: 8,
        ethTokenContract: '0x6110971432e2A27386F92A7a6c0fa9be9B7DbD65',
        ethPipeContract: '0xB346d832724f4991cEE31c0C43982DA24C6C5214'
    },
    {
        name:'DAI',
        id: 3,
        decimals: 8,
        ethTokenContract: '0x6110971432e2A27386F92A7a6c0fa9be9B7DbD65',
        ethPipeContract: '0xB346d832724f4991cEE31c0C43982DA24C6C5214'
    },
    {
        name: 'ETH',
        id: ethId,
        decimals: 8,
        ethTokenContract: '0x6110971432e2A27386F92A7a6c0fa9be9B7DbD65',
        ethPipeContract: '0xB346d832724f4991cEE31c0C43982DA24C6C5214'
    }
];
