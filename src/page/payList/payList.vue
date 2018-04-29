<template>
  <div class="package">
      <div class="item" v-for="(courseList,index) in chooseList" v-cloak>
        <mt-cell-swipe class="cell_swipe" :data-id="index"  :right="[  
                {  
                    content: '删除',  
                    style: { 'background': 'red', 'color': '#fff', 'width':'100px','text-align':'center','line-height':'107px','font-size':'18px'},  
                    handler: () => delBtn(courseList)  
                }  
            ]">
          <shop-list :noBuy='true' :courseList=courseList :payTitle="'创建订单'">
          </shop-list>
        </mt-cell-swipe>
      </div>
     <div class="lineheight"></div>
    <shop-cart :allNum=allNum :allPrice=allPrice :payTitle="'创建订单'" ></shop-cart>   
  </div>  
</template>
<script>

  import { mapState,mapMutations} from 'vuex';
  import {setStore} from 'src/config/mUtils'
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
          chooseType:'wx',
          allNum:0,
          allPrice:0,
          chooseList:[]
        }
      },
      created(){
        this.INIT_BUYCART();
      },
      mounted () {
        // this.initCartList();
      },
      computed:{
        ...mapState([
          'cartList'
        ]),
        //当前商店购物信息
        shopCart: function (){
          return {...this.cartList};
        },
      },
      methods:{
        ...mapMutations([
          'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL'
        ]), 
        initCartList(){
          let _this =this;
          let newCart ={}
          _this.chooseList=[];
          _this.allNum = 0;
          _this.allPrice = 0;
          for(let cart of Object.values(_this.shopCart)){
            if(cart.num == 1){
              _this.allNum++
              _this.allPrice += parseInt(cart.price);
              _this.chooseList.push(cart);
            }
          }
        },
        choosePay(type){
          this.chooseType =type;
        },
        delBtn(courseList){
          let _this =this;
          this.$messagebox.confirm('确定删除订单').then(function(){
            _this.REDUCE_CART(courseList);
            _this.initCartList();
          },function(){

          })
        },
      },
      watch: {
        shopCart:function(value){
          this.initCartList();
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
