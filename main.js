import Vue from 'vue'
import App from './App'
import './js_sdk/ican-H5Api/ican-H5Api';
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
