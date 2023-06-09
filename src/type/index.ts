export type MPFunction = (...args: any[]) => any;

export interface LoginExternalAccountParams {
  extUserId: string;
  displayName: string;
}

export interface INewLayout {
  networkLevel?: number;
  audioImg?: string;
  avatar?: string;
  networkLevelImage?: string;
}
