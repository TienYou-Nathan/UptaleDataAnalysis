import { createApp } from 'vue'
import { SQLStore } from './SQLStore'
import App from './App.vue'

import '@fortawesome/fontawesome-free/js/all'

const myapp = createApp(App)
myapp.use(SQLStore)
myapp.mount('#app')

