<template>
    <div class="container">
        <div :class="{ 'register_box': true, 'slide_up': ishidden }" :model="registerUser">
            <div class="register_title">
                <h2 @click="Switch_modes"><span>没有账号,去</span>注册</h2>
            </div>
            <div class="input-box">
                <input type="test" v-model="registerUser.username" placeholder="用户名">
                <input type="email" v-model="registerUser.email" placeholder="邮箱">
                <input type="password" v-model="registerUser.password" placeholder="密码">
                <input type="password" v-model="registerUser.password2" placeholder="确认密码">
            </div>
            <button @click="handlRegister">注册</button>
        </div>
        <div :class="{ 'login_box': true, 'slide_up': !ishidden }" :model="loginUser">
            <div class="center">
                <div class="login_title">
                    <h2 @click="Switch_modes"><span>已有账号,去</span>登录</h2>
                </div>
                <div class="input-box">
                    <input type="text" v-model="loginUser.username" placeholder="用户名">
                    <input type="password" v-model="loginUser.password" placeholder="密码">
                    <span id="checkbox">
                        <input type="checkbox" v-model="remberBoolean" />
                        <span>记住</span>
                    </span>
                </div>
                <button @click="handleLogin">登录</button>

            </div>
        </div>


    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { loginUser } from '../../utils/loginValidators';
import { registerUser } from '../../utils/registerValidators';
import store from '../../store';
import { ElMessage } from 'element-plus';
// 是否记住
let remberBoolean = ref<boolean>(false)
onMounted(() => {
    if (localStorage.getItem('rember') == 'true') {
        remberBoolean.value = true
    } else {
        remberBoolean.value = false
    }
})
// 触发登录方法
const handleLogin = () => {
    if (loginUser.username.length == 0 || loginUser.password.length == 0) {
        ElMessage.error("用户名或密码不可为空")
        return
    }
    store.dispatch('webLogin', loginUser)
    localStorage.setItem('rember', remberBoolean.value === true ? "true" : "false")
}
// 触发注册方法
const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
const handlRegister = () => {
    if (registerUser.username.length < 2 || registerUser.username.length > 10) {
        ElMessage.error("用户名的长度应该为2~10个字符")
        return
    }
    if (!reg.test(registerUser.email)) {
        ElMessage.error("邮箱格式错误")
        return
    }
    if (registerUser.password.length < 6) {
        ElMessage.error("密码长度不可低于6位数")
        return
    }
    if (registerUser.password != registerUser.password2) {
        ElMessage.error("两次密码不一致")
        return
    }
    store.dispatch('webRegister', registerUser)
}

let ishidden = ref<boolean>(true)
const Switch_modes = () => {
    ishidden.value = !ishidden.value
}


</script>

<style scoped>
h2{
    margin: 0;
    padding: 0;
    margin-bottom: 30px;
}
.container{
    background-color: #ffffff80;
    box-shadow:2px 2px 10px #333333;
    width: 350px;
    height: 550px;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
    backdrop-filter: blur(3px);
}
.container::after{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #222222;
    opacity: 0.8;
}
/* 注册区域（登录区域很多样式和注册区域的一样，故而一些统一的样式写在了一起） */
.register_box{
    width: 70%;
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    transition: 0.3s ease;
}
.register_title,
.login_title{
    color: #fff;
    font-size: 27px;
    text-align: center;
}
.register_title span,
.login_title span{
    color: rgba(0,0,0,0.4);
    display: none;
}
.register_box .input_box,
.login_box .input_box{
    background-color: #fff;
    border-radius: 15px;
    overflow: hidden;
    margin-top: 50px;
    opacity: 1;
    visibility: visible;
    transition: 0.6s ease;
}
.register_box input{
    width: 100%;
    height: 30px;
    border: none;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    background: none;
    font-size: 15px;
    padding: 8px 0;
    text-indent: 15px;
    outline: none;
    color: #fff;
}
.login_box input{
    width: 100%;
    height: 30px;
    border: none;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    background: none;
    font-size: 15px;
    padding: 8px 0;
    text-indent: 15px;
    outline: none;
}

.register_box input::placeholder{
    color: rgba(255,255,255,0.4);

}
.login_box input::placeholder{
    color: rgba(0,0,0,0.4);
}
.register_box button,
.login_box button{
    width: 100%;
    padding: 15px 45px;
    margin: 15px 0;
    background: rgba(0,0,0,0.4);
    border: none;
    border-radius: 15px;
    color: rgba(255,255,255,0.8);
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    opacity: 1;
    visibility: visible;
    transition: 0.3s ease;
}
.register_box button:hover,
.login_box button:hover{
    background-color: rgba(0,0,0,0.8);
}
/* 登录区域 */
.login_box{
    position: absolute;
    inset: 0;
    top: 20%;
    z-index: 2;
    background-color: #fff;
    transition: 0.3s ease;
}
.login_box::before{
    content: "";
    background-color: #fff;
    width: 200%;
    height: 250px;
    border-radius: 50%;
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
}
.login_box .center{
    width: 70%;
    position: absolute;
    z-index: 3;
    left: 50%;
    top: 40%;
    transform: translate(-50%,-50%);
}
.login_title{
    color: #000;
}
.login_box .input_box{
    border: 1px solid rgba(0,0,0,0.1);
}
.login_box button{
    background-color: #75a297;
}
/* 注册、登录区域收起 */
.login_box.slide_up{
    top: 90%;
}
.login_box.slide_up .center{
    top: 10%;
    transform: translate(-50%,0%);
}
.login_box.slide_up .login_title,
.register_box.slide_up .register_title{
    font-size: 16px;
    cursor: pointer;
}
.login_box.slide_up .login_title span,
.register_box.slide_up .register_title span{
    margin-right: 5px;
    display: inline-block;
}
.login_box.slide_up .input_box,
.login_box.slide_up .button,
.register_box.slide_up .input_box,
.register_box.slide_up .button{
    opacity: 0;
    visibility: hidden;
}
.register_box.slide_up{
    top: 6%;
    transform: translate(-50%,0%);
}

#checkbox input[type=checkbox] {
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #ffffff;
    outline: none;
    border: 1px solid rgb(157, 170, 255);
    padding: 0;
    margin: 10px;
    position: relative;
    transition: all .3s;
}

#checkbox input[type=checkbox]:checked {
    background-color: rgb(157, 170, 255);
    transition: all .3s;
}

#checkbox input[type=checkbox]:checked::after {
    content: '';
    height: 4px;
    width: 8px;
    border: 2px solid #fff;
    position: absolute;
    top: 2px;
    left: 1px;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
}

#checkbox span {
    margin-left: 5px;
    font-size: 8px;
    color: #dbdbdb;
}

#checkbox {
    width: 70%;
    display: flex;
    align-items: center;
}
</style>