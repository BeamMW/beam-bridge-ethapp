import { BridgeTransaction, Balance} from '@core/types';

interface Rate {
  usd: number
}

export interface AppStateType {
  bridgeTransactions: BridgeTransaction[];
  isLoggedIn: boolean;
  balance: Balance[];
  //appParams: FaucetAppParams;
  popupsState: {
    account: boolean;
    install: boolean;
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
