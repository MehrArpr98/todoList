import './assets/base.css'
import './assets/main.css'

import { createApp } from 'vue'
import VeeValidatePlugin from './includes/validation'
import App from './App.vue'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import MasonryWall from '@yeger/vue-masonry-wall'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const app = createApp(App)

app.component('VueDatePicker', VueDatePicker)
app.use(MasonryWall)
app.use(VueSweetalert2)
app.use(VeeValidatePlugin)

app.mount('#app')
