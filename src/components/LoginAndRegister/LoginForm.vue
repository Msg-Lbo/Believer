<template>
    <el-form ref="LoginForm" :rules="rules" label-width="100px" :model="loginUser" class="loginForm sign-in-form">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="loginUser.username" placeholder="Enter UserName.." />
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="loginUser.password" :show-password=true type="password" placeholder="Enter PassWord.." />
        </el-form-item>

        <el-form-item>
            <!-- <el-button type="primary" class="submit-btn"><a href="https://pan.ylmty.cc" style="color:aliceblue">提交</a></el-button> -->
            <el-button @click="toIndex()" type="success" class="submit-btn">游客预览</el-button>
            <el-button @click="handleLogin(LoginForm)" type="primary" class="submit-btn">提交</el-button>
        </el-form-item>
        <el-form-item label="记住" prop="delivery">
            <el-switch v-model="remberBoolean" />
        </el-form-item>
        <!-- 找回密码 -->
        <div class="tiparea">
            <p>忘记密码？<a>立即找回</a></p>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { rules, loginUser } from '../../utils/loginValidators';
import router from '../../router';
import type { FormInstance } from 'element-plus'
import store from '@/store';

const LoginForm = ref<FormInstance>()
// 是否记住
let remberBoolean = ref()
onMounted(() => {
    if (localStorage.getItem('rember') == 'true') {
        remberBoolean.value = true
    }else{
        remberBoolean.value = false
    }
})

const toIndex = () => {
    router.push("/")
}
// setup 中使用 defineProps 来获取父组件传递的值
const props = defineProps({
    loginUser: {
        type: Object,
        require: true,
    },
    rules: {
        type: Object,
        require: true,
    }
})
// 触发登录方法
const handleLogin = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            store.dispatch('webLogin', loginUser)
            localStorage.setItem('rember', remberBoolean.value === true ? "true" : "false")
        } else {
            console.log('error submit!')
            return false
        }
    })
}


</script>

<style scoped>
.submit-btn {
    width: 49%;
    margin: 0 auto;
}

/* form表单 */
.loginForm {
    margin: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0 5px 10px #cccc;
    z-index: 1;
}

.tiparea {
    text-align: right;
    font-size: 12px;
    color: #333;
}

.tiparea p a {
    color: #409eff;
}
</style>