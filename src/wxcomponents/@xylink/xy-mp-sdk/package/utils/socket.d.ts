/**
 * 小鱼易连-小程序sdk wss  modules
 *
 */
import Log from '../core/logger';
import Emitter from './emitter';
interface IOptions {
    params?: Record<string, any>;
    url?: string;
    pingData?: string;
    pangData?: string;
    autoReConnect?: boolean;
    openHeatBeat?: boolean;
    retryCount?: number;
    heatBeatFrequency?: number;
    pangEndTime?: number;
    reconnectOffset?: number;
}
declare class Socket extends Emitter {
    private logger;
    private options;
    private socket;
    private wsState;
    private retryWS;
    private isClose;
    private receiveEventMessage;
    private heartbeat;
    private retryHeartbeat;
    private pangTimer;
    private eventTimer;
    constructor(options: IOptions, logger: Log);
    setParams(obj: any): void;
    connect(): void;
    addEvent(): void;
    /**
     *  ws监听open事件
     *
     * @param {*} e
     */
    onOpenSocket(e: any): void;
    /**
     *  ws监听message事件
     *
     * @param {*} e
     */
    onHandleMessage(res: any): void;
    /**
     *  ws监听error事件
     *
     * @param {*} e
     */
    onErrorSocket(res: any): void;
    /**
     * ws监听close事件
     *
     * @param {*} res
     * @returns
     */
    onCloseSocket(res: any): void;
    /**
     *  ws重连
     */
    timeoutRetryWS(): void;
    /**
     * 每11s发送一个ws心跳
     */
    sendWSHeartbeat(): void;
    /**
     * 发送ping，等待接受ws消息
     */
    sendWsPING(): void;
    /**
     * 创建倒计时，响应是否接收到pang消息
     */
    createTimeout(): void;
    /**
     * ws发送消息
     *
     * @param { * } data - WSS数据
     * @returns
     */
    send(data?: string | Record<string, any>): void;
    /**
     * close ws
     *
     * @param {*} closeSocketParams
     */
    close(closeSocketParams?: any): void;
    clearHeartbeat(): void;
    clearPangTimer(): void;
    clearRetryHeartbeat(): void;
    clearEventTimer(): void;
}
export default Socket;
