<template>
      <section class="buy_cart_container">
          <section v-if="payList">

          <!--   <section class="cart_icon_num buy_cart_info">
                共{{payList.courseList.length}}门课程, 已减<span class="red">￥{{payList.discount}}</span>!<span v-if="payList.bookFee >0">(资料费:{{payList.bookFee}})</span>
            </section> -->
            <section class="cart_icon_num">
                <div class="cart_num noIcon">
                    <div v-if="payList.pay">
                      <span>合计:</span>{{'￥'+(Number(payList.pay+bookNum))}}
                    </div>
                    <div v-else>
                        <span>合计:</span>0
                    </div>
                    <div v-if="noIcon!='detail'">
                        <span>总价:￥<span class="borderType">{{Number(payList.pay)+Number(payList.discount)}}</span></span>
                        <span>立减:￥{{Number(payList.discount)}}</span>
                    </div>
                </div>
            </section>
          </section>
          <section v-else>
           <!--  <section class="cart_icon_num buy_cart_info">
            共{{allNum}}门课程,已减<span class="red">¥{{nowDiscount}}</span>，再选<span class="red">¥{{needMoney}}</span>减<span class="red">¥{{newDiscount}}</span>!
            </section> -->
            <section class="cart_icon_num">
                <div class="cart_icon_container" ref="cartContainer" v-if="noIcon=='index'">
                    <span v-if="allNum" class="cart_list_length">
                        {{allNum}}
                    </span>
                    <div class="cart_icon noIcon" @click="gotoPage">
                      <img src="../../images/package.png">  
                    </div>
                </div>
                <div class="cart_num" :class="{noIcon:noIcon!='index'}">
                    <div v-text="allPrice == 0 ? 0 : '￥'+(allPrice-nowDiscount+(bookMoney || 0))" v-if="allPrice && path !='/courseDetail'"></div>
                    <div v-text="allPrice" v-if="path == '/courseDetail'"></div>
                    <!-- 第一版 -->
                    <!-- <div v-if="noIcon!='detail'" class="borderType">¥ {{allPrice || 0}}</div> -->
                    <!-- 第二版 -->
                    <div v-if="noIcon!='detail'">共{{checkLessonsLength || 0}}课次</div>
                </div>
            </section>
          </section>
          <div @click="gotoPage" class="gotopay" :class="{noPay:btnChoose}">
           <section class="gotopay_button_style" :class="{noPay:btnChoose}"  v-text="payTitle || '立即支付'">
           </section>
          </div>
      </section>
