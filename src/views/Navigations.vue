<template>
    <div id="root">
        <div class="buttons">
            <button @click="addLinkModal = true">申请友链</button>
        </div>
        <div class="link_type">
            <router-link :to="{ name: 'Friends' }">友链</router-link>
            <el-divider direction="vertical" />
            <router-link :to="{ name: 'Navs' }">导航</router-link>
            <el-divider direction="vertical" />
            <router-link :to="{ name: 'Tools' }">工具</router-link>
        </div>
        <div class="item-list">
            <router-view></router-view>
        </div>
    </div>
    <!-- 模态框 -->
    <el-dialog v-model="addLinkModal" title="Shipping address" destroy-on-close>
        <el-form :model="form">
            <el-form-item label="头像链接">
                <el-input v-model="form.logo" autocomplete="off" />
            </el-form-item>
            <el-form-item label="网站名称">
                <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>
            <el-form-item label="网站介绍">
                <el-input v-model="form.describes" autocomplete="off" />
            </el-form-item>
            <el-form-item label="网站链接">
                <el-input v-model="form.link" autocomplete="off" />
            </el-form-item>
            <el-form-item label="链接类型">
                <el-select v-model="form.type" placeholder="请选择">
                    <el-option label="友链" value="友链" />
                    <el-option label="导航" value="导航" v-if="authlogin.isadmin && authlogin.token"/>
                    <el-option label="工具" value="工具" v-if="authlogin.isadmin && authlogin.token"/>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addLinkModal = false">Cancel</el-button>
                <el-button type="primary" @click="add">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import store from '@/store';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import Qs from 'qs';
import { computed, onMounted, reactive, ref } from 'vue';

let authlogin = computed(() => {
    return store.getters.isnotUserlogin
})
let form = reactive({
    logo: '',
    title: '',
    describes: '',
    link: '',
    type: '',
})
const addLinkModal = ref(false)
const add = () => {
    axios({
        url: "http://127.0.0.1:9000/api/add-navigation/",
        method: "post",
        data: Qs.stringify({
            logo: form.logo,
            title: form.title,
            describes: form.describes,
            link: form.link,
            type: form.type
        })
    }).then((res) => {
        if (res.data == "ok") {
            ElMessage.success("添加成功")
        }

    })
}
</script>

<style scoped>
.link_type {
    margin: 10px 20px;
}

.link_type a {
    text-decoration: none;
    font-weight: normal;
    padding: 5px 10px;
    white-space: nowrap;
    cursor: pointer;
}

#root .item-list {
    margin: 10px 30px;
    display: grid;
    gap: 13px;
    grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
    justify-content: space-evenly;
}

a {
    text-decoration: none;
}

a,
a:hover,
a:link {
    color: #009a61;
}


h3 {
    font-size: 120%;
    color: #444;
}

@media (max-width: 768px) {
    .link_type {
        margin: 10px 10px;
    }
}
</style>