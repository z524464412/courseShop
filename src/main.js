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
// import { shareOpt , wxReady } from 'src/config/mUtils'
import { getwxConfig,AuthLogin,getDingDing} from 'src/service/course'

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
function wxInit(){
	return new Promise(function(resolve,reject){
		var ua = window.navigator.userAgent.toLowerCase();
		var locationHref = encodeURIComponent(window.location.href.split('#')[0])
    // var locationHref = encodeURIComponent(window.location.href)
    // var locationHref =window.location.href.split('#')[0]
      	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
      		var param ={};
          // param.url = window.location.href.split('#')[0];
      		// param.url = locationHref.split('#')[0];
          param.url = locationHref;
      		getwxConfig(param).then(function(resp){
				    resolve(resp.data);
      		})
	      	// Vue.http.get('/wx/config'+"?url="+locationHref.split('#')[0]).then(function(resp){
	       //   	 resolve(resp.data);
	       //  })
	    }else{

	    }
	});
}
function wxConfig(){
   //  shareOpt.title ='梯方教育1111';
   //  shareOpt.icon = 'http://img.tifangedu.com/course/53090/20180412/6cc4a0c8-da86-45ab-a3bb-b7f1993cb03d.png'; // 分享图标
  	// shareOpt.link='http://www.baidu.com';
   // 	shareOpt.desc = '梯方教育1111';   
  wxInit().then(function(res){
    var body=res;
     if(res.respCode=="0"){
      wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: body.data.appId, // 必填，公众号的唯一标识
              timestamp: body.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: body.data.nonceStr, // 必填，生成签名的随机串
              signature: body.data.signature,// 必填，签名，见附录1
              jsApiList: body.data.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
     
        wx.ready(function(){
          wx.onMenuShareTimeline({
            title: '梯方教育', // 分享标题
            link: 'http://api.tifangedu.com/coursecart/#/login',  // 分享链接
            imgUrl: 'http://api.tifangedu.com/coursecart/static/img/info.png', // 分享图标
            success: function () { 
              // _czc.push(['_trackEvent', '邀请好友', '分享', '分享朋友圈']);
            },
            cancel: function () { 
              // _czc.push(['_trackEvent', '邀请好友', '分享', '取消分享朋友圈']);
            }
          });
          wx.onMenuShareAppMessage({
            title: '梯方教育', // 分享标题
            desc: '梯方教育', // 分享描述
            link: 'http://api.tifangedu.com/coursecart/#/login',  // 分享链接
            imgUrl: 'http://api.tifangedu.com/coursecart/static/img/info.png', // 分享图标
            success: function () { 
              // _czc.push(['_trackEvent', '邀请好友', '分享', '分享微信好友']);
            },
            cancel: function () {
              // _czc.push(['_trackEvent', '邀请好友', '分享', '取消分享微信好友']);
                }
              });
          })
         wx.error(function(res){
          console.log(res)
          alert(res)
        })
     }
  })
}
function ddConfig(){
   var param ='';
    param = window.location.href.split('#')[0];
    getDingDing(param).then(res =>{
      let data = res.data.data;
      dd.config({
        debug:false,
        agentId: data.agentId, 
        corpId: data.corpId,
        timeStamp:data.timeStamp, 
        nonceStr: data.nonceStr, 
        signature: data.signature,
        jsApiList : [ 'runtime.info', 'biz.contact.choose',
            'device.notification.confirm', 'device.notification.alert',
            'device.notification.prompt', 'biz.ding.post',
            'biz.util.openLink','biz.util.share'] // 必填，需要使用的jsapi列表，注意：不要带dd。
      })
      dd.error(function(error){
        alert('dd error:' + JSON.stringify(error))
      })
      dd.biz.util.share({
        type: 0,//分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
        url: 'http://api.tifangedu.com/coursecart/#/course',
        title: '123123',
        content: '123132132',
        image: 'http://api.tifangedu.com/coursecart/static/img/info.png',
        onSuccess : function() {
            //onSuccess将在调起分享组件成功之后回调
        },
        onFail : function(err) {
          alert(err)
        }
      })
    })
}
ddConfig();
wxConfig();
router.beforeEach((to, from, next) => {
	next();
})

new Vue({
	router,
	store,
}).$mount('#app')
