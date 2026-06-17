/*封装功能函数逻辑：
*1.编写函数框架，确定参数和返回值；
*2.编写函数核心逻辑；
*3.进行格式优化或代码优化。
 */

//封装倒计时函数
import dayjs from "dayjs"
import { computed, onMounted, ref } from "vue"

export const useCountDown = () => {
    let timer = null
    //1.显示倒计时数据
    const time = ref(0)
    //通过计算属性进行格式化
    //unix负责处理时间戳转化为day.js对象，format负责格式化YYYY-MM-DD HH:mm:ss
    const formatTime = computed(() => dayjs.unix(time.value).format('mm分ss秒'))
    //2.开始倒计时的逻辑
    const start = (currentTime) => {
        //核心逻辑：每过一秒，当前剩余时间就减一（计时器）
        time.value = currentTime
        timer = setInterval(() => {
            time.value --
        }, 1000)
    }
    //组件销毁时清除定时器
    onMounted(() => {
        timer && clearInterval(timer)
    })
    return {
        formatTime,
        start
    }
}