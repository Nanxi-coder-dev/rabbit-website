//跟order有关接口
import request from "@/utils/http";

/**
 * @description: 获取用户订单列表
 * @param {Object} params { orderState, page, pageSize }
 * @return {*}
 */
export const getUserOrder = (params) => {
  return request({
    url: "/member/order",
    method: "GET",
    params,
  });
};
