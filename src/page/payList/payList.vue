<template>
  <div class="package">
      <div class="userItems">
        <div class="userItem">
          <div>姓名:<span class="red">张三</span></div>
          <div>手机号码:<span class="red">137xxxxxx</span></div>
        </div>
        <div class="userItem">
          <mt-button type="danger" v-show="btnType" @click="checkBtn">已确定</mt-button>
          <mt-button type="danger" v-show="!btnType" plain @click="checkBtn">确认</mt-button>
        </div>
      </div>
      <div class="item" v-for="(item,index) in 1" v-cloak>
        <mt-cell-swipe class="cell_swipe" :data-id="index"  :right="[  
                {  
                    content: '删除',  
                    style: { 'background': 'red', 'color': '#fff', 'width':'100px','text-align':'center','line-height':'107px','font-size':'18px'},  
                    handler: () => delBtn(index)  
                }  
            ]">
          <shop-list :noBuy="true">
          </shop-list>
        </mt-cell-swipe>
      </div>
    <div class="payBox">
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
    <shop-cart></shop-cart>   
  </div>  
</template>

<script>
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import shopList from 'src/components/common/shopList'
  import shopCart from 'src/components/common/shopCart'
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
          chooseType:'wx'
        }
      },
      mounted () {
      
      },
      methods:{
        choosePay(type){
          this.chooseType =type;
        },
        delBtn(id){
          var _this =this;
          this.$messagebox.confirm('确定删除金额').then(function(){
            _this.delItem(id);
          },function(){

          })
        },
        delItem(id){
          console.log(id);
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
