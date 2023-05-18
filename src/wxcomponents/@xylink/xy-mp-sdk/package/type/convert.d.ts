/**
 * CovertPDF 配置参数
 *
 * @property { string } pdfURL - PDF地址
 * @property { string } pdfMD5 - PDF MD5值
 * @property { number } compressLevel - 转图片时压缩比例，0-100，表示压缩等级百分比，传100就是不压缩，传1就是压缩为1%，默认是60
 * @property { string } enterpriseId  - 企业ID
 */
export interface CovertPDFConfig {
    pdfURL: string;
    pdfMD5: string;
    compressLevel: number;
    enterpriseId?: string;
}
/**
 * request请求 ConvertPDF body
 *
 * @property { string } enterpriseId - 企业ID
 * @property { string } fileUrl - PDF地址
 * @property { string } fileMd5 - PDF MD5值
 * @property { number } imageCompressQuality - 转图片时压缩比例，0-100，表示压缩等级百分比，传100就是不压缩，传1就是压缩为1%，默认是60
 */
export interface ConvertPDFBody {
    enterpriseId: string;
    fileUrl: string;
    fileMd5: string;
    imageCompressQuality?: number;
}
