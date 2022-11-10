<template>
    <div class="container">
        <div :class="{ 'form_box': true, 'login_register': islogin }" ref="form_box">
            <div ref="login_box" :class="{ 'login_box': true, 'hidden': ishidden }" :model="loginUser">
                <h1>login</h1>
                <input type="text" v-model="loginUser.username" placeholder="用户名">
                <input type="password" v-model="loginUser.password" placeholder="密码">
                <span id="checkbox">
                    <input type="checkbox" v-model="remberBoolean" />
                    <span>记住</span>
                </span>
                <button @click="handleLogin">登录</button>
            </div>
            <div ref="register_box" :class="{ 'register_box': true, 'hidden': !ishidden }" :model="registerUser">
                <h1>register</h1>
                <input type="test" v-model="registerUser.username" placeholder="用户名">
                <input type="email" v-model="registerUser.email" placeholder="邮箱">
                <input type="password" v-model="registerUser.password" placeholder="密码">
                <input type="password" v-model="registerUser.password2" placeholder="确认密码">
                <button @click="handlRegister">注册</button>
            </div>

        </div>
        <div class="content_box left">
            <h2>明月<span>几时有</span></h2>
            <p>把酒<span>问青天</span></p>
            <img src="../../assets/img/register.jpg" alt="">
            <p>没有账号?</p>
            <button @click="Switch_modes">去注册</button>
        </div>
        <div class="content_box right">
            <h2>不知天上<span>宫阙</span></h2>
            <p>今夕是<span>何年</span></p>
            <img src="../../assets/img/login.jpg" alt="">
            <p>已有账号</p>
            <button @click="Switch_modes">去登录</button>
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


let islogin = ref<boolean>(false)
let ishidden = ref<boolean>(false)
const Switch_modes = () => {
    ishidden.value = !ishidden.value
    islogin.value = !islogin.value
}

</script>

<style scoped>
.container {
    background-color: #fff;
    width: 650px;
    height: 415px;
    border-radius: 5px;
    box-shadow: 5px 5px 5px rega(0, 0, 0, .1);
    position: relative;
}


.form_box {
    position: absolute;
    top: -10%;
    left: 5%;
    background-color: rgb(220, 117, 102);
    width: 320px;
    height: 500px;
    border-radius: 5px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, .1);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    transition: 0.5s ease-in-out;
    transform: translateX(83%);
}

.login_register {
    background-color: rgb(187, 191, 219);
    transform: translateX(0%);
}

.register_box,
.login_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.hidden {
    display: none;
    transition: 0.5s;
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
    margin: 0;
    position: relative;
    transition: all .3s;
}
#checkbox input[type=checkbox]:checked{
    background-color: rgb(157, 170, 255);
    transition: all .3s;
}
#checkbox input[type=checkbox]:checked::after{
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
#checkbox span{
    margin-left: 5px;
    font-size: 8px;
    color: #dbdbdb;
}
#checkbox {
    width: 70%;
    display: flex;
    align-items: center;
    margin-top: 8px;
}


h1 {
    text-align: center;
    margin-bottom: 25px;
    text-transform: uppercase;
    color: #fff;
    letter-spacing: 5px;
}

input {
    background-color: transparent;
    width: 70%;
    color: #fff;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    padding: 10px 0;
    margin: 8px 0;
    font-size: 14px;
    letter-spacing: 2px;
}

input::placeholder {
    color: #fff;
}

input:focus {
    color: #a262ad;
    outline: none;
    border-bottom: 1px solid #a262ad80;
    transition: 0.5s;
}

input:focus::placeholder {
    opacity: 0;
}

.form_box button {
    width: 70%;
    margin-top: 20px;
    background-color: #f6f6f6;
    outline: none;
    border-radius: 8px;
    padding: 13px;
    color: a262ad;
    letter-spacing: 2px;
    border: none;
    cursor: pointer;
}

.form_box button:hover {
    background-color: #a262ad;
    color: #fff;
    transition: background-color 0.5s ease;
}

.content_box {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.content_box.left {
    left: -2%;
}

.content_box.right {
    right: -2%;
}

.content_box h2 {
    color: #8e9aaf;
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
    margin-bottom: 4px;
}

.content_box p {
    font-size: 12px;
    letter-spacing: 2px;
    color: #8e9aaf;
    text-align: center;
}

.content_box span {
    color: #d3b7b8;
}

.content_box img {
    width: 150px;
    height: 150px;
    opacity: 0.9;
    margin: 40px 0;
}

.content_box button {
    margin-top: 3%;
    background-color: #fff;
    color: #a262ad;
    border: 1px solid #d3b7b8;
    padding: 6px 10px;
    border-radius: 5px;
    letter-spacing: 1px;
    outline: none;
    cursor: pointer;
}

.content_box button:hover {
    background-color: #d3b7b8;
    color: #fff;
}
</style>