<template>
    <div class="recenthots">
        <h3>
            <el-icon color="#3498db" size="14px">
                <SemiSelect />
            </el-icon> 近期热门
        </h3>
        <el-row :gutter="20">
            <el-col :span="24">
                <div class="grid-content ep-bg-purple" v-for="(item, index) in 5" :key="index">
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts" setup>

</script>
<style scoped>
/* 近期热门 */
.recenthots {
    padding: 15px;
}

.el-col {
    margin: 0 auto;
}

.el-row {
    width: 100%;
    margin-left: 0 !important;
    margin-bottom: 20px !important;
}

.el-row:last-child {
    margin-bottom: 0;
}

.grid-content {
    border-radius: 10px !important;
    margin: 0 auto;
    width: 350px;
}

.grid-content:nth-child(2n) {
    border-radius: 4px;
    min-height: 80px;
    background-color: #99a9bf;
    margin-top: 10px;
}

.grid-content:nth-child(2n + 1) {
    border-radius: 4px;
    min-height: 80px;
    background-color: #d3dce6;
    margin-top: 10px;

}
</style>