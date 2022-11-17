import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElLoading } from 'element-plus'

let loading: any;
const startloading = () => {
    interface Options {
        lock: boolean;
        text: string;
        background: string;
    };
    const options: Options = {
        lock: true,
        text: "加载中...",
        background: "rgba(231, 76, 60,1.0)"
    };
    loading = ElLoading.service(options)
};

const endLoading = () => {
    loading.close();
};

//请求拦截
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    //加载loading
    startloading();
    return config
})
//相应拦截
axios.interceptors.response.use((response: AxiosResponse<any>) => {
    //结束loading
    endLoading();

    return response
}, error => {
    endLoading();
    return Promise.reject(error)
})


export default axios;