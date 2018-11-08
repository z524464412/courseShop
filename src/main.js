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
import {setStore,getStore,removeStore} from 'src/config/mUtils'
import { getwxConfig,AuthLogin,getDingDing} from 'src/service/course'

// import './config/vconsole'

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
	// scrollBehavior (to, from, savedPosition) {
 //    console.log(123)
	// 	console.log(savedPosition)
	//     if (savedPosition) {
	// 	    return savedPosition
	// 	} else {
	// 	    return {x:0,y: 0}
	// 	}
	// }
})
function wxInit(){
	return new Promise(function(resolve,reject){
		var ua = window.navigator.userAgent.toLowerCase();
		var locationHref = encodeURIComponent(window.location.href.split('#')[0])
      	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
      		var param ={};
          param.url = locationHref;
      		getwxConfig(param).then(function(resp){
				    resolve(resp.data);
      		})
	    }else{

	    }
	});
}
function wxConfig(){
  wxInit().then(function(res){
    var body=res;
    let url = window.location.href
    let origin = window.location.origin
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
            link: url,  // 分享链接
            imgUrl: origin+'/static/img/icon_desc1.png', // 分享图标
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
            link: url,  // 分享链接
            imgUrl: origin+'/static/img/icon_desc1.png', // 分享图标
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
        })
     }
  })
}
function ddConfig(){
   var param ='';
    param = window.location.href.split('#')[0];
    getDingDing(param).then(res =>{
      let data = res.data.data;
      if(data){
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
      }
      dd.error(function(error){
        alert('dd error:' + JSON.stringify(error))
      })
      dd.ready(function() {
          dd.runtime.permission.requestAuthCode({
            // corpId: "ding3dbee29ec52c1ef435c2f4657eb6378f",
            corpId: "ding0fcea94d114a895c35c2f4657eb6378f",
            onSuccess: function(result) {
              let param = {};
              param.code = result.code;
              // param.tag = 'dev'; 
              AuthLogin(param).then(res=>{
                if(res.data.respCode == 0){
                  if(res.data.data.dingToken){
                    setStore('dingToken',res.data.data.dingToken)
                  }
                }
              })
            },
            onFail : function(err) {
              console.log(err)
            }
          })
        });
    })
}


function platformType(){
  var ua = window.navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    wxConfig();
    setStore('type','wx');
  }else if(ua.indexOf('dingtalk') > 0 ){
    ddConfig();
    setStore('type','dingding');
  }else{
    wxConfig();
    setStore('type','wx');
  }
}
router.beforeEach((to, from, next) => {
    document.documentElement.scrollTop  = 0;
    document.body.scrollTop  = 0;
    if(!getStore('type')){
      platformType();
    }
    next();
})

new Vue({
	router,
	store,
}).$mount('#app')
