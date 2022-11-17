<template>
    <div id="root">
        <BreadMenu :page_name="'添加文章'" :manage="'控制台'"></BreadMenu>
        <el-row>
            <el-col :span="24">
                <div class="continue body ylmty">
                    <el-form :label-position="'top'" label-width="100px" :model="article_info">
                        <el-form-item label="标题">
                            <el-input v-model="article_info.title" />
                        </el-form-item>
                        <el-form-item label="描述">
                            <el-input type="textarea" v-model="article_info.describe" />
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="continue body ylmty">
                    <div class="uploadImg">
                        <input type="file" value="" id="upload" accept="image/*" @change="handleFiles">
                        <el-image style="height: 150px" :src=coverImg :fit="'cover'" />
                    </div>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="continue body ylmty">
                    <v-md-editor @change="onchange" @upload-image="handleUploadImage" @save="saveArticle"
                        :left-toolbar=lefttoolbar :toolbar="toolbar" :disabled-menus="[]" height="900px"></v-md-editor>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import BreadMenu from '@/components/Commons/BreadMenu.vue';
import { ElMessage } from 'element-plus'
import { reactive, ref, h } from 'vue';
import { lefttoolbar, toolbar } from '@/utils/ToolBar'
import axios from 'axios';
import Qs from "qs";
import store from '@/store';

const article_info = reactive({
    title: '',
    describe: '',
    html: "",
})
let coverImg = ref()
//选择封面
const handleFiles = (event) => {
    let files = event.target.files
    if (files) {
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = function () {
            coverImg.value = this.result;
            console.log(coverImg);
        }
    } else {
        console.log("封面不可为空")
        return false
    }
}
//监听改变
const onchange = (text, html) => {
    article_info.html = html
}
//保存
const saveArticle = (text, html) => {
    let article_data = reactive({
        title: article_info.title,
        describe: article_info.describe,
        content: article_info.html,
        cover: coverImg,
        token: store.getters.isnotUserlogin.token
    })
    if (article_data.title && article_data.describe && article_data.content && article_data.cover) {
        // console.log(article_data.content)
        axios.post('http://127.0.0.1:9000/api/add-article/', Qs.stringify(article_data))
            .then(res => {
                console.log(res.data)
                if (res.data == 'nologin') {
                    ElMessage.error('登录信息过期，请重新登录.')
                    return
                }
                if (res.data == 'ok') {
                    ElMessage.success('保存成功.')
                    window.location.reload()
                }
            })
            .catch(err => {
                // console.error(err.data);
            })
    } else {
        ElMessage({
            message: h('p', null, [
                h('i', { style: 'color: teal' }, '标题|描述|内容|封面   '),
                h('span', null, ' 均不可为空'),
            ]),
        })
        return false
    }

}


//监听图片上传
const handleUploadImage = (event, insertImage, files) => {
    // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
    let reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = function () {
        var imgData = this.result;
        let localimage_data = reactive({
            limg: imgData
        })
        axios.post('http://127.0.0.1:9000/api/upload-image/', Qs.stringify(localimage_data))
            .then(res => {
                insertImage({
                    url: res.data,
                    desc: 'image',
                    width: '30%',
                    height: '30%',
                });
            })
            .catch(err => {
                console.error(err);

            })
    }

}






</script>

<style scoped>

.ylmty {
    padding: 10px 10px;
    margin: 10px 30px;
}

#add-article .continue {
    min-height: 200px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.uploadImg{
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
}
</style>