</template>
<script>
  import {setStore, getStore,removeStore} from 'src/config/mUtils'
  import {mapState, mapMutations} from 'vuex'
  import { newAddOrder ,testInit,aliPay,prePay,getToken,AuthLogin} from 'src/service/course'
  import { Toast } from 'mint-ui'
  import { httpUrl } from 'src/config/env';
	export default{
    data(){
      return{
        totalNum:0,//选择数
        totalPrice: 0, //总共价格
        discountPrice:0,//折扣价格
        noPay:true,
        ids:[],
        nowDiscount:0,
        needMoney:2700,
        newDiscount:200,
        chooseLength:0,
        platform:'',
        billId:'',
        token:'',
        check:false,
        path:'',
        query:'',
        bookNum:0
      }
    },
    props:['noIcon','allNum','allPrice','payTitle','payList','btnChoose','chooseType','payStatus','addrValue','needBookIds','bookMoney','addrValue1','discountAll','checkLessonsLength'],
    computed:{
      ...mapState([
          'latitude','longitude','cartList','discount'
      ]),
      //当前商店购物信息
      shopCart: function (){
          return {...this.cartList};
      },
      discountList:function(){
        return {...this.discount};
      }
    },
    created(){
      
    },
    mounted(){
      // console.log(this.payList)
      let _this = this;
      _this.path = _this.$route.path
      _this.query = _this.$route.query;
      this.init_platform()
      this.INIT_DISCOUNT();
      this.billId = this.$route.query.id;
      let token = this.getQueryStringByName('code');
      if( _this.$route.path=='/orderList' && !token && _this.platform=='wx'){
        let appId = 'wxc04e9bfb36836d54';
        let url = window.location.origin+'/#/orderList?id='+this.billId;
        // let url = window.location.origin+'/#/orderList?id='+this.billId;
        // let url = window.location.origin+'/order/';
        let svc = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' 
        + appId + '&redirect_uri=' + encodeURIComponent(url) 
        + '&response_type=code&scope=snsapi_base&state=10106767#wechat_redirect';
        window.location.href = svc;
      }
    },
    methods:{
      //vuex数据
      ...mapMutations([
          'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL','ADD_DISCOUNT','INIT_DISCOUNT'
      ]),
      filter_array(array) {    
        return array.filter(item=>item);   
      },   
      gotoPage(){
        if(this.bookNum > 0 && !this.addrValue){
          Toast({
            message: '请填写地址!',
            position: 'middle',
            duration: 1000
          });
          return
        }
        if(this.bookMoney && !this.addrValue1){
          Toast({
            message: '请填写地址!',
            position: 'middle',
            duration: 1000
          });
          return
        }
        let _this = this;
        let user = {};
        let token = '';
        let userToken = getStore('userToken');
        let dingToken = getStore('dingToken');
        let classes = [];
        
        _this.token = token
        user = JSON.parse(getStore('user'));
        _this.ids = [];
        for(let cart of Object.values(_this.cartList)){
          if(cart.needBook && !this.addrValue1 && _this.$route.path=='/payList'){
            Toast({
              message: '请填写地址!',
              position: 'middle',
              duration: 1000
            });
            return
          }else{
            _this.bookNum = 1;
          }
          let checkLesson = {};
           if(cart.choose){
            _this.ids.push(cart.id);
            // console.log(cart)
            checkLesson.id=cart.id;
            if(cart.needBook){
              checkLesson.needBook = cart.needBook
            }else{
              checkLesson.needBook = 0
            }
            if(Object.keys(cart.lessonArr) && Object.keys(cart.lessonArr).length > 0 ){
              checkLesson.saleUnit = 2
              checkLesson.lessons = Object.keys(cart.lessonArr);
            }
            if(cart.isTrial){
               checkLesson.isTrial = cart.isTrial
            }else{
              checkLesson.isTrial = 0
            }
            classes.push(checkLesson);
           }
          }
        if(_this.ids.length<=0 && _this.$route.path !='/orderList' && _this.$route.path !='/courseDetail'){
          Toast({
            message: '至少选择一门课程!',
            position: 'middle',
            duration: 1000
          });
          return;
        }else{
          _this.chooseLength = _this.ids.length
        }  
        if(_this.$route.path == '/payList'){
          //书包列表页面
          let param = {};
          param.userName=user.name;
          param.phoneNo=user.phone;
          // param.classes = classes;
          // let ids  =[];
          // let needBookIds =[];
          // let bookArray = Object.values(_this.needBookIds);
          // for (var i = _this.ids.length - 1; i >= 0; i--) {
          //   let obj = {};
          //   obj.id =_this.ids[i];
          //   let aa =_this.ids[i]
          //   if(_this.needBookIds[aa] && (_this.needBookIds[aa].needBook == 1)){
          //     obj.needBook = 1;
          //   }else{
          //     obj.needBook = 0;
          //   }
          //   ids.push(obj)
          // }
          // needBookIds = ids;
          param.deliverAddr = _this.addrValue1;
          param.school = user.schoolName;
          param.classes = classes;
          param.price = _this.allPrice;
          param.scope = user.scope;
          // param.grade =user.gradeId
          param.grade =user.gradeId
          // param.classes=[];
          if(_this.allPrice){
             param.price = _this.allPrice - _this.nowDiscount;
          }else{
            param.price = 0
          }
          if(_this.bookMoney){
             param.price +=_this.bookMoney;
          }
          param.discount = _this.nowDiscount;
          if(user.login && user.type == 'wx' && user.name ==''){
            user.login = false;
            setStore('user',user);
            param.login = false;
            _this.$router.push({path:'/login',query:param});
          }
          let token = '';
          let userToken = getStore('userToken');
          let dingToken = getStore('dingToken');
          let needBook;
          let deliverAddr = this.addrValue || '';
          if(this.bookNum){
            this.bookNum =1;
            needBook = '&needBook='+this.bookNum
          }else{
            needBook=''
          }
          if(this.addrValue){
            deliverAddr = '&deliverAddr='+encodeURIComponent(this.addrValue)
          }else{
            deliverAddr=''
          }
          if(userToken){
            token = 'userToken='+userToken+needBook+deliverAddr
          }else if(dingToken){
            token = 'dingToken='+dingToken+needBook+deliverAddr
          }else{
            token = ''
          }
          if(user.login && user.type == 'wx'){
            newAddOrder(param,token).then(res=>{
              if(!res){
                return
              }
              if(res.data.respCode == 0){
                _this.$router.push({path:'/orderList',query:{id:res.data.data}});
              }else if(res.data.respCode == 30010 || res.data.respCode ==30000){
                user.login = false;
                removeStore('userToken');
                removeStore('user');
                // setStore('user',user);
                param.login = false;
                _this.$router.push({path:'/login',query:param});
              }else{
                Toast(res.data.respMsg);
              }
            })
          }
          if(user.type == 'dingding'){
            param.channel =user.channeId;
            newAddOrder(param,token).then(res=>{
              if(res.data.respCode == 0){
                _this.$router.push({path:'/orderList',query:{id:res.data.data}});
              }else if(res.data.respCode == 30010 || res.data.respCode ==30000){
                removeStore('dingToken');
                dd.ready(function() {
                  dd.runtime.permission.requestAuthCode({
                    corpId: "ding3dbee29ec52c1ef435c2f4657eb6378f",
                    onSuccess: function(result) {
                      let params = {};
                      params.code = result.code;
                      AuthLogin(params).then(res=>{
                      if(res.data.respCode == 0){
                        if(res.data.data.dingToken){
                            setStore('dingToken',res.data.data.dingToken)
                            let ken = 'dingToken='+res.data.data.dingToken;
                            newAddOrder(param,ken).then(res=>{
                              if(res.data.respCode == 0){
                                _this.$router.push({path:'/orderList',query:{id:res.data.data}});
                              }else{
                                Toast(res.data.respMsg)
                              }
                            })
                          }
                        }
                      })
                    },
                    onFail : function(err) {
                      console.log(err)
                    }
                  })
                });
              }else{
                 Toast(res.data.respMsg)
              }
            })
          }
        }else if(_this.$route.path == '/courseDetail'){
          //课程详情页面
            let chooseCart = JSON.parse(getStore('chooseCart'));
            _this.param ={};
            _this.param.courseId = _this.query.id;
            if(_this.query.gradeId){
              _this.param.gradeId = _this.query.gradeId
            }
            if(_this.query.scope){
              _this.param.scope = _this.query.scope
            }
            // vuex控制课程列表
            _this.ADD_CART(chooseCart);
           _this.$router.push({path:'/lessonsList',query:_this.param})
            // _this.$router.push({path:'/payList'});
        }else if(_this.$route.path == '/orderList'){
          if(this.payStatus == 1){
            return
          }
          if(_this.payTitle == '已支付'){
            Toast({
              message:'已经支付!',
              position: 'middle',
              duration: 1000
            })
            return
          }
          if(_this.btnChoose){
            Toast({
              message:'请先确认信息,在支付!',
              position: 'middle',
              duration: 1000
            })
            return
          }
          if(_this.payList.pay < 0.01){
            this.check =true;
            this.h5AliPay();
            return;
          } 
          if(_this.chooseType == 'wx'){
             this.wechatPay();
          }else if (_this.chooseType == 'zfb'){
            this.aliPay();
          }
        }else{
          _this.$router.push({path:'/payList'});
        }
      },
      //支付宝浏览器判断
      aliPay(){
          //微信浏览器
        if(this.platform == 'wx'){
          this.wxAliPay();
        }else{
          this.h5AliPay();
        }
      },
     
      //微信内使用支付宝
      wxAliPay(){
        var _this = this;
        this.$router.push({path:'/aliUrl',query:{id:_this.billId,bookNum:_this.bookNum,addrValue:_this.addrValue}});
        // location.reload();//微信浏览器需要刷新保存当前的地址
      },
      h5AliPay(){
        let param = {};
        let _this =this;
        param.billId = this.billId;
        //api接口地址
        if(httpUrl && httpUrl.indexOf('tfapi') > 0){
          // window.location.href = window.location.origin+"/v1/pay/alipay"+"?billId="+param.billId
          if(_this.bookNum){
            _this.bookNum = 1
          }
          this.$router.push({path:'/aliUrl',query:{id:_this.billId,bookNum:_this.bookNum,addrValue:_this.addrValue,check:_this.check}})
        }else{
          window.location.href = window.location.origin+"/coursecart/rest/v1/bill/doBillPayAlipay"+"?billId="+param.billId
        }
      },
      //微信支付方式判断
      wechatPay(){
        if(this.platform == 'wx'){
           this.initWx();
        }else{
          this.wxh5pay();
        }
      },
      //h5支付
      wxh5pay(){
        let param = {};
        param.billId = this.billId;
        //api接口地址
        let deliverAddr = this.addrValue || '';
        let needBook;
        if(this.bookNum){
          needBook = '&needBook='+this.bookNum
        }else{
          needBook =''
        }
        if(this.addrValue){
          deliverAddr = '&deliverAddr='+encodeURIComponent(this.addrValue)
        }else{
          deliverAddr
        }
        if(httpUrl && httpUrl.indexOf('tfapi') > 0){
          if(needBook){
            window.location.href = window.location.origin+"/v1/pay/wxh5"+"?billId="+param.billId+deliverAddr+needBook
          }else{
            window.location.href = window.location.origin+"/v1/pay/wxh5"+"?billId="+param.billId
          }
          
        }else{
          window.location.href = window.location.origin+"/coursecart/rest/v1/bill/doBillPayWXH5"+"?billId="+param.billId
        }
      },
      getQueryByName(name){
          let result = location.hash.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
          if (result == null || result.length < 1) {
              return "";
          }
          return result[1];
      },
      getQueryStringByName(name){
          let result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
          if (result == null || result.length < 1) {
              return "";
          }
          return result[1];
      },
      initWx(){
        var _this =this;
        let param ={};
        let token = this.getQueryStringByName('code');
        param.code = token;
        getToken(param).then((res)=>{
          let queryId = this.getQueryByName('id');
          let openid = res.data.data.openid;
          if(openid){
            let params ={};
            params.openId = openid;
            params.billId = _this.billId
            params.deliverAddr =encodeURIComponent(this.addrValue)
            if(this.bookNum){
               params.needBook = 1
            }
            prePay(params).then((res)=>{
                let data =res.data.data;
                // _this.doWXPay(res.data.data);
                wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: data.appId, // 必填，公众号的唯一标识
                  timestamp: data.timeStamp, // 必填，生成签名的时间戳
                  nonceStr: data.nonceStr, // 必填，生成签名的随机串
                  signature: data.signature,// 必填，签名，见附录1
                  jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });
                wx.chooseWXPay({
                  timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                  package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                  signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: data.paySign, // 支付签名
                  success: function (res) {
                    if (res.errMsg === 'chooseWXPay:ok') {
                       window.location.href = window.location.origin+'/#/paysucc?id='+queryId;
                    } else {
                        window.history.go(-1)
                        window.location.reload()
                    }
                  },
                  cancel:function(res){
                      Toast({
                        message: '支付取消',
                        position: 'middle',
                        duration: 5000
                      });
                      window.location.reload()
                      window.history.go(-1)

                  },
                  fail:function(res){
                    window.history.go(-1)
                    Toast({
                      message: '支付失败，请刷新',
                      position: 'middle',
                      duration: 5000
                    });
                  }
              })
            })
          }
        })
      },
      //判断浏览器环境
      init_platform() {
        const platform = navigator.userAgent.toLowerCase();
        if((platform.match(/MicroMessenger/i) == "micromessenger")) {
          this.platform='wx';//是微信浏览器
        }else{
          this.platform = 'order'
        }
      },
      initData(){
        // this.initDiscount();
      },
      initDiscount(){
        var _this =this ;
        var Things = Object.values(this.discountList)
        for (var i = Things.length - 1; i >= 0; i--) {
          console.log(_this.discountAll)
          console.log(Things[i].price)
          if(Things[i].price > _this.discountAll){

            if(Things[i+1]){
              _this.nowDiscount = Things[i+1].discount;  
            }else{
              _this.nowDiscount =0;
            }
            _this.needMoney = Things[i].price - _this.discountAll;
            _this.newDiscount = Things[i].discount;
            return;
          }else{
            // _this.nowDiscount = Things[i].discount;
            // _this.needMoney = 0;
            // _this.newDiscount = Things[i].discount;
            _this.nowDiscount = 0;
            _this.needMoney = 0;
            _this.newDiscount = Things[Things.length-1].discount;

          }
        }
      },
      addBook(){

      }
    },
    watch:{
      shopCart:function(){
        this.initData()
      },
      discountList:function(){
        this.initDiscount();
      },
      bookMoney:function(){
      }
    }
	}
