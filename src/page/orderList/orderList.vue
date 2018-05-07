<template>
  <div class="orderList">
      <div class="userItems">
        <div class="userItem">
          <div>姓名:<span class="red">{{payList.userName}}</span></div>
          <div>手机号码:<span class="red">{{payList.phoneNo}}</span></div>
        </div>
        <div class="userItem">
          <mt-button disabled type="danger" v-if="payStatus == 1" v-show="!btnType" @click="checkBtn">已确定</mt-button>
          <mt-button v-else  type="danger" v-show="!btnType" @click="checkBtn">已确定</mt-button>
          <mt-button  type="danger" v-show="btnType" plain @click="checkBtn">确认</mt-button>
        </div>
      </div>
      <div class="item" v-for="(item,index) in 1" v-cloak>
          <shop-list :noBuy="true" v-for="courseList in courseLists" :courseList=courseList>
          </shop-list>
      </div>
    <div class="payBox" v-if="payStatus == 0">
      <div class="wxpay payItem" @click="choosePay('wx')">
        <div class="payContaienr">
          <div class="icon">
            <img src="../../images/weixin.png" >
          </div>
          <span>微信支付</span>
          <div class="tickIcon">
            <img src="../../images/tick.png" v-show="chooseType == 'wx'">
          </div>
          <div class="noChoose" v-show="chooseType != 'wx'">
          </div>
        </div>
      </div>
      <div class="payItem" @click="choosePay('zfb')">
         <div class="payContaienr">
          <div class="icon">
            <img src="../../images/zhifubao.png">
          </div>
          <span>支付宝支付</span>
          <div class="tickIcon" v-show="chooseType != 'wx'">
            <img src="../../images/tick.png">
          </div>
          <div class="noChoose" v-show="chooseType == 'wx'">
          </div>
        </div>
      </div>
    </div>
    <shop-cart :payList=payList :btnChoose=btnType :chooseType=chooseType :payTitle =payTitle :payStatus=payStatus></shop-cart>   
  </div>  
</template>

<script>
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import shopList from 'src/components/common/shopList'
  import shopCart from 'src/components/common/shopCart'
  import { orderDetail} from 'src/service/course'
  export default {
      components:{
        shopCart,
        shopList
      },
      data() {
        return {
          btnType:true,
          payWay:1,
          value:'',
          chooseType:'wx',
          query :{},
          courseLists:'',
          payList:'',
          payStatus:0,
          payTitle:''
        }
      },
      mounted () {
          let _this = this;
          this.query = this.$route.query
          var param ={};
          param.billId = this.query.id;
          orderDetail(param).then(res=>{
            if(res.data.respCode == 0){
              _this.payList = res.data.data;
              _this.courseLists = res.data.data.courseList;
              _this.payStatus = res.data.data.payStatus;
              if(_this.payStatus == 1){
                _this.btnType = false;
                _this.payTitle = '已支付'
              }else{
                _this.btnType = true;
              }
            }else{
              _this.payStatus = 1
              _this.btnType = false;
              Toast(res.data.respMsg)
            }
          })
      },
      methods:{
        choosePay(type){
          this.chooseType =type;
        },
        checkBtn(){
          this.btnType = !this.btnType;
        }
      }
  }

</script>

<style lang="scss" scoped>
  @import 'src/style/common';
  @import 'src/style/mixin';
  .userItems{
    display: flex;
    height: 65px;
    padding:9px 12px;
    background: #fff;
    margin-bottom: 10px;
    // line-height: 65px;
    .userItem{
      flex:1;
      &:nth-of-type(1){
        div{
          font-size: 15px;  
          color: rgb(57,57,57);
          letter-spacing: 1px;
          line-height: 25px;
        }
        span{
          font-size: 15px;
          letter-spacing: 0px;
        }
      }
      &:nth-of-type(2){
        text-align: right;
        button{
          padding:5px 16px;
          font-size: 18px;
        }
      }
    }
  }
  .payBox{
    background-color: #fff;
    margin:30px 0 90px 0; 
    .payItem{
      padding: 14px 12px;
      @include fj;
      position: relative;
      align-items: center;
      border-bottom: 0.025rem solid #f5f5f5;
      .payContaienr{
          @include fj;
          align-items: center;
          font-size: 15px;
          .icon{
            width: 20px;
            margin-right: 8px;
          }
          span{
            font-size: 15px;
          }
          .tickIcon{
            width: 20px;
            position: absolute;
            top: 14px;
            right: 12px;
          }
          .noChoose{
            width: 20px;
            height: 20px;
            position: absolute;
            top: 14px;
            right: 12px;
            background: #fff;
            border: 2px solid #8b8b8b;
            border-radius: 50%;
          }
      }
    }
  }
</style>
