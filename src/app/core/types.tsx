export type Pallete = 'green' | 'ghost' | 'purple' | 'blue' | 'red' | 'white';

export type ButtonVariant = 'regular' | 'ghost' | 'block' | 'link' | 'icon';

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
