<template>
  	<div>
      <div class="fixtop2">
        <header class="header" ref="header">
          <img src="../../images/info.png">
        </header>
        <div class="nav" ref="nav" :class="{isFixed:isFixed}">
          <div class="box" :class="{active:item.show}" v-for="(item,index) in list" :key="index" @click="checkType(item,list)">
            {{item.title}}
          </div>
        </div>
        <div class="detailsDiv" v-show="list[0].show">
          <div class="infoBox">
            <div class="infoTitle">
              【18暑】37讲学完英语新概念2上半册班
            </div>
            <div class="info">
              <div class="infoTime">有效期:<span>{{infoTime}}天</span></div>
              <div class="infoNumber">购买人数:<span>{{infoNumber}}人</span></div>
            </div>
          </div>
          <div class="detailHtml">
            <div class="detailTitle">
              课程简介
            </div>
            <div v-html="'<p>123123</p>'">
              
            </div>
          </div>
        </div>
        <div class="arrangeDiv" v-show="list[1].show">
          <div class="arrangeList" v-for="item in 10">
            <span>第1讲:</span><span>2018-07-07</span><span>08:00-10:00</span>
          </div>
        </div>
        <div class="teacherDiv" v-show="list[2].show">
          <div class="userBox">
            <div>
              <img src="../../images/avatar.png">
            </div>
            <div>
              小帅老师
            </div>
            <div>
              上海市某顶级八校重点中学青年骨干数学教师，华东师范大学理学硕士，五届高三毕业班教学经验。
            </div>
          </div>
          <div class="courseBox">
            <div class="courseTitle">
              在教课程
            </div>
          </div>
          <shop-list v-for="item in 10"></shop-list>
          <div class="lineheight"></div> 
          <div class="lineheight"></div> 
        </div>
      </div>
      <shop-cart></shop-cart>
    </div>
</template>
<script>
var throttle = require('lodash/throttle'); //从lodash中引入的throttle节流函数
import buyCart from 'src/components/common/buyCart'
import shopCart from 'src/components/common/shopCart'
import shopList from 'src/components/common/shopList'
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
          infoTime:'365',
          infoNumber:3,
        };
      },
      components:{
        shopCart,
        buyCart,
        shopList
      },
      mounted () {
         this.$nextTick(() => {
          window.addEventListener('scroll', this.throttleScroll, false);
        });
         this.throttleScroll = throttle(this.handleScroll, 100);
      },
      deactivated() {
        //离开页面需要remove这个监听器，不然还是卡到爆。
        window.removeEventListener('scroll', this.throttleScroll);
      },
      methods:{
         //滚动的函数
        handleScroll() {
          let h = $(this.$refs.header).outerHeight(); //header的高度
          let wh = $(window).scrollTop(); //滚动的距离的，为什么这里使用的jq，因为不用考虑的什么的兼容问题
          let navH = $(this.$refs.nav).outerHeight(); //nav的高度

          if (wh > h) {
            this.isFixed = true;
          } else {
            this.isFixed = false;
          }
        },
        checkType(item,list){
          for (let elem of list) {
            elem.show = false;
          }
          item.show =true;
        }
      },
  }

</script>

<style lang="scss" scoped>
  .fixtop2 {
  min-height: 100vh;
}

.header {
  height: 204px;
  width: 100%;
}
.nav {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #f4f3f3;
  font-weight: bold;
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
  padding: 0 12px;
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
    padding:10px 0 0px 20px;
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
      background: url(../../images/number.png) no-repeat;
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
.userBox{
  text-align: center;
  background: #fff;
  margin-bottom: 10px;
  div:nth-of-type(1){
    width: 70px;
    height: 70px;
    margin: 13px auto 9px;
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
</style>
