import { NetworkQualityLevel } from '../type/quality';
import { StatusInfo } from '../type/xyrtc';
/**
 * 判断数据类型
 */
export declare const TYPEOF: {
    isNumber(num: any): boolean;
    isObject(obj: any): boolean;
    isArray(arr: any): boolean;
    isString(str: any): boolean;
    isBoolean(str: any): boolean;
};
/**
 * 返回值统一状态信息
 *
 * @param { string | number } code
 * @param { any } data
 * @param { string } message
 * @returns StatusInfo
 */
export declare const getStatus: (code: string | number, data?: any, message?: string) => StatusInfo;
export declare const debounce: (fn: any, delay?: number, atleast?: number) => (...args: any[]) => void;
/**
 * 节流
 *
 * @param fn
 * @param wait
 * @returns
 */
export declare const throttle: (fn: any, wait: any) => (...args: any[]) => void;
export declare const filterEmoji: (val?: string) => string;
/**
 * 获取当前时间，年月日时分秒
 * Format：xx-xx-xx xx:xx:xx
 *
 * @returns { string } 当前时间
 */
export declare const currentTime: () => string;
export declare const compareVersion: (v1: any, v2: any) => 0 | 1 | -1;
/**
 * 获取当前时间
 *
 * Format：xx:xx:xx xx
 */
export declare const getMillTime: () => string;
/**
 * 将腾讯网络等级转为小鱼世界等级
 * 等级：1，2，3，4
 *
 * @param { number } level - 腾讯网络等级
 * @returns { NetworkQualityLevel } 小鱼世界网络等级
 */
export declare const getNetworkLevel: (level: any) => NetworkQualityLevel;
/**
 * 将关键信息转换成***
 *
 * @param data
 * @param key
 * @returns
 */
export declare const hideKeyInfo: (data: any, key: string | string[]) => any;
