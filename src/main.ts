import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

// Tailwind CSS
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
