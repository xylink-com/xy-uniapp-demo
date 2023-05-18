/**
 * 会议进行的时间
 */
import { ref, onUnmounted, watch } from 'vue';

export const secondToDate = (result: number) => {
  const h = Math.floor(result / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((result / 60) % 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(result % 60)
    .toString()
    .padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const useTime = (start: any) => {
  const meetingTimeSecond = ref(0);
  const meetingTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const meetingTime = ref('00:00:00');

  const clearMeetingTimer = () => {
    if (meetingTimer.value) {
      clearTimeout(meetingTimer.value);
      meetingTimer.value = null;
    }
  };

  const onCreateMeetingTimeCount = () => {
    meetingTimeSecond.value++;

    meetingTimer.value = setTimeout(() => {
      clearMeetingTimer();

      meetingTime.value = secondToDate(meetingTimeSecond.value);
      onCreateMeetingTimeCount();
    }, 1000);
  };

  watch(
    start,
    (newVal) => {
      if (newVal) {
        onCreateMeetingTimeCount();
      } else {
        clearMeetingTimer();
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    clearMeetingTimer();
  });

  return meetingTime;
};
