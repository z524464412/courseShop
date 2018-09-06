<template>
  <div class="orderList">
      <!-- <div class="userItems">
        <div class="userItem">
          <div>姓名:<span class="red">{{payList.userName}}</span></div>
          <div>手机号码:<span class="red">{{payList.phoneNo}}</span></div>
        </div>
        <div class="userItem">
          <mt-button disabled type="danger" v-if="payStatus == 1" v-show="!btnType" @click="checkBtn">已确认</mt-button>
          <mt-button v-else  type="danger" v-show="!btnType" @click="checkBtn">已确认</mt-button>
          <mt-button type="danger" v-show="btnType" plain @click="checkBtn">确认</mt-button>
        </div>
      </div> -->
      <div class="checkBox">
         <div class="checkName">
          <span>{{payList.userName}}</span><span class="">{{payList.phoneNo}}</span>
          <!-- <div class="checkBtn">确认</div> -->
           <mt-button disabled type="danger" class="checkedBtn" v-if="payStatus == 1" v-show="!btnType" @click="checkBtn">已确认</mt-button>
          <mt-button v-else class="checkedBtn"  type="danger" v-show="!btnType" @click="checkBtn">已确认</mt-button>
          <mt-button type="danger" class="checkBtn" v-show="btnType" plain @click="checkBtn">确认</mt-button>
        </div>
        <div class="checkAddr" v-if="payList.deliverAddr">
          <span>{{payList.deliverAddr}}</span> 
        </div>
      </div>
      <!-- <div v-if="!payStatus">
        <div class="initlabel" @click="chooseAddr" >
          <div class="addrText">
            资料费(每课<span class="red">￥50</span>):<span class="red">{{'￥'+courseLists.length *50}}</span>
          </div>
          <div class="tickIcon" >
            <img src="../../images/tick.png" v-show="needBook">
          </div>
          <div class="noChoose" v-show="!needBook">
          </div> 
        </div>
        <div class="initlabel" v-show="needBook">
          <div>
            <input type="text" name="addrText" placeholder="请输入地址" v-model="addrValue">
          </div>
        </div>
      </div> -->
      <!-- <div v-else>
        <div v-if="needBook">
          <div class="initlabel1">
              <span>资料费(每课<span class="red">￥50</span>):<span class="red">{{'￥'+courseLists.length *50}}</span></span>
          </div>
          <div class="initlabel1">
            <span>邮寄地址: </span><span>{{addrValue}}</span>
          </div>
        </div>
      </div> -->
      <div class="items">
        <div class="item" v-for="(item,index) in 1" v-cloak>
            <shop-list class="courseItem" :noBuy="true" v-for="courseList in courseLists" :courseList=courseList>
            </shop-list>
        </div>
      </div>
      <div class="readyMore" @click="showMore" v-if="show">
          <div v-text="moreTitle"></div>
          <div class="readyMoreImg">
            <img src="../../images/arrow.png">
          </div>
      </div>
    <div class="payBox" v-if="!payStatus">
      <div class="wxpay payItem" @click="choosePay('wx')" v-if="type != 'dingding'">
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
    <div class="payInfo">
      <span class="red">*</span>资料费不参与折扣活动
    </div>
    <div class="lineheight"></div>
    <shop-cart :payList=payList :bookNum=bookNum :btnChoose=btnType :chooseType=chooseType :payTitle =payTitle :payStatus=payStatus :addrValue=addrValue></shop-cart>   
  </div>  
</template>

