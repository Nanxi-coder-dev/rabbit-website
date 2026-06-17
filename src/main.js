//引入初始化样式
import '@/styles/common.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
//引入懒加载插件并注册
import { lazyPlugin } from './directives/lazy'
//引入组件插件并注册
import { componentsPlugin } from './components/index'


const app = createApp(App)
const pinia = createPinia()

//注册pinia插件，实现token持久化
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(componentsPlugin)
app.mount('#app')
