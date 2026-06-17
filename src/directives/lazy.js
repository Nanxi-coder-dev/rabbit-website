//定义懒加载全局指令
import { useIntersectionObserver } from "@vueuse/core";

export const lazyPlugin = {
    install(app) {
        //懒加载指令逻辑
        app.directive('img-lazy', {
            mounted(el, binding) {
                // el: 指令绑定的那个元素(img),可以直接操作dom
                // binding对象: binding.value  指令等于号后面绑定的表达式的值（图片url）
                const { stop } = useIntersectionObserver( //通过解构赋值拿到stop()
                    //监听对象
                    el,
                    ([{ isIntersecting }]) => {
                        if (isIntersecting) {
                            el.src = binding.value
                            stop() //执行stop()使得第一次监听成功就结束，避免造成浪费
                        }
                    },
                )
            }
        })

    }
}