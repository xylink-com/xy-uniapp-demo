/**
 * 设备类型
 */
type IDeviceType = 'webrtc' | 'soft' | 'hard' | 'nemono' | 'virtualnemo' | 'nemo' | 'tvbox' | 'h323' | 'record' | 'bruce' | 'tel' | 'pstngw' | 'desk';
/**
 * Roster：参会者的基本信息，包含基本信息，设备信息，画面信息等
 *
 * @property { IDeviceType } deviceType - 设备类型
 * @property { string } callNumber - 用户账号
 * @property { number } pid - 参会者id
 * @property { string } userId - 参会者callUri eg:123456@WECHAT
 * @property { string } callUri - 参会者callUri eg:123456@WECHAT
 * @property { string} displayName - 参会者名称
 * @property { boolean} audioTxMute - 参会者麦克风状态，true：关闭，false：开启
 * @property { boolean} videoTxMute - 参会者摄像头状态，true：关闭，false：开启
 * @property { number } videoMuteReason - 视频关闭原因
 * @property { boolean} isContent - 参会者画面类型，true：是共享内容画面，false：people画面
 * @property { boolean} isOnHold - 参会者是否是被呼叫等待状态
 * @property { boolean } isLocal - 参会者是否是自己
 * @property { number } feccOri - ignore
 * @property { number } level - roster排序级别
 */
export interface IRoster {
    deviceType: IDeviceType;
    callNumber: string;
    pid: number;
    userId: string;
    callUri: string;
    displayName: string;
    audioTxMute: boolean;
    videoTxMute: boolean;
    videoMuteReason: number;
    isContent?: boolean;
    isOnHold?: boolean;
    isLocal?: boolean;
    level?: number;
    feccOri?: number;
}
/**
 * roster相关信息
 *
 * @property { IRoster[] } rosterV - roster信息，最多20条
 * @property { number } contentSenderPid - 共享内容pid
 * @property { number } participantsNum - 参会者人数
 * @property { number } confNumber - 会议号
 */
export interface RosterObj {
    rosterV: IRoster[];
    contentSenderPid: number;
    participantsNum: number;
    confNumber: number;
}
/**
 * 参会者信息
 *
 * @property { 0 | 1 } bulkRosterType 全量roster类型，0表示全量数据，1表示增量数据
 * @property { IRoster[] } addRosterInfo  新增的roster信息  当bulkRosterType是0的时候，此参数表示全量数据
 * @property { IRoster[] } changeRosterInfo 变化的roster信息
 * @property { number[] } deleteRosterInfo 被删除的roster pid信息
 */
export interface IBulkRoster {
    bulkRosterType: 0 | 1;
    addRosterInfo: IRoster[];
    changeRosterInfo: IRoster[];
    deleteRosterInfo: number[];
}
/**
 * 远端画面播放状态
 *
 * @param START start - 可以播放
 * @param PULL pull - 请求中
 * @param PAUSE pause - 暂停
 */
export declare enum PlayStatus {
    NONE = "",
    START = "start",
    PULL = "pull",
    PAUSE = "pause"
}
/**
 * 布局对象
 *
 * @property { string } id - LayoutID =  callUr + (isContent? 1:0)
 * @property { boolean } isPusher - 是否是本地画面
 * @property { IRoster } roster - 参会者基本信息、状态信息，例如：用户名、麦克风/摄像头状态等信息
 * @property { string } playUrl - 远端参会者的画面拉流地址
 * @property { PlayStatus } status - 远端参会者的画面播放状态
 * @property { number[] } position - 参会者的位置信息
 * @property { string } style - 参会者的位置样式
 * @property { number } resolution - 参会者分辨率
 * @property { string } avatar - 参会者头像 v3.9.0+支持
 */
export interface LayoutInfo {
    id: string;
    isPusher: boolean;
    roster: Partial<IRoster>;
    position: number[];
    style: string;
    playUrl?: string;
    status?: PlayStatus;
    resolution?: number;
    quality?: string;
    avatar?: string;
    pullStatus?: PlayStatus;
    seat?: number;
    deal?: boolean;
    isRender?: boolean;
}
/**
 * 媒体下发 小鱼向wx请流 的信息
 */
export interface StreamRequestInfo {
    streams: {
        userId: string;
        deviceType: string;
        pid: string;
        priority: string;
        bandwidth: number;
        decCaps: DecCapsInfo;
        delete: boolean;
    }[];
}
export interface DecCapsInfo {
    resolution: string;
    framerate: number;
    payloadType: string;
}
export interface AdjustAssignmentInfo {
    [key: number]: {
        detail: {
            message: string;
        };
    };
}
export {};
