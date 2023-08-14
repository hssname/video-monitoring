<template>
    <div class="dialog">
        <el-dialog
            v-model="dialogVisible"
            title="告警提示"
            width="40%"
            align-center
            center
        >
            <div class="con">
                <div class="img">
                    <img src="../assets/img/warn2.png" />
                </div>
                <div class="desc">
                    <p class="flex"><span class="des">事件：</span><span class="desc-con">未佩戴安全帽引发的事故,未佩戴安全帽引发的事故未佩戴安全帽引发的事故,未佩戴安全帽引发的事故未佩戴安全帽引发的事故,未佩戴安全帽引发的事故</span></p>
                    <p><span class="des">来源：</span>主机2</p>
                    <p><span class="des">时间：</span>2023-08-09 12:00:00</p>
                </div>
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">已知晓</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {watch, ref} from 'vue'
const item = ref(null)
const dialogVisible = ref(false)
const handleOpen = (items) =>{
    dialogVisible.value = true
    item.value = items
}
defineExpose({handleOpen});
</script>
<style scoped lang="scss">
.con{
    .img{
        width: 100%;
        height: 200px;
        img{
            display: inline-block;
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }
    }
    .desc{
        padding: 20px 0;
        line-height: 2.0;
        width: 100%;
        .desc-con{
            display: inline-block;
            width: calc(100% - 50px);
            line-height: 1.8;
        }
        .des{
            display: inline-block;
            min-width: 50px;
            color: #000;
        }
    }
}
</style>