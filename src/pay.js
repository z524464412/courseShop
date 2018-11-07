import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router/payRouter'
import store from './store/'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'

import './config/vconsole'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
Vue.use(MintUI)
Vue.use(VueRouter)

const router = new VueRouter({
	routes,
	mode: routerMode,
})
router.beforeEach((to, from, next) => {

    document.documentElement.scrollTop  = 0;
    document.body.scrollTop  = 0;
    next();
})

new Vue({
	router,
	store,
}).$mount('#pay')
