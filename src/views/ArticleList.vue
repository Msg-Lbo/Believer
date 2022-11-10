<template>
    <div id="root">
        <!-- 面包屑导航 -->
        <BreadMenu :page_name="'文章列表'"></BreadMenu>
        <!-- 置顶文章 -->
        <div class="top">
            <span>填入置顶文章ID,用英文逗号隔开 ","</span>
            <el-input v-model="top_array" placeholder="Please input">
                <template #append>
                    <el-button @click="sub_top_array">Primary</el-button>
                </template>
            </el-input>
        </div>
        <!-- 文章列表 -->
        <div class="table">
            <el-table :data="article_list" stripe :align="'center'" :default-sort="{ prop: 'id', order: 'ascending' }"
                style="width: 100%;" row-key="id">
                <el-table-column align="center" label="ID" prop="id" sortable width="80" />
                <el-table-column align="center" label="文章标题" prop="title" />
                <el-table-column align="center" label="分类" prop="fenlei" />
                <el-table-column align="center" label="发布日期" sortable prop="create_time" />
                <el-table-column align="center" label="操作">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="toArticle(scope.$index, scope.row)">查看
                        </el-button>
                        <el-button size="small" type="warning" @click="handleEdit(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button size="small" type="danger" @click="deleteArticle(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页器 -->
        <div class="pagination">
            <el-pagination background layout="total,prev, pager, next" :total="total" :page-size="pagesize"
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
let top_array = ref([])
onMounted(() => {
    getListData(currentpage.value)
})

const sub_top_array = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/article-list/',
        method: 'post',
        data: Qs.stringify({
            topArray: top_array.value,
            token: store.getters.isnotUserlogin.token
        })
    }).then((res) => {
        if (res.data == 'ok') {
            ElMessage.success('修改成功')
        }
    })
}

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
        article_list.value.push.apply(res.data.data, res.data.top)
        res.data.top.forEach((item) => {
            top_array.value.push(item["id"])
        })
        total.value = res.data.total
    })
}

interface list {
    id: number
    date: string
    title: string
    create_time: string
    nickName: string
}
// let article_list: list[] = []
let article_list = ref([])
const handleEdit = (index: number, row: list) => {
    console.log(row)
}

const toArticle = (index: number, row: list) => {
    router.push({ path: '/article', query: { id: row.id } })
}

let currnetChange = (val) => {
    // console.log(val)
    currentpage.value = val
    getListData(val)
}


const deleteArticle = (index: number, row: list) => {
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
                        id: row.id,
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

.table {
    margin: 10px 30px;
    border: 1px solid #90939960;
}
</style>