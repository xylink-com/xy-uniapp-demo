<template>
  <view class="container">
    <!-- 正在呼叫ing -->
    <view v-if="loading" class="xy__call">
      <view class="xy__call-box">
        <image class="xy__call-image" :src="getDeviceAvatar()" />
        <view class="xy__call-name">呼叫中...</view>
        <view class="xy__call-end" @click="hangup">
          <view class="xy__call-wrap-img">
            <image src="/static/images/action_hangup.png" class="img" />
          </view>
        </view>
      </view>
    </view>

    <!-- 小鱼小程序SDK UI组件 -->
    <xylink-room
      :template="template"
      :beauty="6"
      :muted="audioMute"
      :camera="!videoMute"
      :devicePosition="devicePosition"
      id="xylink"
      @onRoomEvent="onRoomEvent"
    />

    <!-- 操作条 -->
    <view class="xy__operate-container" v-if="!loading && !onHold">
      <!-- 下部的操作条 -->
      <view class="xy__operate xy__operate-left">
        <view :class="['xy__operate-btn', videoMute ? 'xy__operate-btn-disabled' : '']" @click="switchCamera">
          <image class="icon" src="/static/images/icon_switch.png" />
          <view class="xy__operate-font">翻转</view>
        </view>

        <view class="xy__operate-btn" @click="operateAudio">
          <image class="icon" :src="localAudioImg" />
          <view class="xy__operate-font">
            {{ audioMute ? '取消静音' : '静音' }}
          </view>
        </view>

        <view class="xy__operate-btn" @click="operateVideo">
          <image class="icon" :src="localVideoImg" />
          <view class="xy__operate-font">
            {{ videoMute ? '开启视频' : '关闭视频' }}
          </view>
        </view>

        <view class="xy__operate-end" @click="hangup"> 挂断 </view>
      </view>

      <!-- 上部操作条 -->
      <view class="xy__operate xy__operate-right">
        <view class="xy__operate-signal">
          <image :src="signal" />
        </view>

        <view class="xy__operate-time"> {{ meetingTime }} </view>

        <view class="xy__operate-btn xy__operate-info">
          <view class="xy__operate-number">
            {{ meetingInfo.callNumber }}
          </view>
        </view>
      </view>
    </view>

    <!-- 等候室状态，不显示画面，没有等候室需求，可以不添加 -->
    <view v-if="onHold" class="xy__call">
      <view class="xy__call-box">
        <view class="xy__call-person-status">请稍等，主持人稍后邀请您入会</view>

        <view class="xy__call-person-title">会议主题</view>
        <view class="xy__call-person-conference">{{ meetingInfo.displayName }}</view>

        <view class="xy__call-end xy__call-hangup" @click="hangup"> 离开会议 </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import XYRTC from '@/wxcomponents/@xylink/xy-mp-sdk';
import { Event } from '@/utils';
import { getNetworkLevelImage, getDeviceAvatar } from '@/utils/meeting';
import { CUSTOM_TEMPLATE } from '@/utils/template';
import { useTime } from '@/utils/useTime';

const XYClient = ref<any>();
const loading = ref(true);
const videoMute = ref(false); // 本地摄像头是否关闭
const audioMute = ref(false); // 本地麦克风是否关闭
const onHold = ref(false); // 是否在等候室
const roster = ref<any>(); // 会中roster信息
const layout = ref<any[]>([]); // 布局对象
const meetingInfo = ref<any>({}); // 会议信息
const bulkRoster = ref<any[]>([]); // 会中所有终端信息
const callNumber = ref(''); // 会议号
const pageOption = ref<any>({}); // 页面URL参数
const connected = ref<boolean>(false); // 入会成功
const meetingTime = useTime(connected); // 会议时间
const layoutMode = ref('auto');
const template = ref({
  layout: layoutMode,
  detail: [
    {
      // 最终转换为x: 0vw, y: 0vh, width: 100vw, height: 85vh
      position: [0, 0, 100, 85],
      callNumber: callNumber.value,
      name: pageOption.value.displayName || '',
      quality: 'normal',
      isContent: false,
    },
  ],
});
const localNetworkLevel = ref(4);

const devicePosition = ref('front');
const localAudioImg = computed(() =>
  audioMute.value ? '/static/images/audio_mute.png' : '/static/images/audio_unmute.png'
);
const localVideoImg = computed(() =>
  videoMute.value ? '/static/images/video_mute.png' : '/static/images/video_unmute.png'
);
const signal = computed(() => getNetworkLevelImage(localNetworkLevel.value));

onLoad(async (option) => {
  const { displayName } = option || {};
  pageOption.value = option;

  XYClient.value = XYRTC.getClient();

  layoutMode.value = uni.getStorageSync('XY_LAYOUT_MODE') || 'auto';
  callNumber.value = uni.getStorageSync('XY_CALL_NUMBER');

  // 自定义布局，设置初始本地Local预览画面和启动推流
  if (layoutMode.value === 'custom') {
    // 初始页面加载时，获取本地Local数据，做首屏展示

    XYClient.value?.setLayoutMode(layoutMode.value).updateTemplate([
      {
        // 最终转换为x: 0vw, y: 0vh, width: 100vw, height: 85vh
        position: [0, 0, 100, 85],
        callNumber: callNumber.value,
        name: displayName,
        quality: 'normal',
        isContent: false,
      },
    ]);
  }
});

