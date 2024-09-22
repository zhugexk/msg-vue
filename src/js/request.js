import axios from 'axios'

//创建一个新的axios对象
const request = axios.create({
    baseURL: process.env.VUE_APP_BASEURL,   //·后台接口地址
    timeout: 30000
})

// request 拦截器
// 可以在请求发送前对请求做一些处理
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config
},error => {
    console.error('request error: ' + error)
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        
        // 兼容服务器返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) :res
        }
        return res;
    },
    error => {
        console.error("response error: " + error)
        return Promise.reject(error)
    }
)

export default request