<template>
    <div id="otherSettings">
        <BreadMenu :page_name="'其他设置'"></BreadMenu>
        <div class="body ylmty">
            <el-button @click="saveSettings" type="success">保存配置</el-button>
            <el-tabs type="border-card" :tab-position="'left'" model-value="first">
                <el-tab-pane label="基础设置" name="first">
                    <test @reg="reg" @webtitle="wbt" @textorimg="wlg"></test>
                </el-tab-pane>
                <el-tab-pane label="Config">Config</el-tab-pane>
                <el-tab-pane label="Role">Role</el-tab-pane>
                <el-tab-pane label="Task">Task</el-tab-pane>
            </el-tabs>
            <el-button @click="saveSettings" @reg="saveSettings" type="success">保存配置</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BreadMenu from '@/components/Commons/BreadMenu.vue';
import test from '@/components/othersSetting/test.vue'
import { ArrowRight } from '@element-plus/icons-vue';
import axios from 'axios';
import store from '@/store';
import Qs from 'qs';
import { nextTick, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
let app_reg = ref()
let webtitle = ref()
let weblogo = ref()
// 子组件传过来的
const reg = (n) => { app_reg.value = n }
const wbt = (n) => { webtitle.value = n }
const wlg = (n) => { weblogo.value = n }

const saveSettings = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/other-settings/',
        method: 'post',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            dontreg: app_reg.value,
            webtitle: webtitle.value,
            weblogo: weblogo.value,
        })
    }).then((res) => {
        if (res.data == 'nologin') {
            ElMessage.error('用户信息过期或未登录.')
            return
        }
        if (res.data == 'noperm') {
            ElMessage.error('当前用户权限不足.')
            return
        }
        if (res.data == 'ok') {
            ElMessage.success('保存成功')
            document.title = webtitle.value
        }
    })
}
const getsettings = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/other-settings/',
        method: 'get'
    }).then((res) => {
        app_reg.value = res.data.isreg
        webtitle.value = res.data.wbt
        weblogo.value = res.data.wlg
    })
}

onMounted(() => {
    getsettings()
})
</script>

<style scoped>
#otherSettings {
    max-width: 1366px;
    margin: 0 auto;
    margin-top: 70px;
}

.ylmty {
    padding: 10px 10px;
}
</style>