<template>
  <view class="container">
    <view class="title">示例SDK小程序</view>
    <view class="version">{{ version }}</view>
    <view @click="switchEnv" class="setting">设置</view>

    <!-- Token登录 -->
    <view class="form" v-if="loginMode === 'token'">
      <view class="form-group">
        <input
          class="form-input"
          id="token"
          :value="token"
          type="text"
          @input="bindFromTokenInput"
          placeholder="输入token"
        />
      </view>
      <view class="from-group">
        <button class="xy-primary-btn" type="button" @click="login">Token登录</button>
      </view>
    </view>

    <!-- SDK企业登录 -->
    <view class="form" v-if="loginMode === 'sdk'">
      <view class="form-group">
        <input
          class="form-input"
          id="extUserId"
          :value="externalLogin.extUserId"
          type="text"
          @input="bindFromExternalInput"
          placeholder="输入三方UserId"
        />
      </view>
      <view class="form-group">
        <input
          class="form-input"
          id="displayName"
          :value="externalLogin.displayName"
          type="text"
          @input="bindFromExternalInput"
          placeholder="输入三方用户名"
        />
      </view>
      <view class="from-group">
        <button class="xy-primary-btn" type="button" @click="login">SDK企业登录</button>
      </view>
    </view>

    <!-- 加入会议 -->
    <view class="form">
      <view class="form-group">
        <input
          class="form-input"
          id="number"
          :value="meeting.number"
          type="text"
          @input="bindFromInput"
          placeholder="会议号"
        />
      </view>
      <view class="form-group">
        <input
          class="form-input"
          id="password"
          :value="meeting.password"
          type="text"
          @input="bindFromInput"
          placeholder="入会密码"
        />
      </view>
      <view class="form-group">
        <input
          class="form-input"
          id="name"
          :value="meeting.name"
          type="text"
          @input="bindFromInput"
          placeholder="入会名称"
        />
      </view>
      <!-- 会议配置 -->
      <view class="form-group">
        <label class="form-checkbox">
          <checkbox-group @change="changeVideo">
            <checkbox value="1" :checked="videoMute" />
            入会时关闭摄像头
          </checkbox-group>
        </label>
        <label class="form-checkbox">
          <checkbox-group @change="changeAudio">
            <checkbox value="2" :checked="audioMute" />
            入会时静音
          </checkbox-group>
        </label>
      </view>
      <view class="form-group">
        <button class="xy-primary-btn" type="button" @click="onJoinMeeting">立即入会</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, shallowRef, reactive } from 'vue';
import XYRTC from '@xylink/xy-mp-sdk';
import { DEFAULT_APPID, DEFAULT_EXTID, DEFAULT_SERVER } from '@/config';
import { LoginExternalAccountParams } from '@/type';
import { onLoad, onShow } from '@dcloudio/uni-app';

const XYClient = shallowRef<any>();
const version = ref('');
const loginMode = ref('token');
const token = ref('');
const externalLogin = reactive<LoginExternalAccountParams>({ extUserId: '', displayName: '' });
const meeting = reactive<Record<string, string>>({ number: '', password: '', name: '' });
const videoMute = ref(false);
const audioMute = ref(false);

onLoad(() => {
  const { version: sdkVersion, time } = XYRTC.version;
  const versionText = `${sdkVersion} - build on ${time}`;
  version.value = versionText;

  initSDK();
});

// 设置页面配置项可能改动，重新回到首页，重新初始化SDK
onShow(() => {
  loginMode.value = uni.getStorageSync('XY_LOGIN_MODE') || 'sdk';

  initSDK();
});

/**
 * 初始化SDK
 */
const initSDK = async () => {
  const server = uni.getStorageSync('XY_SERVER') || DEFAULT_SERVER;
  const extId = uni.getStorageSync('XY_EXTID') || DEFAULT_EXTID;
  const appId = uni.getStorageSync('XY_APPID') || DEFAULT_APPID;

  //  [top, bottom, left , right]
  const offset = [40, 40, 0, 0];

  XYClient.value = XYRTC.createClient({
    extId,
    appId,
    container: {
      offset,
    },
  });

  // 可选执行，设置SDK服务域名，默认可不需要调用
  XYClient.value.setServer(server);

  // 调试用，放开SDK日志打印
  XYClient.value.setDebug(true, true);
};

/**
 * 登录
 */
const login = async () => {
  if (!XYClient.value) {
    return;
  }

  // SDK企业账号登录
  if (loginMode.value === 'sdk') {
    const response = await XYClient.value.loginExternalAccount(externalLogin);

    onGetCallNumber(response);
  } else if (loginMode.value === 'token') {
    // Token登录号
    // 此处第三方开发者需要自行与服务器交互，获取Token
    // 具体参见接口文档： https://openapi.xylink.com/common/meeting/doc/miniprogram_server?platform=miniprogram
    const response = await XYClient.value.login(token.value);

    onGetCallNumber(response);
  }
};

/**
 * 执行初始化登录回调函数
 */
const onGetCallNumber = (response: any) => {
  console.log('login response:', response);
  // 状态是200时，初始化登录成功
  if (response.code === 'XYSDK:980200' || response.code === 200) {
    const cn = response.data.callNumber;

    uni.setStorageSync('XY_CALL_NUMBER', cn);

    XYClient.value?.showToast('登录成功');
  } else {
    XYClient.value?.showToast('登录失败，请稍后重试');
  }
};

/**
 * 加入会议
 */
const onJoinMeeting = () => {
  // 没有callNumber，则需要进行login操作
  const callNumber = uni.getStorageSync('XY_CALL_NUMBER');

  // 如果本地没有callNumber字段，则认为没有登录操作。需要提示进行初始化登录
  if (!callNumber) {
    XYClient.value?.showToast('请先登录');
    return;
  }

  const { name, password, number } = meeting;

  if (!number) {
    XYClient.value?.showToast('会议号不能为空');
    return;
  }

  uni.navigateTo({
    url: `/pages/meeting/index?displayName=${name}&password=${password}&number=${number}&videoMute=${videoMute.value}&audioMute=${audioMute.value}`,
  });
};

/**
 * 切换环境
 */
const switchEnv = () => {
  uni.navigateTo({ url: '/pages/setting/index' });
};

/**
 * Token登录
 */
const bindFromTokenInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const { value } = target;

  token.value = value;
};

/**
 * SDK企业登录信息
 */
const bindFromExternalInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const { id, value } = target;

  externalLogin[id as keyof LoginExternalAccountParams] = value;
};

/**
 * 入会信息
 */
const bindFromInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const { id, value } = target;

  meeting[id] = value;
};

/**
 * 入会时是否开启摄像头
 */
const changeVideo = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const { value } = target;

  videoMute.value = !!value[0];
};

/**
 * 入会时是否开启麦克风
 */
const changeAudio = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const { value } = target;

  audioMute.value = !!value[0];
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