<script>
  import { Toast } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import { Checklist } from 'mint-ui';
  import {setStore, getStore,removeStore} from 'src/config/mUtils'
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
          payStatus:1,
          payTitle:'',
          show:false,
          showAll:true,
          moreTitle:'显示全部',
          needBook:false,
          showBook:0,
          addrValue:'',
          bookNum:0
        }
      },
      mounted () {
          let _this = this;
          _this.type = getStore('type');
          this.query = this.$route.query
          var param ={};
          param.billId = this.query.id;
          let item = document.querySelector('.items');
          orderDetail(param).then(res=>{
            if(res.data.respCode == 0){
              _this.payList = res.data.data;
              _this.courseLists = res.data.data.courseList;
              _this.payStatus = res.data.data.payStatus;
              _this.addrValue = res.data.data.deliverAddr;
              _this.showBook = res.data.data.needBook;
              if(_this.courseLists &&  _this.courseLists.length>3){
                // setTimeout(function(){
                item.style.height = '200px';
                item.style.overflow = 'hidden';
              // },0)
                _this.show =true;
              }
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
          let url = window.location.href
          let origin =window.location.origin
          dd.ready(function(){
          　　dd.biz.navigation.setRight({
          　　show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
          　　control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
          　　text: '分享',//控制显示文本，空字符串表示显示默认文本
          　　onSuccess : function(result) {
          　　//如果control为true，则onSuccess将在发生按钮点击事件被回调
          　　dd.ready(function(){
                // 设置导航
                dd.biz.util.share({
                  type: 0,//分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
                  url: url,
                  title: '梯方教育',
                  content: '梯方在线课程购买',
                  image: origin+'/static/img/icon_desc1.png',
                  onSuccess : function() {
                      //onSuccess将在调起分享组件成功之后回调
                  },
                  onFail : function(err) {
                    alert(err)
                  }
                })
              }); 
          　　},
          　　onFail : function(err) {}
          　　});
          })
      },
      methods:{
        showMore(){
          let _this =this;
          let item = document.querySelector('.items');
          let divHeight = document.querySelector('.item').offsetHeight;
          let moreImg = document.querySelector('.readyMoreImg');
            if(!this.showAll){
              // setTimeout(function(){
                item.style.height = '200px';
                item.style.overflow = 'hidden';
                _this.moreTitle = '显示全部';
              // },0)
            }else{
              // setTimeout(function(){
                item.style.height = divHeight+'px';
                item.style.overflow = 'auto';
                _this.moreTitle = '收回';
              // },0)
            }
          this.showAll = !this.showAll;
          
        },
        chooseAddr(){
          this.needBook = !this.needBook
          if(this.needBook){
            this.bookNum = this.courseLists.length * 50;
          }else{
            this.bookNum = 0;
          }
        },
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
  .mint-checkbox-input:checked{
    background-color:#d83034;
    border-color: #d83034;

  }
  .initlabel1{
    line-height:40px;
    background: #fff;
    font-size: 15px;
    color: #393939;
    padding:0 10px;
    position:relative;
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
  .initlabel{
    // margin-top:10px;
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
    .addrText{
      font-size: 15px;
    }
    .tickIcon{
      width: 17px;
      position: absolute;
      top: 6.5px;
      left: 10px;
    }
    .noChoose{
      width: 17px;
      height: 17px;
      position: absolute;
      top: 6.5px;
      left: 10px;
      background: #fff;
      border: 2px solid #8b8b8b;
      border-radius: 50%;
    }
  }
  .readyMore{
    text-align: center;
    line-height: 25px;
    background: #fff;
    margin-bottom: 10px;
    color: rgb(153,153,153);
    border-top: 1px solid #f5f5f5;
  }
  .readyMoreImg{
    width: 15px;
    margin: 0 auto;
    padding: 5px 0;
    // transform: rotate(180deg);
  }

  .item{
    transition: all 0.5s ease;
  }

  .items{
    margin-top: 10px;
    height: auto;
    overflow:auto;
    transition: all 1s ease;
    
  }
  .allItems {
    height:200px;
    overflow:hidden;
    transition: all 2s;
  }
  .userItems{
    display: flex;
    // height: 100px;
    padding:9px 12px 0px;
    background: #fff;
    // margin-bottom: 10px;
    // line-height: 65px;
    .userItem{
      flex:1;
      .mint-switch{
        display: inline-flex
      }
      &:nth-of-type(1){
        div{
          font-size: 15px;  
          color: rgb(57,57,57);
          letter-spacing: 1px;
          line-height: 32px;
          display: flex;
          padding-right: 5px; 
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
  .payInfo{
    padding: 10px;
    // background: #fff;
    margin-top: 10px;
  }
  .payBox{
    background-color: #fff;
    margin:30px 0 0 0; 
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
        color: #F95353;
        font-size: 15px;
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
      .checkedBtn{
        float: right;
        background: #5197FC;
        border: 1px solid #5197FC;
        color: #fff;
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
</style>
