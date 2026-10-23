<script setup>
import { computed, watchEffect } from 'vue'
import subSet from './subSet';
const props = defineProps({
    goods: {
        type: Object,
        default: () => ({ specs: [], skus: [] })
    }
})

// 商品数据
const goods = computed(() => props.goods);
let pathMap = {};

// 显示规格是否可选
const getPathMap = (goods) => {
    const pathMap = {};
    // 1.依据 skus.item.inventory 字段，通过  filter 方法筛选符合条件的规格
    const effectiveSkus = goods.skus.filter(item => item.inventory > 0)
    // 2.通过幂集算法将 effectiveSkus 字段中的每个有效库存（[蓝色]-[20cm]-[美国]）生成所有可选子路径[[蓝色],[20cm],[美国],[[蓝色]-[20cm]],...]
    effectiveSkus.forEach(sku => {  // forEach遍历整个数组，对每个元素按要求进行操作，没有返回值
        // 2.1 抽离 effectiveSkus.spec 的 ValName 属性，方便后续操作
        const selectedValArr = sku.specs.map(item => item.valueName);
        // 2.2 通过幂集算法，生成当前规格的全部可选项[蓝色]-[20cm] -> [蓝色],[20cm],[[蓝色],[20cm]]
        const selectedSubSet = subSet(selectedValArr);
        // 3.将生成的 selectedSubSet 存入 pathMap
        // 3.1 通过 join 方法将可选项[[蓝色],[20cm]] -> '蓝色'-'20cm'
        selectedSubSet.forEach(arr => {
            const key = arr.join("-");
            if(pathMap[key]){
                // 该条选项已存在，补充可选id
                pathMap[key].push(sku.id);
            } else {
                // 该条选项不存在，设置可选id
                pathMap[key] = [sku.id];
            }
        })
    })
    return pathMap;
}

// 初始化禁用无库存规格
const initDisabled = (specs, pathMap) => {
    // 遍历每一行
    specs.forEach(item => {
        // 遍历每一项
        item.values.forEach(val => {
            if(pathMap[val.name]) {
                val.disabled = false;
            } else {
                val.disabled = true;
            }
        })
    })
}

const emit = defineEmits(['change'])

watchEffect(() => {
    // 初始化路径字典
    pathMap = getPathMap(goods.value);
    // 初始化禁用状态
    initDisabled(goods.value.specs, pathMap);
})


/* 激活选项样式:
思路：如果选中的是当前样式 val，那么将当前样式 selected 置为 false；
      如果选中的是同列其他样式，那么先将当前其他样式 item.val 置为 false，再将当前 val 置为 true
 */
let changeSelectedStatus = (val, item) => {
    // 没有库存不可选
    if (val.disabled) return;

    if(val.selected) {
        // 选中当前规格
        val.selected = false;
    } else {
        item.values.forEach(val => {
            val.selected = false;
        });
        val.selected = true;
    }
    // 切换时更新禁用状态
    updateDisabledStatus(goods.value.specs, pathMap);
    // 产出有效的sku信息
    // 通过 findIndex 查找 selectedValArr 中是否有未选中项
    const index = getSelectedValArr(goods.value.specs).findIndex(item => item === undefined);
    if (index > -1) {
        console.log("存在未选中项，无法产出有效信息")
         emit('incomplete', { missingCount: getSelectedValArr(goods.value.specs).filter(item => !item).length })
    } else {
        const key = getSelectedValArr(goods.value.specs).join("-");
        const skuId = pathMap[key];
        const sku = goods.value.skus.find(item => item.id === skuId[0]);
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').trim()
        })
    }

}

// 获取当前选中规格属性值，通过数组方式保存，方便 join 方法转为 key
const getSelectedValArr = (specs) => {
    const selectedArr = [];
    // 1.遍历每一个规格
    specs.forEach(spec => {
        // 2.通过 find 方法与 selected 属性找到被选中的规格属性值
        const selectedVal = spec.values.find(val => val.selected);
        // 3.按顺序拼入对应选中值
        selectedArr.push(selectedVal ? selectedVal.name : undefined)
    })
    return selectedArr;
}

// 切换选中规格时更新禁用状态 [undefine，20cm，中国]
 /* 思路：根据已选择状态任意n项（values.name）与假设未选一项（values.name）组成 key 进行匹配（pathMap），
 判断当前规格是否有禁用*/
const updateDisabledStatus = (specs, pathMap) => {
    // 1.遍历每一项规格，判断该规格具体属性是否禁用
    specs.forEach((spec, index) => {
        // 2.获取当前选择状态，与当前规格每一属性形成 key，判断是否禁用
        const selectedValArr = getSelectedValArr(specs);
        spec.values.forEach(val => {
            if (val.selected) return;
            // 做个浅拷贝，数据兜底
            const _seletedValArr = [...selectedValArr];
            _seletedValArr[index] = val.name;
            // 通过 filter 去掉 undefine 的属性值，使得结果不含-
            const key = _seletedValArr.filter(value => value).join('-');
            // 路径字典中查找是否有数据 有-可以点击 没有-禁用
            val.disabled = !pathMap[key];
        })
    })
}
</script>

<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <!-- 图片类型规格 -->
          <img :class="{selected: val.selected, disabled: val.disabled}" v-if="val.picture" :src="val.picture" :title="val.name" @click="changeSelectedStatus(val, item)">
          <!-- 文字类型规格 -->
          <span :class="{selected: val.selected, disabled: val.disabled}" v-else @click="changeSelectedStatus(val, item)">{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<style scoped lang="scss">
@mixin sku-state-mixin {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;

  &.selected {
    border-color: #27ba9b;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      >img {
        width: 50px;
        height: 50px;
        margin-bottom: 4px;
        @include sku-state-mixin;
      }

      >span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin-bottom: 4px;
        @include sku-state-mixin;
      }
    }
  }
}
</style>