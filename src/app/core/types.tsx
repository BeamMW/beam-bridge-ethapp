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
        ethTokenContract: '0xfdb6ba93e0b3A760bCD36140C20F96eE4A636f7B',
        ethPipeContract: '0x25E613875ea1143005411D8808faed9bEE94cD7B'
    },
    {
        name:'WBTC',
        id: 2,
        decimals: 8,
        ethTokenContract: '0x9acDE598dd6e8D29eCCe8FbE58e3190Ab7302179',
        ethPipeContract: '0xB9b49dd981d01F4433c551100FFe64a6FcFd1049'
    },
    {
        name:'DAI',
        id: 3,
        decimals: 18,
        ethTokenContract: '0xB786c676A626D0abB616beF59056291fC84F4Bc4',
        ethPipeContract: '0xE4eCDDdF9fB032eEBa2f022a48ed41F5c96781bE'
    },
    {
        name: 'ETH',
        id: ethId,
        decimals: 18,
        ethTokenContract: '',
        ethPipeContract: '0x0994E43993b04Fe60F10d03fa4F3BdDa2bbB6f00'
    }
];
