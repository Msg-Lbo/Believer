import { reactive } from 'vue'

interface RegisterUser {
    username: string;
    email: string;
    password: string;
    password2: string;
}

export const registerUser = reactive<RegisterUser>({
    username: "",
    email: "",
    password: "",
    password2: "",
})


interface RegisterRules {
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
    email: {
        type: string;
        message: string;
        required: boolean;
        trigger: string;
    }[];
    password: ({
        required: boolean;
        message: string;
        trigger: string;
    } | {
        min: number;
        max: number;
        message: string;
        trigger: string;
    })[];
    password2: ({
        required: boolean;
        message: string;
        trigger: string;
    } | {
        min: number;
        max: number;
        message: string;
        trigger: string;
    } | {
        validator: (rule: RegisterRules, vulue: string, callback: any) => void;
        trigger: string;
    })[];
}

const validatePass2 = (rule: RegisterRules, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码..'))
    } else if (value !== registerUser.password) {
        callback(new Error("两次输入的密码不一致！"))
    } else {
        callback()
    }
}

// 校验规则
export const registerRules = reactive<RegisterRules>({

    username: [{ required: true, message: "用户名不可为空..", trigger: 'blur' }, { min: 2, max: 30, message: "长度应为2到30个字符..", trigger: 'blur' }],
    email: [{ required: true, type: "email", message: "请填写完整邮箱..", trigger: 'blur' }],
    password: [{ required: true, message: "密码不可为空..", trigger: 'blur' }, { min: 6, max: 30, message: "密码长度应为6到30位数..", trigger: 'blur' }],
    password2: [{ required: true, message: "请再次输入密码..", trigger: 'blur' }, { min: 6, max: 30, message: "密码长度应为6到30位数..", trigger: 'blur' }, { validator: validatePass2, trigger: 'blur' }],

});