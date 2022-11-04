import { reactive } from 'vue'

interface User { //类型匹配
    username: string;
    password: string;
}

export const loginUser = reactive<User>({
    username: "",
    password: "",
});

interface Rules {
    username: ({
        message: string;
        required: boolean;
        trigger: string;
    } | {
        min: number;
        max: number;
        message: string;
        trigger: string;
    })[];
    password: ({
        required: boolean;
        message: string;
        trigger: string;
        min?: undefined;
        max?: undefined;
    } | {
        min: number;
        max: number;
        message: string;
        trigger: string;
        required?: undefined;
    })[];
}

// 校验规则
export const rules = reactive<Rules>({
    username: [{ message: "用户名不可为空..", required: true, trigger: 'blur' }, { min: 2, max: 30, message: "长度应为2到30个字符..", trigger: 'blur' }],
    password: [{ message: "密码不可为空..", required: true, trigger: 'blur' }, { min: 6, max: 30, message: "密码长度应为6到30位数..", trigger: 'blur' }],
});