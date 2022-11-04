<template>
    <div id="root">
        <div class="carousel">
            <el-carousel id="el-carousel" :interval="4000" type="card" height="400px" width="1200px" pause-on-hover>
                <el-carousel-item v-for="item in 6" :key="item">
                    <h3 text="2xl" justify="center">{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </div>
        <!-- <el-affix :offset="120"> -->
        <div class="main">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="16">
                    <div class="left-box">
                        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                            <el-tab-pane label="全部" name="All" class="card">
                                <el-scrollbar height="800px">
                                    <all></all>
                                </el-scrollbar>
                            </el-tab-pane>
                            <el-tab-pane label="热门" name="hots" class="card">
                                <el-scrollbar height="800px">
                                    <hots></hots>
                                </el-scrollbar>
                            </el-tab-pane>
                            <el-tab-pane label="Pixiv周榜" name="weeklylist" class="card">
                                <el-scrollbar height="800px">
                                    <weeklylist></weeklylist>
                                </el-scrollbar>
                            </el-tab-pane>
                            <el-tab-pane label="Pixiv月榜" name="monthlylist" class="card">
                                <el-scrollbar height="800px">
                                    <monthlylist></monthlylist>
                                </el-scrollbar>
                            </el-tab-pane>
                            <el-tab-pane label="Acg资讯" name="acg" class="card">
                                <el-scrollbar height="800px">
                                    <acg></acg>
                                </el-scrollbar>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8">
                    <div class="right-box">
                        <latesthots></latesthots>
                    </div>
                </el-col>
            </el-row>

        </div>
        <!-- </el-affix> -->
    </div>
</template>
<script lang="ts" setup>
import all from "@/components/InformationCard/All.vue"
import hots from "@/components/InformationCard/Hots.vue"
import weeklylist from "@/components/InformationCard/WeeklyList.vue"
import monthlylist from "@/components/InformationCard/MonthlyList.vue"
import acg from "@/components/InformationCard/Acg.vue"
import latesthots from '@/components/InformationCard/LatestHots.vue'
import { ref } from "vue";
import { TabsPaneContext } from "element-plus"
const activeName = ref('All')
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab)
}
</script>

<style scoped>
/* .main {
    width: 1366px;
    margin: 0 auto;
} */

/* 左边主体 */
.left-box {
    /* width: 100%; */
    padding: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}


.right-box {
    /* width: 100%; */
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    height: auto;
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

@media screen and (max-width<=768px) {
    .carousel {
        display: none;
    }

    /* .left-box {
        width: auto;
    } */

    .right-box {
        display: none;
    }

    .main {
        width: auto;
        margin: 0 20px;
        margin-top: 80px;
    }
}
</style>