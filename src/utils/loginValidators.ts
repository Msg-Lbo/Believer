import { ElMessage } from 'element-plus';
import { reactive } from 'vue'

interface Login { //类型匹配
    username: string;
    password: string;
}

export const loginUser = reactive<Login>({
    username: "",
    password: "",
});

