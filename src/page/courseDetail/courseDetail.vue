<template>
  	<div>
      <div class="fixtop2">
        <header class="header" ref="header">
          <img :src="imgBaseUrl + courseDetail.avatar" v-if="courseDetail.avatar">
          <img src="../../images/info.png" v-else>
        </header>
        <div class="isIOS">
          <div class="nav" ref="nav" :class="{isFixed:isFixed} " >
            <div class="box" :class="{active:item.show}" v-for="(item,index) in list" :key="index" @click="checkType(item,list)">
              {{item.title}}
            </div>
          </div>
        </div>
        <div class="courseheight"></div>
        <div class="detailsDiv" v-show="list[0].show">
          <div class="infoBox">
            <div class="infoTitle">
              {{courseDetail.title || '名称'}}
            </div>
            <div class="info">
              <div class="infoTime">有效期:<span>{{courseDetail.endTime}}天</span></div>
              <div class="infoNumber">购买人数:<span>{{courseDetail.number}}人</span></div>
            </div>
          </div>
          <div class="detailHtml">
            <div class="detailTitle">
              课程简介
            </div>
            <div v-html="decodeURI(courseDetail.content)" class="">
            </div>
          </div>
        </div>
        <div class="arrangeDiv" v-show="list[1].show">
          <div class="arrangeList" v-for="(item,index) in courseTimeList">
            <span>课程安排{{index}}:</span><span>{{item.date}}</span><span>{{item.begin}}-{{item.end}}</span>
          </div>
          
        </div>
        <div class="teacherDiv" v-show="list[2].show">
          <div class="userBox">
            <div>
              <img :src="imgBaseUrl + teacher.avatar" v-if="teacher.avatar">
              <img src="../../images/avatar.png" v-else>
            </div>
            <div>
              {{teacher.name || '老师名字'}}
            </div>
            <div>
                {{teacher.info ||'老师介绍'}}
              
            </div>
          </div>
          <div class="courseBox">
            <div class="courseTitle">
              在教课程
            </div>
          </div>
          <shop-list v-for="item in teacher.courseList" :courseList=item></shop-list>
          <div class="listend">
              没有更多的内容..
          </div>
        </div>
        
        <div class="lineheight"></div> 
      </div>
      <div id="packageBox" :class="{showCart:showCart}" >
        <i class="packageIcon" v-if="allNum>0">{{allNum}}</i>
        <img src="../../images/package1.png">
      </div>
      <shop-cart :noIcon="'detail'" :allPrice=query.price></shop-cart>
    </div>
