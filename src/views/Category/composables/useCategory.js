//获取分类数据业务
import { getCategoryAPI } from '@/apis/category';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

export const useCategory = () => {
    const categoryData = ref({})
    const route = useRoute()
    //通过使用默认值，使得第一次可以成功加载路由
    const getCategory = async(id = route.params.id) => {
        const res = await getCategoryAPI(id)
        categoryData.value = res.data.result
    }

    onMounted(() => {
        getCategory()
    })
    //目标：路由发生变化的时候 数据可以重新发送请求
    onBeforeRouteUpdate((to) => {
    console.log("路由变化了")
    //onBeforeRoouteUpdate 中的 to 属性中可以获取到最新的路由 id
    getCategory(to.params.id)
    })


    return {
        categoryData
    }
}