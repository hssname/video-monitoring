<script setup>
import index from './view/index.vue';
import { initWebSocket } from './components/socket';
import VueCookies from 'vue-cookies';
components:{index}
const token = "cz_u2YyaVxD7N2ZJL_UsazVU7nDZARYSNo__"
console.log(token, 'token')
VueCookies.set('tbds_token',token);
// 连接websocket
initWebSocket()

</script>

<template>
  <div id="app">
    <index />
  </div>
</template>

<style lang="scss">
#app {
 overflow: hidden;
 position: relative;
 width: 100%;
 height: 100%;
 font-size: 14px;
}

</style>