</template>
<script>
var throttle = require('lodash/throttle'); //从lodash中引入的throttle节流函数
import {mapState, mapMutations} from 'vuex'
import {imgBaseUrl} from 'src/config/env'
import { courseDetail } from 'src/service/course'
import buyCart from 'src/components/common/buyCart'
import shopCart from 'src/components/common/shopCart'
import shopList from 'src/components/common/shopList'
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { Spinner } from 'mint-ui';

  export default {
      data() {
        return {
          list: [
            { title: '课程详情', id: 1 ,show:true},
            { title: '课程安排', id: 2 ,show:false},
            { title: '老师介绍', id: 3 ,show:false},
          ],
          isFixed: false, //是否固定的
          throttleScroll: null, //定义一个截流函数的变量
          showCart:false,
          query:{},
          courseDetail:{},
          courseTimeList:{},
          teacher:{},
          allNum:0,
          allPrice:0,
          imgBaseUrl,
          apptype:'',
          positionX:0,
          positionY:0,
        };
      },
      components:{
        shopCart,
        buyCart,
        shopList
      },
      created(){
        //缓存中取数据
        this.INIT_BUYCART();
      },
      mounted () {
        this.query = this.$route.query
        var _this = this;
        var stickyEl = document.querySelector('.nav')
        var stickyHolder = document.createElement('div');
        var rect = stickyEl.getBoundingClientRect();
        stickyEl.parentNode.replaceChild(stickyHolder, stickyEl);
        stickyHolder.appendChild(stickyEl);
        stickyHolder.style.height = rect.height + 'px';
         //判断平台
        let u = navigator.userAgent;  
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;  
        if(isIOS){
          this.apptype = 'ios'
        }
        if(isAndroid){
          this.apptype ='android'
          this.$nextTick(() => {
            window.addEventListener('scroll', this.throttleScroll, false);
            // window.addEventListener('touchmove',this.showCartT,false)
            // window.addEventListener('touchend',this.showCartF,false)
          });
        }

         this.throttleScroll = throttle(this.handleScroll, 100);
         this.showCartT = function(){_this.showCart = true}
         this.showCartF = function(){_this.showCart = false}
         this.dropCart('#packageBox');
         this.getDetail();
      },
      deactivated() {
        //离开页面需要remove这个监听器，不然还是卡到爆。
        window.removeEventListener('scroll', this.throttleScroll);
        // window.removeEventListener('touchmove', this.throttleScroll);
        // window.removeEventListener('touchmove', this.showCartT);
        // window.removeEventListener('touchend', this.showCartF);
      },
      computed:{
        ...mapState([
            'cartList'
        ]),
        // 当前商店购物信息
        shopCart: function (){
          return {...this.cartList};
        },
      },
      methods:{
        //vuex数据
        ...mapMutations([
            'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL'
        ]),
        getDetail(){
          var _this= this;
         var param = {};
         param.courseId = this.query.id;
          courseDetail(param).then(res =>{
            if(res.data.respCode == 0){
              let data = res.data.data;
              _this.courseDetail = data.courseDetail;
              _this.courseTimeList = data.courseTimeList;
              _this.teacher = data.teacher;
              this.initCartList()
            }else{
              Indicator.close();
            MessageBox('系统错误,请刷新!')
            }
          })
        },
        //滚动的函数
        handleScroll() {
          let h = $(this.$refs.header).outerHeight(); //header的高度
          let wh = $(window).scrollTop(); //滚动的距离的，为什么这里使用的jq，因为不用考虑的什么的兼容问题
          let navH = $(this.$refs.nav).outerHeight(); //nav的高度
          if(this.apptype == 'android'){
            if (wh > h) {
              this.isFixed = true;
            } else {
              this.isFixed = false;
            }
          }
        },
        //切换学科
        checkType(item,list){
          for (let elem of list) {
            elem.show = false;
          }
          item.show =true;
        },
        //初始化和shopCart变化时
        initCartList(){
          let _this =this
          _this.allNum = 0
          _this.allPrice = 0;
          if(!_this.teacher.courseList){
            return
          }
          for(let cart of Object.values(_this.shopCart)){
            if(cart.num == 1){
              _this.allNum++
            }
            for(let list of _this.teacher.courseList){
              if((cart.id == list.id) && (cart.num == 1)){
                list.choose =true;
              }
            }
          }
        },
        move(e){
            e.preventDefault();
            let odiv = e.target;    //获取目标元素
            this._x_move=e.touches[0].clientX,
            this._y_move=e.touches[0].clientY;
            //移动当前元素
            odiv.style.left = parseFloat(this._x_move)-parseFloat(this._x_start)+parseFloat(this.left_start)+"px"
            odiv.style.top = parseFloat(this._y_move)-parseFloat(this._y_start)+parseFloat(this.top_start)+"px"
        },
        end(e){
          e.preventDefault();
          this._x_end=e.changedTouches[0].clientX;
          this._y_end=e.changedTouches[0].clientY;
        },
        start(e){
          e.preventDefault();
          let odiv = e.target;
          this._x_start=e.touches[0].clientX;
          this._y_start=e.touches[0].clientY;
          this.left_start=odiv.offsetLeft;
          this.top_start=odiv.offsetTop;
        },
        // 拖拽书包图标
        dropCart(el){
          var _x_start,_y_start,_x_move,_y_move,_x_end,_y_end,left_start,top_start;
          document.querySelector(el).addEventListener("touchstart",function(e)
          {
              _x_start=e.touches[0].clientX;
              _y_start=e.touches[0].clientY;
              left_start=document.querySelector(el).offsetLeft;
              top_start=document.querySelector(el).offsetTop;
              e.preventDefault();
          })
          document.querySelector(el).addEventListener("touchmove",function(e)
          {
             e.preventDefault();
            document.querySelector('body').style.overflow ='hidden'
              _x_move=e.touches[0].clientX;
              _y_move=e.touches[0].clientY;
              if(_x_move > e.view.innerWidth-28){
                _x_move = e.view.innerWidth-28
              }
              if(_y_move > e.view.innerHeight-28){
                _y_move = e.view.innerHeight-28
              }
              if(_x_move < 50){
                _x_move = 50
              }
              if(_y_move < 50){
                _y_move = 50
              }
               document.querySelector(el).style.left = parseFloat(_x_move)-parseFloat(_x_start)+parseFloat(left_start)+"px"
              document.querySelector(el).style.top = parseFloat(_y_move)-parseFloat(_y_start)+parseFloat(top_start)+"px"
          })
          document.querySelector(el).addEventListener("touchend",function(e)
          {
            event.preventDefault();
            document.querySelector('body').style.overflow ='auto'
              var _x_end=e.changedTouches[0].clientX;
              var _y_end=e.changedTouches[0].clientY;
              
          })
          //阻止浏览器下拉事件 
        }
      },
      watch: {
        shopCart: function (value){
          this.initCartList();
        },
      }
  }

