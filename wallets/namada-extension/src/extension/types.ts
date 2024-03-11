import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignature,
  StdSignDoc,
} from '@cosmjs/amino';
import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { DirectSignResponse } from '@cosmjs/proto-signing';
import { BroadcastMode } from '@cosmos-kit/core';
import type { ChainInfo } from '@keplr-wallet/types';

// {
//   "alias": "Namada Shielded Expedition",
//   "bech32Prefix": "tnam",
//   "bip44": {
//       "coinType": 877
//   },
//   "bridgeType": [
//       "ibc",
//       "ethereum-bridge"
//   ],
//   "chainId": "shielded-expedition.88f17d1d14",
//   "currency": {
//       "address": "tnam1qxvg64psvhwumv3mwrrjfcz0h3t3274hwggyzcee",
//       "gasPriceStep": {
//           "average": 0.025,
//           "high": 0.03,
//           "low": 0.01
//       },
//       "symbol": "NAM",
//       "token": "Nam"
//   },
//   "extension": {
//       "alias": "Namada",
//       "id": "namada",
//       "url": "https://namada.me"
//   },
//   "ibc": {
//       "portId": "transfer"
//   },
//   "id": "namada",
//   "rpc": "https://proxy.heliax.click/shielded-expedition.88f17d1d14/"
// }
export interface NamadaChainInfo {
  readonly id: string;
  readonly alias: string;
  readonly bech32Prefix: string;
  readonly chainId: string;
  readonly currency: ChainCurrency;
  readonly extension: ChainExt;
}

export interface ChainCurrency {
  readonly address: string;
  readonly symbol: string;
  readonly token: string;
}
export interface ChainExt {
  readonly alias: string;
  readonly id: string;
  readonly url: string;
}


export interface NamadaSignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export interface Namada {
  defaultOptions: {
    sign?: NamadaSignOptions;
  };
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  enable(chainIds: string | string[]): Promise<void>;
  suggestToken(chainId: string, contractAddress: string): Promise<void>;
  suggestCW20Token(chainId: string, contractAddress: string): Promise<void>;
  mode: 'extension';
  getChain(chainId: string): Promise<NamadaChainInfo>;
  getSigner(): OfflineAminoSigner & OfflineDirectSigner;
  getOfflineSigner(chainId: string): OfflineAminoSigner & OfflineDirectSigner;
  getOfflineSignerOnlyAmino(chainId: string): OfflineAminoSigner;
  getOfflineSignerAuto(chainId: string): Promise<OfflineSigner>;
  signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: NamadaSignOptions
  ): Promise<AminoSignResponse>;
  signDirect(
    chainId: string,
    signer: string,
    signDoc: {
      /** SignDoc bodyBytes */
      bodyBytes?: Uint8Array | null;
      /** SignDoc authInfoBytes */
      authInfoBytes?: Uint8Array | null;
      /** SignDoc chainId */
      chainId?: string | null;
      /** SignDoc accountNumber */
      accountNumber?: Long | null;
    },
    signOptions?: NamadaSignOptions
  ): Promise<DirectSignResponse>;
  signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature>;
  getEnigmaPubKey(chainId: string): Promise<Uint8Array>;
  getEnigmaTxEncryptionKey(
    chainId: string,
    nonce: Uint8Array
  ): Promise<Uint8Array>;
  enigmaEncrypt(
    chainId: string,
    contractCodeHash: string,
    msg: object
  ): Promise<Uint8Array>;
  enigmaDecrypt(
    chainId: string,
    ciphertext: Uint8Array,
    nonce: Uint8Array
  ): Promise<Uint8Array>;
  sendTx(
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
  ): Promise<Uint8Array>;
  experimentalSuggestChain(chainInfo: ChainInfo): Promise<void>;
}
