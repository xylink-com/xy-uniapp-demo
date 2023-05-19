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

    <!-- layout -->
    <view v-if="!loading" :hidden="onHold" class="xy__layout-container">
      <view class="xy__click-content" id="container">
        <view v-for="item in newLayout" :key="item.id">
          <!-- 本地端画面 -->
          <view
            v-if="item.isPusher"
            class="video video-1"
            :style="item.style"
            @click.stop="onFullScreenContent(item, $event)"
          >
            <live-pusher
              v-if="pushUrl"
              id="pusher"
              class="video-player"
              :enable-camera="!videoMute && isPushed"
              :muted="audioMute"
              :url="pushUrl"
              :enable-ans="true"
              :enable-agc="true"
              @statechange="onPusherStateChange"
              @netstatus="onPusherNetStatus"
              @error="onPusherError"
              @audiovolumenotify="onPusherAudioVolumeNotify"
            >
            </live-pusher>

            <view class="video-status">
              <image class="video-mute-icon" :src="localAudioImg" />
              <image class="video-signal" :src="signal" />
              <view class="video-member">{{ item.roster.displayName }}</view>
            </view>

            <view class="video-bg" v-if="!(pushUrl && isPushed) && !videoMute">
              <view class="video-pause-box">
                <view> 获取推流中... </view>
              </view>
            </view>

            <view class="video-bg" v-if="pushUrl && videoMute">
              <view class="video-pause-box">
                <image :class="item.seat === 0 ? 'big-avatar' : 'video-avatar'" :src="item.avatar"></image>
              </view>
            </view>
          </view>

          <!-- 远端所有画面 -->
          <view v-else class="video" :style="item.style" @click.stop="onFullScreenContent(item, $event)">
            <live-player
              v-if="item.playUrl"
              :id="item.id"
              class="video-player"
              mode="RTC"
              :src="item.playUrl"
              :autoplay="true"
              :auto-pause-if-open-native="false"
              :auto-pause-if-navigate="false"
              :data-item="item"
              @netstatus="onPlayNetStatus"
              @statechange="onPlayStateChange"
              @audiovolumenotify="onPlayAudioVolumeNotify"
            >
            </live-player>

            <view class="video-status">
              <image class="video-mute-icon" v-if="!item.roster.isContent" :src="item.audioImg" />
              <image class="video-signal" :src="item.networkLevelImage" />
              <view class="video-member">
                {{ item.roster.displayName }}
              </view>
            </view>

            <view
              class="video-bg"
              v-if="
                (item.roster.isContent && item.roster.videoTxMute) ||
                item.roster.deviceType === 'pstngw' ||
                item.roster.deviceType === 'tel'
              "
            >
              <view class="video-pause-box">
                <view class="video-name">
                  {{ item.roster.displayName }}
                </view>
                <view> 语音通话中 </view>
              </view>
            </view>
            <!--正常播放情况-->
            <view
              v-else-if="item.playUrl && !item.roster.videoTxMute && item.status === 'start'"
              class="video-cover-view"
            >
            </view>

            <view v-else-if="item.roster.videoTxMute" class="video-bg">
              <view class="video-pause-box">
                <image :class="item.seat === 0 ? 'big-avatar' : 'video-avatar'" :src="item.avatar"></image>
              </view>
            </view>

            <view v-else class="video-bg">
              <view class="video-pause-box"> {{ item.roster.isContent ? '共享内容请求中...' : '视频请求中...' }} </view>
            </view>

            <canvas v-if="item.roster.isContent" type="2d" id="contentCanvas" class="canvas"></canvas>
          </view>
        </view>
      </view>
    </view>

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
import XYRTC from '@xylink/xy-mp-sdk';
import { IBulkRoster, ILayout, MeetingInfo, IRosterObj } from '@xylink/xy-mp-sdk/package/type';
import { Event } from '@/utils';
import { getNetworkLevelImage, getDeviceAvatar } from '@/utils/meeting';
import { CUSTOM_TEMPLATE } from '@/utils/template';
import { useTime } from '@/utils/useTime';
import { INewLayout } from '@/type';

