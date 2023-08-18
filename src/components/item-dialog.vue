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
                    <img :src="item.imgUrl" />
                </div>
                <div class="desc">
                    
                    <p class="flex"><span class="des">事件：</span><span class="desc-con">{{item.event}}</span></p>
                    <p><span class="des">来源：</span>{{item.origin}}</p>
                    <p><span class="des">时间：</span>{{item.time}}</p>
                </div>
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleClose">我已知晓</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import {ref} from 'vue'
const item = ref(null)
const dialogVisible = ref(false)
const handleOpen = (items) =>{
    dialogVisible.value = true
    item.value = items
}
const handleClose = () =>{
    dialogVisible.value = false
    item.value = null
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