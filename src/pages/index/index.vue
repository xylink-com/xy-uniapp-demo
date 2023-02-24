<template>
  <view class="container">
    <view class="meeting">
      <div v-for="item in layout">
        {{ item }}
      </div>
    </view>

    <view class="footer">
      <view class="btn" @click="login">登录</view>
      <view class="btn" @click="makeCall">呼叫</view>
      <view class="btn" @click="hangup">挂断</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import XYRTC from '@xylink/xy-mp-sdk';

const XYClient = ref<any>(null);
const layout = ref([]);
const isPushed = ref(false);
const muted = ref(false);
const pushUrl = ref('');

onMounted(() => {
  // 初始化组件时，创建XYClient实例，并配置企业ID和小鱼SDK应用ID
  XYClient.value = XYRTC.createClient({
    extId: '3a90719f80c1df2b37214ec1cb4728f9ce041b5e',
    appId: 'BJNNNNXNENNDT',
  });
  // 设置服务域名
  XYClient.value.setServer('pretbmp.xylink.com');

  console.log('XYClient: ', XYClient.value);

  // 调试用，放开SDK日志打印
  XYClient.value.setDebug(true, true);
  // 绑定监听事件
  onRoomEvent();
});

/**
 * 绑定SDK事件
 */
const onRoomEvent = () => {
  XYClient.value.on('roomEvent', async (e: any) => {
    console.log('demo roomEvent: ', e);
    const { type, detail } = e;

    switch (type) {
      case 'connected': {
        console.log('Demo get connected msg: ', detail);

        break;
      }

      case 'layout':
        console.log('[component] layout:', detail);

        layout.value = detail;

        break;
      case 'pushUrl':
        console.log('[component] pushUrl:', detail);
        const pusherUrl = detail;

        pushUrl.value = pusherUrl;
        await nextTick();

        XYClient.value.startLivePusher(
          () => {
            console.log('start pusher success');

            // 修复ios开启摄像头入会，关闭摄像头后，远端听不到声音问题
            isPushed.value = true;
          },
          (err: any) => {
            console.log('start pusher failed', err, 'warn');
          }
        );

        break;
      case 'audioStatus':
        console.log('[component] audioStatus:', detail);

        muted.value = detail;
        break;
      default: {
        console.log('detail: ', detail);
      }
    }
  });
};

/**
 * 登录
 */
const login = async () => {
  const res = await XYClient.value.loginExternalAccount({
    extUserId: `${Math.ceil(Math.random() * 100000)}_${Math.ceil(Math.random() * 1000)}_SDK`,
    displayName: 'mp888',
  });

  console.log('login res: ', res);

  // 状态是200时，初始化登录成功
  if (res.code === 'XYSDK:980200') {
    // 登录成功后，开始加入会议...
    XYClient.value.showToast('登录成功');
  } else {
    XYClient.value.showToast('登录失败，请检查');
  }
};

/**
 * 呼叫
 */
const makeCall = () => {
  XYClient.value.makeCall(
    {
      number: 915353622534,
      password: '',
      displayName: 'uniapp',
    },
    (res: any) => {
      console.log('makecall res: ', res);
    }
  );
};

/**
 * 挂断会议
 */
const hangup = () => {
  XYClient.value.hangup();
};
</script>

<style>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #1f1f25;
  color: #fff;
}

.footer {
  position: fixed;
  bottom: 0;
  height: 40px;
  width: 100vw;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.8);

  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 12px;
  z-index: 9;
}

.footer .btn {
  min-width: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