const XYClient = ref<XYRTC>();
const loading = ref(true);
const pushUrl = ref(''); // 推流地址
const isPushed = ref(false); // 是否已完成推流
const videoMute = ref(false); // 本地摄像头是否关闭
const audioMute = ref(false); // 本地麦克风是否关闭
const localNetworkLevel = ref(4); // 本地网络信号等级
const remoteNetworkLevel = ref<Record<string, number>>({}); // 远端网络信号等级
const onHold = ref(false); // 是否在等候室
const isShowDetected = ref(false);
const roster = ref<IRosterObj>(); // 会中roster信息
const layout = ref<ILayout[]>([]); // 布局对象
const meetingInfo = ref<MeetingInfo>({}); // 会议信息
const bulkRoster = ref<IBulkRoster[]>([]); // 会中所有终端信息
const callNumber = ref(''); // 会议号
const pageOption = ref<any>({}); // 页面URL参数
const connected = ref<boolean>(false); // 入会成功
const meetingTime = useTime(connected); // 会议时间

const localAudioImg = computed(() =>
  audioMute.value ? '/static/images/audio_mute.png' : '/static/images/audio_unmute.png'
);
const localVideoImg = computed(() =>
  videoMute.value ? '/static/images/video_mute.png' : '/static/images/video_unmute.png'
);
const signal = computed(() => getNetworkLevelImage(localNetworkLevel.value));
const newLayout = computed(() => {
  const temp: INewLayout[] = layout.value.map((item: ILayout) => {
    const audioImg = item.roster.audioTxMute ? '/static/images/audio_mute.png' : '/static/images/audio_unmute.png';
    const defaultAvatar = getDeviceAvatar(item.roster.deviceType);
    const avatar = item.avatar || defaultAvatar;

    const networkLevel = remoteNetworkLevel.value[item.roster.callUri || ''] || 4;
    const networkLevelImage = getNetworkLevelImage(networkLevel);

    return {
      ...item,
      audioImg,
      avatar,
      networkLevel,
      networkLevelImage,
    };
  });

  return temp;
});

