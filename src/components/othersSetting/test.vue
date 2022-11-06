<template>
    <div class="test">
        <el-row>
            <el-col :span="6">
                <div class="col_body">
                    <span>允许注册</span>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="col_body">
                    <el-switch v-model="reg" @click="change" />
                    <p>是否开放站点注册权限</p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="col_body">
                    <span>站点标题</span>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="col_body">
                    <el-input v-model="webtitle" @change="change" placeholder="Please input" />
                    <p>请填入站点标题,不要太长(刷新后生效)</p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="col_body">
                    <span>站点Logo类型</span>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="col_body">
                    <el-radio-group v-model="logotype" class="ml-4">
                        <el-radio label="text" size="large" disabled>文字LOGO</el-radio>
                        <el-radio label="img" size="large">图片LOGO</el-radio>
                    </el-radio-group>
                </div>
            </el-col>
            <el-col :span="6" v-if="logotype == 'text'">
                <div class="col_body">
                    <span>站点文字LOGO</span>
                </div>
            </el-col>
            <el-col :span="6" v-else>
                <div class="col_body">
                    <span>站点图片LOGO</span>
                </div>
            </el-col>
            <el-col :span="18" v-if="logotype == 'img'">
                <div class="col_body">
                    <el-image style="width: 100px; height: 100px" :src="textorimg" :fit="'scale-down'" />
                    <el-input v-model="textorimg" @change="tologourlortext" placeholder="Please input" />
                    <p>请填入站点图片LOGO直链，最佳尺寸为250X70</p>
                </div>
            </el-col>
            <el-col :span="18" v-else>
                <div class="col_body">
                    <el-input v-model="textorimg" @change="tologourlortext" placeholder="Please input" />
                    <p>请填入文字LOGO</p>
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
let reg = ref()
let webtitle = ref()
let logotype = ref('img')
let textorimg = ref()
const tologourlortext = () => {
    let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if (!reg.test(textorimg.value) && logotype.value == 'img' && textorimg.value != '') {
        textorimg.value = textorimg.value
    } else if (logotype.value == 'text' && textorimg.value != '') {
        textorimg.value = textorimg.value
    } else {
        ElMessage.error('不是LOGO直链或为空')
        logotype.value = 'text'
        textorimg.value = '我的网站'
    }
}
const emits = defineEmits(["reg", "webtitle", "textorimg"]);
const change = () => {
    emits('reg', reg.value)
    emits('webtitle', webtitle.value)
    emits('textorimg', textorimg.value)
}
const getsettings = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/other-settings/',
        method: 'get'
    }).then((res) => {
        reg.value = res.data.isreg === "true" ? true : false
        webtitle.value = res.data.webt
        textorimg.value = res.data.wlg
    })
}
onMounted(() => {
    getsettings()
})

// let Change = () => {
//     reg.value = reg.value
//     webtitle = webtitle
// }

// defineExpose({
//     reg: reg.value,
//     webtitle: webtitle.value
// })

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
</style>