import { LayoutInfo } from '@xylink/xy-mp-sdk/package/type';

export type MPFunction = (...args: any[]) => any;

export interface LoginExternalAccountParams {
  extUserId: string;
  displayName: string;
}

export interface NewLayout extends LayoutInfo {
  networkLevel?: number;
  audioImg?: string;
  avatar?: string;
  networkLevelImage?: string;
}