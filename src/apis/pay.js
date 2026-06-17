//支付页接口封装
import request from '@/utils/http'

/**
* @description: 获取结算信息
* @param {*} id 订单id
* @return {*}
*/
export const getOrderAPI = (id) => {
    return request({
        url: `/member/order/${id}`
    })
} 