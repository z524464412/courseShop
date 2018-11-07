import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueRouter from 'vue-router'
import payRouter from './router/payRouter'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import { quickpassPaySucc } from './service/course'
import { GetRequest } from './config/mUtils'
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
	mode: routerMode,
})
console.log(payRouter)
function sendSuccess(){
	return new Promise(function(resolve,reject){
		let query = {};
		query = GetRequest() ;
		let param = {};
		param.midNo = query.down_trade_no;
		param.transNo = query.order;
		param.pay = query.total_amount;
		quickpassPaySucc(param).then(res=>{
			if(res.data.respCode == 0){
				resolve(res.data.data)
			}else{
				reject(false);
			}
		})
	});
}
router.beforeEach((to, from, next) => {
		if(to.path == '/'){
			sendSuccess().then(res=>{
				location.href = location.origin+'/pay.html#/queryPaySucc'
			}).catch(err=>{
				alert(失败)
			});
		}
    // next();
})

new Vue({
	router,
}).$mount('#pay')
