<template>
    <div id="article-list">
        <!-- 面包屑导航 -->
            <BreadMenu :page_name="'文章列表'"></BreadMenu>
        <!-- 文章列表 -->
        <div class="body ylmty">
            <el-row>
                <el-col v-for="item in article_list" :key="item.id" :span="24" class="colcard">
                    <el-card shadow="hover" class="card">
                        <el-row style="align-items:center;">
                            <el-col :xs="24" :lg="4">
                                <el-image style="width: 200px; height: 100px; margin: 0 auto;" :src="item.cover"
                                    :fit="'cover'" />
                            </el-col>
                            <el-col class="text-item" :xs="24" :lg="10">
                                <span>{{ item.title }}</span>
                            </el-col>
                            <el-col class="text-item" :xs="12" :lg="4">
                                <span>发布者：{{ item.nickName }}</span>
                            </el-col>
                            <el-col class="text-item" :xs="12" :lg="6">
                                <el-button type="primary" @click="toArticle(item.id)" :icon="Search">查看</el-button>
                                <el-button type="warning" :icon="Edit">编辑</el-button>
                                <el-button type="danger" @click="deleteArticle(item.id)" :icon="Delete">删除</el-button>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 分页器 -->
        <div class="pagination ylmty ">
            <el-pagination background layout="total,prev, pager, next" :total="total" :page-size="pagesize"
                @current-change="currnetChange" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import BreadMenu from '@/components/Commons/BreadMenu.vue';
import store from '@/store';
import { ArrowRight, Search, Delete, Edit } from '@element-plus/icons-vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Qs from 'qs';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '@/router';
import QueryString from 'qs';

let currentpage = ref<number>(1)
let pagesize = ref<number>(5)
let total = ref<number>(100)
let article_list = ref([])
onMounted(() => {
    getListData(currentpage.value)
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
    // console.log(val)
    currentpage.value = val
    getListData(val)
}


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
                        id,
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
#article-list {
    max-width: 1366px;
    margin: 0 auto;
    margin-top: 70px;
}

.ylmty {
    padding: 10px 10px;
}

.el-row .colcard {
    margin-top: 5px;
}

.card .text-item {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
}

#article-list .pagination {
    padding: 10px 10px;
    margin: 0 auto;
    margin-top: 10px;
}
</style>