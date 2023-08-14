<template>
    <div class="video">
        <video 
        :id="`videoElement${index}`" 
        autoplay
        muted
        ></video>
    </div>
</template>
<script setup>
import flvjs from 'flv.js';
import {ref,onMounted,toRefs,onUnmounted } from 'vue'

const player = ref(null)
const props = defineProps({
    url: {
        type: String,
        default: () => ''
    },
    index: {
        type: Number,
        default: () => 0
    }
})
const { url, index } = toRefs(props);

onMounted(() =>{
    console.log('isSupported: ' + flvjs.isSupported())
    console.log('是否支持点播视频：' + flvjs.getFeatureList().mseFlvPlayback)
    console.log(
        '是否支持httpflv直播流：' + flvjs.getFeatureList().mseLiveFlvPlayback
    )
    createVideo()
})
const createVideo = () =>{
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById(`videoElement${index.value}`)
        player.value = flvjs.createPlayer({
            type: "flv", // 是否是直播流，默认 true
            url: url.value,   // 播放地址
            hasAudio: false, // 是否有音频
            hasVideo: true, // 是否有视频
            isLive: true, // 是否是直播流
            cors: true, // 开启跨域访问
            stashInitialSize: 128, // 减少首帧显示等待时长
            enableWorker: false, // 不启用分离的线程进行转换，之前为true
            enableStashBuffer: false, // 关闭IO隐藏缓冲区
            autoCleanupSourceBuffer: true, // 打开自动清除缓存
            fixAudioTimestampGap: false, //false才会音视频同步,新增
            lazyLoad: false, // 去掉懒加载,新增
        })
        player.value && player.value.attachMediaElement(videoElement);
        play()
        flvEvent()
    }
   
}
const play = () => {
    player.value && player.value.load()
    setTimeout(() =>{
        player.value && player.value.play();
    }, 300)
}
const flvEvent = () =>{
    player.value && player.value.on(
        flvjs.Events.ERROR,
        (errorType, errorDetail, errorInfo) =>{
            console.log(
                '类型:' + JSON.stringify(errorType),
                '报错内容' + errorDetail,
                '报错信息' + errorInfo
            )
            ElMessage.error(`视频加载失败，请稍候重试！`);
        }
    )
    player.value && player.value.on(
        flvjs.Events.STATISTICS_INFO,
        (errorType, errorDetail, errorInfo) =>{
            console.log(
                '类型:' + JSON.stringify(errorType),
                '报错内容' + errorDetail,
                '报错信息' + errorInfo
            )
            ElMessage.error(`视频加载失败，请稍候重试！`);
        }
    )
}

onUnmounted(() => {
    destory()
})

</script>
<style scoped lang="scss">
video {
  width: 100%;
  height: 100%;
  cursor: pointer;
  object-fit: cover
}
</style>