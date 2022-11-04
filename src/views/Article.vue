<template>
    <div id="root" v-cloak>
        <BreadMenu :page_name="article_data.title" :fenlei="article_data.fenlei"></BreadMenu>
        <!-- 文章内容 -->
        <div class="body ylmty">
            <el-row :gutter="10">
                <el-col :xs="24" :lg="16">
                    <div class="body ylmty">
                        <div class="header">
                            {{ article_data.title }}
                        </div>
                    </div>
                    <div class="body ylmty">
                        <div class="ylmty">
                            {{ article_data.describe }}
                        </div>
                    </div>
                    <div class="body ylmty">
                        <div class="article_content">
                            <v-md-preview-html :html="article_data.content" preview-class="vuepress-markdown-body">
                            </v-md-preview-html>
                        </div>
                    </div>
                    <div class="body ylmty">
                        <el-button v-if="toNumber(article_data.pre_id) == 0" @click="toOtherPage(article_data.pre_id)"
                            type="info" disabled>没有上一篇了</el-button>
                        <el-button v-else @click="toOtherPage(article_data.pre_id)" type="primary">上一篇</el-button>
                        <el-button v-if="toNumber(article_data.next_id) == 0" @click="toOtherPage(article_data.next_id)"
                            type="info" disabled>没有下一篇了</el-button>
                        <el-button v-else @click="toOtherPage(article_data.next_id)" type="primary">下一篇</el-button>
                    </div>
                    <div class="body ylmty">
                        <h1>评论区:</h1>
                        <el-input v-model="comment" :rows="6" type="textarea" placeholder="Please input" />
                        <el-button @click="sendNewcomment()" type="primary">提交</el-button>
                        <div class="body ylmty">
                            <el-scrollbar height="800">
                                <div class="scrollbar-demo-item" v-for="(item, index) in comments_data" :key="index">
                                    <span>{{ item.nickName }} 说：</span>
                                    <el-divider />
                                    <p>{{ item.comment }}</p>
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                </el-col>

                <el-col :xs="24" :lg="8" class="affix-container">
                    <el-affix target=".affix-container" :offset="60">
                        <div class="body ylmty">
                            <el-image :src="article_data.cover" :fit="'cover'" />
                        </div>
                        <!-- 点赞收藏打赏 -->
                        <div class="body ylmty likeBtn">
                            <el-row>
                                <el-col :span="8">
                                    <i @click="tolike()" v-if="article_data_info.like" class="iconfont icon-dianzan"
                                        style="color:#409EFF;"></i>
                                    <i @click="tolike()" v-else class="iconfont icon-dianzan"></i>
                                </el-col>
                                <el-col :span="8">
                                    <i @click="tofavor()" v-if="article_data_info.favor" class="iconfont icon-shoucang"
                                        style="color:#E6A23C;"></i>
                                    <i @click="tofavor()" v-else class="iconfont icon-shoucang"></i>
                                </el-col>
                                <el-col :span="8">
                                    <i v-if="article_data_info.dashang" class="iconfont icon-dashang1"
                                        style="color:#E6A23C;"></i>
                                    <i v-else class="iconfont icon-dashang1"></i>
                                </el-col>
                            </el-row>
                        </div>
                        <!-- 最新评论 -->
                        <div class="body ylmty">
                            <h3>最新评论</h3>
                            <div class="body ylmty plugin-item">
                                Admin 说：
                                <el-divider></el-divider>
                                哈哈哈
                            </div>
                        </div>
                    </el-affix>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BreadMenu from '@/components/Commons/BreadMenu.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Qs from 'qs';
import router from '@/router';
import { ElMessage } from 'element-plus';
import { toNumber } from 'lodash';
import store from '@/store';

onMounted(() => {
    getArticleData(article_id)
    getAllConmments()
    gerUserArticleInfo()
})

const Adata = {
    cover: null,
    describe: null,
    fenlei: null,
    nickName: null,
    title: null,
    content: null,
    next_id: null,
    pre_id: null,
}
const route = useRoute();
let article_id = route.query.id
let article_data = reactive(Adata)
let comments_data = ref()
let article_data_info = reactive({
    like: null,
    favor: null,
    dashang: null
})
watch(() => route.query, (to) => {
    article_id = to.id
    getArticleData(to.id)
    getAllConmments()
    gerUserArticleInfo()
})
// 点赞
const tolike = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/article-like/',
        method: 'post',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            article_id: article_id
        })
    }).then((res) => {
        if (res.data == 'nologin') {
            ElMessage.warning('登录之后才能点赞哦.')
            return
        }
        if (res.data == 'ok') {
            gerUserArticleInfo()
        }
    })
}
// 收藏
const tofavor = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/article-favor/',
        method: 'post',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            article_id: article_id
        })
    }).then((res) => {
        if (res.data == 'nologin') {
            ElMessage.warning('登录之后才能点赞哦.')
            return
        }
        if (res.data == 'ok') {
            gerUserArticleInfo()
        }
    })
}
// 获取点赞信息
const gerUserArticleInfo = () => {
    let token = store.getters.isnotUserlogin.token
    if (token) {
        axios({
            url: 'http://127.0.0.1:9000/api/user-article-info/',
            method: 'post',
            data: Qs.stringify({
                token: token,
                article_id: article_id
            })
        }).then((res) => {
            Object.assign(article_data_info, res.data)
        })
    }
}

// 获取文章评论
const getAllConmments = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/comments/',
        method: 'get',
        params: {
            article_id: article_id,
        }
    }).then((res) => {
        comments_data.value = res.data
    })
}

// 发送评论
let comment = ref('')
const sendNewcomment = () => {
    if (comment.value.length == 0) {
        ElMessage.warning("评论不能小于5个字符.")
        return
    }
    axios({
        url: 'http://127.0.0.1:9000/api/comments/',
        method: 'post',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            article_id: article_id,
            comment: comment.value
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
            getAllConmments()
        }
    })
}

// 跳转文章 上下
const toOtherPage = (id) => {
    if (id == 0) {
        ElMessage.warning('没有了.')
        return
    }
    router.push({ path: "/article", query: { id: id } })
    // console.log(article_data);
}

// 获取文章全部数据
const getArticleData = (id) => {
    axios({
        url: 'http://127.0.0.1:9000/api/article-data/',
        method: 'get',
        params: {
            article_id: id
        }
    }).then((res) => {
        Object.assign(article_data, res.data)
    })
}
</script>

<style scoped>
#root {
    max-width: 1150px;
    margin: 0 auto;
    margin-top: 70px;
}



.ylmty {
    padding: 10px 10px;
}

.body.ylmty .header {
    text-align: center;
    font-size: 40px;
    font-weight: 600;
}

.body.ylmty .ylmty {
    font-size: 12px;
}

.body.ylmty {
    padding: 10px;
}

.likeBtn {
    text-align: center;
}

.likeBtn i {
    font-size: 30px;
    cursor: pointer;
}
[v-cloak] {
    display: none !important;
}
.body.ylmty.plugin-item {
    color: rgb(39, 39, 39);
    font-size: 18px;
}

.scrollbar-demo-item {
    padding: 10px;
    height: auto;
    margin: 10px;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}
</style>