import { reactive } from 'vue'

interface Register {
    username: string;
    email: string;
    password: string;
    password2: string;
}

export const registerUser = reactive<Register>({
    username: "",
    email: "",
    password: "",
    password2: "",
})
