import { createStore } from 'vuex'
import axios from 'axios';
import Qs from 'qs';
import { ElMessage } from 'element-plus';
import router from '@/router';

export default createStore({
  state: {
    userinfo: {
      headImg: '',
      nickName: '',
      token: '',
    },
    other_settings: {
      isreg: '',
      webt:''
    }
  },
  getters: {
    // 查询登录状态
    isnotUserlogin(state) {
      return state.userinfo
    }
  },
  mutations: {
    // 保存 注册登录用户信息
    saveUserinfo(state, userinfo) {
      state.userinfo = userinfo
    },
    //清空用户登录状态
    clearUserinfo(state) {
      state.userinfo.headImg = ''
      state.userinfo.nickName = ''
      state.userinfo.token = ''
    }
  },
  actions: {
    // 登录
    webLogin({ commit }, loginUser) {
      axios({
        url: 'http://127.0.0.1:9000/api/ylmty-login/',
        method: 'post',
        data: Qs.stringify(loginUser)
      }).then((res) => {
        if (res.data == 'none') {
          ElMessage.error('没有这个用户名，请检查...')
          return
        }
        if (res.data == 'pwderr') {
          ElMessage.error('密码错误...')
          return
        }
        // console.log(res.data)
        commit('saveUserinfo', res.data)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('headImg', res.data.headImg)
        router.push({ path: '/' })
      })
    },
    // 注册
    webRegister({ commit }, registerUser) {
      axios({
        url: 'http://127.0.0.1:9000/api/ylmty-register/',
        method: 'post',
        data: Qs.stringify(registerUser)
      }).then((res) => {
        if (res.data == 'repeat') {
          ElMessage.warning('用户名已存在...')
          return
        }
        // console.log(res.data)
        // localStorage.setItem('token', res.data.token)
        ElMessage.success('注册成功，请前往登录')
        router.push({ path: '/login' })
      })
    },
    // 自动登录
    TryAoutLogin({ commit }) {
      let token = localStorage.getItem('token')
      let rember = localStorage.getItem('rember')
      if (rember == 'true') {
        if (token) {
          axios({
            url: 'http://127.0.0.1:9000/api/auto-login/',
            method: 'post',
            data: Qs.stringify({ token })
          }).then((res) => {
            // console.log(res.data)
            if (res.data == 'tokenTimeout') {
              ElMessage.error('用户信息过期，请重新登录')
              return
            }
            commit('saveUserinfo', res.data)
            localStorage.setItem('token', res.data.token)
            router.push({ path: '/' })
          })
          return
        }
        return
      }
    },
    // 登出
    webLogout({ commit }, token) {
      commit('clearUserinfo')
      localStorage.clear();
      axios({
        url: 'http://127.0.0.1:9000/api/ylmty-logout/',
        method: 'post',
        data: Qs.stringify({ token })
      }).then((res) => {
        // console.log(res.data)
      })
    },
    // 权限判断
    async checkUserPerm({ getters }, checkInfo) {
      //用户
      let token = getters.isnotUserlogin.token
      let contentType = checkInfo.contentType
      let permissions = checkInfo.permissions
      // 鉴权结果
      let perm_data;
      await axios({
        url: 'http://127.0.0.1:9000/api/ylmty-checkperm/',
        method: 'post',
        data: Qs.stringify({
          token,
          contentType,
          permissions: JSON.stringify(permissions)
        })
      }).then((res) => {
        // console.log(res.data)
        if (res.data == 'nologin') {
          perm_data = false
          ElMessage.error('用户信息过期或未登录.')
          return
        }
        if (res.data == 'noperm') {
          perm_data = false
          ElMessage({
            message: '用户权限不足，请联系管理员.',
            type: 'warning',
            duration: 1000
          })
          return
        }
        if (res.data == 'ok') {
          perm_data = true
        }
      })
      return perm_data
    },
    // 获取其他设置
    // getsettings(state) {
    //   axios({
    //     url: 'http://127.0.0.1:9000/api/other-settings/',
    //     method: 'get'
    //   }).then((res) => {
    //     state.state.other_settings.isreg = res.data.isreg
    //     state.state.other_settings.webt = res.data.webt
    //   })
    // }
  },
  modules: {
  }
})
