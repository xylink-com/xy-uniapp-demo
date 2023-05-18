export type Method = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
/**
 * 返回结果
 *
 * @property { string } statusCode - 状态码
 * @property { any } data - 数据
 * @property { string } errMsg - 错误信息
 */
export interface IHttpResponse {
    statusCode?: number;
    data?: any;
    errMsg?: string;
}
/**
 * HttpClient 参数
 *
 * @property { ?string } baseUrl
 * @property { ?any } header
 * @property { ?number } timeout 最大请求时间
 */
export interface IHttpRequestOption {
    baseUrl?: string;
    header?: any;
    timeout?: number;
}
