<template>
    <div>
      <div @click="swipeClick" id="swipeDiv"ref="header">
        <mt-swipe class="myswipe" :auto="3000" >
          <mt-swipe-item v-for="(banner,index) in 3" :data-value="banner.url" class="swiper-slide">
            <img src="../../images/banner.png">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="courseLists" >
        <div class="courseheight"></div>
        <div class="courseTitle" ref="nav" :class="{isFixed:isFixed}">
          <div class="left courseType">全部课程</div>
          <div class="right courseScreening" @click="selectType(99)">
            筛选
          </div>
        </div>
        <shop-list v-for="item in 10" @click="gotoPage('/courseDetail',{id:123})">
        </shop-list>
      </div>
      
      <shop-cart></shop-cart>
      <div class="typeBox" v-show="typeShow">
        <div @click="selectType(0)" class="typeItem active">全部课程</div>
        <div @click="selectType(1)" class="typeItem">语文</div>
        <div @click="selectType(2)" class="typeItem">数学</div>
        <div @click="selectType(3)" class="typeItem">英语</div>
        <div @click="selectType(4)" class="typeItem">物理</div>
        <div @click="selectType(5)" class="typeItem">化学</div>
        <div @click="selectType(6)" class="typeItem">地理</div>
        <div @click="selectType(7)" class="typeItem">政治</div>
        <div @click="selectType(8)" class="typeItem">专项课程</div>
        <div class="closeBtn" @click="selectType">
          <img src="../../images/close.png">
        </div>
      </div>
    </div>
</template>
<script>
var throttle = require('lodash/throttle'); //从lodash中引入的throttle节流函数
import shopCart from 'src/components/common/shopCart'
import shopList from 'src/components/common/shopList'
  export default {
      data() {
        return {
          banners:[{url:'../../images/banner.png',title:'图片'}],
          isFixed: false, //是否固定的
          throttleScroll: null, //定义一个截流函数的变量
          typeShow:false,//是否显示类型
        }
      },
      mounted () {
        
        this.$nextTick(() => {
          window.addEventListener('scroll', this.throttleScroll, false);
        });
         this.throttleScroll = throttle(this.handleScroll, 100);
      },
      components:{
        shopCart,
        shopList
      },
      methods:{
        //跳转页面
        gotoPage(path,query){
          this.$router.push({path,query})
        },
        //选择科目
        selectType(type){
          if(type == 99){
            $('body').css('overflow','hidden');
          }else{
            $('body').css('overflow','auto');
          }
          this.typeShow =!this.typeShow;
        },
        //轮播跳转
        swipeClick(){
          this.$router.push('activity')
        },
        //滚动的函数
        handleScroll() {
          let h = $(this.$refs.header).outerHeight(); //header的高度
          let wh = $(window).scrollTop(); //滚动的距离的，为什么这里使用的jq，因为不用考虑的什么的兼容问题
          let navH = $(this.$refs.nav).outerHeight(); //nav的高度
          if (wh > h) {
            this.isFixed = true;
            $('.courseheight').show();
          } else {
            $('.courseheight').hide();
            this.isFixed = false;
          }
        }
      },
      deactivated() {
        //离开页面需要remove这个监听器，不然还是卡到爆。
        window.removeEventListener('scroll', this.throttleScroll);
      }
  }

</script>

<style lang="scss" scoped>
  @import 'src/style/common';
  @import 'src/style/mixin';

  .typeBox{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(38,38,38,0.97);
        z-index: 200;
        text-align: center;
        .typeItem{
          border-bottom:2px solid  #303231;
          color: rgb(155,157,156);
          line-height: 48px;
          width: 100%;
          letter-spacing: 2px;
          &.active{
            color: rgb(87,152,246)
          }
        }
        .closeBtn{
          position: absolute;
          width: 60px;
          height: 60px;
          margin: 0 auto;
          bottom: 30px;
          left: 50%;
          margin-left: -30px;
        }
  }
  .isFixed {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 14;
  }
  #swipeDiv{
    .mint-swipe {
      height: 145px;
      color: #fff;
      font-size: 30px;
      text-align: center;
    }
  }
  .courseheight{
      display: none;
      height: 46px;
    }
  .courseLists{
    background :#fff;
    
    .courseTitle{
      line-height: 46px;
      padding: 0px 12px;
      border-bottom: 1px solid #f5f4f5;
      overflow: hidden;
      width: 100%;
      background: #fff;
      .courseType {
         color: rgb(81,149,246);
         font-size: 15px;

      }
      .courseScreening{
        color: rgb(102,102,102);
        font-size: 14px;
        padding-right: 20px;
        position: relative;
        &:before{
          content: '';
          position: absolute;
          right: 0;
          bottom: 20px;
          display: inline-block;
          border-left: 2px solid;
          border-bottom: 2px solid;
          width: 8px;
          height: 8px;
          transform: rotate(-45deg);
        }
        &:after{
          content: '';
          position: absolute;
          left: -20px;
          top: 15px;
          width: 15px;
          height: 15px;
          background: url(../../images/invalidName.png) no-repeat;
          background-size: 100% auto;
        }
      }
    }
  }
  .courseBuyBox{
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    .discountInfo{
      background: rgba(253,249,216,0.9)
    }
  }

</style>
