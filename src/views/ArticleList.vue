<template>
    <div id="root">
        <!-- 面包屑导航 -->
        <BreadMenu :page_name="'文章列表'" :manage="'控制台'"></BreadMenu>
        <!-- 置顶文章 -->
        <!-- <div class="top">
            <span>填入置顶文章ID,用英文逗号隔开 ","</span>
            <el-input v-model="top_array" placeholder="Please input">
                <template #append>
                    <el-button @click="sub_top_array">Primary</el-button>
                </template>
            </el-input>
        </div> -->
        <!-- 文章列表 -->
        <div class="content">
            <div class="list-title">
                <span>标题(▲=置顶 ❖=普通)</span>
                <span>分类</span>
                <span>时间</span>
                <span>操作</span>
            </div>
            <ul class="list" v-for="(item, index) in top_article" :key="index">
                <li class="common">
                    <a @click="toArticle(item.id)">▲{{ item.title }}</a>
                    <span><a>{{ item.fenlei }}</a></span>
                    <span>{{ item.create_time }}</span>
                    <span class="actions">
                        <a @click="In_top(item.id)" style="color:#3498db">取消置顶</a>
                        <a @click="handleEdit(item.id)" style="color:#e67e22">编辑</a>
                        <a @click="deleteArticle(item.id)" style="color:#e74c3c">删除</a>
                    </span>
                </li>
            </ul>

            <ul class="list" v-for="(item, index) in article_list" :key="index">
                <li class="common">
                    <a @click="toArticle(item.id)">❖{{ item.title }}</a>
                    <span><a>{{ item.fenlei }}</a></span>
                    <span>{{ item.create_time }}</span>
                    <span class="actions">
                        <a @click="In_top(item.id)" style="color:#2ecc71">置顶</a>
                        <a @click="handleEdit(item.id)" style="color:#e67e22">编辑</a>
                        <a @click="deleteArticle(item.id)" style="color:#e74c3c">删除</a>
                    </span>
                </li>
            </ul>
        </div>
        <!-- 分页器 -->
        <div class="pagination">
            <el-pagination layout="total,prev, pager, next" :total="total" :page-size="pagesize"
                @current-change="currnetChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import BreadMenu from '@/components/Commons/BreadMenu.vue';
import store from '@/store';
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import Qs from 'qs';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router';

let currentpage = ref<number>(1)
let pagesize = ref<number>(10)
let total = ref<number>()
let top_article = ref([])
onMounted(() => {
    getListData(currentpage.value)
    getTopArticles()
})

// 置顶
const In_top = (id) => {
    axios({
        url: 'http://127.0.0.1:9000/api/article-top/',
        method: 'post',
        data: Qs.stringify({
            id: id,
            token: store.getters.isnotUserlogin.token
        })
    }).then((res) => {
        if (res.data == 'top') {
            ElMessage.success('文章置顶成功')
            getTopArticles()
            getListData(currentpage.value)
        }
        if (res.data == 'cancel') {
            ElMessage.warning('取消置顶成功')
            getTopArticles()
            getListData(currentpage.value)
        }
    })
}

const getTopArticles = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/article-top/',
        method: 'get'
    }).then((res) => {
        top_article.value = res.data
    })
}

// 获取全部文章
const getListData = (page) => {
    axios({
        url: 'http://127.0.0.1:9000/api/article-list/',
        method: 'get',
        params: {
            page,
            pageSize: pagesize.value,
            fenlei: 'all'
        }
    }).then((res) => {
        article_list.value = res.data.data
        total.value = res.data.total
    })
}

let article_list = ref([])
const handleEdit = (id) => {
    console.log(id)
}

const toArticle = (id) => {
    router.push({ path: '/article', query: { id: id } })
}

// 分页
let currnetChange = (val) => {
    // console.log(val)
    currentpage.value = val
    getListData(val)
}

// 删除文章
const deleteArticle = (id) => {
    ElMessageBox.confirm(
        '当前操作不可逆，请确认是否删除！',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
        }
    ).then(() => {
        let checkInfo = {
            contentType: 'mweb_article',
            permissions: ['delete']
        }
        store.dispatch("checkUserPerm", checkInfo).then((res) => {
            if (res) {
                axios({
                    url: 'http://127.0.0.1:9000/api/delete-article/',
                    method: 'delete',
                    data: Qs.stringify({
                        id: id,
                        token: store.getters.isnotUserlogin.token
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then((res) => {
                    // console.log(res)
                    if (res.data == 'nologin' || res.data == 'noperm') {
                        ElMessage.error('用户没有权限或登录信息过期.')
                        return
                    }
                    ElMessage({
                        type: 'success',
                        message: '确认删除',
                    })
                    getListData(currentpage.value)
                })
            }
        })



    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    })





}




</script>

<style scoped>
.pagination {
    margin: 10px 30px;
}

span {
    display: block;
    color: #909399;
    margin-bottom: 5px;
}

.top {
    margin: 10px 30px;
}

.content {
    margin: 30px;
}

.list-title {
    background: #f5f6f8;
    line-height: 33px;
    margin-bottom: 5px;
    display: flex;
    padding: 0 10px;
    border-radius: 2px;
}

.list-title *:nth-child(1) {
    flex: 1;
    text-align: left;
}

.list-title *:nth-child(2) {
    min-width: 200px;
}

.list-title *:last-child {
    min-width: 180px;
}

.list-title span {
    color: #373e4e;
    font-size: 14px;
    white-space: nowrap;
    min-width: 100px;
    text-align: center;
}

ul {
    margin: 0;
}

.list {
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    transition: all .2s;
}

.list:hover {
    background-color: #9ea6bb20;
    cursor: pointer;
}

.list li {
    padding: 6px 10px;
    list-style: none;
    margin: 0;
    width: 100%;
    display: flex;
}

.list span {
    color: #a7a8ac;
    font-size: 14px;
    display: inline-block;
    white-space: nowrap;
    min-width: 100px;
    text-align: center;
}

.list a {
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}

.list span a {
    margin: 0 5px;
    color: inherit;
}

.top a {
    color: #fb7a89;
}


a {
    color: #373e4e;
}

.list li>*:nth-child(2) {
    min-width: 200px;
}

.list li>*:last-child {
    min-width: 180px;
}

.pagination {
    margin: 30px;
}

@media (max-width: 768px) {
    .content {
        margin: 30px 5px;
    }

    .list-title {
        display: none;
    }

    .list span {
        display: none;
    }

    .list .actions {
        display: block;
    }
}
</style>