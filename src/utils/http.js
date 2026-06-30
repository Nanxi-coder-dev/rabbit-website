/* 为什么要携带token？
很多接口中都需要携带token才可以正确获取数据 */

/* config（完整请求配置对象）属性介绍
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
import { configProviderContextKey, ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";

//创建实例定义基础配置config
const httpInstance = axios.create({
  baseURL: "/api", //vite代理转发
  timeout: 8000,
  ignoreCancel: false,
  //全局默认json头请求，不用每次paot单独配置
  headers: {
    "Content-Type": "application/json",
  },
});

//优化1：重复请求拦截，通过axios自带的AbortController来终止网络请求
export const pendingRequest = new Map();
//请求创建与删除检查
let getReqKey = (config = {}) => {
  //设计规则：把请求方式 + 地址接口 + 参数请求 拼接成唯一字符
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
};

let removeReqKey = (reqKey) => {
  if (pendingRequest.has(reqKey)) {
    // 使用abort取消请求
    pendingRequest.get(reqKey).abort();
    pendingRequest.delete(reqKey);
  }
};

let createController = (config, reqKey) => {
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingRequest.set(reqKey, controller);
};

//拦截器
// 添加请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    //1.获取userStore中的token数据
    const userStore = useUserStore();
    const token = userStore.userInfo.token;
    //2.根据后端要求拼接token数据
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 优化1：并行请求放行
    if (!config.ignoreCancel) {
      //优化1：发送新请求前，先取消同类型的未完成就旧请求
      const reqKey = getReqKey(config);
      removeReqKey(reqKey);
      //优化1：创建新的abortController对象，并存入map
      createController(config, reqKey);
    }
    return config;
  },
  (e) => {
    return Promise.reject(e);
  },
);

// 添加响应拦截器
httpInstance.interceptors.response.use(
  //成功直接获取接口信息
  (res) => {
    //优化1：成功删除
    removeReqKey(getReqKey(res.config));
    return res.data;
  },
  // 统一错误提示
  (e) => {
    // 优化1：失败删除
    if (axios.isCancel(e)) {
      return new Promise(() => {});
    }
    if (e.config) {
      removeReqKey(getReqKey(e.config));
    }

    // 优化2：处理断网、超时、跨域，e.response不存在的情况
    if (!e.response) {
      if (e.message.includes("timeout")) {
        ElMessage({ type: "warning", message: "请求超时，请重试" });
      } else {
        ElMessage({ type: "warning", message: "网络连接失败，请检查" });
      }
    } else {
      // 有响应，存在status、data
      const userStore = useUserStore();
      ElMessage({
        type: "warning",
        message: e.response.data.message,
      });
      //401token失效处理
      if (e.response.status === 401) {
        //1.清除本地用户数据
        userStore.clearUserInfo();
        //2.跳转至登录页
        router.push("/login");
      }
    }
    return Promise.reject(e);
  },
);

export default httpInstance;
