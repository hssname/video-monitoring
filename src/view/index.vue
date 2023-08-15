<template>
    <div class="wrap">
      <div class="wrap-con">
        <!-- <h2>智能监控平台</h2> -->
        <div class="select flex flex-v-c flex-s-b">
            <p>{{nowTime}}</p>
        </div>
        <div class="wrap-list flex flex-v-c">
          <div class="mainView panel flex-4">
            <div class="img"><img :src="playUrl" /></div>
            <!-- 目前就一个视频 -->
            <!-- <videoFlv :url="playUrl" :index="0" /> -->
          </div>
          <div class="warning-list flex-1">
            <div class="total panel">
              <p>0</p>
            </div>
            <div class="list panel">
                <div>
                  <el-select v-model="camera" class="m-2" placeholder="请选择" size="large">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                  </el-select>
                </div>
                <div class="li">
                     <div class="item flex flex-v-c" v-for="(item,index) in 50" :key="index" @click="openDialog(item)">
                        <div class="img"><img src="../assets/img/warn.png" /></div>
                        <div class="desc">
                          <p>事件：未佩戴安全帽引发的事故,未佩戴安全帽引发的事故</p>
                          <p>来源：主机2</p>
                          <p>时间：2023-08-09 12:00:00</p>
                        </div>
                     </div>
                </div>
            </div>
          </div>
        </div>
        
        <div class="loading" v-if="loading">
          <div class="mark">
            <div class="wave">
                <div class="react react1"></div>
                <div class="react react2"></div>
                <div class="react react3"></div>
                <div class="react react4"></div>
                <div class="react react5"></div>
            </div>
          </div>
        </div>
      </div>
      <itemDialog ref="itemOpen" />
    </div>
</template>
<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'

import videoFlv from '../components/mianVideo.vue'
import {addMessageHandler,removeMessageHandler, websocketSend} from '../components/socket.js'
import itemDialog from '../components/item-dialog.vue';
import warnIcon from '../components/svg/warning.vue'

components: {videoFlv,itemDialog}
const loading = ref(false)
const camera = ref('主机2')
const playUrl = ref('https://img0.baidu.com/it/u=1435639120,2241364006&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500')
const itemOpen = ref(null)

const nowTime = ref(null)
const timer = ref(null)

