<template>
  <div class="courseList"  @click="gotoPage('/courseDetail',{id:123})">
    <div class="courseImg">
        <img src="../../images/info.png">
    </div>
    <div class="courseInfo">
      <div class="courseName">【18暑】37讲学完英语新概念2上半册班
      </div>
      <div class="userBox">
        <div class="manAvatar">
          <img src="../../images/avatar.png">
        </div>
        <div class="manName userItem">
          <div>
            小帅老师
          </div>
          <div class="gray">
            共18课时
          </div>
        </div>
        <div class="courseMoney userItem">
          ￥2880
        </div>
        <buy-cart class="coursePlus" :shopId='1123' :foods='123'  @showMoveDot="showMoveDotFun"></buy-cart>
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
  </div>
</template>
<script>
import buyCart from 'src/components/common/buyCart'
  export default{
    data(){
      return{
          showMoveDot:[],
          shopId: null, //商店id值
          elLeft:0,
          elBottom:0,
          windowHeight:null,
          receiveInCart:false,
      }
    },
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
  .courseList{
    padding: 13px 12px;
    border-bottom: 1px solid #f5f4f5;
    display: flex;
    align-content: flex-start;
    .courseImg{
      flex-basis:37%
    }
  }
  .courseInfo{
    padding-left: 15px;
    flex:1;
  }
  .courseName{
    font-size: 14px;
    line-height: 20px;
    height: 40px;
    text-align: left;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .userBox{
    display: flex;
    height: 40px;
    .userItem{
      flex:1;
      align-self:center;
    }
    .manName div{
      padding-left: 5px;
      font-size: 10px;
      line-height: 14px;
    }
    .manAvatar{
      align-self:center;
      flex-basis:30px;
    }
    .courseMoney{
      font-size: 18px;
      color:rgb(218,46,46);
    }
    .coursePlus{
      flex-basis: 20px;
      align-self:center;
    }
  }
</style>