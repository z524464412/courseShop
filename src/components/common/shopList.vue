<template>
  <div v-if="courseList" class="courseList" @click="gotoPage('/courseDetail',{id:courseList.id})">
    <div class="courseImg">
        <img :src="imgBaseUrl +courseList.avatar" v-if="courseList.avatar">
        <img src="static/img/info.png" v-else>
    </div>
    <div class="courseInfo">
      <div class="courseName">{{courseList.title || '测试1'}}
      </div>
      <div class="userBox">
        <div class="manAvatar" v-if="!noBuy">
          <img :src="imgBaseUrl + courseList.t_avatar" v-if="courseList.t_avatar">
          <img src="static/img/avatar.png" v-else>
        </div>
        <div class="manName userItem" v-if="!noBuy">
          <div>
            {{courseList.teacher || '小帅老师1' }}
          </div>
          <div class="gray">
            {{courseList.totalHour || '共18课时1'}}
          </div>
        </div>
        <div class="courseMoney userItem">
          {{'￥'+courseList.price}}
        </div>
        <buy-cart v-if="!noBuy" class="coursePlus" :courseList=courseList  @showMoveDot="showMoveDotFun">
        </buy-cart>
      </div>
    </div>
    <transition
    appear
    @after-appear = 'afterEnter'
    @before-appear="beforeEnter"
    v-for="(item,index) in showMoveDot">
      <span class="move_dot" v-if="item">
          <img src="../../images/tick.png">
      </span>
    </transition>
    <div class="lineheight"></div> 
    <div class="lineheight"></div> 
  </div>
</template>
<script>
import buyCart from 'src/components/common/buyCart'
import {imgBaseUrl} from 'src/config/env'
  export default{
    data(){
      return{
          showMoveDot:[],
          shopId: null, //商店id值
          elLeft:0,
          elBottom:0,
          windowHeight:null,
          receiveInCart:false,
          imgBaseUrl,
      }
    },
    props:['noBuy','courseList'],
    mounted(){
      this.windowHeight = window.innerHeight;
    },
    methods:{
      //跳转页面
         gotoPage(path,query){
          this.$router.push({path,query})
        },
      //显示加入购物购物特效
      showMoveDotFun(showMoveDot, elLeft, elBottom){
          this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
          this.elLeft = elLeft;
          this.elBottom = elBottom;
      },
      beforeEnter(el){
          el.style.transform = `translate3d(0,${37 + this.elBottom - this.windowHeight}px,0)`;
          el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`;
          el.children[0].style.opacity = 0;
      },
      afterEnter(el){
          el.style.transform = `translate3d(0,0,0)`;
          el.children[0].style.transform = `translate3d(0,0,0)`;
          el.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
          el.children[0].style.transition = 'transform .55s linear';
          this.showMoveDot = this.showMoveDot.map(item => false);
          el.children[0].style.opacity = 1;
          el.children[0].addEventListener('transitionend', () => {
              // this.listenInCart();
          })
          el.children[0].addEventListener('webkitAnimationEnd', () => {
              // this.listenInCart();
          })
      }
    },
    components:{
      buyCart,
    }
  }
  
</script>
<style lang="scss" scoped>
  @import 'src/style/common';
  @import 'src/style/mixin';
  .move_dot{
    position: fixed;
    bottom: 30px;
    left: 30px;
    z-index: 300;
    img{
        @include wh(.9rem, .9rem);
    }
  }
</style>