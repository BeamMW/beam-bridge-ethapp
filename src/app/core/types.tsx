export type Pallete = 'green' | 'ghost' | 'purple' | 'blue' | 'red' | 'white' | 'disconnect';

export type ButtonVariant = 'regular' | 'ghost' | 'block' | 'link' | 'icon' | 'validate' | 'darkest_blue' | 'revoke';

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
    rate_id: string,
    icon: string,
    is_approved: boolean
}

export interface State {
    likes: number,
    dislikes: number
}

export type AccountState = 'not voted' | 'likes' | 'dislikes';
