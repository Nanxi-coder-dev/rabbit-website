//createRouter：创建router实例对象
//createWebHistory：创建history模式路由

import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login/index.vue";
import Layout from "@/views/Layout/index.vue";
import Home from "@/views/Home/index.vue";
import Category from "@/views/Category/index.vue";
import SubCategory from "@/views/subCategory/index.vue";
import Detail from "@/views/Detail/index.vue";
import CartList from "@/views/CartList/index.vue";
import CheckOut from "@/views/CheckOut/index.vue";
import Pay from "@/views/Pay/index.vue";
import PayBack from "@/views/Pay/PayBack.vue";
import Member from "@/views/Member/index.vue";
import MemberInfo from "@/views/Member/components/MemberInfo.vue";
import MemberOrder from "@/views/Member/components/MemberOrder.vue";
import { pendingRequest } from "@/utils/http";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //path和component关系对应的位置
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "", //当二级路由路径置空时会与一级路由同时显示
          component: Home,
        },
        {
          path: "category/:id",
          component: Category,
        },
        {
          path: "category/sub/:id",
          name: "subCategory",
          component: SubCategory,
        },
        {
          path: "detail/:id",
          name: "detail",
          component: Detail,
        },
        {
          path: "cartlist",
          name: "cartList",
          component: CartList,
        },
        {
          path: "checkout",
          name: "checkout",
          component: CheckOut,
        },
        {
          path: "pay",
          name: "pay",
          component: Pay,
        },
        {
          path: "paycallback",
          name: "payback",
          component: PayBack,
        },
        {
          path: "member",
          name: "member",
          component: Member,
          children: [
            {
              path: "",
              name: "memberInfo",
              component: MemberInfo,
            },
            {
              path: "order",
              name: "memberOrder",
              component: MemberOrder,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      component: Login,
    },
  ],
  //路由滚动行为定制
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

router.beforeEach((to, from) => {
  // 取消请求缓存
  if (to.path !== from.path) {
    pendingRequest.forEach((ctrl) => ctrl.abort());
    pendingRequest.clear();
  }
  return true;
});

export default router;
