webpackJsonp([14,12],{0:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(){return new l.default(function(e,t){var n=window.navigator.userAgent.toLowerCase(),o=encodeURIComponent(window.location.href.split("#")[0]);if("micromessenger"==n.match(/MicroMessenger/i)){var r={};r.url=o,(0,T.getwxConfig)(r).then(function(t){e(t.data)})}})}function a(){r().then(function(e){var t=e,n=window.location.href,o=window.location.origin;"0"==e.respCode&&(wx.config({debug:!1,appId:t.data.appId,timestamp:t.data.timestamp,nonceStr:t.data.nonceStr,signature:t.data.signature,jsApiList:t.data.jsApiList}),wx.ready(function(){wx.onMenuShareTimeline({title:"梯方教育",link:n,imgUrl:o+"/static/img/icon_desc1.png",success:function(){},cancel:function(){}}),wx.onMenuShareAppMessage({title:"梯方教育",desc:"梯方教育",link:n,imgUrl:o+"/static/img/icon_desc1.png",success:function(){},cancel:function(){}})}),wx.error(function(e){console.log(e)}))})}function u(){var e="";e=window.location.href.split("#")[0],(0,T.getDingDing)(e).then(function(e){var t=e.data.data;t&&dd.config({debug:!1,agentId:t.agentId,corpId:t.corpId,timeStamp:t.timeStamp,nonceStr:t.nonceStr,signature:t.signature,jsApiList:["runtime.info","biz.contact.choose","device.notification.confirm","device.notification.alert","device.notification.prompt","biz.ding.post","biz.util.openLink","biz.util.share"]}),dd.error(function(e){alert("dd error:"+(0,s.default)(e))}),dd.ready(function(){dd.runtime.permission.requestAuthCode({corpId:"ding3dbee29ec52c1ef435c2f4657eb6378f",onSuccess:function(e){var t={};t.code=e.code,(0,T.AuthLogin)(t).then(function(e){0==e.data.respCode&&e.data.data.dingToken&&(0,I.setStore)("dingToken",e.data.data.dingToken)})},onFail:function(e){console.log(e)}})})})}function i(){var e=window.navigator.userAgent.toLowerCase();"micromessenger"==e.match(/MicroMessenger/i)?(0,I.setStore)("type","wx"):e.indexOf("dingtalk")>0?(0,I.setStore)("type","dingding"):(0,I.setStore)("type","wx")}var c=n(99),s=o(c),d=n(68),l=o(d),f=n(92),p=o(f),m=n(10),g=o(m);n(200);var v=n(109),_=(o(v),n(263)),E=o(_),S=n(143),h=o(S),A=n(147),D=o(A),R=n(8);n(142);var O=n(213),C=o(O),I=n(6),T=n(13);"addEventListener"in document&&document.addEventListener("DOMContentLoaded",function(){C.default.attach(document.body)},!1),p.default.use(g.default),p.default.use(E.default);var b=new E.default({routes:h.default,mode:R.routerMode});u(),a(),b.beforeEach(function(e,t,n){document.documentElement.scrollTop=0,document.body.scrollTop=0,i(),n()}),new p.default({router:b,store:D.default}).$mount("#app")},6:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(){wx.ready(function(){wx.onMenuShareTimeline({title:p.title,link:p.link,imgUrl:p.icon,success:function(){_czc.push(["_trackEvent","邀请好友","分享","分享朋友圈"])},cancel:function(){_czc.push(["_trackEvent","邀请好友","分享","取消分享朋友圈"])}}),wx.onMenuShareAppMessage({title:p.title,desc:p.desc,link:p.link,imgUrl:p.icon,success:function(){_czc.push(["_trackEvent","邀请好友","分享","分享微信好友"])},cancel:function(){_czc.push(["_trackEvent","邀请好友","分享","取消分享微信好友"])}})})}Object.defineProperty(t,"__esModule",{value:!0}),t.shareOpt=t.animate=t.showBack=t.loadMore=t.getStyle=t.removeStore=t.getStore=t.setStore=t.catchError=void 0;var a=n(151),u=o(a),i=n(99),c=o(i),s=n(68),d=o(s);t.wxReady=r;var l=n(10),f=(t.catchError=function(e){if(e&&(0,l.MessageBox)("服务端异常，请联系技术支持"),e.response)switch(e.response.status){case 400:(0,l.MessageBox)("请求参数异常");break;case 403:(0,l.MessageBox)("无访问权限，请联系企业管理员");break;default:(0,l.MessageBox)("服务端异常，请联系技术支持")}return d.default.reject(e)},t.setStore=function(e,t){e&&("string"!=typeof t&&(t=(0,c.default)(t)),window.localStorage.setItem(e,t))},t.getStore=function(e){if(e)return window.localStorage.getItem(e)},t.removeStore=function(e){e&&window.localStorage.removeItem(e)},t.getStyle=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"int",o=void 0;return o="scrollTop"===t?e.scrollTop:e.currentStyle?e.currentStyle[t]:document.defaultView.getComputedStyle(e,null)[t],"float"==n?parseFloat(o):parseInt(o)}),p=(t.loadMore=function e(t,n){var o=window.screen.height,r=void 0,a=void 0,u=void 0,i=void 0,c=void 0,s=void 0;document.body.addEventListener("scroll",function(){e()},!1),t.addEventListener("touchstart",function(){r=t.offsetHeight,a=t.offsetTop,u=f(t,"paddingBottom"),i=f(t,"marginBottom")},{passive:!0}),t.addEventListener("touchmove",function(){e()},{passive:!0}),t.addEventListener("touchend",function(){s=document.body.scrollTop,d()},{passive:!0});var d=function n(){c=requestAnimationFrame(function(){document.body.scrollTop!=s?(s=document.body.scrollTop,e(),n()):(cancelAnimationFrame(c),r=t.offsetHeight,e())})},e=function(){document.body.scrollTop+o>=r+a+u+i&&n()}},t.showBack=function(e){var t=void 0,n=void 0;document.addEventListener("scroll",function(){r()},!1),document.addEventListener("touchstart",function(){r()},{passive:!0}),document.addEventListener("touchmove",function(){r()},{passive:!0}),document.addEventListener("touchend",function(){n=document.body.scrollTop,o()},{passive:!0});var o=function e(){t=requestAnimationFrame(function(){document.body.scrollTop!=n?(n=document.body.scrollTop,e()):cancelAnimationFrame(t),r()})},r=function(){e(document.body.scrollTop>500?!0:!1)}},t.animate=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:400,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"ease-out",r=arguments[4];clearInterval(e.timer),n instanceof Function?(r=n,n=400):n instanceof String&&(o=n,n=400),o instanceof Function&&(r=o,o="ease-out");var a=function(t){return"opacity"===t?Math.round(100*f(e,t,"float")):f(e,t)},i=parseFloat(document.documentElement.style.fontSize),c={},s={};(0,u.default)(t).forEach(function(e){/[^\d^\.]+/gi.test(t[e])?c[e]=t[e].match(/[^\d^\.]+/gi)[0]||"px":c[e]="px",s[e]=a(e)}),(0,u.default)(t).forEach(function(e){"rem"==c[e]?t[e]=Math.ceil(parseInt(t[e])*i):t[e]=parseInt(t[e])});var d=!0,l={};e.timer=setInterval(function(){(0,u.default)(t).forEach(function(u){var i=0,c=!1,f=a(u)||0,p=0,m=void 0;switch(o){case"ease-out":p=f,m=5*n/400;break;case"linear":p=s[u],m=20*n/400;break;case"ease-in":var g=l[u]||0;i=g+(t[u]-s[u])/n,l[u]=i;break;default:p=f,m=5*n/400}switch("ease-in"!==o&&(i=(t[u]-p)/m,i=i>0?Math.ceil(i):Math.floor(i)),o){case"ease-out":c=f!=t[u];break;case"linear":c=Math.abs(Math.abs(f)-Math.abs(t[u]))>Math.abs(i);break;case"ease-in":c=Math.abs(Math.abs(f)-Math.abs(t[u]))>Math.abs(i);break;default:c=f!=t[u]}c?(d=!1,"opacity"===u?(e.style.filter="alpha(opacity:"+(f+i)+")",e.style.opacity=(f+i)/100):"scrollTop"===u?e.scrollTop=f+i:e.style[u]=f+i+"px"):d=!0,d&&(clearInterval(e.timer),r&&r())})},20)},{title:"",desc:"",link:"",icon:""});t.shareOpt=p},8:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o="",r="hash",a="http://img.tifangedu.com/",u="https://tfapi.tifangedu.com/";t.baseUrl=o="http://tifang.com",t.baseUrl=o,t.routerMode=r,t.imgBaseUrl=a,t.httpUrl=u},13:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.getSchool=t.getArea=t.getChannel=t.getToken=t.h5alipay=t.prePay=t.checkAliResult=t.checkPayResult=t.aliPay=t.orderDetail=t.discount=t.getDingDing=t.testInit=t.getwxConfig=t.addOrder=t.checkCode=t.getCodeMsg=t.manName=t.AuthLogin=t.CourseType=t.gradeList=t.courseDetail=t.courseList=void 0;var r=n(144),a=o(r);n(8),t.courseList=function(e){return a.default.get("/coursecart/v1/course/list",{params:e})},t.courseDetail=function(e){return a.default.get("/coursecart/v1/course/detail",{params:e})},t.gradeList=function(e){return a.default.get("/coursecart/v1/grade",{params:e})},t.CourseType=function(e){return a.default.get("/coursecart/v1/grade/filter",{params:e})},t.AuthLogin=function(e){return a.default.get("/coursecart/v1/dingtalk/auth",{params:e})},t.manName=function(e){return a.default.get("/coursecart/v1/user/info",{params:e})},t.getCodeMsg=function(e){return a.default.get("/coursecart/v1/message/sms",{params:e})},t.checkCode=function(e){return a.default.get("/coursecart/v1/message/sms/check",{params:e})},t.addOrder=function(e,t){return a.default.post("/coursecart/v1/bill/create?"+t,e)},t.getwxConfig=function(e){return a.default.get("/coursecart/v1/wechat/auth",{params:e})},t.testInit=function(e){return a.default.get("/coursecart/v1/bill/setLogonSale?saleId=17")},t.getDingDing=function(e){return a.default.get("/coursecart/v1/dingtalk/signature?"+e)},t.discount=function(e){return a.default.get("/coursecart/v1/sale/discount",{params:e})},t.orderDetail=function(e){return a.default.get("/coursecart/v1/bill/detail",{params:e})},t.aliPay=function(e){return a.default.get("/coursecart/v1/bill/alipay",{params:e})},t.checkPayResult=function(e){return a.default.get("/coursecart/v1/bill/pay/result",{params:e})},t.checkAliResult=function(e){return a.default.post("/coursecart/v1/bill/pay/result",e)},t.prePay=function(e){return a.default.get("/coursecart/v1/bill/wxopen",{params:e})},t.h5alipay=function(e){return a.default.get("/coursecart/v1/bill/alipay",{params:e})},t.getToken=function(e){return a.default.get("/coursecart/v1/wechat/openid",{params:e})},t.getChannel=function(e){return a.default.get("/coursecart/v1/channel",{params:e})},t.getArea=function(e){return a.default.get("/coursecart/v1/area",{params:e})},t.getSchool=function(e){return a.default.get("/coursecart/v1/school",{params:e})}},98:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.RECORD_ADDRESS="RECORD_ADDRESS",t.ADD_CART="ADD_CART",t.REDUCE_CART="REDUCE_CART",t.INIT_BUYCART="INIT_BUYCART",t.CLEAR_CART="CLEAR_CART",t.RECORD_SHOPDETAIL="RECORD_SHOPDETAIL",t.RECORD_USERINFO="RECORD_USERINFO",t.GET_USERINFO="GET_USERINFO",t.CONFIRM_REMARK="CONFIRM_REMARK",t.CONFIRM_INVOICE="CONFIRM_INVOICE",t.CHOOSE_SEARCH_ADDRESS="CHOOSE_SEARCH_ADDRESS",t.SAVE_GEOHASH="SAVE_GEOHASH",t.CONFIRM_ADDRESS="CONFIRM_ADDRESS",t.CHOOSE_ADDRESS="CHOOSE_ADDRESS",t.NEED_VALIDATION="NEED_VALIDATION",t.SAVE_CART_ID_SIG="SAVE_CART_ID_SIG",t.SAVE_ORDER_PARAM="SAVE_ORDER_PARAM",t.CHANGE_ORDER_PARAM="CHANGE_ORDER_PARAM",t.ORDER_SUCCESS="ORDER_SUCCESS",t.SAVE_SHOPID="SAVE_SHOPID",t.SAVE_ORDER="SAVE_ORDER",t.OUT_LOGIN="OUT_LOGIN",t.RETSET_NAME="RETSET_NAME",t.SAVE_AVANDER="SAVE_AVANDER",t.SAVE_ADDDETAIL="SAVE_ADDDETAIL",t.SAVE_ADDRESS="SAVE_ADDRESS",t.SAVE_QUESTION="SAVE_QUESTION",t.ADD_ADDRESS="ADD_ADDRESS",t.BUY_CART="BUY_CART",t.ADD_DISCOUNT="ADD_DISCOUNT",t.INIT_DISCOUNT="INIT_DISCOUNT",t.CHOOSE_CART="CHOOSE_CART",t.NEED_BOOK="NEED_BOOK"},109:function(e,t,n){n(207);var o=n(1)(n(129),n(256),null,null);e.exports=o.exports},129:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},142:function(e,t){"use strict";!function(e,t){var n=e.documentElement,o="orientationchange"in window?"orientationchange":"resize",r=function(){var e=n.clientWidth;e&&(n.style.fontSize=20*(e/320)+"px")};e.addEventListener&&(t.addEventListener(o,r,!1),e.addEventListener("DOMContentLoaded",r,!1))}(document,window)},143:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(109),a=o(r),u=function(e){return n.e(5,function(){return e(n(242))})},i=function(e){return n.e(0,function(){return e(n(239))})},c=function(e){return n.e(1,function(){return e(n(240))})},s=function(e){return n.e(3,function(){return e(n(244))})},d=function(e){return n.e(10,function(){return e(n(249))})},l=function(e){return n.e(11,function(){return e(n(246))})},f=function(e){return n.e(8,function(){return e(n(245))})},p=function(e){return n.e(6,function(){return e(n(247))})},m=function(e){return n.e(4,function(){return e(n(238))})},g=function(e){return n.e(2,function(){return e(n(243))})},v=function(e){return n.e(9,function(){return e(n(241))})},_=function(e){return n.e(7,function(){return e(n(248))})};t.default=[{path:"/",component:a.default,children:[{path:"",redirect:"/login"},{path:"/login",component:u},{path:"/course",component:i},{path:"/courseDetail",component:c},{path:"/payList",component:s},{path:"/orderList",component:g},{path:"/wxpay",component:d},{path:"/alipay",component:l},{path:"/aliUrl",component:f},{path:"/paysucc",component:p},{path:"/activity",component:m},{path:"/error",component:v},{path:"/testMove",component:_}]}]},144:function(e,t,n){"use strict";function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n(111),u=r(a),i=n(6),c=o(i),s=(n(10),u.default.create({baseURL:"https://api.tifang.online",timeout:1e4}));s.defaults.headers.post["Content-Type"]="application/json",s.interceptors.response.use(function(e){return e},c.catchError),t.default=s},145:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(154),a=o(r),u=n(152),i=o(u),c=n(98);t.default={getUserInfo:function(e){var t=this,n=e.commit;e.state;return(0,i.default)(a.default.mark(function e(){var o;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,getUser();case 2:o=e.sent,n(c.GET_USERINFO,o);case 4:case"end":return e.stop()}},e,t)}))()},saveAddress:function(e){var t=this,n=e.commit,o=e.state;return(0,i.default)(a.default.mark(function e(){var r;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!(o.removeAddress.length>0)){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,getAddressList(o.userInfo.user_id);case 4:r=e.sent,n(c.SAVE_ADDRESS,r);case 6:case"end":return e.stop()}},e,t)}))()}}},146:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={}},147:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(92),a=o(r),u=n(11),i=o(u),c=n(148),s=o(c),d=n(145),l=o(d),f=n(146),p=o(f);a.default.use(i.default);var m={latitude:"",longitude:"",cartList:{},shopDetail:null,userInfo:null,shopid:null,remarkText:null,inputText:"",invoice:!1,newAddress:[],searchAddress:null,geohash:"wtw3sm0q087",choosedAddress:null,addressIndex:null,needValidation:null,cartId:null,sig:null,orderParam:null,orderMessage:null,orderDetail:null,login:!0,imgPath:null,removeAddress:[],addAddress:"",question:null,cartPrice:null,discount:null,oneCart:{}};t.default=new i.default.Store({state:m,getters:p.default,actions:l.default,mutations:s.default})},148:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r,a=n(153),u=o(a),i=n(9),c=o(i),s=n(98),d=n(6);n(8);t.default=(r={},(0,u.default)(r,s.RECORD_ADDRESS,function(e,t){var n=t.latitude,o=t.longitude;e.latitude=n,e.longitude=o}),(0,u.default)(r,s.RECORD_SHOPDETAIL,function(e,t){e.shopDetail=t}),(0,u.default)(r,s.CHOOSE_CART,function(e,t){}),(0,u.default)(r,s.NEED_BOOK,function(e,t){e.bookIds;t&&(e.bookIds=(0,c.default)({},t)),(0,d.setStore)("bookIds",e.bookIds)}),(0,u.default)(r,s.ADD_CART,function(e,t){var n=e.cartList;t&&(t.num=1,t.choose=!0,n[t.id]=t,e.cartList=(0,c.default)({},n),(0,d.setStore)("buyCart",e.cartList))}),(0,u.default)(r,s.REDUCE_CART,function(e,t){var n=e.cartList;n&&n[t.id]&&n[t.id].num>0&&(n[t.id].num=0,t.choose=!1,e.cartList=(0,c.default)({},n),(0,d.setStore)("buyCart",e.cartList))}),(0,u.default)(r,s.ADD_DISCOUNT,function(e,t){e.discount=t,(0,d.setStore)("discount",e.discount)}),(0,u.default)(r,s.INIT_DISCOUNT,function(e){var t=(0,d.getStore)("discount");t&&(e.discount=JSON.parse(t))}),(0,u.default)(r,s.INIT_BUYCART,function(e){var t=(0,d.getStore)("buyCart");t&&(e.cartList=JSON.parse(t))}),(0,u.default)(r,s.CLEAR_CART,function(e,t){e.cartList=null,e.cartList=(0,c.default)({},e.cartList),(0,d.setStore)("buyCart",e.cartList)}),(0,u.default)(r,s.RECORD_USERINFO,function(e,t){e.userInfo=t,e.login=!0,(0,d.setStore)("user",t)}),(0,u.default)(r,s.GET_USERINFO,function(e,t){e.userInfo&&e.userInfo.username!==t.username||e.login&&(t.message?e.userInfo=null:e.userInfo=(0,c.default)({},t))}),r)},200:function(e,t){},207:function(e,t){},256:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("transition",{attrs:{name:"router-fade",mode:"out-in"}},[n("keep-alive",[e.$route.meta.keepAlive?n("router-view"):e._e()],1)],1),e._v(" "),n("transition",{attrs:{name:"router-fade",mode:"out-in"}},[e.$route.meta.keepAlive?e._e():n("router-view")],1)],1)},staticRenderFns:[]}}});