</script>
<style lang="scss" scoped>
  @import 'src/style/common';
  @import 'src/style/mixin';
	  .buy_cart_container{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 13;
        display: flex;
        width: 100%;
        height: 45px;
         background-color: rgba(255,255,255, 1);
        .cart_icon_num{
            flex: 1;
            .cart_icon_container{
                display: flex;
                position: absolute;
                left: 12px;
                bottom: 8px;
                .cart_icon{
                    width: 50px;
                    height: 50px;
                }
                .cart_list_length{
                    position: absolute;
                    top: 5px;
                    right: 1px;
                    background-color: rgb(218,46,46);
                    line-height: 18px;
                    text-align: center;
                    border-radius: 50%;
                    min-width: 18px;
                    height: 18px;
                    @include sc(.5rem, #fff);
                    font-family: Helvetica Neue,Tahoma,Arial;
                }
            }
            .cart_num{
                @include ct;
                left: 3.5rem;
                &.noIcon{
                  left: 12px;
                }
                div:nth-of-type(1){
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: .1rem;
                    color: rgb(218,46,46);
                    span{
                      color: rgb(12,12,12);
                      font-size: 14px;
                      font-weight: bold;
                    }
                }
                div:nth-of-type(2){
                    font-size: 14px;
                    color: rgb(153,153,153);
                    &.borderType{
                      position: relative;
                      &:before{
                        content: '';
                        height: 1px;
                        background: rgb(153,153,153);
                        position: absolute;
                        width: 100%;
                        top: 50%;
                      }
                    }
                    .borderType{
                      position: relative;
                      &:before{
                        content: '';
                        height: 1px;
                        background: rgb(153,153,153);
                        position: absolute;
                        width: 100%;
                        top: 50%;
                      }
                    }
                }
            }
        }
        .buy_cart_info{
          position: absolute;
          height: 30px;
          line-height: 30px;
          width: 100%;
          text-align: center;
          background: rgba(253,249,216,0.9);
          top:-30px;
        }
        .gotopay{
            position: absolute;
            right: 0;
            background-color: #d52829;
            @include wh(6.6rem, 100%);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            .gotopay_button_style{
                @include sc(.7rem, #f6cece);
                font-weight: bold;
                letter-spacing: 2px;
                &.noPay{
                  color: #fff;
                }
            }
            &.noPay{
              @include sc(.7rem, #bbb);
              color: #fff;
              background: #bbb;
            }
        }
    }
</style>