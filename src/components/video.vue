<template>
    <div class="video-list flex flex-wrap">
        <div class="item" :class="{'mainScreen': isMain === index + 1}" :id="`item${index + 1}`" v-for="(item, index) in list" :key="index">
            <div class="video" >
                <videoChild :isMark="getMark(index)"/>
            </div>
            <div class="desc flex flex-v-c ">
                <p class="flex-3 ">视频{{index + 1}}</p>
                <div class="flex flex-v-c flex-h-end">
                    <p @click="handleMark(index)"><openVideo :isopen="getMark(index)" /></p> <!-- 打开视频 -->
                    <p @click="handleMain(index + 1)"><mainLayout /></p> <!-- 主视频 -->
                    <p @click="toggleScreen(index + 1)"><screen :isfull="isFullscreen" /></p> <!-- 全屏 -->
                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import {ref, onMounted, computed} from 'vue'
import videoChild from './videoChild.vue';
import mainLayout from './svg/main-layout.vue';
import screen from './svg/screen-full.vue';
import openVideo from './svg/open-video.vue'
import fullscreen from 'screenfull'
components: {videoChild,mainLayout,screen,openVideo}
const list = ref([{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}])
const isFullscreen = ref(false)
const isMain = ref(0)
const isMark = ref([])
onMounted(() =>{
    window.addEventListener("fullscreenchange", (e)=> {
        if(fullscreen.isFullscreen){
           isFullscreen.value = true
        }else{
           isFullscreen.value = false
        }
    })
})
const getMark = computed(() =>{
    return (index) =>{
        if(isMark.value.length){
           const obj = isMark.value.find(v => v === index)
            return obj === 0 || obj
        }
        return false
    }
})

const handleMark = (index) =>{
    const obj = isMark.value.find(v => v === index)
    obj === 0 || obj ? isMark.value = isMark.value.filter(k => k !== obj) : isMark.value.push(index)
    getMark.value(index)
}
const handleMain = (index) =>{
    isMain.value && isMain.value === index ? isMain.value = null : isMain.value = index
}
const toggleScreen = (index) =>{
        isFullscreen.value = !isFullscreen.value
           const element = document.getElementById(`item${index}`);
        if(isFullscreen.value){
          element.requestFullscreen()
        } else{
          document.exitFullscreen()
        }
}


</script>
<style scoped lang="scss">
.video-list{
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: rgb(28, 30, 33);
    color: #fff;
    box-sizing: border-box;
    .item{
        width: 24.2%;
        height: 300px;
        border: 1px solid #333;
        box-sizing: border-box;
        margin: 10px 5px;
        &.mainScreen{
            width: (24.2% * 2) !important;
            height: 300px !important;
        }
        .video{
           height: calc(100% - 40px);
        }
        .desc{
            height: 40px;
            background: #000;
            p:first-child{
                padding: 0 5px 0 10px;
               
            }
            p{
                padding: 0 5px;
                cursor: pointer;
            }
        }
    }
}
</style>