const options = ref([
  {
    value: '主机2',
    label: '主机2',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
])

const timeFormate = () =>{
  const date = new Date();   //获取当前时间
  const week = date.getDay();
  const weeks = ["日", "一", "二", "三", "四", "五", "六"];
  const getWeek = "星期" + weeks[week];
  nowTime.value = `${date.toLocaleString("zh", {year: 'numeric', month: '2-digit', day: '2-digit',hour: '2-digit', minute: '2-digit', second: '2-digit'})} ${getWeek}`
}



onMounted(() =>{
  // 向后端发送事件
  websocketSend('main')
  timeFormate()
  timer.value = setInterval(() =>{
    timeFormate()
  }, 1000)
  // 获取视频流
  addMessageHandler("index", "main", syncMainVideo)
  addMessageHandler("index", "warn", syncWranList)
})
function syncMainVideo(res){
  loading.value = false
  // 图片流显示
  let blob = new Blob([res.data], {type: 'image/jpeg'});
  const imageUrl = URL.createObjectURL(blob);
  playUrl.value = imageUrl
}
  // 获取报警信息列表
const syncWranList = (data) =>{
  loading.value = false
  if(data){
    ElNotification({
        title: '告警',
        message: '检测异常，请在“ AI识别中查看 ”',
        icon: warnIcon,
        position: 'bottom-right',
        duration: 0
    })
  }
}
const openDialog = (item) =>{
  itemOpen.value && itemOpen.value.handleOpen()
}
onUnmounted(() =>{
  removeMessageHandler('video')
  clearInterval(timer.value)
  timer.value = null
})
/* 刷新页面，断开socket */
window.onbeforeunload = function () {
  reConnect(true)
}
</script>
<style scoped lang="scss">
.wrap{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-color: #0B1632;
  .wrap-con{
    width: 100%;
    height: 100%;
    background: url('../assets/img/bg.png') no-repeat center;
    background-size: 100% 100%;
    color: #f0f0f0;
    position: relative;
  }
  .select {
    margin: 0 32px 10px 32px;
    height: 40px;
    position: relative;
    top: 1%;
    p{
      padding: 5px 20px;
      background: #0E1745;
      box-shadow: inset 0px 0px 10px 0px #144599;
      font-size: 20px;
      background: rgba(19, 40, 90, 0.51);
      box-sizing: border-box;
    }
  }
  .wrap-list{
    padding: 10px 32px;
    height: calc(100% - 60px);
    .mainView{
      border: 1px solid #2047A0;
      height: 100%;
      margin-right: 20px;
      position: relative;
      &::before{
        content: "监控视频";
        position: absolute;
        text-align: center;
        line-height: 30px;
        left: 35%;
        top: -1px;
        height: 30px;
        width: 200px;
        border: 1px solid #2047A0;
        background: #0E1745;
        box-shadow: inset 0px 0px 10px 0px #144599;
        font-weight: bold;
        letter-spacing: 0.98px;
        background: linear-gradient(180deg, #FFFFFF 0%, #5FFFFF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        text-shadow: 0px 2px 6px 0px #00356E;
        font-size: 18px;
      }
      .img{
        padding: 40px 10px 10px 10px;
        height: 100%;
        img{
          width: 100%;
          height: 100%;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    .warning-list{
      width: 285px;
      height: 100%;
      position: relative;
      .total{
        height: 120px;
        margin-bottom: 20px;
        border: 1px solid #2047A0;
        position: relative;
        p{
          font-size: 40px;
          color: red;
          line-height: 150px;
          text-align: center;
        }
      }
      .list{
        width: 100%;
        height: calc(100% - 140px);
        border: 1px solid #2047A0;
        position: relative;
        .li{
          width: 100%;
          height: calc(100% - 60px);
          overflow-y: auto;
          margin-top: 12px;
          padding: 0 10px;
          .item{
            margin-bottom: 10px;
            cursor: pointer;
            .img{
              width: 100px;
              height: 60px;
              margin-right: 5px;
              img{
                width: 100%;
                height: 100%;
                display: inline-block;
                vertical-align: middle;
              }
            }
            .desc{
              width: calc(100% - 105px);
              p{
                // width: 100%;
                height: 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: #f0f0f0;
              }
            }
          }
        }
      }
      .total, .list{
        &::before{
          content: "";
          text-align: center;
          line-height: 30px;
          position: absolute;
          left: 33%;
          top: -1px;
          height: 30px;
          width: 120px;
          background: #0E1745;
          box-shadow: inset 0px 0px 10px 0px #144599;
          font-weight: bold;
          letter-spacing: 0.98px;
          background: linear-gradient(180deg, #FFFFFF 0%, #5FFFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-shadow: 0px 2px 6px 0px #00356E;
          font-size: 16px;
        }
      }
      .total::before{
        content: "今日预警统计";
      }
      .list::before{
        content: "AI动态识别";
      }
     
    }
    
  }
}
::v-deep(.el-input__wrapper){
  background-color: transparent;
  box-shadow:inset 0 0 0 1px transparent;
  width: 95px;
  height: 32px;
  .el-input__inner{
    color: #f0f0f0;
  }
}
::v-deep(.el-input){
  border: 0 none;
}
  
::v-deep(.el-input__wrapper.is-focus),
::v-deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow:inset 0 0 0 1px transparent !important;
}
.loading{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .mark{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0,0.4);
    z-index: 9999;
  }
  .wave {
    width: 100px;
    height: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    justify-content: space-evenly;
}

.react{
    width: 3px;
    height: 40px;
    background-color: #fff;
    animation: waveLoading 1.2s both infinite;
}

/* 设置延时 */
.react1{
    animation-delay: 0s;
}
.react2{
    animation-delay: -1.1s;
}
.react3{
    animation-delay: -1.0s;
}
.react4{
    animation-delay: -0.9s;
}
.react5{
    animation-delay: -0.8s;
}

@keyframes waveLoading{
    0% {
        transform: scaleY(0.4);
    }
    20% {
        transform: scaleY(1);
    }
    80% {
        transform: scaleY(0.4);
    }
    100% {
        transform: scaleY(0.4);
    }
}
}

</style>