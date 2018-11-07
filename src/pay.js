import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueRouter from 'vue-router'
import payRouter from './router/payRouter'
// import {routerMode} from './config/env'
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
	payRouter,
	mode: 'hash',
})
router.beforeEach((to, from, next) => {
    document.documentElement.scrollTop  = 0;
    document.body.scrollTop  = 0;
    next();
})

new Vue({
	router,
}).$mount('#pay')
