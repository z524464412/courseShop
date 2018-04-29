<template>
    <div class="page-infinite-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <div @click="swipeClick" id="swipeDiv" ref="header">
        <mt-swipe class="myswipe" :auto="3000" >
          <mt-swipe-item v-for="(banner,index) in 1" :data-value="banner.url" class="swiper-slide">
            <img src="../../images/banner.png">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="courseLists" >
        <div class="courseheight"></div>
        <div class="courseTitle" ref="nav" :class="{isFixed:isFixed}">
          <div class="left courseType">{{courseTypeName}}</div>
          <div class="right courseScreening" @click="selectType(99,'全部课程')">
            筛选
          </div>
        </div>
          <ul class="page-infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="20">
            <shop-list v-for="courseList in courseLists" :courseList=courseList>
            </shop-list>
          </ul>
          <p v-show="loading" class="page-infinite-loading">
            <mt-spinner type="fading-circle"></mt-spinner>
            加载中...
          </p>
        <div class="null-empty" v-show="showEmpty">
          <img src="../../images/empty.png">
        </div>
      </div> 
      <div class="lineheight"></div>
      <div class="lineheight"></div>
      <shop-cart :allNum=allNum :allPrice=allPrice :noIcon="'index'"></shop-cart>
      <div class="typeBox" v-show="typeShow">
        <div @click="selectType('','课程')" class="typeItem active">全部课程</div>
        <div @click="selectType(typename.name,typename.name)" v-text="typename.name" class="typeItem" v-for="typename in courseTypeList">

        </div>
        <!-- <div @click="selectType(8,'')" class="typeItem">专项课程</div> -->
        <div class="closeBtn" @click="selectType(98)">
          <img src="../../images/close.png">
        </div>
      </div>
    </div>
</template>
<script>
var throttle = require('lodash/throttle'); //从lodash中引入的throttle节流函数
import {mapState, mapMutations} from 'vuex'
import shopCart from 'src/components/common/shopCart'
import shopList from 'src/components/common/shopList'
import { courseList , CourseType,discount} from 'src/service/course'
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { Spinner } from 'mint-ui';

  export default {
      data() {
        return {
          banners:[{url:'../../images/banner.png',title:'图片'}],
          isFixed: false, //是否固定的
          throttleScroll: null, //定义一个截流函数的变量
          typeShow:false,//是否显示类型
          showEmpty: false, //无数据
          loading: false, //底部加载
          listEnd: false, //底部提示
          courseLists: [],
          lastPage: 1,
          currentPage: 0,
          pageSize:10,
          allLoaded:false,
          wrapperHeight: 0,
          list:[],
          curPage:1,
          courseTypeName:'全部课程',
          allNum:0,
          allPrice:0,
          gradeId:'',
          courseTypeList:{},
          tag:''
        }
      },
      created(){
        Indicator.open('加载中...');
        this.gradeId = this.$route.query.gradeId;
        this.INIT_BUYCART();
        this.getdiscount();
      },
      mounted () {
        this.$nextTick(() => {
          window.addEventListener('scroll', this.throttleScroll, false);
          this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        });
         this.throttleScroll = throttle(this.handleScroll, 100);
         this.getCourseType();
         this.getCourseList();
      },
      components:{
        shopCart,
        shopList
      },
      computed: {
        ...mapState([
            'cartList','discount'
        ]),
        //当前商店购物信息
        shopCart: function (){
          return {...this.cartList};
        },

      },
      methods:{
        //vuex数据
        ...mapMutations([
            'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL','ADD_DISCOUNT','INIT_DISCOUNT'
        ]),
        getdiscount(){
          var _this =this;
          discount().then(res=>{
            if(res.data.respCode == 0){
             _this.ADD_DISCOUNT(res.data.data)
            }
          })
        },
        //下拉加载
        loadMore() {
          const _this = this;
          if (_this.lastPage > _this.curPage) {
            if (_this.curPage != 0) {//首次加载不显示loading
              _this.loading = true;
              setTimeout(function(){
                 _this.curPage++;
                 _this.getCourseList();
              },500)
            }
          }
        },
        //获取所有类型
        getCourseType(){
          var _this =this;
          var param = {};
          param.type = 'subject'
          param.grade = this.gradeId;
          CourseType(param).then(res =>{
            _this.courseTypeList = res.data.data;
          })
        },
        //获取课程列表
        getCourseList(){
          var _this = this;
          var param = {};
          param.grade = this.gradeId;
          param.pageSize = this.pageSize;
          if(this.tag){
            param.tag = encodeURI(this.tag);
          }
          param.pageNo = _this.curPage;
          courseList(param).then(res =>{
            setTimeout(()=>{
              Indicator.close();
              if(res.data.respCode == 0){
                if(res.data.data.classes.length>0){
                  for(let i in res.data.data.classes){
                    if(!isNaN(i)){
                       this.courseLists.push(res.data.data.classes[i])
                    }
                  }
                  this.initCartList()
                  this.lastPage = res.data.data.paging.lastPage;
                  this.currentPage = res.data.data.paging.currentPage;
                }else{
                  
                }
              }else{
                MessageBox(res.data.respMsg);
              }
              if(_this.courseLists.length <= 0){
                _this.showEmpty = true;
              }else{
                _this.showEmpty = false;
              }
              _this.loading = false;
           },200)
          },function(res){
            Indicator.close();
            this.loading = false;
            MessageBox('系统错误,请刷新!')
          }); 
        },
        //初始化和shopCart变化时
        initCartList(){
          let _this =this;
          _this.allNum = 0;
          _this.allPrice = 0;
          for(let cart of Object.values(_this.shopCart)){
            if(cart.num == 1){
              _this.allNum++
              _this.allPrice += parseInt(cart.price);
            }
            for(let list of _this.courseLists){
              if((cart.id == list.id) && (cart.num == 1)){
                list.choose =true;
              }
            }
          }
        },
        
        //选择科目
        selectType(type,name){
          if(type == 99){
            $('body').css('overflow','hidden');
            this.typeShow =!this.typeShow;
          }else if(type== 98){
            this.typeShow = !this.typeShow
            $('body').css('overflow','auto');
          }else{
            $('body').css('overflow','auto');
            
            if(name=='课程'){
              this.courseTypeName = '全部课程'
              this.tag = '';
            }else{
              this.courseTypeName = name
              this.tag = name;
            }
            
            this.curPage = 1;
            this.courseLists =[];
            this.getCourseList();
            this.typeShow =!this.typeShow;
          }
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
      },
      watch: {
        shopCart: function (value){
          this.initCartList();
        },
        // 'currentPage': function() { //加载到最后一页监控
        //   if (this.lastPage == this.currentPage) {
        //     if (this.currentPage != 1 || this.courseLists.length > 8) {
        //       this.listEnd = true;
        //     }
        //   }
        // }
      }
  }

</script>

<style lang="scss" scoped>
  @import 'src/style/common';
  @import 'src/style/mixin';
  .detailHtml img{
      display: block;
      width: 100% !important;
      height: auto !important;
  }
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
      height: 6rem;
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
    // background :#fff;
    
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
  .content_bd{
    position: absolute;
    top: 152px;
    bottom: 60px;
    width: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
