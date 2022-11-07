<template>
    <div id="root">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="18">
                <div class="ylmty body">
                    <el-carousel trigger="click" height="150px">
                        <el-carousel-item v-for="item in article_list" :key="item.id">
                            <div class="small justify-center" @click="toArticle(item.id)" style="position: relative;">
                                <el-image style="height:150px;display:block;border-radius: .25rem 0 0 .25rem;"
                                    :src="item.cover" :fit="'cover'" />
                                <span
                                    style="position: absolute; top: 80%;left:50%; transform:translate(-50%,-50%); color: #fff; font-size: 20px;">{{ item.title }}</span>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                    <el-scrollbar height="70vh">
                        <div v-for="item in article_list" :key="item.id" @click="toArticle(item.id)"
                            class="body ylmty cardBox">
                            <div class="card">
                                <div class="article_cover card_item">
                                    <el-image style="height:145px;display:block;border-radius: .25rem 0 0 .25rem;"
                                        :src="item.cover" :fit="'cover'" />
                                </div>
                                <div class="article_data card_item">
                                    <h2>{{ item.title }}</h2>
                                    <p>{{ item.describe }}</p>
                                    <div>
                                        <span>{{ item.create_time }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </el-col>
            <el-col :sm="6" class="right">
                <div class="body ylmty head_card">
                    <img :src=headimg alt="">
                    <h2>{{ blogger_name }}</h2>
                    <p>{{ overview }}</p>
                    <div class="statistics">
                        <span>文章<p>{{ total }}</p></span>
                        <span>分类<p>{{ fenlei_len }}</p></span>
                        <span>标签<p>8880</p></span>
                    </div>
                </div>
                <div class="body ylmty archive">
                    <span style="font-size:20px;font-weight:bold;">归档</span>
                    <div class="archive_data">
                        <span>2022/10<p>20篇</p></span>
                        <span>2022/10<p>20篇</p></span>
                        <span>2022/10<p>20篇</p></span>
                        <span>2022/10<p>20篇</p></span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="body ylmty ">
            <el-pagination background layout="total,prev, pager, next" :total="total" :page-size="pagesize"
                @current-change="currnetChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import store from '@/store';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import Qs from 'qs';
import { onMounted, ref } from 'vue';

let currentpage = ref<number>(1)
let pagesize = ref<number>(4)
let total = ref<number>(100)
let article_list = ref([])

onMounted(() => {
    getFenleiTree()
    getListData(currentpage.value)
    getsettings()
})

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
        // console.log(res)
        article_list.value = res.data.data
        total.value = res.data.total
    })
}

const toArticle = (id) => {
    router.push({ path: '/article', query: { id: id } })
}

let currnetChange = (val) => {
    // currentpage.value = val
    getListData(val)
}


let headimg = ref<string>()
let blogger_name = ref<string>()
let overview = ref<string>()
let fenlei_len = ref<number>()
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

const getFenleiTree = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/ylmty-fenlei/',
        method: 'get'
    }).then((res) => {
        // console.log(res.data)
        if (res.data == 'null') {
            ElMessage.warning('无分类数据')
            return
        }
        fenlei_len.value = res.data.fenlei_len
    })
}

</script>

<style scoped>
.time {
    font-size: 12px;
    color: #999;
}

.card {
    display: flex;
    transition: box-shadow 0.3s;
}

.card .article_cover {
    width: 240px;
    margin-right: 20px;
}

.card:hover {
    cursor: pointer;
    box-shadow: 0 0 20px -3px rgba(0, 0, 0, .3);
}

.card span {
    color: #999;
    font-size: 15px;
}

.card_item img {
    border-radius: 0.75rem 0 0 0.75rem;

}

/* .body.ylmty.content{
    padding: 0 10px;
} */

/* .el-scrollbar{
    padding: 10px;
} */

.cardBox {
    margin: 10px 10px;
}

.head_card {
    background-image: linear-gradient(to right top, #d16ba530, #c777b930, #ba83ca30, #aa8fd830, #9a9ae130, #8aa7ec30, #79b3f430, #69bff830, #52cffe30, #41dfff30, #46eefa30, #5ffbf130);
    padding: 10px;
    text-align: center;
    color: #fff;
}

.head_card img {
    text-align: center;
    border-radius: 50%;
}

.statistics {
    display: flex;
    justify-content: space-around;
}

.statistics span {
    /* margin: 10px 20px; */
    font-size: 20px;
    font-weight: bold;
}

.archive {
    padding: 20px;
}

.archive_data span {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.demonstration {
    color: var(--el-text-color-secondary);
}

.el-carousel {
    border-radius: .25rem .25rem 0 0;
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

@media screen and (max-width: 768px) {
    .right {
        display: none;
    }
}
</style>