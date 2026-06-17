通用模板适配使用思路：
有几种情况就准备几个template模板，通过条件控制进行渲染

<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

//获取用户数据中的token
const userStore = useUserStore()
const router = useRouter()

//退出登录业务实现
const confirm = () => {
  //1.清除用户数据,触发action
  userStore.clearUserInfo()
  //2.跳转登录页
  router.push('/login')
}

</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <!-- 登录模板区域，区分登陆状态与非登陆状态 -->
         <!-- 适配思路：登陆时显示第一块模板，未登录时显示第二块模板 以token作为判断 -->
        <template v-if="userStore.userInfo.token">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{ userStore.userInfo.account }}</a></li>
          <li>
            <!-- 该组件提供confirm事件进行触发 -->
            <el-popconfirm @confirm="confirm" title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <a href="javascript:;">退出登录</a>
              </template>
            </el-popconfirm>
          </li>
          <li><a href="javascript:;"@click="$router.push('/member/order')" >我的订单</a></li>
          <li><a href="javascript:;" @click="$router.push('/member')">会员中心</a></li>
        </template>
        <template v-else>
          <li><a href="javascript:;" @click="$router.push('/login')">请先登录</a></li>
          <li><a href="javascript:;">帮助中心</a></li>
          <li><a href="javascript:;">关于我们</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>


<style scoped lang="scss">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: $xtxColor;
        }
      }

      ~li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>