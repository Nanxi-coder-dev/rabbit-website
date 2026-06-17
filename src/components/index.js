//通过插件方式把components中的所有组件进行全局化注册
import ImageView from '@/components/ImageView/index.vue'
import XtxSku from '@/components/XtxSku/index.vue'

export const componentsPlugin = {
    install(app) {
        //app.component('组件名称'， 配置的对象组件)
        app.component('XtxImageView', ImageView)
        app.component('XtxSku', XtxSku)
    }
}