<template>
    <span id="link_title">友链</span>
    <div class="item" v-for="(item, index) in friends" :key="index">
        <div class="item-inner">
            <div class="item-hd">
                <a target="_blank" :href="item.link" class="item-icon"><img :src="item.logo" width="48" height="48"
                        alt="avatar"></a>
                <h3><a target="_blank" :href="item.link">{{ item.title }}</a></h3>
            </div>
            <div class="item-bd">
                <div class="item-desc">{{ item.describes }}</div>
            </div>
            <div class="item-ft">
                <a target="_blank" class="item-link" :href="item.link">{{ item.link }}</a>
                <a target="_blank" class="item-btn" :href="item.link">进入</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
let friends = ref([])

onMounted(() => {
    getallLinks()
})
const getallLinks = () => {
    axios({
        url: "http://127.0.0.1:9000/api/add-navigation/",
        method: "get",
    }).then((res) => {
        friends.value = res.data.friends
    })
}
</script>

<style scoped>
#link_title {
    font-size: 30px;
    position: absolute;
    left: 50%;
    top:10px
}

.item {
    border: 1px solid #ccc;
    position: static;
    border-radius: 4px;
    transition: box-shadow .3s ease-in-out;
}

.item:hover {
    box-shadow: 3px 3px 7px #33333333;
}

.item-inner {
    padding: 10px 15px 10px 8px;
    position: relative;
}

.item .item-icon {
    float: left;
    margin-right: 10px;
}

.item a {
    color: #333;
    display: inline-block;
    text-decoration: none;
}

a {
    text-decoration: none;
}

a,
a:hover,
a:link {
    color: #009a61;
}

.item h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    line-height: 1.4;
    margin-bottom: 5px;
    height: 22px;
    overflow: hidden;
}

.item a {
    color: #333;
    display: inline-block;
    text-decoration: none;
}

h3 {
    font-size: 120%;
    color: #444;
}

.item .item-category {
    float: right;
}

.item .item-desc {
    margin-top: 8px;
    padding: 10px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item .item-ft {
    text-align: right;
}

.item .item-link {
    float: left;
    margin-top: 3px;
    color: #999;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item a.item-btn {
    display: inline-block;
    padding: 3px 12px;
    text-decoration: none;
    position: relative;
}
</style>