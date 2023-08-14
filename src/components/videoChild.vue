<template>
    <div class="child">
      <div class="video-play" :class="{'mark': isMark}"></div>
        <!-- <div class="no-video flex flex-c flex-v">
            <noVideo />
            <p>无视频信号</p>
        </div> -->
    </div>
</template>
<script setup>
import noVideo from './svg/no-video.vue';
components: {noVideo}
const props = defineProps({
  isMark: {
    type: Object,
    default: () => null
  }
})

</script>
<style scoped lang="scss">
.child{
  width: 100%;
  height:100%;
  margin: 0 auto;
  box-sizing: border-box;
  .video-play{
    height: 100%;
    width: 100%;
    background: orange;
    &.mark{
      background: #fff;
    }
  }
  .no-video{
    height: 100%;
    width: 100%;;
    background: #272772;
    p{
        padding-top: 10px;
    }
  }
}

</style>