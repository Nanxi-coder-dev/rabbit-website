//管理用户相关数据
//将与用户有关的数据都放进pinia进行统一管理，组件只触发action函数
//模块持久化开启：安装插件包 -> pinia注册插件 -> 需要持久化的store进行配置
//跨模块调用执行时机应该在函数内部

import { loginAPI } from "@/apis/user";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useCartStore } from "./cart";
import { mergeCartAPI } from "@/apis/cart";

export const useUserStore = defineStore('user', () => {

    //1.定义管理用户数据的state
    const userInfo = ref({})
    
    //获取cart数据
    const cartStore = useCartStore()

    //2.定义获取接口数据的action函数
    const getUserInfo = async({ account, password }) => {

        const res = await loginAPI({ account, password })
        userInfo.value = res.result
        //合并购物车数据
        /* arr.map(callback(currentValue[, index[, array]])[, thisArg])
        将符合条件的元素作为一个新数组返回，不改变原数组 */
        await mergeCartAPI( cartStore.cartList.map( item => {
            return {
                skuId: item.skuId,
                selected: item.selected,
                count: item.count
            }
        }))
        //更新购物车列表
        cartStore.updateNewList()
    }
    //清除用户数据
    const clearUserInfo = () => {
        userInfo.value = {}
        //清除购物车数据
        cartStore.clearCart()
    }
    //3.以对象的形式导出
    return {
        userInfo,
        getUserInfo,
        clearUserInfo
    }
},
{
    /* 通过配置persist属性实现token记录持久化 */
    persist: true,
})