import * as _ from 'lodash';
import * as ByteBuffer from "bytebuffer";

import {DevicePolicyEnum} from "./device-policy-enum";
import {CoinName} from "./coin-name";
import {CoinTypeConfiguration} from "./coin-type";
import {CoinType} from "./coin-type";

export interface DeviceCapabilities {
  firmwareImageAvailable: boolean;
  defaultMnemonicSeedLength: number;
  supportsCipheredKeyRecovery: boolean;
  supportsSecureAccountTransfer: boolean;
  hasPagedCoinTable: boolean;
  supportsRecoveryDryRun: boolean;
}

export interface BootloaderInfo {
  hash: string;
  upgradable: boolean;
  upgradeSkipable: boolean;
  tag: string;
}

export interface Policy {
  policy_name: string;
  enabled: boolean;
}

export interface IFeatureCoin {
  coin_name: string;
  coin_shortcut: string;
  address_type: number;
  maxfee_kb: string;
  address_type_p2sh: number;
  address_type_p2wpkh: number;
  address_type_p2wsh: number;
  signed_message_header: string;
  bip44_account_path: number;
  forkid: number;
  decimals: number;
  contract_address: ByteBuffer;
  gas_limit: ByteBuffer;
}

export interface DeviceProfile {
  identity: Object;
  capabilities: DeviceCapabilities;
}

export interface IFeatures {
  available_firmware_versions: Array<string>;
  bootloader_hash: ByteBuffer;
  bootloader_mode: any;
  coins: Array<IFeatureCoin>;
  device_id: string;
  initialized: boolean;
  label: string;
  language: string;
  major_version: number;
  minor_version: number;
  passphrase_cached: boolean;
  passphrase_protection: boolean;
  patch_version: number;
  pin_cached: boolean;
  pin_protection: boolean;
  policies: Array<Policy>;
  revision: string;
  vendor: string;
  coin_metadata: Array<CoinTypeConfiguration>;
  deviceCapabilities: DeviceCapabilities;
  bootloaderInfo: BootloaderInfo;
  model: string;
  version: string;
}

export interface ICoinTable {
  table: Array<IFeatureCoin>;
  num_coins: number;
  chunk_size: number;
}

export class Features {
  public get version(): string {
    return [
      this.data.major_version.toString(),
      this.data.minor_version.toString(),
      this.data.patch_version.toString()
    ].join('.');
  }

  public get initialized(): boolean {
    return this.data.initialized;
  }

  public get bootloaderMode(): boolean {
    return this.data.bootloader_mode;
  }

  public get supportsCipheredKeyRecovery(): boolean {
    return _.get(this.data, 'deviceCapabilities.supportsCipheredKeyRecovery');
  }

  public get defaultMnemonicSeedLength(): number {
    return _.get(this.data, 'deviceCapabilities.defaultMnemonicSeedLength');
  }

  public get usesShapeshiftResponseV2(): boolean {
    return _.get(this.data, 'deviceCapabilities.usesShapeshiftResponseV2');
  }

  public get raw(): IFeatures {
    return this.data;
  }

  constructor(private data: IFeatures) {};

  public supportsPolicy(policy: DevicePolicyEnum): boolean {
    return !!(this.findPolicy(policy));
  }

  public policyEnabled(policy: DevicePolicyEnum): boolean {
    return _.get(this.findPolicy(policy), 'enabled');
  }

  public supportsCoinType(coin: CoinName): boolean {
    var coinName: string = CoinName[coin];
    return !!(_.find(this.data.coin_metadata, {name: coinName}));
  }

  public getTokenList(): Array<IFeatureCoin> {
    return this.data.coins.filter((coin: IFeatureCoin) => !!coin.contract_address);
  }

  public get model(): string {
    return this.data.model;
  }

  private findPolicy(policy: DevicePolicyEnum) {
    return _.find(this.data.policies, {
      policy_name: DevicePolicyEnum[policy]
    });
  }
}
