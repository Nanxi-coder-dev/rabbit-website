//跟order有关接口
import request from '@/utils/http'

/**
 * @description: 获取order信息
 * @praams {
        orderState: 0,
        page: 1,
        pageSize: 2
 * @return {*}
 * }
*/
export const getUserOrder = (params) => {
  return request({
    url:'/member/order',
    method:'GET',
    params
  })
}