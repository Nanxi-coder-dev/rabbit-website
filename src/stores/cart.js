//定义本地购物车数据库
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./user";
import { addCartAPI, delCartAPI, findNewCartListAPI } from "@/apis/cart";

export const useCartStore = defineStore('cart', () => {
    
   
    //1.定义cartList响应数据 state
    const cartList = ref([])

    //获取token为判断shifou为登陆状态准备
    const isLogin = computed(() => {
        const userStore = useUserStore()
        return userStore.userInfo.token
    })
    //获取最新购物车列表
    const updateNewList = async () => {
        //1.获取购物车列表接口
        const res = await findNewCartListAPI()
        //2.更新本地购物车列表
        cartList.value = res.result
    }

    //2.定义操作购物车的action方法
    const addCart = async (goods) => {
        //添加购物车逻辑
        if(isLogin.value){
            const { skuId, count } = goods
            //处于登录状态：1.调用加入购物车接口
            await addCartAPI({skuId, count})
            //2.更新购物车列表
            updateNewList()
        } else {
            //处于非登录状态
            //思路:通过匹配cartList中每条数据中的skuId是否相符
            //存在有则该条数据count+1，不存在那么就push新数据进数组
            const item = cartList.value.find((item) => goods.skuId === item.skuId)
            if (item) {
                //存在
                item.count ++
            } else{
                //不存在
                cartList.value.push(goods)
            }
        }
    }
    //3.删除购物车商品函数
    const delCart = async (skuId) => {
        //判断是否为登录状态
        if (isLogin.value) {
            //处于登陆状态
            //1.调用删除购物车接口
            await delCartAPI([skuId])
            //2.更新购物车列表
            updateNewList()
        } else {
            //处于非登录状态
            //思路：用skuId进行匹配，删除cartList中对应的数据，findIndex：返回一个符合要求的元素
            //1.使用splice(从索引位置开始删除几个元素)，需要使用修改索引的起始位置且改变原数组
            /* const idex = cartList.value.findIndex( item => item.skuId === skuId )
            cartList.value.splice(idex, 1) */
            //2.使用filter,过滤不符合条件的数组,返回新数组，不改变原数组需要重新赋值
            cartList.value = cartList.value.filter( item => item.skuId !== skuId )
        }
    }

    //4.清除购物车数据
    const clearCart = () => {
        cartList.value = []
    }

    //5.操作单选功能，修改selected状态
    const singleCheck = (skuId, selected) => {
        //find方法：查找该数组中与条件匹配的首个元素，并返回该元素
        const item = cartList.value.find( (item) => item.skuId === skuId )
        item.selected = selected
    }

    //6.操作全选框
   /*  array.forEach(callback(currentValue[, index[, array]])[, thisArg])
    对每个元素按要求操作，没有返回值，不创建新数组，不能使用break、return中断，会修改原数组 */
    const allCheck = (selected) => {
        //将cartList中的元素的selected属性改为与全选框selected属性相同
        cartList.value.forEach( item => item.selected = selected)
    }

    //计算属性 computed传入一个回调函数
    //array.reduce(callback(acc, cur, (index, arry, initialValue)))：计算数组之和返回值，acc累加器，cur当前项
    //1.计算总数,count累加
    const sumCount = computed( () => cartList.value.reduce( (acc, cur) => acc + cur.count, 0 ) )
    //2.计算总价，count * price 累加
    const sumPrice = computed( () => cartList.value.reduce( (acc, cur) => acc + cur.count * cur.price, 0 ) )
    
    //3.计算已选择商品总数
    const selectedCount = computed( () => cartList.value.filter( item => item.selected ).reduce( (acc, cur) => acc + cur.count, 0 ))
    //4.计算已选择商品价格总数
    const selectedPrice = computed( () => cartList.value.filter( item => item.selected ).reduce( (acc, cur) => acc + cur.count * cur.price, 0 ) )

    //是否全选
    //array.every(callback(element[, index[, array]]))，返回ture：所有元素通过，返回false：至少有一项未通过
    const isAll = computed(() => cartList.value.every( item => item.selected ))
    
    //导出
    return {
        cartList,
        sumCount,
        sumPrice,
        isAll,
        selectedCount,
        selectedPrice,
        updateNewList,
        addCart,
        delCart,
        clearCart,
        singleCheck,
        allCheck
    }
},
{
    persist: true,
})
