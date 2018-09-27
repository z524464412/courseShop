<template>
  <div class="package">
      <div v-if="showbook" class="checkBox">
         <div class="checkName" v-if="user.name">
          <span>{{user.name}}</span><span>{{user.phone}}</span>
          <!-- <div class="checkBtn">确认</div> -->
        </div>
        <div class="checkName" v-else>
          <span>未添加个人信息</span>
          <!-- <div class="checkBtn" @click="gotoLogin">确认</div> -->
        </div>
        <div class="checkAddr" v-show="!showBtn">
          <input type="text" name="addrText" placeholder="请输入资料邮寄地址" v-model="addrValue1" >
          <div class="checkAddrBtn" @click="checkAddr(true)">
            保存
          </div>  
        </div>
        <div class="checkAddr" v-show="showBtn">
          <span>{{addrValue1}}</span>
          <div class="checkAddrBtn" @click="checkAddr(false)">
            修改
          </div>  
        </div>
      </div>
      <div class="item" v-for="(courseList,index) in chooseList" v-cloak>
        <!-- <shop-list :noBuy='true' :courseList=courseList :payTitle="'创建订单'" @needBook="needBook" @click="gotoUrl">
        </shop-list> -->
        <mt-cell-swipe class="cell_swipe" :right="[  
                {  
                    content: '删除',  
                    style: { 'background': 'red', 'color': '#fff', 'width':'100px','text-align':'center','line-height':'65px','font-size':'18px'},  
                    handler: () => delBtn(courseList)  
                }  
            ]">
          <shop-list class="courseImg" :noBuy='true'  :courseList=courseList :payTitle="'创建订单'" @needBook="needBook">
          </shop-list>
        </mt-cell-swipe>
      </div>
     <div class="lineheight"></div>
    <shop-cart :allNum=allNum :discountAll=discountAll :checkLessonsLength=lessonsLength :allPrice=allPrice :payTitle="'创建订单'" :needBookIds=needBookIds :bookMoney=bookMoney :addrValue1=addrValue1></shop-cart>   
  </div>  
</template>
<script>

  import { mapState,mapMutations} from 'vuex';
  import {setStore,getStore} from 'src/config/mUtils'
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
          chooseList:[],
          addrValue1:'',
          needBookIds:{},
          bookMoney:0,
          showbook:false,
          showBtn:false,
          user :'',
          discountAll:0,
          lessonsLength:0
        }
      },
      created(){
        this.INIT_BUYCART();
        if(this.$route.path == '/payList'){
          this.showbook =true
        }else{
          this.showbook =false
        }
      },
      mounted () {
        // this.initCartList();
        this.user =JSON.parse(getStore('user')) ;
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
        gotoUrl(){
        },
        checkAddr(type){
          this.showBtn = type;
        },
        gotoLogin(){
          this.$router.push({path:'/login',query:{login:false}})
        },
         filter_array(array) {    
          return array.filter(item=>item);   
        }, 
        needBook(needBook){ 
          this.needBookIds[needBook.id] = needBook 
          let bookvalues =Object.values(this.needBookIds)
          let booklength = 0;
          for (var i = bookvalues.length - 1; i >= 0; i--) {
            if(bookvalues[i].needBook == 1){  
              booklength++;
            }
          }
          this.bookMoney =  booklength * 50;
          setStore('needBook',this.needBookIds);
        },
        initCartList(){
          let _this =this;
          let newCart ={}
          _this.chooseList=[];
          _this.allNum = 0;
          _this.allPrice = 0;
          _this.discountAll = 0;
          console.log(_this.shopCart)
          for(let cart of Object.values(_this.shopCart)){
            if(cart.choose){
              if(cart.lessonArr){
                _this.chooseList.push(cart);
                _this.checkLessonsLength = Object.keys(cart.lessonArr).length || 0;
                _this.allPrice = _this.allPrice + cart.checkLessonsPrice * _this.checkLessonsLength;
               if(cart.needBook){
                _this.allPrice+= 50;
               }
                _this.lessonsLength= _this.lessonsLength +_this.checkLessonsLength
              }
          //     _this.allNum++
          //     _this.allPrice += new Number(cart.price);
              
          //     if(!cart.exclude){
          //       _this.discountAll += new Number(cart.price);
          //     }
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
  .courseList{
    width: 100%;
  }
  .checkBox{
    margin: 8px 13px 15px 12px;
    box-shadow: 0 4px 6px 0 rgba(0,0,0,0.1);
    background: #fff;
    border-radius: 5px;
    .checkName{
      color: #F95353;
      font-size: 15px;
      line-height:50px;
      border-bottom: 1px solid #F1F3F8;
      overflow: auto;
      margin: 0 10px;
      span{
        margin-right: 20px;
      }
      .checkBtn{
          float: right;
          background: #fff;
          border: 1px solid #5197FC;
          color: #5197FC;
          font-size: 15px;
          width: 60px;
          height: 30px;
          line-height: 27.5px;
          text-align: center;
          margin-top: 10px;
          border-radius: 6px;
      }
    }
    .checkAddr{
      margin: 10px;
      min-height: 32px;
      overflow: hidden;
      input::-webkit-input-placeholder {
         color: #999999;
         font-size: 11px;
         opacity: 0.7;
      }
      span{
        width: 70%;
        word-break: break-all;
        display: inline-block;
        font-size: 14px;
      }
      input{
        width: 70%;
        color: #333333;
        font-size: 11px;
      }
    }
    .checkAddrBtn{
      float: right;
      margin-right: 10px;
      font-size: 12px;
      color: #F95353;
    }
  }
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
  .initlabel{
    padding-top:10px;
    line-height: 28px;
    background: #fff;
    font-size: 15px;
    color: #393939;
    padding: 0 10px;
    padding-left: 33px;
    position: relative;
    span{
      font-size:15px;
      word-wrap: break-word;
    }
    input{
      width: 100%;
      line-height: 20px;
      font-size: 15px;
      color: #898989;
    }
  }
</style>
