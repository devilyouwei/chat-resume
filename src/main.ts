import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import "highlight.js/styles/dark.css";
import 'md-editor-v3/lib/preview.css'
import 'swiper/css/swiper.css'
import '@/assets/style/marquee.css'
import '@/assets/style/index.scss'

createApp(App).use(store).use(router).mount('#app')
