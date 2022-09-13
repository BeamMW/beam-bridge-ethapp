import { BridgeTransaction, Balance} from '@core/types';

interface Rate {
  usd: number
}

export interface FaucetStateType {
  bridgeTransactions: BridgeTransaction[];
  pk: string;
  balance: Balance[];
  //appParams: FaucetAppParams;
  popupsState: {
    account: boolean;
  };
  rate: {
    dai: Rate,
    ethereum: Rate,
    tether: Rate,
    'wrapped-bitcoin': Rate
  };
  //funds: FaucetFund[];
  isDonateInProgress: boolean;
  donatedBeam: number;
  donatedBeamX: number;
}
