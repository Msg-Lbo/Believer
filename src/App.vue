<template>
  <div class="header">
    <div class="header-title"><a href="/">买四个🥕萝卜</a></div>
    <div class="header-menu">
      <router-link to="/">首页</router-link><span class="_drop"></span>
      <a href="https://pan.ylmty.cc/" target="_blank">网盘</a><span class="_drop"></span>
      <router-link to="/navigations">导航</router-link><span class="_drop"></span>
      <router-link to="/about">关于</router-link><span class="_drop"></span>
      <router-link to="/login" v-if="!authlogin.token">登录</router-link>
      <a v-else @click="logout" style="cursor:pointer;">退出</a>
    </div>
    <br>
    <div class="header-menu" v-if="authlogin.isadmin && authlogin.token">
      <router-link to="/manage">控制台</router-link>
    </div>
    <footerVue></footerVue>
  </div>

  <div class="main">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import footerVue from './components/Commons/footer.vue';
import router from '@/router';

import { watch, computed, ref, onMounted } from 'vue';
import store from './store';

let authlogin = computed(() => {
  return store.getters.isnotUserlogin
})
// 监听token
watch(() => authlogin.value.token, (newVal) => {
  if (newVal == '') {
    router.push({ path: '/login' })
  }
})

onMounted(() => {
  store.dispatch('TryAoutLogin')
})
const logout = () => {
  store.dispatch('webLogout', store.getters.isnotUserlogin.token)
}

</script>
<style scoped>
.header {
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  position: fixed;
  width: 30%;
  top: 0;
  left: 0;
  height: 100%;
  background-image: url(./assets/img/bg2.jpg);
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  z-index: 3;
}

.header::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  background: #1b2338c9;
}

.header-title {
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 50px;
  font-size: 22px;
}

.header-title a {
  color: #fff;
  text-decoration: none;
  font-size: 40px;
}

.header-menu {
  margin-top: 20px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  flex-wrap: wrap;
}

.header-menu a {
  color: #eff1fac9;
  text-decoration: none;
  font-weight: normal;
  padding: 5px 10px;
  white-space: nowrap;
}

.main {
  height: 100%;
  background: rgb(216, 216, 216);
  margin-left: 30%;
}

@media (max-width: 768px) {

  #root {
    min-height: 100%;
  }

  .header {
    display: block;
    position: sticky;
    width: 100%;
    margin-bottom: 0;
    padding: 20px 0;
  }

  .header-title {
    flex-wrap: nowrap;
    margin-bottom: 5px;
    margin-top: 0;
  }

  .main {
    min-height: initial;
    display: block;
    margin-left: 0;
  }
}
</style>