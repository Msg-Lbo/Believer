<template>
    <div id="root">
        <div class="top_links">
            <span>🏠︎<a @click="getListData(currentpage, fenlei_name)">全部({{ Total_number_of_articles }})</a></span>
            <span v-for="(item, index) in fenlei_data" :key="index">
                <el-divider direction="vertical" />
                <a @click="getListData(currentpage, item.label)">{{ item.label }}({{ item.article_num }})</a>
            </span>
        </div>
        <div class="content">
            <div class="list-title">
                <span>标题 (▲=置顶 ❖=普通)</span>
                <span>分类</span>
                <span>浏览</span>
                <span>评论</span>
                <span>时间</span>
            </div>
            <ul class="list top" v-for="(item, index) in top_article" :key="index">
                <li class="common">
                    <a @click="toArticle(item.id)">▲ {{ item.title }}</a>
                    <span><a href="/">{{ item.fenlei }}</a></span>
                    <span>352</span>
                    <span>3</span>
                    <span>{{ item.create_time }}</span>
                </li>
            </ul>

            <ul class="list" v-for="(item, index) in article_list" :key="index">
                <li class="common">
                    <a @click="toArticle(item.id)">❖ {{ item.title }}</a>
                    <span><a href="/">{{ item.fenlei }}</a></span>
                    <span>352</span>
                    <span>3</span>
                    <span>{{ item.create_time }}</span>
                </li>
            </ul>
        </div>
        <!-- 分页器 -->
        <div class="pagination">
            <el-pagination layout="total, prev, pager, next" :total="total" :page-size="pagesize"
                @current-change="currnetChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

let currentpage = ref<number>(1)
let pagesize = ref<number>(15)
let total = ref<number>()
let article_list = ref([])
let top_article = ref([])
let fenlei_name = ref<string>('all')
let Total_number_of_articles = ref<number>()
onMounted(() => {
    getFenleiTree()
    getListData(currentpage.value, fenlei_name.value)
    getTopArticles()
})

const getListData = (page, fenlei) => {
    axios({
        url: 'http://127.0.0.1:9000/api/article-list/',
        method: 'get',
        params: {
            page,
            pageSize: pagesize.value,
            fenlei: fenlei
        }
    }).then((res) => {
        Total_number_of_articles.value = res.data.num
        article_list.value = res.data.data
        total.value = res.data.total
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

const toArticle = (id) => {
    router.push({ path: '/article', query: { id: id } })
}

let currnetChange = (val) => {
    currentpage.value = val
    getListData(val, fenlei_name.value)
}

let fenlei_len = ref<number>()
let fenlei_data = ref([])
const getFenleiTree = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/ylmty-fenlei/',
        method: 'get'
    }).then((res) => {
        if (res.data == 'null') {
            ElMessage.warning('无分类数据')
            return
        }
        // console.log(res.data);
        fenlei_len.value = res.data.fenlei_len
        fenlei_data.value = res.data.fenlei_data
    })
}

</script>

<style scoped>
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
    min-width: 140px;
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
    min-width: 140px;
}

.pagination {
    margin: 30px;
}

.top_links {
    position: relative;
    top: 15px;
    left: 30px;
}

.top_links a {
    color: #292929c9;
    text-decoration: none;
    font-weight: normal;
    padding: 5px 10px;
    white-space: nowrap;
    cursor: pointer;
}

.el-table {
    background: none;
}

.el-table tr {
    background: none;

}

.el-table__inner-wrapper::before {
    height: 0 !important;
}

@media (max-width: 768px) {
    .top_links {
        top: 15px;
        left: 5px;
    }

    .content {
        margin: 30px 5px;
    }

    .list-title {
        display: none;
    }

    .list span {
        display: none;
    }
}
</style>