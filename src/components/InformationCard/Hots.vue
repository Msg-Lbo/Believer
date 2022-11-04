<template>
    <h3>热门</h3>
    <div class="Hotslist">
        <el-row>
            <el-col :span="24">
                <div class="grid-content ep-bg-purple" v-for="(item, index) in 15" :key="index"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
    margin-right: 0px !important;
}

.el-row:last-child {
    margin-bottom: 0;
}

.grid-content {
    border-radius: 10px !important;
}

.grid-content:nth-child(2n) {
    border-radius: 4px;
    min-height: 120px;
    background-color: #99a9bf;
    margin-top: 10px;
}

.grid-content:nth-child(2n + 1) {
    border-radius: 4px;
    min-height: 120px;
    background-color: #d3dce6;
    margin-top: 10px;

}
</style>