<template>
    <div id="userperm">
        <BreadMenu :page_name="'用户管理'"></BreadMenu>
        <div class="body ylmty">
            <div style="display:flex; justify-content: flex-end;">
                <el-button type="primary" :icon="Plus" @click="dialogVisible = true">新增用户组</el-button>

            </div>
            <div class="body ylmty">
                <h5 style="font-size:25px;">用户组</h5>
                <el-divider />
                <el-row :gutter="10">
                    <el-col :lg="3" :xs="12" v-for="(item, index) in all_groups" :key="index">
                        <el-button-group class="ml-4">
                            <el-button type="primary">{{ item.name }}</el-button>
                            <el-button @click="deleteGroup(item.name)" type="primary" :icon="Delete" />
                        </el-button-group>
                    </el-col>
                </el-row>
            </div>

            <div class="body ylmty">
                <h5 style="font-size:25px;">用户</h5>
                <el-divider />
                <el-row :gutter="10">
                    <el-col :span="16">
                        <div class="body ylmty">
                            <el-transfer v-model="choosed_user" filterable :filter-method="filterMethod"
                                filter-placeholder="State Abbreviations" :data="userlist" />
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="body ylmty">
                            <el-radio-group v-model="choosed_group" class="ml-4" v-for="(item, index) in all_groups"
                                :key="index">
                                <el-radio :label="index" size="large" @click="chooseGroup(index)"
                                    style="width:110px;margin:5px 0;" border>{{
                                            item.name
                                    }}</el-radio>
                            </el-radio-group>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="body ylmty">
                            <el-button @click="setUsertoGroup()" type="success">Success</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>


    <!-- 新增用户模板 -->
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

<script lang="ts" setup>
import BreadMenu from '@/components/Commons/BreadMenu.vue';
import { ArrowRight, Delete, Plus } from '@element-plus/icons-vue';
import axios from 'axios';
import Qs from 'qs';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import store from '@/store';
// 选择用户组
const chooseGroup = (index) => {
    choosed_group.value = index
}
// 保存用户分配
const choosed_group = ref<number>(0)
const setUsertoGroup = () => {
    let Group = all_groups.value[choosed_group.value]
    let userlist = choosed_user.value

    if (userlist.length == 0) {
        ElMessage.warning("未选择用户..")
        return
    }
    //提交用户组分配
    axios({
        url: 'http://127.0.0.1:9000/api/ylmty-group/',
        method: 'post',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            group: Group.name,
            userlist: JSON.stringify(userlist),
        })
    }).then((res) => {
        console.log(res.data)
        if (res.data == 'nologin') {
            ElMessage.error('用户信息过期或未登录.')
            return
        }
        if (res.data == 'noperm') {
            ElMessage.error('当前用户权限不足.')
            return
        }
        if (res.data == 'ok') {
            ElMessage.success('分配成功.')
        }
    })
}


// 用户列表
const userlist = reactive([])
const choosed_user = ref([])
const getUserList = () => {
    axios({
        url: "http://127.0.0.1:9000/api/ylmty-userlist/",
        method: 'get'
    }).then((res) => {
        let data = res.data
        data.forEach((user) => {
            userlist.push({
                lable: user.name,
                key: user.name,
                name: user.name
            })
        });
    })
}

// 搜索用户
const filterMethod = (query, item) => {
    return item.name.toLowerCase().includes(query.toLowerCase())
}

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
// 载入加载
onMounted(() => {
    getAllGrounp()
    getUserList()
})

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

// 删除用户组
const deleteGroup = (name) => {
    ElMessageBox.confirm(
        '确定删除该用户组?',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            axios({
                url: 'http://127.0.0.1:9000/api/ylmty-group/',
                method: 'delete',
                data: Qs.stringify({
                    name: name,
                    token: store.getters.isnotUserlogin.token,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
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
                if (res.data == 'ok'|| res.data == 'perm_pass') {
                    ElMessage.success('成功删除.')
                    getAllGrounp()
                }
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })




}

let all_groups = ref([])
// 获取所有用户组
const getAllGrounp = () => {
    axios({
        url: 'http://127.0.0.1:9000/api/ylmty-group/',
        method: 'get',
    }).then((res) => {
        // console.log(res.data)
        all_groups.value = res.data
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
                    console.log(res.data)
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

</script>

<style scoped>
#userperm {
    max-width: 1366px;
    margin: 0 auto;
    margin-top: 70px;
}

.ylmty {
    padding: 10px 10px;
}

.new_group {
    height: 150px;
}

.perm-list {
    margin-top: 10px;
    border: 1px solid;
    border-radius: 5px;
    padding: 5px;
}

.el-checkbox-group {
    display: flex;
    justify-content: space-between;
}

.el-checkbox.is-bordered.el-checkbox--large {
    margin-right: 10px;
}

.el-checkbox.is-bordered.el-checkbox--large:last-of-type {
    margin-right: 0 !important;
}
</style>