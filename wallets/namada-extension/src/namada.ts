import { namadaExtensionInfo, NamadaExtensionWallet } from './extension';

const namadaExtension = new NamadaExtensionWallet(namadaExtensionInfo);

export const wallets = [namadaExtension];
