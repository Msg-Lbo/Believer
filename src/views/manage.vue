<template>
    <div id="root">
        <!-- 面包屑导航 -->
        <BreadMenu :page_name="'控制台'"></BreadMenu>
        <div class="top_menu">
            <router-link to="/add-article">添加</router-link><el-divider direction="vertical" />
            <router-link to="/article-list">列表</router-link><el-divider direction="vertical" />
            <router-link to="/fenlei-admin">分类</router-link><el-divider direction="vertical" />
            <router-link to="/user-permission">用户</router-link>
        </div>
    </div>
</template>
<script lang="ts" setup>
import BreadMenu from '@/components/Commons/BreadMenu.vue';

</script>

<style scoped>

.top_menu {
    margin: 10px 20px;
}

.top_menu a {
    color: #292929c9;
    text-decoration: none;
    font-weight: normal;
    padding: 5px 10px;
    white-space: nowrap;
    cursor: pointer;
}
@media (max-width: 768px) {
    .top_menu {
        margin: 10px 10px;
    }
}
</style>