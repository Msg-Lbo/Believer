<template>
    <div id="root">
        <el-row>
            <el-divider />
            <el-col :span="6">
                <div class="col_body">
                    <span>博主头像图片</span>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="col_body">
                    <el-image style="width: 100px; height: 100px" :src="headimg" :fit="'scale-down'" />
                    <el-input v-model="headimg" placeholder="Please input" />
                    <p>请放入博主头像链接</p>
                </div>
            </el-col>
            <el-divider />
            <el-col :span="6">
                <div class="col_body">
                    <span>博主昵称</span>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="col_body">
                    <el-input v-model="blogger_name" placeholder="Please input" />
                    <p>请填写博主昵称,若为空则不显示</p>
                </div>
            </el-col>
            <el-divider />
            <el-col :span="6">
                <div class="col_body">
                    <span>博主个人简介</span>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="col_body">
                    <el-input v-model="overview" placeholder="Please input" />
                    <p>请填写博主个性简介,若为空则不显示</p>
                </div>
            </el-col>
            <el-divider />
            <el-col :span="6">
                <div class="col_body">
                    <span>QQ二维码图片</span>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="col_body">
                    <el-input v-model="headimg" placeholder="Please input" />
                    <p>请上传QQ二维码图片，建议尺寸为300px×300px，若为空则不显示</p>
                </div>
            </el-col>
            <el-divider />
            <el-col :span="6">
                <div class="col_body">
                    <span>微信二维码图片</span>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="col_body">
                    <el-input v-model="headimg" placeholder="Please input" />
                    <p>请上传微信二维码图片，建议尺寸为300px×300px，若为空则不显示</p>
                </div>
            </el-col>
            <el-divider />
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

let headimg = ref<string>()
let blogger_name = ref<string>()
let overview = ref<string>()

const getsettings = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/other-settings/',
        method: 'get'
    }).then((res) => {
        headimg.value = res.data.headimg
        blogger_name.value = res.data.blogger_name
        overview.value = res.data.overview
    })
}
onMounted(() => {
    getsettings()
})

</script>

<style scoped>
.col_body {
    padding: 15px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
}
.col_body p{
    font-size: 12px;
    color: #9f9f9f;
}

.col_body input{
    width: 300px;
}
</style>