/* 1.按照业务以‘use’开头声明逻辑函数；
2.把独立的业务逻辑封装到各个函数内部；
3.函数把组件中需要使用的数据和方法return出去，并导出函数；
4.在组件中使用函数中的方法和数据来实现组件业务。 */

//Banner业务函数封装
import { getBannerAPI } from '@/apis/home';
import { ref, onMounted } from 'vue';


export const useBanner = () => {
    const bannerList = ref([])
    const getBanner = async() => {
    const res = await getBannerAPI({distributionSite: "2"})
    bannerList.value = res.result
    }

    onMounted( () => getBanner() )

    return {
        bannerList
    }
}
