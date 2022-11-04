<template>
  <div id="app">
    <div class="top-menu">
      <el-menu default-active="/" class="el-menu-demo" mode="horizontal" text-color="#999" router>
        <a href="/" class="weblogo">
          <img :src="weblogo" alt="" height="58">
        </a>
        <el-menu-item index="/">首页</el-menu-item>
        <el-sub-menu index="1">
          <template #title>分类</template>
          <el-menu-item index="/other-settings">其他设置</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/navigations">导航</el-menu-item>
        <el-menu-item index="/information">资讯</el-menu-item>
        <!-- <el-menu-item index="/goods">资源</el-menu-item> -->
        <el-menu-item index="/about">关于</el-menu-item>
        <el-sub-menu index="2" v-if="authlogin.token">
          <template #title>控制台</template>
          <el-menu-item index="/other-settings">其他设置</el-menu-item>
          <el-menu-item index="/add-article">添加文章</el-menu-item>
          <el-menu-item index="/article-list">文章列表</el-menu-item>
          <el-menu-item index="/fenlei-admin">分类管理</el-menu-item>
          <el-menu-item index="/user-permission">用户管理</el-menu-item>
        </el-sub-menu>
        <div class="headLoginBox">
          <el-input placeholder="Please input" class="input-with-select">
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
          <el-divider direction="vertical" />

          <div class="block">
            <!-- <el-button  type="primary" class="btn-Login">登录</el-button> -->
            <el-avatar :size="45">
              <el-dropdown ref="dropdown1" @command="handleCommand">
                <el-button @click="showClick" style="height: 50px">
                  <el-avatar :size="45" v-if="icoimg" :src="icoimg"></el-avatar>
                  <el-avatar :size="45" v-else :icon="UserFilled"></el-avatar>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="!authlogin.token" command="tologin">登录</el-dropdown-item>
                    <el-dropdown-item v-if="authlogin.token" command="user">个人中心</el-dropdown-item>
                    <el-dropdown-item v-if="authlogin.token" command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-avatar>
          </div>
        </div>
      </el-menu>


    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search, UserFilled } from '@element-plus/icons-vue'
import router from '@/router';

import { watch, computed, ref, onMounted } from 'vue';
import store from './store';
import axios from 'axios';

let icoimg = ref()
let weblogo = ref()
let authlogin = computed(() => {
  return store.getters.isnotUserlogin
})


// 监听token
watch(() => authlogin.value.token, (newVal) => {
  if (newVal == '') {
    router.push({ path: '/login' })
  }
})

const isheadimg = () => {
  if (localStorage.getItem('token') == 'null') {
    icoimg.value = 'null'
  } else if (localStorage.getItem('headImg') == 'null') {
    icoimg.value = 'https://file.moetu.org/images/2020/07/10/title908f2ba122496aa2.png'
  } else {
    icoimg.value = localStorage.getItem('headImg')
  }
}
const getsettings = () => {
  axios({
    url: 'http://127.0.0.1:9000/api/other-settings/',
    method: 'get'
  }).then((res) => {
    document.title = res.data.webt
    weblogo.value = res.data.wlg
  })
}
onMounted(() => {
  store.dispatch('TryAoutLogin')
  isheadimg()
  getsettings()
})



// 鼠标放入头像范围的操作
const dropdown1 = ref()
const showClick = () => {
  dropdown1.value.handleOpen()
}
// 鼠标点击头像下拉菜单的操作
const handleCommand = (command: string | number | object) => {
  if (command == 'tologin') { // 登录
    router.push({ path: '/login' })
  }
  if (command == 'user') { // 用户中心
    console.log()
  }
  if (command == 'logout') { // 登出
    icoimg.value = ''
    store.dispatch('webLogout', store.getters.isnotUserlogin.token)
  }
}

</script>
<style scoped>
html,
body {
  width: 100vh;
}

.block {
  flex: 1;
}

#content {
  margin-top: 58px !important;
}

.top-menu {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
}

.weblogo {
  margin-right: 20px;
  height: 58px;
  text-align: center;
}

.headLoginBox {
  margin-left: auto;
  height: 58px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.btn-Login {
  width: 80px;
}

/* 自定义 */
.el-menu {
  border: none;
  box-shadow: 0px 4px 8px 0px rgba(50, 50, 50, 0.2);
  padding: 0 3%;
  background-color: #ffffff60;
  backdrop-filter: blur(8px);
}

.el-menu-item {
  font-weight: bold;
}

.el-divider {
  border-width: 3px;
  margin: 0 30px;
}
</style>