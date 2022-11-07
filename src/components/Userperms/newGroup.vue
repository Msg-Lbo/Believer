<template>
    <!-- 新增用户组模板 -->
    <el-dialog v-model="dialogVisible" title="新建用户组" width="40%" :before-close="handleClose" style="min-width:400px">
        <el-form :inline="true" :model="new_group" class="demo-form-inline">
            <el-input v-model="new_group.name" class="w-50 m-2" size="large" placeholder="用户组名称" />
            <div class="perm-list" v-for="(item, index) in new_group.checkList" :key="index">
                <span>{{ item.name }}</span>
                <el-checkbox-group v-model="item.checkList">
                    <el-checkbox v-for="method in item.perm_methods" :label="method.codename" :key="method.codename"
                        size="large" border>
                        {{ method.name }}
                    </el-checkbox>

                </el-checkbox-group>
            </div>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewGroup()">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>import store from '@/store';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, ref } from 'vue';
import Qs from 'qs'

const emits = defineEmits(["dialogVisible"]);
const change = () => {
    emits('dialogVisible', dialogVisible.value)
}


// 用户组表单
const new_group = reactive({
    name: '',
    checkList: [
        {
            name: '文章管理',
            content_type: 'mweb_article',
            perm_methods: [
                {
                    name: '增',
                    codename: 'add'
                },
                {
                    name: '删',
                    codename: 'delete'
                },
                {
                    name: '改',
                    codename: 'change'
                },
                {
                    name: '查',
                    codename: 'view'
                },
            ],
            checkList: []
        },
        {
            name: '用户管理',
            content_type: 'auth_user',
            perm_methods: [
                {
                    name: '增',
                    codename: 'add'
                },
                {
                    name: '删',
                    codename: 'delete'
                },
                {
                    name: '改',
                    codename: 'change'
                },
                {
                    name: '查',
                    codename: 'view'
                },
            ],
            checkList: []
        },
        {
            name: '栏目管理',
            content_type: 'mweb_fenlei',
            perm_methods: [
                {
                    name: '增',
                    codename: 'add'
                },
                {
                    name: '删',
                    codename: 'delete'
                },
                {
                    name: '改',
                    codename: 'change'
                },
                {
                    name: '查',
                    codename: 'view'
                },
            ],
            checkList: []
        }
    ]
})
// 添加用户组模态框
const dialogVisible = ref(false)
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('确定退出吗？此操作无法保存以下配置', '警告！！！',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            done()
        })
        .catch(() => {

        })
}

// 保存用户组
const saveNewGroup = () => {
    if (new_group.name.length == 0) {
        ElMessage.warning("用户组名称不可为空.")
        return
    }
    // 判断权限的选择
    let checkType = false
    let perm_list = []
    new_group.checkList.forEach((obj) => {

        if (obj.checkList.length > 0) {
            checkType = true
            let perm_item = {
                content_type: obj.content_type,
                perm_methods: obj.checkList
            }
            perm_list.push(perm_item)

        }

    })
    //判断用户权限
    let checkInfo = {
        contentType: 'auth_user',
        permissions: ['add', 'change', 'delete', 'view']
    }
    if (checkType) {
        store.dispatch("checkUserPerm", checkInfo).then((res) => {
            if (res) {
                axios({
                    url: 'http://127.0.0.1:9000/api/ylmty-group/',
                    method: 'put',
                    data: Qs.stringify({
                        token: store.getters.isnotUserlogin.token,
                        new_group: new_group.name,
                        perm_list: JSON.stringify(perm_list)
                    })
                }).then((res) => {
                    // console.log(res.data)
                    if (res.data == 'nologin') {
                        ElMessage.error('用户信息过期或未登录.')
                        return
                    }
                    if (res.data == 'noperm') {
                        ElMessage.error('当前用户权限不足.')
                        return
                    }
                    if (res.data == 'same name') {
                        ElMessage.warning('用户组重名')
                        return
                    }
                    if (res.data == 'ok' || res.data == 'perm_pass') {
                        dialogVisible.value = false
                        ElMessage.success('添加成功.')
                        getAllGrounp()
                    }
                })
            }
        })
    } else {
        ElMessage.error('新用户组权限未选择.')
        return
    }
}
let all_groups = ref([])
const getAllGrounp = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/ylmty-group/',
        method: 'get',
    }).then((res) => {
        // console.log(res.data)
        all_groups.value = res.data
    })

}
</script>