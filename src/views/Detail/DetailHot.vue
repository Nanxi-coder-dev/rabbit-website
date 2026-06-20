<script setup>
//24小时为例获取数据，渲染模板
import { getHotGoodsAPI } from '@/apis/detail';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

//设计props参数 适配不同的title和数据
const props = defineProps({
    hotType: {
        type: Number
    }
})
//适配title，先定义关系对应表，再利用tpye值通过计算属性进行判断
const typeMap = {
    1: '24小时热榜',
    2: '周热榜'
}
//通过[属性访问器]（由于对象是数字开头，不可以使用点方法），动态获取对象的属性值
const title = computed(() => typeMap[props.hotType])

const hotList = ref([])
const route = useRoute()
const getHotList = async() => {
    const res = await getHotGoodsAPI({
        id: route.params.id,
        //通过父组件传来的props中包含的type值来适配列表
        type: props.hotType
    })
    hotList.value = res.result
}
onMounted(() => getHotList())
</script>


<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <!-- 商品区块 -->
    <RouterLink :to="`/detail/${item.id}`" class="goods-item" v-for="item in hotList" :key="item.id">
      <img :src="item.picture" alt="" />
      <p class="name ellipsis">{{ item.id }}</p>
      <p class="desc ellipsis">{{ item.desc }}</p>
      <p class="price">&yen;{{ item.price }}</p>
    </RouterLink>
  </div>
</template>


<style scoped lang="scss">
.goods-hot {
  h3 {
    height: 70px;
    background: $helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }

  .goods-item {
    display: block;
    padding: 20px 30px;
    text-align: center;
    background: #fff;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }
}
</style>