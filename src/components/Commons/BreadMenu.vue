<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="fenlei">{{ fenlei }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ page_name }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';

const props = defineProps(['page_name', 'fenlei'])
</script>

<style scoped>
.el-breadcrumb {
    margin: 10px 30px;
}

.el-breadcrumb span {
    font-size: 16px;
}
</style>