/* 为什么要携带token？
很多接口中都需要携带token才可以正确获取数据 */

/* config属性介绍
{
  // 基础属性
  url: '/api/users',     // 请求地址
  method: 'post',        // 请求方法：get/post/put/delete等
  baseURL: 'https://api.example.com',  // 基础URL
  
  // 请求头（最常用）
  headers: {
    'Content-Type': 'application/json',
    'Authorization': ''  // 我们就是在这里添加Token
  },
  
  // 请求参数
  params: { page: 1, size: 10 },  // URL查询参数（GET请求）
  data: { name: '张三', age: 18 }, // 请求体数据（POST请求）
  
  // 其他配置
  timeout: 5000,         // 超时时间
  withCredentials: false, // 是否携带Cookie
  responseType: 'json'   // 响应数据类型
}
*/

//axios基础的封装
import router from "@/router";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css';

//创建实例定义基础配置config
const httpInstance = axios.create({
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    timeout: 8000
})

//拦截器
// 添加请求拦截器
httpInstance.interceptors.request.use( (config) => {
    //1.获取userStore中的token数据
    const userStore = useUserStore()
    const token = userStore.userInfo.token
    //2.根据后端要求拼接token数据
    if(token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
httpInstance.interceptors.response.use(
    //成功直接获取接口信息
    res => res, 
    //统一错误提示
    e  => {
    const userStore = useUserStore()
    ElMessage({
      type: 'warning',
      message: e.response.data.message
    })
    //401token失效处理
    if (e.response.status === 401) {
      //1.清除本地用户数据
      userStore.clearUserInfo()
      //2.跳转至登录页
      router.push('/login')
    }
    return Promise.reject(e);
  });

export default httpInstance