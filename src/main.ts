import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupElementPlus } from './plugins/element-plus'
import { setupPermissionDirective } from './directives/permission'
import './styles/index.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupElementPlus(app)
setupPermissionDirective(app)

app.mount('#app')
