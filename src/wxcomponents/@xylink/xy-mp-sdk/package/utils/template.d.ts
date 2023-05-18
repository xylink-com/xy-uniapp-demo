export declare const localPosition: {
    mini: number[];
    max: number[];
    hide: number[];
};
export declare const fullPosition: number[];
/**
 * 竖屏 横向展示
 * [14, 0, 72, 100]
 *
 * 14: 居右
 * 0： 居上
 * 72: 宽度
 * 100: 高度
 */
export declare const TEMPLATE_VERTICAL: {
    '1-1': {
        position: number[];
        resolution: number;
    }[];
    '2-1': ({
        position: number[];
        resolution: number;
        type?: undefined;
    } | {
        position: number[];
        type: string;
        resolution: number;
    })[];
    '3-1': ({
        position: number[];
        resolution: number;
        type?: undefined;
    } | {
        position: number[];
        type: string;
        resolution?: undefined;
    })[];
    '4-1': ({
        position: number[];
        resolution: number;
        type?: undefined;
    } | {
        position: number[];
        type: string;
        resolution?: undefined;
    })[];
};
/**
 * 横屏 横向展示
 * left/top/width/height
 *
 */
export declare const TEMPLATE_HORIZONTAL: {
    '1-1': {
        position: number[];
        resolution: number;
    }[];
    '2-1': ({
        position: number[];
        resolution: number;
        type?: undefined;
    } | {
        position: number[];
        type: string;
        resolution: number;
    })[];
    '3-1': ({
        position: number[];
        resolution: number;
        type?: undefined;
    } | {
        position: number[];
        type: string;
        resolution?: undefined;
    })[];
    '4-1': ({
        position: number[];
        resolution: number;
        type?: undefined;
    } | {
        position: number[];
        type: string;
        resolution?: undefined;
    })[];
};
/**
 * Layout模版
 *
 * @param { boolean } isHorizontal 是否是横屏模式
 * @param { boolean } isContent 是否是content模式
 * @returns
 */
export declare const TEMPLATE: (isHorizontal?: boolean, isContent?: boolean) => {
    length: number;
    temp: {
        0: {
            position: number[];
            resolution: number;
        }[];
        1: {
            position: number[];
            resolution: number;
        }[];
        2: ({
            position: number[];
            resolution: number;
            type?: undefined;
        } | {
            position: number[];
            type: string;
            resolution: number;
        })[];
        3: ({
            position: number[];
            resolution: number;
            type?: undefined;
        } | {
            position: number[];
            type: string;
            resolution?: undefined;
        })[];
        4: ({
            position: number[];
            resolution: number;
            type?: undefined;
        } | {
            position: number[];
            type: string;
            resolution?: undefined;
        })[];
    };
};
export declare const initHidePosition: number[];
export declare const hidePosition: number[];
