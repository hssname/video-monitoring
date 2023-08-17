import {ElMessage} from 'element-plus';
import VueCookies from 'vue-cookies';
var reHeart = false // 是否允许重新连接
var timeoutTimer = null // 心跳定时器
var reTimeoutTimer = null // 重连定时器
var client = null
var handlers = {}
var num = 0


/* 初始化socket */
export const initWebSocket = () =>{
  const token = VueCookies.get('tbds_token')
  console.log(token, 'token')
 if ("WebSocket" in window) {
  let protocol = location.protocol == "https:" ? 'wss': 'ws'
  client = new WebSocket(`${protocol}://${location.host}/api/wcu/ws`);
 } else {
     return "WebSocket" in window ? false : ElMessage.warning('当前浏览器不支持 WebSocket。部分功能不能使用。')
 }
 client.onopen = () =>{
   console.log('连接成功...')
   timeoutTimer = setTimeout(() =>{
     reHeart = !reHeart
   }, 1500)
 }
 client.onerror = () =>{
   console.log('连接失败...')
   reConnect()
 }
 client.onclose = (evt) =>{
   console.log('连接已关闭...')
   console.log('websocket 断开: ' + evt.code + ' ' + evt.reason + ' ' + evt.wasClean)
   reConnect()
 }
  // 接收
  client.binaryType = 'arraybuffer'
 client.onmessage = (evt) => {
   websocketonmessage(evt)
 }
}

function websocketonmessage(evt){
  // 判断是否是流，如果是流则是 mainView
  try {
    const json = JSON.parse(evt.data)
    if (json) {
      const obj = {
        id: 0 + num,
        imgUrl: 'https://static.runoob.com/images/demo/demo2.jpg',
        event: '未佩戴安全帽引发的事故,未佩戴安全帽引发的事故',
        origin: `主机${num}`,
        time: '2023-08-09 12:00:00'
      }
      num++
      getData('warn', obj)
    }
  } catch (err) {
    getData('main', evt) 
  }  
}

/* 匹配页面参数 */
function getData(type, data){
  for (let handleKey in handlers) {
    if (handlers.hasOwnProperty(handleKey) && handlers[handleKey].socketKey === type){
      handlers[handleKey].handler(data);
    }
  }
}

export const websocketSend = (data) =>{
  if(client && reHeart) {
    client.send(JSON.stringify(data));
  }
}
export const addMessageHandler = (handlerKey,socketKey,handlerFunction) =>{
 handlers[handlerKey] = {socketKey: socketKey, handler: handlerFunction};
}

export const removeMessageHandler = (handlerKey) =>{
 if(handlers[handlerKey]){
     handlers[handlerKey] = null
     delete handlers[handlerKey];
 }
}



/* 重连 */
export const reConnect = (val) =>{
  if(val){
   resetData()
   return
  }
  reTimeoutTimer && clearTimeout(reTimeoutTimer)
  reTimeoutTimer = setTimeout(function () {
   client && client.close()
   client = null
   initWebSocket() // 重新连上
 }, 1500)
}

/* 重置数据 */
function resetData(){
  console.log('关闭socket')
  window.sessionStorage.clear()
  client && client.close()
  reHeart = false
  timeoutTimer = null
  reTimeoutTimer = null
  client = null
  handlers = {}
}