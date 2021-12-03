export interface SendParams {
    selectedCurrency: Currency,
    amount: number,
    address: string,
    fee: number,
    account: string
}

export interface Currency {
    id: number,
    rate_id: string,
    decimals: number,
    name: string,
    validator_dec: number,
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
        rate_id: 'tether',
        id: 1,
        decimals: 6,
        validator_dec: 6,
        ethTokenContract: '0xfdb6ba93e0b3A760bCD36140C20F96eE4A636f7B',
        ethPipeContract: '0x25E613875ea1143005411D8808faed9bEE94cD7B'
    },
    {
        name:'WBTC',
        rate_id: 'wrapped-bitcoin',
        id: 2,
        decimals: 8,
        validator_dec: 6,
        ethTokenContract: '0x9acDE598dd6e8D29eCCe8FbE58e3190Ab7302179',
        ethPipeContract: '0xB9b49dd981d01F4433c551100FFe64a6FcFd1049'
    },
    {
        name:'DAI',
        rate_id: 'dai',
        id: 3,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '0xB786c676A626D0abB616beF59056291fC84F4Bc4',
        ethPipeContract: '0xE4eCDDdF9fB032eEBa2f022a48ed41F5c96781bE'
    },
    {
        name: 'ETH',
        rate_id: 'ethereum',
        id: ethId,
        decimals: 18,
        validator_dec: 8,
        ethTokenContract: '',
        ethPipeContract: '0x0994E43993b04Fe60F10d03fa4F3BdDa2bbB6f00'
    }
];
