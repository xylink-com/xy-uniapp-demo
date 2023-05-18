const DEVICE_TYPE_MAP: Record<string, string> = {
  webrtc: 'noicon',
  soft: 'noicon',
  hard: 'nemo',
  nemono: 'nemo',
  virtualnemo: 'nemo',
  nemo: 'nemo',
  tvbox: 'tvbox',
  h323: 'h323',
  bruce: 'bruce',
  desk: 'noicon',
  tel: 'tel',
  shtl: 'shtl',
  default: 'noicon',
};

/**
 * 获取终端默认头像
 *
 * @param {string} type
 * @param {string} theme 'default' | 'blue'
 * @returns
 */
export const getDeviceAvatar = (type = 'default') => {
  const prefix = '/static/images/device/';

  type = DEVICE_TYPE_MAP[type] || DEVICE_TYPE_MAP['default'];

  return `${prefix}${type}.png`;
};

/**
 * 分割会议号
 * 9: 3 3 3
 * 10: 3 3 4
 * 11: 3 4 4
 * 12: 4 4 4
 *
 * 非数字不分割
 *
 * @param {string} callNumber 会议号
 * @returns
 */
export const splitCallNumber = (callNumber = '') => {
  callNumber = (callNumber || '').replace(/\s*/g, '');

  if (!/^\d+$/.test(callNumber)) {
    return callNumber;
  }

  const len = callNumber.length;
  const callNumberArr = [];
  let splitNum = 3;

  if (len >= 11) {
    splitNum = 4;
  }

  if (len === 11) {
    for (let i = len / splitNum; i > 0; i--) {
      const end = splitNum * i;
      const start = Math.max(splitNum * (i - 1), 0);

      callNumberArr.unshift(callNumber.slice(start, end));
    }
    return callNumberArr.join(' ');
  }

  for (let i = 0; i < len / splitNum; i++) {
    const start = splitNum * i;
    let end = splitNum * (i + 1);

    if (len === 10) {
      if (end > len) break;
      if (len - end < splitNum) end = len;
    }

    callNumberArr.push(callNumber.slice(start, end));
  }

  return callNumberArr.join(' ');
};

export const getNetworkLevelImage = (networkLevel: number) => {
  return `/static/images/icon_signal_${networkLevel}.png`;
};
