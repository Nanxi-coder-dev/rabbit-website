//购物车相关接口
import requset from '@/utils/http'

/**
 * @description: 加入购物车接口
 * @data {Object} { skuId, count } 商品skuId、count
 * @return {*}
 */
 export const addCartAPI = ({skuId, count}) => {
    return requset({
        url: '/member/cart',
        method: 'POST',
        data: {
            skuId,
            count
        }
    })
}

/**
 * @description: 加入购物车接口
 * @param {*}
 * @return {*}
 */
export const findNewCartListAPI = () => {
    return requset({
        url: '/member/cart'
    })
}

/**
 * @description: 删除购物车商品接口
 * @data {Array} ids skuId合集
 * @return {*}
 */
export const delCartAPI = (ids) => {
    return requset({
        url: '/member/cart',
        method: 'DELETE',
        data: {
            ids
        }
    })
}

/**
 * @description: 合并购物车商品接口
 * @data {Array} 商品skuId、selected、count
 * @return {*}
 */
export const mergeCartAPI = (data) => {
    return requset({
        url: '/member/cart/merge',
        method: 'POST',
        data
    })
}