onMounted(async () => {
  const { number = '', password = '', displayName = '' } = pageOption.value;

  videoMute.value = pageOption.value?.videoMute === 'true';
  audioMute.value = pageOption.value?.audioMute === 'true';

  // 发起SDK呼叫，通过回调获取结果
  // 此处请参考API文档，新版本新增其他配置参数
  const response = await XYClient.value?.makeCall({
    number,
    password,
    displayName,
  });

  onGetCallStatus(response);
});

onBeforeUnmount(() => {
  XYClient.value?.hangup('');
});

const onRoomEvent = (event: any) => {
  const { type, detail } = event.detail;

  switch (type) {
    // 入会成功消息
    case 'connected':
      connectMeeting();
      break;
    // 退出会议消息
    case 'disconnected':
      disConnectMeeting(detail);
      break;
    // 会议信息，包含会议号、会议名称、邀请信息等
    case 'meetingInfo':
      meetingInfo.value = detail;
      break;
    // 被会控移入等候室，当前参会者无法接收到远端的声音和画面，本地画面和声音也无法发送
    case 'onHold':
      onHold.value = detail;
      break;
    // 参会者列表数据，当有人员变动或者状态变动，会实时推送最新的列表数据
    case 'roster':
      roster.value = detail;

      if (layoutMode.value === 'custom') {
        handleCustomLayout(detail);
      }

      break;
    // 自动布局/自定义布局上报布局结果，基于此数据渲染画面
    case 'layout':
      layout.value = detail;
      break;
    // 共享Content数据
    case 'content':
      break;
    // 推送实时麦克风状态，最新的麦克风状态请以此为准
    case 'audioStatus':
      audioMute.value = detail;
      break;
    // 会中所有终端信息
    case 'bulkRoster':
      bulkRoster.value = detail;
      break;
    case 'networkParameter':
      console.log('networkParameter::', detail);
      break;
    case 'networkLevel':
      localNetworkLevel.value = detail;
      break;
    default:
      break;
  }
};

/**
 * 呼叫事件回调，通知是否可以进行入会操作
 *
 * 此处有两处逻辑变动：
 * • makeCall方法传递参数发生变化，第一个参数改为了对象，内容不变，第二个参数设置回调函数；
 * • 回调函数中，判断呼叫成功并隐藏CallLoading的逻辑移动到监听事件“connected”中触发，调用组件的start方法移除：
 */
const onGetCallStatus = (response: any) => {
  console.log('call response: ', response);
  const { code, message } = response;

  // 最新的逻辑仅需要处理异常呼叫入会即可，其他逻辑不需要再处理
  if (code !== 200) {
    XYClient.value?.showToast(message, () => {
      // 退出呼叫页面
      uni.navigateBack({ delta: 1 });
    });
  }
};

/**
 * 入会成功
 */
const connectMeeting = () => {
  loading.value = false;
  connected.value = true;
};

/**
 * 退出会议界面
 */
const hangup = () => {
  uni.navigateBack({ delta: 1 });
};

/**
 * 退出会议消息
 */
const disConnectMeeting = (detail: any) => {
  const { message } = detail;
  loading.value = false;

  if (message) {
    // 存在message消息，则直接提示，默认3s后退会会议界面
    // 注意此处的message可以直接用做展示使用，不需要开发者再进行错误码的匹配
    XYClient.value?.showToast(message, () => {
      hangup();
    });
  } else {
    // 不存在message消息，直接退会
    hangup();
  }
};

/**
 * 切换摄像头
 */
const switchCamera = () => {
  XYClient.value?.switchCamera();
};

/**
 * 开启/关闭摄像头
 */
const operateVideo = () => {
  videoMute.value = !videoMute.value;
};

const operateAudio = () => {
  audioMute.value = !audioMute.value;
};

/**
 * 自定义布局，处理模板计算
 */
const handleCustomLayout = (detail: any) => {
  // 处理custom模式自定义布局
  const newDetails = [];
  // 获取roster数据
  const roster = detail.rosterV;

  // 最多显示9个画面(包括Local)
  if (roster.length > 8) roster.length = 8;

  const len = roster.length + 1;

  const selfDetailObj = {
    position: CUSTOM_TEMPLATE[len].self,
    callNumber: callNumber.value,
    name: pageOption.value?.displayName,
    quality: 'normal',
    isContent: false,
  };

  roster.forEach((item: any, index: any) => {
    newDetails.push({
      position: CUSTOM_TEMPLATE[len].other[index].position,
      callNumber: item.callNumber,
      name: item.displayName || '',
      quality: item.isContent ? 'hd' : 'normal',
      isContent: item.isContent,
    });
  });

  // 自己的数据补充到第一位
  newDetails.unshift(selfDetailObj);

  template.value = {
    ...template.value,
    detail: newDetails,
  };
};
</script>

<style scoped lang="scss">
@import './meeting.scss';
</style>
