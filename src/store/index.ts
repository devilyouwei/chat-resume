import { createPinia } from "pinia"
import piniaPluginPersist from 'pinia-plugin-persist'

const store = createPinia()
// 持久化挂载
store.use(piniaPluginPersist)

export default store
