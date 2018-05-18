<template>
      <section class="buy_cart_container">
          <section v-if="payList">
            <section class="cart_icon_num buy_cart_info">
                共{{payList.courseList.length}}门课程, 已减<span class="red">￥{{payList.discount}}</span>!
            </section>
            <section class="cart_icon_num">
                <div class="cart_num noIcon">
                    <div v-if="payList.pay">
                      <span>合计:</span>{{'￥'+payList.pay}}
                    </div>
                    <div v-else>
                        <span>合计:</span>0
                    </div>
                    <div v-if="noIcon!='detail'">
                        <span>总价:￥<span class="borderType">{{payList.pay+payList.discount}}</span></span>
                        <span>立减:￥{{payList.discount}}</span>
                    </div>
                </div>
            </section>
          </section>
          <section v-else>
            <section class="cart_icon_num buy_cart_info">
            共{{allNum}}门课程,已减<span class="red">¥{{nowDiscount}}</span>，再选<span class="red">¥{{needMoney}}</span>减<span class="red">¥{{newDiscount}}</span>!
            </section>
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

                    <div v-text="allPrice == 0 ? 0 : allPrice-nowDiscount" v-if="allPrice"></div>
                    <div v-if="noIcon!='detail'" class="borderType">¥ {{allPrice || 0}}</div>
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
  import {setStore, getStore} from 'src/config/mUtils'
  import {mapState, mapMutations} from 'vuex'
  import { addOrder ,testInit,aliPay,prePay,getToken} from 'src/service/course'
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
        token:''
      }
    },
    props:['noIcon','allNum','allPrice','payTitle','payList','btnChoose','chooseType','payStatus'],
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
      let _this = this;
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
      gotoPage(){
        let _this = this;
        let user = {};
        let token = '';
        let userToken = getStore('userToken');
        let dingToken = getStore('dingToken');
        _this.token = token
        user = JSON.parse(getStore('user'));
        _this.ids = [];
        for(let cart of Object.values(_this.cartList)){
           if(cart.num ==1){
            _this.ids.push(cart.id);
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
          param.classes = _this.ids;
          param.price = _this.allPrice;
          param.scope = user.scope;
          param.grade =user.gradeId
          if(_this.allPrice){
             param.price = _this.allPrice - _this.nowDiscount;
          }else{
            param.price = 0
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
          if(userToken){
            token = 'userToken='+userToken
          }else if(dingToken){
            token = 'dingToken='+dingToken
          }else{
            token = ''
          }
          if(user.login && user.type == 'wx'){
            addOrder(param,token).then(res=>{
              if(res.data.respCode == 0){
                _this.$router.push({path:'/orderList',query:{id:res.data.data}});
              }else if(res.data.respCode == 30015){
                user.login = false;
                setStore('user',user);
                param.login = false;
                _this.$router.push({path:'/login',query:param});
              }else{
                Toast(res.data.respMsg);
              }
            })
          }
          if(user.type == 'dingding'){
            param.channel =user.channeId;
            addOrder(param,token).then(res=>{
              if(res.data.respCode == 0){
                _this.$router.push({path:'/orderList',query:{id:res.data.data}});
              }else if(res.data.respCode == 30010){
                AuthLogin(param).then(res=>{
                if(res.data.respCode == 0){
                  if(res.data.data.dingToken){
                      setStore('dingToken',res.data.data.dingToken)
                      addOrder(param,token).then(res=>{
                        if(res.data.respCode == 0){
                          _this.$router.push({path:'/orderList',query:{id:res.data.data}});
                        }else{
                          Toast(res.data.respMsg)
                        }
                      })
                    }
                  }
                })
              }else{
                 Toast(res.data.respMsg)
              }
            })
          }
        }else if(_this.$route.path == '/courseDetail'){
          //课程详情页面
            let chooseCart = JSON.parse(getStore('chooseCart'));
            this.ADD_CART(chooseCart);
              _this.$router.push({path:'/payList'});
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
        this.$router.push({path:'/aliUrl',query:{id:_this.billId}});
        // location.reload();//微信浏览器需要刷新保存当前的地址
      },
      h5AliPay(){
        let param = {};
        let _this =this;
        param.billId = this.billId;
        //api接口地址
        if(httpUrl && httpUrl.indexOf('tfapi') > 0){
          // window.location.href = window.location.origin+"/v1/pay/alipay"+"?billId="+param.billId
          this.$router.push({path:'/aliUrl',query:{id:_this.billId}})
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
        if(httpUrl && httpUrl.indexOf('tfapi') > 0){
          window.location.href = window.location.origin+"/v1/pay/wxh5"+"?billId="+param.billId
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
      //初始化微信支付配置
      // doWXPay(pack){
      //   WeixinJSBridge.invoke(
      //       'getBrandWCPayRequest', pack ,
      //      function(res){
      //       let queryId = this.getQueryByName('id');
      //          if(res.data.err_msg == "get_brand_wcpay_request:ok" ) {
      //           setTimeout(function(){
      //             window.location.href = 'http://api.tifangedu.com/coursecart/paysucc?id='+queryId;
      //             window.history.replaceState("pay_suc","",location.origin+"/coursecart/paysucc?id="+queryId);
      //              window.location.reload()
      //           },1000)
      //          }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
      //      }
      //  ); 
      // },
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
            prePay(params).then((res)=>{
              alert(JSON.stringify(res))
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
        this.initDiscount();
      },
      initDiscount(){
        var _this =this ;
        var Things = Object.values(this.discountList)
        for (var i = Things.length - 1; i >= 0; i--) {
          if(Things[i].price > _this.allPrice){
            if(Things[i+1]){
              _this.nowDiscount = Things[i+1].discount;  
            }else{
              _this.nowDiscount =0;
            }
            _this.needMoney = Things[i].price - _this.allPrice;
            _this.newDiscount = Things[i].discount;
            return;
          }else{
            _this.nowDiscount = Things[i].discount;
            _this.needMoney = 0;
            _this.newDiscount = Things[i].discount;
          }
        }
      }
    },
    watch:{
      shopCart:function(){
        this.initData()
      },
      discountList:function(){
        this.initDiscount();
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
         background-color: rgba(255,255,255, 0.9);
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