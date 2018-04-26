import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'

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
	// strict: process.env.NODE_ENV !== 'production',
	scrollBehavior (to, from, savedPosition) {
		console.log(savedPosition)
	    if (savedPosition) {
		    return savedPosition
		} else {
			// if (from.meta.keepAlive) {
			// 	//记录缓存页面的高度
			// 	from.meta.savedPosition = document.body.scrollTop;
			// }
			//根据记录的缓存的页面高度,显示页面的高度
		    // return { x: 0, y: to.meta.savedPosition ||0}
		    return {x:0,y: 0}
		}
	}
})


new Vue({
	router,
	store,
}).$mount('#app')
