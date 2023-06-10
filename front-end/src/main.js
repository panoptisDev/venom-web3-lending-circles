import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router'
import store from '@/store'
import ElementPlus from 'element-plus'
import VCalendar from 'v-calendar'
import VueCryptojs from 'vue-cryptojs'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(VCalendar, {})
app.use(VueCryptojs)

import 'bootstrap/dist/js/bootstrap.js'

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { dom } from "@fortawesome/fontawesome-svg-core"
library.add(fas)
library.add(fab)
library.add(far)
dom.watch()
app.component("font-awesome-icon", FontAwesomeIcon)

import Jazzicon from 'vue-jazzicon/src/components'
app.component('JazzIcon', Jazzicon)
app.config.globalProperties.jazzColors = [
  '#2347b3', // blue
  '#4462be', // second blue
  '#3c4a77', // third blue
  '#11a97d', // venom green
  '#15cc97', // venom second green
  '#094030', // venom third green
]

import MessageModal from "@/components/CustomModals/MessageModal.vue"
app.component('MessageModal', MessageModal)

import VenomConnectModal from "@/components/CustomModals/VenomConnectModal.vue"
app.component('VenomConnectModal', VenomConnectModal)

import VueQRCodeComponent from 'vue-qrcode-component'
app.component('qr-code', VueQRCodeComponent)

import { SvgPaymentToken } from '@/assets/svgs'
app.component('SvgPaymentToken', SvgPaymentToken)

import mitt from 'mitt'
app.config.globalProperties.emitter = mitt()

import blockchains from "@/configs/blockchains"
app.config.globalProperties.blockchains = blockchains
app.config.globalProperties.defaultchain = blockchains[process.env.VUE_APP_DEFAULT_NETWORK]

import { device, notification, utils, regex } from "@/plugins"
app.config.globalProperties.device = device()
app.config.globalProperties.notif = notification
app.config.globalProperties.utils = utils
app.config.globalProperties.regex = regex
window.addEventListener("resize", () => {
  app.config.globalProperties.device = device()
})

app.mount('#app')

export default app
