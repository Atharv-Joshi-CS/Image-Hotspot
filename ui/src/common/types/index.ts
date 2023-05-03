import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

export interface TypePopupWindowDetails {
  url: string;
  title: string;
  w: number;
  h: number;
}

export interface TypeAppSdkConfigState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

export interface TypeSDKData {
  config: any;
  location: any;
  appSdkInitialized: boolean;
}

export interface TypeEntryData {
  title: string; // This is just example. You can remove this field or add any fields as per your requirement from the Entry data of CMS
}

export interface TypeHotspot {
  id: number;
  x : number,
  y : number,
  content : {
    title : string,
    description : string
  }
}

export interface TypeState {
  config: {};
  syncAsset: () => void;
  extension_uid: string;
  metadata: any[]; // Replace 'any' with the actual type of the metadata array
  assetMetadataExist: boolean;
  localMetadataUid: string;
  location: {};
  currentAsset: undefined | { [key: string]: any; };
  isConfiguredState: boolean;
  appSdkInitialized: boolean;
}