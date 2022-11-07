<template>
    <div id="root">
        <!-- 面包屑导航 -->
        <BreadMenu :page_name="'分类管理'"></BreadMenu>

        <!-- 主体 -->
        <div class="body ylmty">
            <el-row :gutter="10">
                <el-col :span="7">
                    <div class="ylmty" style="height:720px;">
                        <h5 style="font-size:25px;">分类结构</h5>
                        <el-divider />
                        <div style="display:flex; margin-bottom: 10px;">
                            <el-input v-model="New_fenlei_name" placeholder="新分类名字" />
                            <el-button @click="pushFenleiList()" type="success">保存</el-button>
                        </div>
                        <el-row>
                            <el-col>
                                <el-tree :data="fenlei_tree" draggable default-expand-all node-key="id"
                                    :render-content="renderContent" :expand-on-click-node="false"
                                    @node-click="choosed_fenlei_articleList" />
                            </el-col>
                        </el-row>
                        <div class="save-tree" style="display:flex; justify-content: space-between; margin-top: 10px;">
                            <el-button @click="getFenleiTree()" type="warning">恢复结构</el-button>
                            <el-button type="success" @click="saveFenleiTree()">保存结构</el-button>
                            <el-button @click="getListData(currentpage, currentfenlei)" type="primary">全部文章获取
                            </el-button>
                        </div>
                    </div>
                </el-col>
                <el-col :span="17">
                    <div class="ylmty" style="height:720px;">
                        <h5 style="font-size:25px;">{{ fenlei_name }}</h5>
                        <el-divider />
                        <el-row>
                            <el-col v-for="item in article_list" :key="item.id" :span="24" class="colcard">
                                <el-card shadow="hover" class="card">
                                    <el-row style="align-items:center;">
                                        <el-col :xs="24" :lg="5">
                                            <el-image style="width: 120px; height: 70px; margin: 0 auto;"
                                                :src="item.cover" :fit="'cover'" />
                                        </el-col>
                                        <el-col class="text-item" :xs="24" :lg="9">
                                            <span>{{ item.title }}</span>
                                        </el-col>
                                        <el-col class="text-item" :xs="12" :lg="6">
                                            <span>发布者：{{ item.nickName }}</span>
                                        </el-col>
                                        <el-col class="text-item" :xs="12" :lg="4">

                                            <el-popover placement="right" :width="200"
                                                trigger="hover">
                                                <template #reference>
                                                    <el-button type="warning" :icon="Plus">移动
                                                    </el-button>
                                                </template>
                                                <el-tree :data="fenlei_tree" show-checkbox @node-click="choosed_fenlei"
                                                    default-expand-all :expand-on-click-node="false" :hide-after="0" />
                                                <el-button type="success" size="default"
                                                    @click="saveArticleToFenlei(item.id)" :icon="Plus">确定</el-button>
                                            </el-popover>

                                        </el-col>
                                    </el-row>
                                </el-card>
                            </el-col>
                        </el-row>
                        <!-- 分页器 -->
                        <div class="pagination ylmty ">
                            <el-pagination background layout="total,prev, pager, next" :total="total"
                                :page-size="pagesize" @current-change="currnetChange" />
                        </div>
                    </div>
                </el-col>

            </el-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BreadMenu from '@/components/Commons/BreadMenu.vue';
import store from '@/store';
import { Search, Delete, Check, Plus } from '@element-plus/icons-vue';
import type Node from 'element-plus/es/components/tree/src/model/node'
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import Qs from 'qs';
// 文章内容
let currentpage = ref<number>(1)
let currentfenlei = ref<string>('nobelong')
let pagesize = ref<number>(5)
let total = ref<number>(100)
let article_list = ref([])
let visible = ref<boolean>()
// 分类结构
let New_fenlei_name = ref('')
let maxId = ref(0)
let fenlei_tree = ref<Tree[]>([])
let fenlei_name = ref<string>()
// 文章分配到类
let choosed_fenlei_id = ref<number>()
let choosed_fenlei_name = ref<string>()
interface Tree {
    id: number
    label: string
    children?: Tree[]
}


// 选择分类查看文章
const choosed_fenlei_articleList = (node) => {
    fenlei_name.value = node.label
    getListData(1, fenlei_name.value)
}

