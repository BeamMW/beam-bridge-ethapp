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
    name: string
}

export const ethId = 4;

export const currencies : Currency[] = [
    {name: "USDT", id: 1, decimals: 8},
    {name:'WBTC', id: 2, decimals: 8},
    {name:'DAI', id: 3, decimals: 8},
    {name: 'ETH', id: ethId, decimals: 18}
];
