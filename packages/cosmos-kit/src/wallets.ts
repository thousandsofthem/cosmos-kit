import { MainWalletBase } from '@cosmos-kit/core';
import { wallets as coin98Extension } from '@cosmos-kit/coin98-extension';
import { wallets as compassExtension } from '@cosmos-kit/compass-extension';
import { wallets as cosmostationExtension } from '@cosmos-kit/cosmostation-extension';
import { wallets as cosmostationMobile } from '@cosmos-kit/cosmostation-mobile';
import { wallets as exodusExtension } from '@cosmos-kit/exodus-extension';
import { wallets as frontierExtension } from '@cosmos-kit/frontier-extension';
import { wallets as keplrExtension } from '@cosmos-kit/keplr-extension';
import { wallets as keplrMobile } from '@cosmos-kit/keplr-mobile';
import { wallets as leapExtension } from '@cosmos-kit/leap-extension';
import { wallets as leapMobile } from '@cosmos-kit/leap-mobile';
import { wallets as ledgerUSB } from '@cosmos-kit/ledger';
import { wallets as omniMobile } from '@cosmos-kit/omni-mobile';
import { wallets as finExtension } from '@cosmos-kit/fin-extension';
import { wallets as stationExtension } from '@cosmos-kit/station-extension';
import { wallets as trustMobile } from '@cosmos-kit/trust-mobile';
import { wallets as shellExtension } from '@cosmos-kit/shell-extension'
import { wallets as vectisExtension } from '@cosmos-kit/vectis-extension';
import { wallets as xdefiExtension } from '@cosmos-kit/xdefi-extension';

export type WalletName =
  | 'keplr'
  | 'cosmostation'
  | 'ledger'
  | 'station'
  | 'leap'
  | 'exodus'
  | 'trust'
  | 'xdefi'
  | 'vectis'
  | 'frontier'
  | 'fin'
  | 'omni'
  | 'coin98'
  | 'shell'
  | 'compass';

export type WalletList<
  E extends MainWalletBase | null,
  M extends MainWalletBase | null
> = (E extends MainWalletBase
  ? M extends MainWalletBase
  ? [E, M]
  : [E]
  : M extends MainWalletBase
  ? [M]
  : []) & {
    mobile: M | null;
    extension: E | null;
  };

export function createWalletList<
  ExtensionWallet extends MainWalletBase | null,
  MobileWallet extends MainWalletBase | null
>(extension: ExtensionWallet | null, mobile: MobileWallet | null) {
  const list = [extension, mobile].filter((wallet) => Boolean(wallet)) as WalletList<ExtensionWallet, MobileWallet>;
  list.mobile = mobile;
  list.extension = extension;
  return list;
}

export const keplr = createWalletList(keplrExtension[0], keplrMobile[0]);
export const cosmostation = createWalletList(
  cosmostationExtension[0],
  cosmostationMobile[0]
);
export const ledger = ledgerUSB;
export const station = createWalletList(stationExtension[0], null);
export const leap = createWalletList(leapExtension[0], leapMobile[0]);
export const exodus = createWalletList(exodusExtension[0], null);
export const trust = createWalletList(null, trustMobile[0]);
export const xdefi = createWalletList(xdefiExtension[0], null);
export const vectis = createWalletList(vectisExtension[0], null);
export const frontier = createWalletList(frontierExtension[0], null);
export const fin = createWalletList(finExtension[0], null);
export const omni = createWalletList(null, omniMobile[0]);
export const shell = createWalletList(shellExtension[0], null);
export const coin98 = createWalletList(coin98Extension[0], null);
export const compass = createWalletList(compassExtension[0], null);

export type SubWalletList = MainWalletBase[] & {
  get mobile(): MainWalletBase[];
  get extension(): MainWalletBase[];
};

export type AllWalletList = SubWalletList & {
  keplr: typeof keplr;
  cosmostation: typeof cosmostation;
  ledger: typeof ledger;
  station: typeof station;
  leap: typeof leap;
  exodus: typeof exodus;
  trust: typeof trust;
  xdefi: typeof xdefi;
  vectis: typeof vectis;
  frontier: typeof frontier;
  fin: typeof fin;
  omni: typeof omni;
  coin98: typeof coin98;
  compass: typeof compass;
  for: (...names: WalletName[]) => SubWalletList;
  not: (...names: WalletName[]) => SubWalletList;
};

export function defineGetters(wallets: MainWalletBase[]) {
  return Object.defineProperties(wallets, {
    mobile: {
      get() {
        return this.filter(
          (wallet: MainWalletBase) =>
            wallet.walletInfo.mode === 'wallet-connect'
        );
      },
    },
    extension: {
      get() {
        return this.filter(
          (wallet: MainWalletBase) => wallet.walletInfo.mode === 'extension'
        );
      },
    },
  }) as SubWalletList;
}

export function createAllWalletList(ws: MainWalletBase[]) {
  const wallets = ws.slice() as AllWalletList;

  wallets.keplr = keplr;
  wallets.cosmostation = cosmostation;
  wallets.ledger = ledger;
  wallets.station = station;
  wallets.leap = leap;
  wallets.exodus = exodus;
  wallets.trust = trust;
  wallets.xdefi = xdefi;
  wallets.vectis = vectis;
  wallets.frontier = frontier;
  wallets.fin = fin;
  wallets.omni = omni;
  wallets.coin98 = coin98;
  wallets.compass = compass;

  defineGetters(wallets);

  wallets.for = function (...ns: WalletName[]) {
    const names = Array.from(new Set(ns));
    return defineGetters(
      wallets.filter((wallet: MainWalletBase) =>
        names.some((name: WalletName) => wallet.walletInfo.name.includes(name))
      )
    );
  };

  wallets.not = function (...ns: WalletName[]) {
    const names = Array.from(new Set(ns));
    return defineGetters(
      wallets.filter(
        (wallet: MainWalletBase) =>
          !names.some((name: WalletName) => wallet.walletInfo.name.includes(name))
      )
    );
  };

  return wallets;
}

export const wallets = createAllWalletList([
  ...keplr,
  ...cosmostation,
  ...ledger,
  ...station,
  ...leap,
  ...exodus,
  ...trust,
  ...xdefi,
  ...vectis,
  ...frontier,
  ...fin,
  ...omni,
  ...coin98,
  ...compass
]);