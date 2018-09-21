<template>
  <div v-if="courseList" class="courseList" :class="{gotoLesson:$route.path == '/orderList'}"@click="gotoPage()">
    <!-- 隐藏缩略图 -->
    <!-- <div class="courseImg">
        <span class="hasBook" v-if="courseList.needBook == 1">
          资料
        </span>
        <img :src="imgBaseUrl +courseList.avatar" v-if="courseList.avatar">
        <img src="../../images/info.png" v-else>
        <div class="imgExclude" v-if="courseList.exclude">
          <img src="../../images/noDiscount.png" >  
        </div>
    </div> -->
    <div class="courseInfo">
      <div class="courseName">{{courseList.title || '课程题目'}}
      </div>
      <div class="userBox">
       <!--  <div class="manAvatar" v-if="!noBuy">
          <img :src="imgBaseUrl + courseList.t_avatar" v-if="courseList.t_avatar">
          <img src="../../images/avatar.png" v-else>
        </div> -->

        <div v-if="$route.path == '/orderList'" class="userBox">
          <div class="bookSty userItem" v-if="courseList.lessons">
            {{'共'+ courseList.lessons +'课次'}}
            <span class="bookSty" v-if="courseList.needBook">
              含资料费: <span class="red">50</span>元
            </span>
          </div>
          <div class="dataDiv courseMoney" id="fz16" v-if="courseList.needBook">
            {{'￥'+(courseList.lessons * courseList.lessonPrice +50)}}
          </div>
          <div class="dataDiv courseMoney" id="fz16" else>
            {{'￥'+courseList.lessons * courseList.lessonPrice}}
          </div>
        </div>
        <div class="bookSty userItem" v-if="courseList.lessonArr">
          {{'共'+(Object.keys(courseList.lessonArr).length)+'次'}}
          <span class="bookSty" v-if="courseList.needBook">
            含资料费: <span class="red">50</span>元
          </span>
        </div>
        <div class="manName userItem" v-if="!noBuy">
         <!--  <div>
            {{courseList.name || '小帅老师1' }}
          </div> -->
          <div class="gray" v-if="courseList.totalHour">
            {{'共'+courseList.totalHour+'课时'}}
          </div>
           <div class="gray" v-else>
            {{'共0课时'}}
          </div>
        </div>

        <div class="dataDiv courseMoney" v-if="courseList.needBook && courseList.lessonArr ">
          {{'￥'+((Object.keys(courseList.lessonArr).length)*courseList.checkLessonsPrice +50)}}
        </div>
        <div class="dataDiv courseMoney" v-if="courseList.lessonArr && !courseList.needBook">
          {{'￥'+((Object.keys(courseList.lessonArr).length)*courseList.checkLessonsPrice)}}
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
        <!-- 筛选 popUp-->
   <!--  <mt-popup v-model="chooseScreening" position="right" class="popupRight">
      <div class="gray" if="courseList.needBook">
        学习资料费: <span class="red">50</span> 元
      </div>
    </mt-popup> -->
  </div>
</template>
<script>
import buyCart from 'src/components/common/buyCart'
import {imgBaseUrl} from 'src/config/env'
import {setStore} from 'src/config/mUtils'
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
          needBook:false,
          needBookId:[],
          showbook:false,
          route:'',//路由地址
          chooseScreening:false,//显示课次列表

      }
    },
    props:['noBuy','courseList','payTitle'],
    created(){
      if(this.$route.path == '/payList'){
        this.showbook =true
      }else{
        this.showbook =false
      }
    },
    mounted(){
      this.query = this.$route.query;
      this.windowHeight = window.innerHeight;
    },
    methods:{
      chooseData(){
        let  _this = this;
        let needBook ={};
        _this.needBook = !_this.needBook;
        if(_this.needBook){
          needBook.id = _this.courseList.id;
          needBook.needBook = 1
        }else{
          needBook.id = _this.courseList.id;
          needBook.needBook = 0
        }
        this.$emit('needBook', needBook);  
      },
      //跳转页面
         gotoPage(){
          //订单支付页面不跳转
          if(this.$route.path == '/orderList'){
            console.log(this.courseList);
              // this.chooseScreening = !this.chooseScreening;
            return
            //创建订单页面
          }else if(this.$route.path == '/payList'){
            //显示选择课次详情

          }
          if(this.payTitle == '创建订单'){

          }else{
            setStore('chooseCart',this.courseList);
            this.$router.push({path:'/courseDetail',query:{id:this.courseList.id,price:this.courseList.price,courseId:this.courseList.id,gradeId:this.query.gradeId,scope:this.query.scope}})
          }
        },
      //显示加入购物购物特效
      showMoveDotFun(showMoveDot, elLeft, elBottom){
          this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
          this.elLeft = elLeft;
          this.elBottom = elBottom;
      },
      beforeEnter(el){
          el.style.transform = `translate3d(0,${37-10 + this.elBottom - this.windowHeight}px,0)`;
          el.children[0].style.transform = `translate3d(${this.elLeft -10-30}px,0,0)`;
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
  .popupRight {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 6px;
  }
  .chooseBtn {
    position: absolute;
    width: 200px;
    height: 42px;
    bottom: 11px;
    right: 39px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .closeBtn {
      border: 1px solid #5197FC;
      border-radius: 100px 0 0 100px;
      color: #5197FC;
      font-size: 15px;
    }
    .checkBtn {
      font-size: 15px;
      color: #fff;
      background-image: linear-gradient(90deg, #5FA0FE 0%, #88F5FE 100%);
      border-radius: 0 100px 100px 0;
      border: 1px solid #5FA0FE;
    }
    .btn {
      flex: 0 0 50%;
      line-height: 42px;
    }
  }
  .gotoLesson{
    position: relative;
    &:before{
      position: absolute;
      content: '';
      background: url('../../images/icon_arrow_right.png') no-repeat;
      background-size: 100% 100%;
      width: 11px;
      height: 18px;
      right: 10px;
      top: 35px;
    }
  }
  .fz12{
    font-size: 12px;
  }
  #fz16{
    font-size: 16px;
  }
  .blue{
    color: #5197FC;
  }
  .courseList {
    padding-right: 30px;
    .userBox{
      width: 100%;
    }
  }
  .bookSty{
    font-size: 12px;
    color: #666;
    span{
      font-size: 12px;
    }
  }
  .courseImg{
    .imgExclude{
      position: absolute;
      top: 0;
      width: 42px;
      height: 13px;
    }
    .hasBook{
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      color: #fff;
      padding: 5px;
      background: #F95353;
    }
  }
  .move_dot{
    position: fixed;
    bottom: 30px;
    left: 30px;
    z-index: 300;
    img{
        @include wh(.9rem, .9rem);
    }
  }
  .dataDiv{
    color: #666;
    float: right;
    padding-left: 20px;
    position: relative;
    font-size: 12px;
    color: #666666;
    span{
      font-size: 12px;
    }
    .dataImg{
      width: 16px;
      height: 16px;
      position: absolute;
      right: 0;
      top: 0;
    }
    .dataNoImg{
      width: 17px;
      height: 17px;
      position: absolute;
      right: 0;
      top: 0;
      background: #fff;
      border: 2px solid #8b8b8b;
      border-radius: 50%;
    }
  }
</style>