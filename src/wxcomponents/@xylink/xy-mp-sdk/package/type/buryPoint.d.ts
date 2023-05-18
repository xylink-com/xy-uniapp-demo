interface IEvents {
    length: number;
}
/**
 * 设备上报时间描述
 *
 * @property { string } defaultPriority - 默认时间基本
 * @property { IEvents } events
 * @property { number } timestamp - 时间
 */
export interface IEventDescription {
    defaultPriority: string;
    events: IEvents;
    timestamp: number;
}
export {};