onLoad(async (option) => {
  const { displayName } = option || {};
  pageOption.value = option;

  XYClient.value = XYRTC.getClient();

  const layoutMode = uni.getStorageSync('XY_LAYOUT_MODE') || 'auto';
  callNumber.value = uni.getStorageSync('XY_CALL_NUMBER');

  // 自定义布局，设置初始本地Local预览画面和启动推流
  if (layoutMode === 'custom') {
    // 初始页面加载时，获取本地Local数据，做首屏展示

    XYClient.value?.setLayoutMode(layoutMode).updateTemplate([
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
  initSDK();

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
  hangup();
});

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
 * 初始化SDK
 */
const initSDK = () => {
  if (!XYClient.value) return;

  XYClient.value.on('roomEvent', (e: { type: string; detail: any }) => {
    const { type, detail } = e;

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
      // 获取到推流地址事件
      case 'pushUrl':
        pushUrl.value = detail;

        // 切记，需要等待推流地址设置完成后，再启动本地推流
        XYClient.value?.startLivePusher(
          () => {
            isPushed.value = true;
          },
          (err: any) => {}
        );

        break;
      // 参会者列表数据，当有人员变动或者状态变动，会实时推送最新的列表数据
      case 'roster':
        roster.value = detail;

        // if (this.data.template.layout !== 'custom') {
        //   return;
        // }

        // handleCustomLayout(detail);
        break;
      // 权限被拒异常处理
      case 'permission':
        detectAuthorizeModel();
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
      // pusher渲染错误
      case 'pusherError':
        exitRoom('异常退出，请尝试重新入会');
        break;
      // 会中所有终端信息
      case 'bulkRoster':
        bulkRoster.value = detail;
        break;
      case 'networkParameter':
        remoteNetworkLevel.value[detail.fromCallUri] = detail.networkLevel;
        break;
      case 'networkLevel':
        localNetworkLevel.value = detail;
        break;
      default:
        break;
    }
  });
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
  XYClient.value?.hangup('');
  XYClient.value?.off('roomEvent');

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
 * live-pusher 状态变化事件
 */
const onPusherStateChange = (e: any) => {
  XYClient.value?.pusherEventHandler(e);
};

/**
 * live-pusher 网络状态通知
 */
const onPusherNetStatus = (e: any) => {
  XYClient.value?.pusherNetStatusHandler(e);
};

/**
 * live-pusher 渲染错误事件
 */
const onPusherError = (e: any) => {
  XYClient.value?.pusherErrorHandler(e);
};

/**
 * live-pusher 返回麦克风采集的音量大小
 */
const onPusherAudioVolumeNotify = (e: any) => {
  XYClient.value?.pusherAudioVolumeNotify(e);
};

/**
 * live-player 播放状态变化事件
 */
const onPlayStateChange = (e: any) => {
  XYClient.value?.playerEventHandler(e);
};

/**
 * live-player 网络状态通知
 */
const onPlayNetStatus = (e: any) => {
  XYClient.value?.playNetStatusHandler(e);
};

/**
 * live-player 播放音量大小通知
 */
const onPlayAudioVolumeNotify = (e: any) => {
  XYClient.value?.playAudioVolumeNotify(e);
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
  if (XYClient.value) {
    XYClient.value[videoMute.value ? 'unmuteVideo' : 'muteVideo']();

    videoMute.value = !videoMute.value;
  }
};

const operateAudio = () => {
  if (XYClient.value) {
    XYClient.value[audioMute.value ? 'unmuteAudio' : 'muteAudio']();
  }
};

/**
 * 双击 forceLayout
 *
 */
const onFullScreenContent = (item: ILayout, event: any) => {
  Event.click(event, () => {
    XYClient.value?.handleFullScreen(item);
  });
};

/**
 * 权限确认提示框
 */
const detectAuthorizeModel = () => {
  if (!isShowDetected.value) {
    isShowDetected.value = true;

    uni.showModal({
      title: '权限提示',
      content: '请开启“麦克风”和“摄像头”权限才可以进行音视频通话！',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#666666',
      confirmText: '去设置',
      confirmColor: '#3876FF',
      success: (res: any) => {
        if (res.confirm) {
          detectAuthorize();
        } else if (res.cancel) {
          exitRoom();
        }
      },
    });
  }
};

/**
 * 检测权限设置，如果没有授权，提示用户设置中授权操作
 */
const detectAuthorize = () => {
  try {
    uni.openSetting({
      success: (res: any) => {
        const camera = res.authSetting['scope.camera'];
        const record = res.authSetting['scope.record'];

        isShowDetected.value = false;

        if (!camera || !record) {
          detectAuthorizeModel();
        } else {
          exitRoom('授权成功，请重新入会');
        }
      },
      fail: (error: any) => {
        exitRoom('授权错误，请重新入会');
      },
    });
  } catch (err) {}
};

/**
 * 授权状态更新，需要重新入会
 */
const exitRoom = (msg = '') => {
  if (msg) {
    uni.showModal({
      title: '提示', //提示的标题,
      content: msg, //提示的内容,
      showCancel: false, //是否显示取消按钮,
      confirmText: '退出会议', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#3876FF', //确定按钮的文字颜色,
      success: () => {
        hangup();
      },
    });
  } else {
    hangup();
  }
};

/**
 * 自定义布局，处理模板计算
 */
const handleCustomLayout = (detail: IRosterObj) => {
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

  roster.forEach((item, index) => {
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

  XYClient.value?.updateTemplate(newDetails);
};
</script>

<style scoped lang="scss">
@import './meeting.scss';
</style>
