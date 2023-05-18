/**
 * 网络质量信息信息
 *
 * @property {number}  videoGOP 当前视频 GOP,也就是每两个关键帧(I帧)间隔时长，单位 s
 * @property {number}  videoFPS 当前视频帧率
 * @property {number}  netJitter 网络抖动情况，为 0 时表示没有任何抖动，值越大表明网络抖动越大，网络越不稳定
 * @property {number}  avRecvInterval 音画同步错位时间（网络），单位 ms，此数值越小，音画同步越好
 * @property {number}  videoBitrate 当前视频编/码器输出的比特率，单位 kbps
 * @property {number}  audioBitrate 当前音频编/码器输出的比特率，单位 kbps
 * @property {number}  videoHeight 视频画面的高度
 * @property {number}  videoWidth 视频画面的宽度
 * @property {number}  netSpeed 当前的发送/接收速度
 * @property {number}  netQualityLevel 网络质量：0：未定义 1：最好 2：好 3：一般 4：差 5：很差 6：不可用
 * @property {number}  videoCache 缓冲的视频总时长，单位毫秒
 * @property {number}  audioCache 缓冲的音频总时长，单位毫秒
 * @property {number}  vSumCacheSize 缓冲的总视频帧数，该数值越大，播放延迟越高
 * @property {number}  audioCacheThreshold 音频缓冲时长阈值，缓冲超过该阈值后，播放器会开始调控延时
 * @property {number}  vDecCacheSize 解码器中缓存的视频帧数 (Android 端硬解码时存在）
 * @property {NetworkQualityLevel}  netWorkLevel 小鱼网络质量等级
 */
export interface NetworkInfoItem {
    videoGOP: number;
    videoFPS: number;
    netJitter: number;
    avRecvInterval: number;
    videoBitrate: number;
    audioBitrate: number;
    videoHeight: number;
    videoWidth: number;
    netSpeed: number;
    netQualityLevel: number;
    videoCache: number;
    audioCache: number;
    vSumCacheSize: number;
    audioCacheThreshold: number;
    vDecCacheSize: number;
    netWorkLevel?: NetworkQualityLevel;
}
/**
 * 网络质量信息
 *
 * @property {NetworkInfoItem} info 网络质量详细信息
 * @property {string} userId 终端ID
 * @property {number} volume 音量
 * @property {number} pid 终端ID
 */
export type NetworkInfo = Record<string, {
    info: NetworkInfoItem;
    userId: string;
    volume: number;
    displayName: string;
    pid?: number;
}>;
/**
 * 会议质量上报 基础数据
 *
 * @property { string } callNumber 会议号callUri
 * @property { string } deviceId
 * @property { string } meetingId 会议ID
 * @property { string } osVersion 终端系统版本； 目前上报的是navigator.userAgent
 * @property { string } sockProto 终端接入协议方式 udpProto
 * @property { string } swVersion 终端软件版本
 * @property { string } cdrVersion 统计版本号 目前传的是10
 * @property { string } deviceType 设备类型 17
 *
 */
export interface IMeetingQualityData {
    callNumber: string;
    deviceId: string;
    meetingId: string;
    osVersion: string;
    sockProto: string;
    swVersion: string;
    cdrVersion: number;
    deviceType: number;
}
/**
 * 网络质量信号等级
 *
 * @param Bad 1 - 非常差, loss > 30 || rtt >500 || 心跳连续3次以上超时
 * @param Poor 2 - 差, 20 < loss < 30 || 300 < rtt < 500 || 心跳连续3次以上超时
 * @param Good 3 - 一般, 10 < loss < 20 || 100 < rtt < 300 || 心跳连续2次以上超时
 * @param Excellent 4 - 很好, loss < 10 || rtt < 100
 */
export declare enum NetworkQualityLevel {
    Bad = 1,
    Poor = 2,
    Good = 3,
    Excellent = 4
}
