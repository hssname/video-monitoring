<template>
    <div class="wrap">
      <div class="wrap-con">
        <div class="select flex flex-v-c flex-s-b">
            <p>{{nowTime}}</p>
        </div>
        <div class="wrap-list flex flex-v-c">
          <div class="mainView panel flex-4">
            <div class="img"><img :src="imgUrl" /></div>
          </div>
          <div class="warning-list flex-1">
            <div class="total panel">
              <p>{{warnNum}}</p>
            </div>
            <div class="list panel">
                <div>
                  <el-select v-model="select" class="m-2" placeholder="请选择" size="large" @change="filterList">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                  </el-select>
                </div>
                <div class="li">
                     <div class="item flex flex-v-c" v-for="(item,index) in warnList" :key="index" @click="openDialog(item)">
                        <div class="img"><img :src="itemImgUrl(item.imgUrl)" /></div>
                        <div class="desc">
                          <p>事件：{{item.event}}</p>
                          <p>来源：{{item.origin}}</p>
                          <p>时间：{{item.time}}</p>
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
import {addMessageHandler,removeMessageHandler, websocketSend} from '../components/socket.js'
import itemDialog from '../components/item-dialog.vue';
import warnIcon from '../components/svg/warning.vue'

components: {itemDialog}
const loading = ref(true)
const itemOpen = ref(null)

const nowTime = ref(null)
const timer = ref(null)

const notify = ref(null)

const select = ref('')
const imgUrl = ref('')
const options = ref([])

const warnList = ref([])
const allWarn = ref([])
const warnNum = ref(0)

const timeFormate = () =>{
  const date = new Date();
  const week = date.getDay();
  const weeks = ["日", "一", "二", "三", "四", "五", "六"];
  const getWeek = "星期" + weeks[week];
  nowTime.value = `${date.toLocaleString("zh", {year: 'numeric', month: '2-digit', day: '2-digit',hour: '2-digit', minute: '2-digit', second: '2-digit'})} ${getWeek}`
}

onMounted(() =>{
  timeFormate()
  timer.value = setInterval(() =>{ timeFormate() }, 1000)
  // 获取视频流
  addMessageHandler("mianView", "main", syncMainImage)
  addMessageHandler("warnView", "warn", syncWranList)
})

const itemImgUrl = computed(() =>{
  return function(url){
    return `data:image/jpeg;base64,${url}`
  }
})

// 获取主界面图片
function syncMainImage(event){
  loading.value = false
  const buffer = new Uint8Array(event.data)
  const blob = new Blob([buffer],{type: 'image/jpeg'})
  const imageUrl = URL.createObjectURL(blob);
  imgUrl.value = imageUrl
}
  // 获取报警信息列表
const syncWranList = (data) =>{
  loading.value = false
  if(data){
    notify.value && notify.value.close()
    notify.value = ElNotification({
        title: '告警',
        message: `${data.time},【${data.origin}】检测异常，请在“ AI动态识别 ” 中查看`,
        icon: warnIcon,
        position: 'bottom-right',
        duration: 0
    })
  }
  // 列表根据事件去重
  allWarn.value.push(data)
  handleData()
}
const handleData = () =>{
  var hash = {};
  allWarn.value =  allWarn.value.reduce(function(item, next) {
    hash[next.id] ? '' : hash[next.id] = true && item.push(next);
    return item
  }, [])

  warnNum.value = allWarn.value.length > 9 ? allWarn.value.length: '0' + allWarn.value.length
  select.value ? filterList(select.value) : warnList.value = allWarn.value 

  // 选择框去重
  let option = allWarn.value.map(key => key.origin)
  option = [...new Set(option)]
  const selectOption = option.map(el => {return {value: el, label: el}})
  options.value = [...[ {value: '',label: '全部'}], ...selectOption]
}

const filterList = (val) =>{
  const list = JSON.parse(JSON.stringify(allWarn.value))
  warnList.value = val ? list.filter(v => v.origin === val): list
}
const openDialog = (item) =>{
  itemOpen.value && itemOpen.value.handleOpen(item)
}
onUnmounted(() =>{
  removeMessageHandler('mianView')
  removeMessageHandler('warnView')
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