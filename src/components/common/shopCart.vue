<template>
      <section class="buy_cart_container">
          <section v-if="payList">
            <section class="cart_icon_num buy_cart_info">
                共{{payList.courseList.length}}门课程, 已减<span class="red">￥{{payList.discount}}</span>!
            </section>
            <section class="cart_icon_num">
                <div class="cart_num noIcon">
                    <div>
                      <span>合计:</span>{{'￥'+payList.pay}}
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
                    <div class="cart_icon noIcon" >
                      <img src="../../images/package.png">  
                    </div>
                </div>
                <div class="cart_num" :class="{noIcon:noIcon!='index'}">
                    <div v-text="allPrice == 0 ? 0 : allPrice-nowDiscount"></div>
                    <div v-if="noIcon!='detail'" class="borderType">¥ {{allPrice || 0}}</div>
                </div>
            </section>
          </section>
          <div @click="gotoPage" class="gotopay">
           <section class="gotopay_button_style" :class="{noPay:noPay}" v-text="payTitle || '立即支付'">
           </section>
          </div>
      </section>
</template>
<script>
  import {setStore, getStore} from 'src/config/mUtils'
  import {mapState, mapMutations} from 'vuex'
  import { addOrder ,testInit} from 'src/service/course'
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
        newDiscount:200
      }
    },
    props:['noIcon','allNum','allPrice','payTitle','payList'],
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
    mounted(){
      this.INIT_DISCOUNT();
    },
    methods:{
      //vuex数据
      ...mapMutations([
          'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL','ADD_DISCOUNT','INIT_DISCOUNT'
      ]),
      gotoPage(){
        let _this = this;
        let user = {};
        user = JSON.parse(getStore('user'));

        
        _this.ids = [];
        for(let cart of Object.values(_this.cartList)){
           if(cart.num ==1){
            _this.ids.push(cart.id);
           }
          }
        if(_this.payTitle == '创建订单'){
          let param = {};
          param.userName=user.name;
          param.phoneNo=user.phone;
          param.classes = _this.ids;
          param.price = _this.allPrice;
          if(_this.allPrice){
             param.price = _this.allPrice - _this.nowDiscount;
          }else{
            param.price = 0
          }
          param.discount = _this.nowDiscount;
          
          if(user.login){
            user.login = false;
            setStore('user',user);
            param.login = false;
            console.log(param)
            _this.$router.push({path:'/login',query:param});
          }
          // testInit().then(res=>{
          //   addOrder(param).then(res=>{
          //     console.log(res.data.data)
          //     if(res.data.respCode == 0){
          //       _this.$router.push({path:'/orderList',query:{id:res.data.data}});
          //     }
          //   })
          // })
        }else{
          _this.$router.push({path:'/payList'});
        }
      },
      initData(){
        this.initDiscount();
      },
      initDiscount(){
        var _this =this ;
        var Things = Object.values(this.discountList)
        console.log(_this.allPrice)
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
            }
            .noPay{
              @include sc(.7rem, #bbb);
              color: #fff;
            }
        }
    }
</style>