</script>

<style lang="scss" scoped>
  .listend{
    text-align: center;
    font-size: .7rem;
    margin: 10px 0;
  }
  .fixtop2 {
    line-height: 40px;
  min-height: 100vh;
}

.header {
  height: 204px;
  width: 100%;
}
.isIOS{
  position: -webkit-sticky;  
  position: sticky; 
  top: 0;  
  left: 0; 
  z-index: 13; 
}
.nav {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #f4f3f3;
  font-weight: bold;
  /*z比下方所有z高*/  
  &.isFixed {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
  }
  .box {
    font-size: 15px;
    line-height: 42px;
    color: #333333;
    background: #fff;
    flex: 1;
    text-align: center;
    &.active{
      color:rgb(81,149,246);
      border-bottom: 2px solid rgb(81,149,246);
    }
  }
}

.content {
  height: 20rem;
  li {
    width: 100%;
    height: 1rem;
    border-bottom: 1px solid #000;
  }
}
.infoBox{
  padding:10px;
  background:#fff;
  margin-bottom: 10px;
}
.infoTitle{
  font-size: 18px;
  margin-left: -8px;
}
.detailHtml{
  background: #fff;
  padding: 0 12px 12px;
  width: 100%;
  .detailTitle{
    margin-left: 4px;
    font-size: 14px;
    position: relative;
    line-height: 40px;
    color: rgb(102,102,102);
    &:before{
      position: absolute;
      content: "";
      left: -5px;
      top: 32%;
      width: 2px;
      height: 35%;
      background: red;
    }
  }
}
.info{
  // padding:0 5px;
  color: rgb(153,153,153);
  display: flex;
  font-size: 15px;
  // height: 30px;
  div{
    flex:1;
    position: relative;
    padding:0px 0 0px 20px;
    letter-spacing: 1px;
    &:before{
      position: absolute;
      left: 0;
      content: '';
      width: 16px;
      height: 16px;
    }
  }
  div:nth-of-type(1){
    &:before{
      top: 11px;
      background: url(../../images/time.png) no-repeat;
      background-size: 100% auto;
    }
  }
  div:nth-of-type(2){
    &:before{
      top: 12px;
      background: url(../../images/man.png) no-repeat;
      background-size: 100% auto;
    }
  }
}
.arrangeList{
  line-height: 36px;
  font-size: 14px;
  margin:0 14px;
  color: #666;
  border-bottom: 1px dashed rgb(203,203,203);
  span{
    padding-right: 18px
  }
}
.arrangeDiv{
  margin-bottom: 60px;
}
.userBox{
  text-align: center;
  background: #fff;
  margin-bottom: 10px;
  div:nth-of-type(1){
    width: 70px;
    height: 70px;
    margin: 0 auto 9px;
    padding-top: 10px;

  }
  div:nth-of-type(2){
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 1px;
  }
  div:nth-of-type(3){
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0pt;
    text-align: left;
    text-indent: 1.5rem;
    padding:16px;
    color: rgb(51,51,51);
  }
}
.courseBox{
  padding: 10px 15px;
  background: #fff;
}
.courseTitle{
  line-height: 40px;
  position: relative;
  font-size: 16px;
  margin-left: 10px;
  &:before{
    content: '';
    position: absolute;
    top: 10px;
    width: 4px;
    height: 20px;
    left: -10px;
    background: red;
    border-radius: 5px;
  }
}
.courseheight{
    display: none;
    height: 46px;
  }
#packageBox{
  position: fixed;
  right: 10px;
  bottom: 81px;
  width: 55px;
  z-index: 15;
  i{
    position: absolute;
    right: 5px;
    background: rgb(218,46,46);
    border-radius: 50%;
    width: 14px;
    text-align: center;
    color: #f4f4f4;
  }
}
  .showCart{
    right: -40px;
  }
</style>
