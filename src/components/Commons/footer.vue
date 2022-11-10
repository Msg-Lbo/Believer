<template>
    <div class="header-bottom">
        <div class="header-info">我欲乘风归去，又恐琼楼玉宇，高处不胜寒。</div>
        <div class="header-info">起舞弄清影，何似在人间</div>
        <div class="header-left">
            <span>开源系统 - <a href="https://github.com/Msg-Lbo/Believer" target="_blank">Believerv1.0.0</a></span>
        </div>
        <!-- <div class="header-right">
            <span>RunTime: 0.0089 s</span>
            <span>Memory: 496 kb</span>
        </div> -->
    </div>
</template>
<script lang="ts" setup>

</script>

<style scoped>
.header-bottom {
    color: rgb(207 223 255 / 61%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 2px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 0;
    background: #00000040;
    flex-wrap: wrap;
    font-size: 13px;
}
.header-bottom span {
    margin-right: 15px;
    /* font-size: 13px; */
}
.header-bottom a {
    color: #a6da69;
}
.header-info {
    margin-bottom: 10px;
    margin-left: 10px;
    text-align: left;
    bottom: 40px;
    color: rgb(207 223 255 / 61%);
    flex: 0 0 100%;
}
.header-left{
    margin-left: 10px;
}
@media (max-width: 768px) {
    .header-bottom {
        display: none;
    }


}
</style>