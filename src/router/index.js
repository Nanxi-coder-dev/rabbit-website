//createRouter：创建router实例对象
//createWebHistory：创建history模式路由
import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/views/Layout/index.vue";
import { pendingRequest } from "@/utils/http";

// 路由懒加载：动态导入，访问路由时才加载对应组件分包
const Login = () => import("@/views/Login/index.vue");
const Home = () => import("@/views/Home/index.vue");
const Category = () => import("@/views/Category/index.vue");
const SubCategory = () => import("@/views/subCategory/index.vue");
const Detail = () => import("@/views/Detail/index.vue");
const CartList = () => import("@/views/CartList/index.vue");
const CheckOut = () => import("@/views/CheckOut/index.vue");
const Pay = () => import("@/views/Pay/index.vue");
const PayBack = () => import("@/views/Pay/PayBack.vue");
const Member = () => import("@/views/Member/index.vue");
const MemberInfo = () => import("@/views/Member/components/MemberInfo.vue");
const MemberOrder = () => import("@/views/Member/components/MemberOrder.vue");

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
  // 路由切换时取消所有进行中请求、清空缓存，防止内存泄漏
  if (to.path !== from.path) {
    pendingRequest.forEach((ctrl) => ctrl.abort());
    pendingRequest.clear();
  }
  return true;
});

export default router;
