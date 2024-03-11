import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { StdSignature, StdSignDoc } from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  BroadcastMode,
  ChainRecord,
  ExtendedHttpEndpoint,
  SignType,
  SuggestToken,
} from '@cosmos-kit/core';
import { DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';

import { Namada } from './types';
import Long from 'long';

interface NamadaWindow {
  namada?: Namada;
}

export class NamadaClient implements WalletClient {
  readonly client: Namada;
  private _defaultSignOptions: SignOptions = {
    preferNoSetFee: false,
    preferNoSetMemo: true,
    disableBalanceCheck: true,
  };

  get defaultSignOptions() {
    return this._defaultSignOptions;
  }

  setDefaultSignOptions(options: SignOptions) {
    this._defaultSignOptions = options;
  }

  constructor(client: Namada) {
    console.log("client.js - client constructor v3", client);

    this.client = client;
    // DEBUG!
    (window as any).namada_client = client;
    (window as any).namada_this = this;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async suggestToken({ chainId, tokens, type }: SuggestToken) {
    if (type === 'cw20') {
      for (const { contractAddress } of tokens) {
        await this.client.suggestCW20Token(chainId, contractAddress);
      }
    }
  }

  async addChain(chainInfo: ChainRecord) {
    console.log("client.js - addChain6", chainInfo, this.client)

    await this.client.connect();
    // return this.client.getChain("");
    const suggestChain = chainRegistryChainToKeplr(
      chainInfo.chain,
      chainInfo.assetList ? [chainInfo.assetList] : []
    );

    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      (suggestChain.rest as string | ExtendedHttpEndpoint) =
        chainInfo.preferredEndpoints?.rest?.[0];
    }

    // if (chainInfo.preferredEndpoints?.rpc?.[0]) {
    //   (suggestChain.rpc as string | ExtendedHttpEndpoint) =
    //     chainInfo.preferredEndpoints?.rpc?.[0];
    // }

    // await this.client.experimentalSuggestChain(suggestChain);
  }

  async disconnect() {
    console.log("client.js - disconnect v3", this.client);

    // await this.client.disconnect();
  }

  async experimentalSuggestChain(foo: any) {
    console.log("client.js - experimentalSuggestChain", foo);

  }

  async getSimpleAccount(chainId: string) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username,
    };
  }

  async getAccount(chainId: string) {
    const c = await this.client.getChain(chainId);
    const algo: Algo = "secp256k1";
    // const pubkey: Uint8Array = [];
    var enc = new TextEncoder();
    const pubkey =  enc.encode(c.currency.address) //new Uint8Array([]);
    return {
      username: c.alias,
      address: c.currency.address,
      // algo: key.algo as Algo,
      algo: algo,
      // pubkey: c.currency.address,
      pubkey: pubkey,
      isNanoLedger: false,
      isSmartContract: false
    };
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    switch (preferredSignType) {
      case 'amino':
        return this.getOfflineSignerAmino(chainId);
      case 'direct':
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
    // return this.client.getOfflineSignerAuto(chainId);
  }

  getOfflineSignerAmino(chainId: string) {
    return this.client.getSigner();
  }

  getOfflineSignerDirect(chainId: string) {
    return this.client.getSigner() as OfflineDirectSigner;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signAmino(
      chainId,
      signer,
      signDoc,
      signOptions || this.defaultSignOptions
    );
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    return await this.client.signArbitrary(chainId, signer, data);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signDirect(
      chainId,
      signer,
      {
        ...signDoc,
        accountNumber: Long.fromString(signDoc.accountNumber.toString()),
      },
      signOptions || this.defaultSignOptions
    );
  }

  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
}
