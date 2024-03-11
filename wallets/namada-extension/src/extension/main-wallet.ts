import { Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';

import { ChainNamadaExtension } from './chain-wallet';
import { NamadaClient } from './client';
import { getNamadaFromExtension } from './utils';

export class NamadaExtensionWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainNamadaExtension);
    console.log("main-wallet.ts - constructor v3", walletInfo);

  }

  async initClient() {
    console.log("main-wallet.ts - initClient", 1);

    this.initingClient();
    try {
      const namada = await getNamadaFromExtension();
      console.log("main-wallet.ts - initClient.namada", namada);

      this.initClientDone(namada ? new NamadaClient(namada) : undefined);
    } catch (error) {
      console.log("main-wallet.ts - initClient.error", error);

      this.initClientError(error);
    }
  }
}
