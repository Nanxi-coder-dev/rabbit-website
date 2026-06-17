//订单页面的接口
import request from '@/utils/http'

/**
* @description: 获取结算信息
* @param {*}
* @return {*}
*/
export const getCheckOutInfoAPI = () => {
    return request({
        url: '/member/order/pre'
    })
}

/**
 * @description: 创建订单接口
 * @data {
 *      deliveryTimeType: 1,
 *      payType: 1,
 *      buyerMessage: '',
 *      goods: [ {skuId, count} ],
 *      addressId
 * }
 * @return {*}
*/
export const createOrderAPI = (data) => {
    return request({
        url: 'member/order',
        method: 'POST',
        data
    })
}