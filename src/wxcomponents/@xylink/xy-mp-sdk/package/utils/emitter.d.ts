/**
 * Event Emitter
 *
 * @authors Luo-jinghui (luojinghui424@gmail.com)
 * @date  2019-10-17 19:14:39
 */
export default class Emitter {
    private events;
    constructor();
    on(key: string, listener: (...args: any[]) => void, total?: number): void;
    once(key: string, listener: any, total?: number): void;
    off(key: string): void;
    offAll(): void;
    emit(key: string, ...args: any[]): void;
}
