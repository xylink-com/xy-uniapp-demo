import { ILayout } from '@xylink/xy-mp-sdk/package/type';

export type MPFunction = (...args: any[]) => any;

export interface LoginExternalAccountParams {
  extUserId: string;
  displayName: string;
}

export interface INewLayout extends ILayout {
  networkLevel?: number;
  audioImg?: string;
  avatar?: string;
  networkLevelIcon?: string;
}