// 选择文章保存栏目
const choosed_fenlei = (node) => {
    choosed_fenlei_id = node.id
    choosed_fenlei_name = node.label
}
const saveArticleToFenlei = (article_id) => {
    axios({
        url: 'http://127.0.0.1:9000/api/add-article/',
        method: 'put',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            fenlei_id: choosed_fenlei_id,
            article_id: article_id
        })
    }).then((res) => {
        console.log(res.data)
        if (res.data == 'nologin') {
            ElMessage.error('用户信息过期或未登录.')
            return
        }
        if (res.data == 'noperm') {
            ElMessage.error('当前用户权限不足.')
            return
        }
        if (res.data == 'ok') {
            ElMessage.success('提交成功')
            getListData(1, choosed_fenlei_name)
            getFenleiTree()
        }
    })
}


// 推入新栏目名称
const pushFenleiList = () => {
    let checkTree = loopCheckData(fenlei_tree.value)
    if (checkTree == false) {
        New_fenlei_name.value = ''
        return
    }
    if (New_fenlei_name.value == '') {
        ElMessage.warning('分类名不能为空.')
        return
    }
    let new_fenlei = {
        label: New_fenlei_name.value,
        id: maxId.value + 1,
        children: []
    }
    fenlei_tree.value.push(new_fenlei)
    New_fenlei_name.value = ''
    // console.log(fenlei_tree)
}

// 检查遍历分类树
const loopCheckData = (tree) => {
    let checkTree = true
    tree.forEach(obj => {
        if (obj.id > maxId.value) {
            maxId.value = obj.id
        }
        if (obj.label == New_fenlei_name.value) {
            ElMessage.warning('分类名重复.')
            checkTree = false
            return
        }
        if (obj.children) {
            if (obj.children.length > 0) {
                loopCheckData(obj.children)
            }
        }

    });

    return checkTree
}

// 获取分类结构
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
        fenlei_tree.value = res.data.fenlei_data
    })
}

// 保存分类结构
const saveFenleiTree = () => {
    // console.log(fenlei_tree.value)
    axios({
        url: 'http://127.0.0.1:9000/api/ylmty-fenlei/',
        method: 'put',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            fenlei_tree: JSON.stringify(fenlei_tree.value)
        })
    }).then((res) => {
        // console.log(res.data)
        if (res.data == 'nologin') {
            ElMessage.error('用户信息过期或未登录.')
            return
        }
        if (res.data == 'noperm') {
            ElMessage.error('当前用户权限不足.')
            return
        }
        if (res.data == 'ok') {
            ElMessage.success('提交成功')
        }
    })
}

// 删除分类结构
const remove = (data: Tree) => {
    // console.log(data.id)
    axios({
        url: 'http://127.0.0.1:9000/api/ylmty-fenlei/',
        method: 'delete',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            id: data.id
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then((res) => {
        // console.log(res.data)
        if (res.data == 'nologin') {
            ElMessage.error('用户信息过期或未登录.')
            return
        }
        if (res.data == 'noperm') {
            ElMessage.error('当前用户权限不足.')
            return
        }
        if (res.data == 'ok') {
            ElMessage.success('删除成功')
            getFenleiTree()
        }
    })
}
// 删除按钮
const renderContent = (
    h,
    {
        node,
        data,
    }: {
        node: Node
        data: Tree
    }
) => {
    return h(
        'span',
        { class: 'custom-tree-node' },
        h('span', null, node.label),
        h('span', { style: 'margin-left: 20px; color: #409EFF;', }, node.data.article_num),
        h('span', null,
            h(
                'a',
                {
                    style: 'margin-left: 20px; color: #F56C6C;',
                    onClick: () => remove(data),
                },
                '删除'
            )
        )
    )
}

// 渲染完成后加载
onMounted(() => {
    getListData(currentpage.value, currentfenlei.value)
    getFenleiTree()
})

// 获取文章
const getListData = (page, fenlei) => {
    // console.log(page,fenlei);
    axios({
        url: 'http://127.0.0.1:9000/api/article-list/',
        method: 'get',
        params: {
            page,
            pageSize: pagesize.value,
            fenlei: fenlei
        }
    }).then((res) => {
        // console.log(res)
        article_list.value = res.data.data
        total.value = res.data.total
    })
}

// 监听分页返回
let currnetChange = (val) => {
    currentpage.value = val
    getListData(val,fenlei_name.value)
}
</script>

<style scoped>
#root {
    max-width: 1366px;
    margin: 0 auto;
    margin-top: 70px;
}

.ylmty {
    padding: 10px 10px;
}

.card .text-item {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-row .colcard {
    margin-top: 5px;
}

#article-list .pagination {
    padding: 10px 10px;
    margin: 0 auto;
    margin-top: 10px;
}

.text-item span {
    height: 40px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>