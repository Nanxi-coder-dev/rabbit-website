//所有与用户有关的接口
import request from "@/utils/http";

/**
 * @description: 用户登录
 * @param {Object} { account, password } 账号、密码
 * @return {*}
 */
export const loginAPI = ({ account, password }) => {
  return request({
    url: "/login",
    method: "POST",
    data: {
      account,
      password,
    },
  });
};

/**
 * @description: 获取猜你喜欢商品列表
 * @param {Object} { limit = 4 } 获取个数
 * @return {*}
 */
export const getLikeListAPI = ({ limit = 4 }) => {
  return request({
    url: "/goods/relevant",
    params: {
      limit,
    },
  });
};
