<script setup>
import index from './view/index.vue';
import { initWebSocket } from './components/socket';
components:{index}
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