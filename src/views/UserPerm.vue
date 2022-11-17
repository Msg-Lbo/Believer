<template>
    <div id="root">
        <BreadMenu :page_name="'用户管理'" style="margin: 10px 30px;"></BreadMenu>
        <div class="body ylmty" style="margin: 10px 30px;">
            <div style="display:flex; justify-content: flex-end;">
                <el-button type="primary" :icon="Plus" @click="dialogVisible = true">新增用户组</el-button>

            </div>
            <div class="body ylmty">
                <h5 style="font-size:25px;">用户组</h5>
                <el-divider />
                <el-row :gutter="10">
                    <el-col :lg="4" :xs="12" v-for="(item, index) in all_groups" :key="index">
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
                <el-table :data="filteruserlist" stripe style="width: 100%">
                    <el-table-column label="ID" prop="id" />
                    <el-table-column label="用户名" prop="name" />
                    <el-table-column label="用户组" prop="group" />
                    <el-table-column align="right">
                        <template #header>
                            <el-input v-model="search" size="small" placeholder="Type to search" />
                        </template>
                        <template #default="scope">
                            <el-button size="small" type="warning" @click="handleEdit(scope.$index, scope.row)">Edit
                            </el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>


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

    <!-- 编辑用户模板 -->
    <el-dialog v-model="dialogFormVisible" title="编辑用户" width="40%" :before-close="handleClose" style="min-width:400px">
        <el-form :model="Edit_form">
            <el-form-item label="ID" :label-width="'140px'">
                <el-input v-model="Edit_form.id" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户名" :label-width="'140px'">
                <el-input v-model="Edit_form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户组" :label-width="'140px'">
                <el-select v-model="Edit_form.group" placeholder="Please select a zone">
                    <el-option v-for="(item, index) in all_groups" :key="index" :label="item.name" :value="item.name" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="setUsertoGroup">
                    Confirm
                </el-button>
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
import { computed, onMounted, reactive, ref } from 'vue';
import store from '@/store';

// 载入加载
onMounted(() => {
    getAllGrounp()
    getUserList()
})

// 
const dialogFormVisible = ref(false)
const Edit_form = reactive({
    name: null,
    group: null,
    id: null,
})

const setUsertoGroup = () => {
    //提交用户组分配
    axios({
        url: 'http://127.0.0.1:9000/api/ylmty-group/',
        method: 'post',
        data: Qs.stringify({
            token: store.getters.isnotUserlogin.token,
            group: Edit_form.group,
            id: Edit_form.id,
            newusername: Edit_form.name
        })
    }).then((res) => {
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

// 搜索用户
const search = ref('')
const filteruserlist = computed(() =>
    userlist.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)
const handleEdit = (index: number, row: User) => {
    dialogFormVisible.value = true
    Edit_form.name = row.name
    Edit_form.group = row.group
    Edit_form.id = row.id
    console.log(index)
}
const handleDelete = (index: number, row: User) => {
    console.log(index, row)
}

interface User {
    name: string
    group: string
    id: number
}
// 用户列表
let userlist = reactive([])
const choosed_user = ref([])
const getUserList = () => {
    axios({
        url: "http://127.0.0.1:9000/api/ylmty-userlist/",
        method: 'get'
    }).then((res) => {
        Object.assign(userlist, res.data)
        console.log(userlist)
    })
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
                if (res.data == 'ok' || res.data == 'perm_pass') {
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

</script>

<style scoped>

.ylmty {
    padding: 10px 10px;
    
}

.new_group {
    height: 150px;
}

.perm-list {
    margin-top: 10px;
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