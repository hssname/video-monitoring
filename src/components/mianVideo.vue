<template>
    <div class="video">
       <div class="action" @click="zoom">
          <screenFull :isfull="false" />
       </div>
        <video 
        :id="`videoElement${index}`" 
        autoplay
        muted
        ></video>
    </div>
</template>
<script setup>
import flvjs from 'flv.js';
import {ref,onMounted,toRefs,watch, onUnmounted } from 'vue'
import screenFull from './svg/screen-full.vue';
components: {screenFull}
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
const { index } = toRefs(props);
const playUrl = ref(props.url)
watch(
    () => props.url,
    (val, old) =>{
        playUrl.value = val
        createVideo()
    },{deep: true}
)
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
            url: playUrl.value,   // 播放地址
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
            setTimeout(() => { createVideo() }, 1000);
            
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
            setTimeout(() => { createVideo() }, 1000);
        }
    )
}
const zoom = () => {
    if (!!isFullscreen()) exitFullScreen()
    else requestFullScreen()
}
const isFullscreen = () => {
    const documentScreenElement = document.getElementById(`videoElement${index.value}`)
    return (
        documentScreenElement.fullscreenElement ||
        documentScreenElement.msFullscreenElement ||
        documentScreenElement.mozFullScreenElement ||
        documentScreenElement.webkitFullscreenElement ||
        false
    )
    // return (
    //     document.fullscreenElement ||
    //     document.msFullscreenElement ||
    //     document.mozFullScreenElement ||
    //     document.webkitFullscreenElement ||
    //     false
    // )
}
const requestFullScreen = () => {
    let documentRequestScreenElement = null
    documentRequestScreenElement = document.getElementById(`videoElement${index.value}`)

    var requestMethod =
        documentRequestScreenElement.requestFullScreen ||
        documentRequestScreenElement.webkitRequestFullScreen ||
        documentRequestScreenElement.mozRequestFullScreen ||
        documentRequestScreenElement.msRequestFullScreen
    if (requestMethod) {
        requestMethod.call(documentRequestScreenElement)
    }
}

const exitFullScreen = () => {
    const documentFullScreenElement = document.getElementById(`videoElement${index.value}`)
    var exitMethod =
        documentFullScreenElement.exitFullscreen ||
        documentFullScreenElement.mozCancelFullScreen ||
        documentFullScreenElement.webkitExitFullscreen ||
        documentFullScreenElement.msExitFullscreen
    if (exitMethod) {
        exitMethod.call(documentFullScreenElement)
    }
}

</script>
<style scoped lang="scss">
.action{
    position: absolute;
    top: 2%;
    right: 2%;
    cursor: pointer;
}
video {
  width: 100%;
  height: 100%;
  cursor: pointer;
  object-fit: cover
}
</style>