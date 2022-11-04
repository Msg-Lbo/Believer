<template>
    <el-form ref="RegisterForm" :rules="registerRules" label-width="100px" :model="registerUser"
        class="registerForm sign-up-form">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="registerUser.username" placeholder="Enter UserName.." />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerUser.email" placeholder="Enter Email.." />
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="registerUser.password" :show-password=true type="password"
                placeholder="Enter PassWord.." />
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
            <el-input v-model="registerUser.password2" :show-password=true type="password"
                placeholder="Enter PassWord2.." />
        </el-form-item>
        <el-form-item>
            <el-button @click="submitForm(RegisterForm)" type="primary" class="submit-btn">注册
            </el-button>
        </el-form-item>
        <div class="tiparea">
            <p>邮箱为找回密码的唯一凭证，请确认是否填写正确</p>
        </div>
    </el-form>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { registerUser } from '@/utils/registerValidators';
import type { FormInstance } from 'element-plus'
import store from '@/store';


const RegisterForm = ref<FormInstance>()
const props = defineProps({
    registerUser: {
        type: Object,
        require: true,
    },
    registerRules: {
        type: Object,
        require: true,
    }
})
// 触发注册方法
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            store.dispatch('webRegister',registerUser)
        } else {
            console.log('error submit!')
            return false
        }
    })
}

</script>

<style scoped>
.submit-btn {
    width: 100%;
}

.tiparea {
    text-align: right;
    font-size: 12px;
    color: rgb(177, 128, 128);
}

.tiparea p a {
    color: #409eff;
}
</style>