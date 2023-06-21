<template>
  <view class="setting-container">
    <view class="setting-title">设置</view>
    <view class="version">版本：{{ versionText }}</view>
    <view class="setting-title">设置布局模式</view>
    <radio-group class="form-audio-group" @change="radioChange">
      <label class="form-audio" v-for="item in layoutModes" :key="item.value">
        <view>
          <radio :value="item.value" :checked="item.value === setting.layoutMode" />
        </view>
        <view>{{ item.name }}</view>
      </label>
    </radio-group>

    <view class="setting-title">设置登录方式</view>
    <radio-group class="form-audio-group" @change="loginChange">
      <label class="form-audio" v-for="item in loginModes" :key="item.value">
        <view>
          <radio :value="item.value" :checked="item.value === setting.loginMode" />
        </view>
        <view>{{ item.name }}</view>
      </label>
    </radio-group>

    <view class="setting-title">配置环境</view>
    <label>企业ID</label>
    <input class="form-input" id="number" :value="setting.extId" type="text" @input="bindFromExtIdInput" />

    <label>APPID</label>
    <input class="form-input" id="number" :value="setting.appId" type="text" @input="bindFromAppIdInput" />

    <label>服务器地址</label>
    <input class="form-input" id="number" :value="setting.server" type="text" @input="bindFromServerInput" />

    <button class="xy-primary-btn setting-btn" @click="update">确认修改</button>
    <button class="xy-primary-btn setting-btn" @click="reset">恢复默认值</button>
  </view>
</template>

<script setup lang="ts">
import { ref, shallowRef, reactive } from 'vue';
import XYRTC from '@/wxcomponents/@xylink/xy-mp-sdk';
import { onLoad } from '@dcloudio/uni-app';
import { DEFAULT_APPID, DEFAULT_SERVER, DEFAULT_EXTID } from '@/config';

const layoutModes = [
  {
    value: 'auto',
    name: '自动布局',
  },
  {
    value: 'custom',
    name: '自定义布局',
  },
];
const loginModes = [
  {
    value: 'sdk',
    name: 'SDK企业账号登录',
  },
  {
    value: 'token',
    name: 'Token登录',
  },
];

const XYClient = shallowRef<any>();
const versionText = ref('');
const setting = reactive<Record<string, string>>({
  server: DEFAULT_SERVER,
  appId: DEFAULT_APPID,
  extId: DEFAULT_EXTID,
  layoutMode: 'auto',
  loginMode: 'sdk',
});

onLoad(() => {
  XYClient.value = XYRTC.getClient();
  const { version, time } = XYRTC.version;
  versionText.value = `${version} - build on ${time}`;

  setting.server = uni.getStorageSync('XY_SERVER') || DEFAULT_SERVER;
  setting.extId = uni.getStorageSync('XY_EXTID') || DEFAULT_EXTID;
  setting.appId = uni.getStorageSync('XY_APPID') || DEFAULT_APPID;
  setting.layoutMode = uni.getStorageSync('XY_LAYOUT_MODE') || 'auto';
  setting.loginMode = uni.getStorageSync('XY_LOGIN_MODE') || 'sdk';
});

const bindFromServerInput = (e: Event) => {
  bindFromInput(e, 'server');
};

const bindFromExtIdInput = (e: Event) => {
  bindFromInput(e, 'extId');
};

const bindFromAppIdInput = (e: Event) => {
  bindFromInput(e, 'appId');
};

// 监听输入
const bindFromInput = (e: Event, key: string) => {
  const target = e.target as HTMLInputElement;
  const { value } = target;

  setting[key] = value;
};

// 更新服务域名、APPID、EXTID信息
const update = () => {
  if (!XYClient.value) return;

  if (!setting.server) {
    XYClient.value.showToast('请输入服务器地址');
    return;
  }

  XYClient.value.setServer(setting.server);
  XYClient.value.showToast('修改成功');

  // 存储下来，后续读取此配置
  uni.setStorageSync('XY_APPID', setting.appId);
  uni.setStorageSync('XY_EXTID', setting.extId);
  uni.setStorageSync('XY_SERVER', setting.server);
};

/**
 * 重新配置信息
 */
const reset = () => {
  setting['server'] = DEFAULT_SERVER;
  setting['appId'] = DEFAULT_APPID;
  setting['extId'] = DEFAULT_EXTID;
};

/**
 * 更新布局模式
 */
const radioChange = (e: any) => {
  const { value = 'auto' } = e.detail || {};

  setting['layoutMode'] = value;

  uni.setStorageSync('XY_LAYOUT_MODE', value);
};

/**
 * 更新登录模式
 */
const loginChange = (e: any) => {
  const { value = 'sdk' } = e.detail || {};

  setting['loginMode'] = value;

  uni.setStorageSync('XY_LOGIN_MODE', value);
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
