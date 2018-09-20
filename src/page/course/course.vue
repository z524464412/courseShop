<template>
    <div class="page-infinite-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
    
    <!-- 隐藏首页轮播 -->
     <!--  <div @click="swipeClick" id="swipeDiv" ref="header">
        <mt-swipe class="myswipe" :auto="3000" >
          <mt-swipe-item v-for="(banner,index) in 1" :data-value="banner.url" class="swiper-slide">
            <img src="../../images/banner.png">
          </mt-swipe-item>
        </mt-swipe>
      </div> -->
      <div class="courseLists" >
        <div class="courseheight"></div>
        <div class="isIOS">
        <search-box @getList="getCourseList" :clearSearBtn="clearSearBtn"></search-box>
          <div class="courseTitle" ref="nav"  :class="{isFixed:isFixed}">
            <div class="left courseType" @click="selectType(99,'全部课程','gradeShow')">{{courseTypeName}}</div>
            <div class="right courseScreening" @click="selectType(99,'全部课程','typeShow')">
              科目筛选
            </div>
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
      <shop-cart :allNum=allNum :allPrice=allPrice :checkLessonsLength=lessonsLength :discountAll=discountAll :noIcon="'index'"></shop-cart>
      <div class="typeBox" v-show="typeShow">
        <div class="subjectBox">
          <div class="popupTitle">科目</div>
          <div class="popupTypes">
            <div class="popupType" @click="clickType(item,'subject',index)" :class="{active : item.check}" v-for='(item,index) in courseTypeList'>
              {{item.name}}
            </div>
          </div>
        </div>
      </div>
      <div class="typeBox" v-show="gradeShow">
        <div class="grade-boxs">
          <div class="grade-box grade-left" >
            <div class="grade-item" :class="{active : item.check}" v-for="(item,index) in scopeTypes" @click="clickType(item,'scope')">{{item.name}}</div>
          </div>
          <div class="grade-box grade-right"  >
            <div class="grade-items" :class="{active : item.check}" v-for="(item,index) in gradeTypes" @click="clickType(item,'grade')">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
var throttle = require('lodash/throttle'); //从lodash中引入的throttle节流函数
import searchBox from "src/components/common/searchBox"
import {mapState, mapMutations} from 'vuex'
import shopCart from 'src/components/common/shopCart'
import shopList from 'src/components/common/shopList'
import { courseList , CourseType,discount,gradeList} from 'src/service/course'
import { MessageBox } from 'mint-ui';
import { Indicator } from 'mint-ui';
import { Spinner } from 'mint-ui';

  export default {
      data() {
        return {
          subjectsType:false,//学科popup是否显示
          subjectsArr:[
            {name:'全部',check:true},
            {name:'语文',check:false},
            {name:'数学',check:false},
            {name:'英语',check:false},
          ],//学科数组
          clearSearBtn:true, //是否显示搜索组件的搜索按钮
          banners:[{url:'../../images/banner.png',title:'图片'}],
          isFixed: false, //是否固定的
          throttleScroll: null, //定义一个截流函数的变量
          typeShow:false,//是否显示类型
          gradeShow:false,//是否显示
          showEmpty: false, //无数据
          loading: false, //底部加载
          listEnd: false, //底部提示
          scopeTypes:[],//学段类型
          gradeTypes:[],//学年类型
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
          scopeId:'',
          gradeId:'',
          courseTypeList:[],
          tag:'',
          apptype:'',
          winStyle: {
            headerTitle: 230,
            bannerHeight: 60,
            ordernav: 50,
            lovenav: 52
          },
          discountAll:0,
          lessonsLength:0
        }
      },
      created(){
        Indicator.open('加载中...');
        this.gradeId = this.$route.query.gradeId;
        this.scopeId = this.$route.query.scope;
        this.INIT_BUYCART();
        this.getdiscount();
      },
      mounted () {
        var stickyEl = document.querySelector('.courseTitle')
        var stickyHolder = document.createElement('div');
        var rect = stickyEl.getBoundingClientRect();
        stickyEl.parentNode.replaceChild(stickyHolder, stickyEl);
        stickyHolder.appendChild(stickyEl);
        stickyHolder.style.height = rect.height+ 'px';
        stickyHolder.style.className = 'isIOS'
        let u = navigator.userAgent;  
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;  
        if(isIOS){
          this.apptype = 'ios'
        }
        if(isAndroid){
          this.apptype ='android'
        }
        this.$nextTick(() => {
          window.addEventListener('scroll', this.throttleScroll, false);
          this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        });
         this.throttleScroll = throttle(this.handleScroll, 100);
         this.getCourseType();
         // this.getCourseList();
         this.getGradeList();
         // this.scroll()
      },
      components:{
        shopCart,
        shopList,
        searchBox
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
        //选择课程
        checkSubject(){

        },
        //获取优惠规则
        getdiscount(){
          var _this =this;
          discount().then(res=>{
            if(res.data.respCode == 0){
             _this.ADD_DISCOUNT(res.data.data)
            }
          })
        },
        //年级切换
        clickType(item,type,index){
          if( type == 'type'){
            for (var i = this.courseTypes.length - 1; i >= 0; i--) {
              this.courseTypes[i].check = false;
            }
            this.typeStatus = item.typeStatus;
          }else if(type == 'subject'){
            for (var i = this.courseTypeList.length - 1; i >= 0; i--) {
              this.courseTypeList[i].check =false
            }
            this.courseTypeList[index].check =true;
            this.$set(this.courseTypeList,index,item);
            this.tag = item.tag;
            this.searchData();

          }else if(type == 'scope'){
            let bb = {name:'全部',id:'',check:false};
            for (var i = this.scopeTypes.length - 1; i >= 0; i--) {
              this.scopeTypes[i].check =false
            }
            // if(item.name == '全部'){
            //   item.check =true;
            //    this.gradeTypes =[];
            //    this.gradeTypes.push(bb);
            //    return
            // }
            this.scopeId = item.id;
            this.gradeTypes =[];
            let aa = [];
            aa = this.getGrade(item.name);
            for (var i = aa.length - 1; i >= 0; i--) {
              aa[i].check = false
            }
            //添加全部选项
            this.gradeTypes = aa 
            // this.gradeTypes[0].check =true;
          }else if(type == 'grade'){
            for (var i = this.gradeTypes.length - 1; i >= 0; i--) {
              this.gradeTypes[i].check =false
            }
            this.gradeId = item.id;
            this.pickerVisible1 = false;
            this.searchData();
          }
          item.check = true;
        },
        //选择课程或类型获取课程列表
        searchData(){
          $('body').css('overflow','auto');
          this.gradeShow = false;
          this.typeShow = false;
          this.curPage = 1;
          this.courseLists =[];
          this.getCourseList();
        },
        //获取所有名字
        getNameDta(arr){
          var result = new Array();
          for (var i in arr) {
            if (arr[i].name != '') {
              let aa = {};
              aa.name =arr[i].name
              aa.id = arr[i].id;
              aa.check = false;
              result.push(aa); 
            }
          }
          return result;
        },
        //获取二级菜单
        getGrade: function(placeName) {
          this.gradeTypes =[];
          var _this = this;
          var place = Object.values(_this.allData);
          for (let item of place) {
            if (item.name == placeName) {
               return item.sub;
            }
          }
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
        // //获取所有类型
        // getCourseType(){
        //   var _this =this;
        //   var param = {};
        //   param.type = 'subject'
        //   if(this.scopeId){
        //     param.scope = this.scopeId;
        //   }else{
        //     param.grade = this.gradeId;
        //   }
        //   CourseType(param).then(res =>{
        //     _this.courseTypeList = res.data.data;
        //   })
        // },
        //获取课程列表
        getCourseList(val,clear){
          var _this = this;
          var param = {};
          if(clear){
            this.courseLists = [];
          }
          if(val && val.inputValue){
            param.search = encodeURIComponent(val.inputValue);
          }
          param.scope = this.scopeId;
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
                if(res.data.data.classes && res.data.data.classes.length>0){
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
          _this.discountAll = 0;
          _this.lessonsLength = 0;
          for(let cart of Object.values(_this.shopCart)){
            if(cart.choose){
              _this.allNum++
              // 第一版订单
              // _this.allPrice += new Number(cart.price);
              if(cart.lessonArr){
                _this.checkLessonsLength = Object.keys(cart.lessonArr).length || 0;
                _this.allPrice = _this.allPrice + cart.checkLessonsPrice * _this.checkLessonsLength;
                _this.lessonsLength= _this.lessonsLength +_this.checkLessonsLength
              }
              if(cart.needBook){
                _this.allPrice+= 50;
               }
              if(!cart.exclude){
                _this.discountAll += new Number(cart.price);
              }
            }
            for(let list of _this.courseLists){
              if((cart.id == list.id) && (cart.choose)){
                list.choose =true;
              }
            }
          }
        },
        //获取年级列表
       getGradeList(){
        let _this =this;
        let param = {};
        param.type = 'subject'
        gradeList(param).then(res =>{
          if(res.data && res.data.data){
            _this.allData = res.data.data;
            let aa = _this.allData[2];
            let bb = _this.allData[0];
            _this.allData[0] = aa;
            _this.allData[2] = bb;
            var allName =  this.getNameDta(res.data.data)
            if(_this.oldgrade){
              for (var i = _this.allData.length - 1; i >= 0; i--) {
                for (var j = _this.allData[i].sub.length - 1; j >= 0; j--) {
                  if(_this.allData[i].sub[j].id ==  _this.oldgrade){
                      if(allName[i]){
                        allName[i].check =true; 
                      }
                      _this.gradeNowList = _this.getGrade(allName[i].name);

                      for (let o = _this.gradeNowList.length - 1; o >= 0; o--) {
                        _this.gradeNowList[o].check = false
                      }
                      _this.gradeNowList[j].check = true;
                     _this.scopeId  = _this.allData[i].id
                     _this.gradeId  = _this.oldgrade;
                  }
                }
              }
            }else{
              if(allName[0]){
                allName[0].check = true;
              }
              _this.gradeNowList = _this.getGrade(allName[0].name);
              for (let i = _this.gradeNowList.length - 1; i >= 0; i--) {
                _this.gradeNowList[i].check = false
              }
              _this.gradeNowList[0].check = true;
              _this.gradeId =_this.allData[0].sub[0].id;
              _this.scopeId = _this.allData[0].id;
            }
            this.gradeTypes = _this.gradeNowList;
            /* 添加全部功能*/
            // let scopeAll = {name:'全部',id:'',check:true};
            // if(_this.scopeId){
            //   scopeAll.check = false
            // }else{
            //   scopeAll.check = true;
            // }
            _this.scopeTypes =allName;
            // _this.scopeTypes.unshift(scopeAll)
            // this.scopeId;//学段(高中小专项)
            // param.grade = this.gradeId;//年级
            this.getCourseType();
            this.getCourseList();
          }
        })
      },
      //获取所有类型
        getCourseType(){
          var _this =this;
          var param = {};
          param.type = 'subject'
          if(this.scopeId){
            param.scope = this.scopeId;
          }else{
            param.grade = this.gradeId;
          }
          CourseType(param).then(res =>{
            if(!res.data.data){
              _this.courseTypeList =[];
              return
            }else{
              _this.courseTypeList = res.data.data;
              for (var i = _this.courseTypeList.length - 1; i >= 0; i--) {
                _this.courseTypeList[i].tag = _this.courseTypeList[i].name
                _this.courseTypeList[i].check = false
              }
              let allCourse = {name:'全部',tag:0,check:true};
              _this.courseTypeList.unshift(allCourse)
            }
          })

        },
        //选择科目
        selectType(type,name,btn){
          let _this  =this;
          if(type == 99){
            $('body').css('overflow','hidden');
          }else if(type== 98){
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
          }
          //根据传入
          if(btn){
            this[btn] = !this[btn]
          }
        },
        //轮播跳转
        swipeClick(){
          this.$router.push('activity')
        },
        handleScroll() {
          let h = $(this.$refs.header).outerHeight(); //header的高度
          let wh = $(window).scrollTop(); //滚动的距离的，为什么这里使用的jq，因为不用考虑的什么的兼容问题
          let navH = $(this.$refs.nav).outerHeight(); //nav的高度
          if(this.apptype == 'android'){
            if (wh > h) {
              this.isFixed = true;
              // $('.courseheight').show();
            } else {
              // $('.courseheight').hide();
              this.isFixed = false;
            }
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
  .mint-popup{
    width: 100%;
    transform: translate(-50%, 0);
    box-shadow: 0 5px 10px 0 rgba(133,133,133,0.5);
    &:before{
      display: inline-block;
      width: 0;
      height: 0;
      border: solid transparent;
      border-width: 10px;
      border-bottom-color: #fff;
      content: "";
      position: absolute;
      top: -20px;
      margin-left: -10px;
    }
    &.mint-popup-1{
      &:before{
        left: 16%;
      }
    }  
  }
  .popupTypes{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 10px 0;
    .popupType{
      font-size: 12px;
      width: 20%;
      text-align: center;
      padding: 8px;
      background: #F1F3F8;
      border:1px solid #F1F3F8;
      color: #4A4A4A;
      border-radius: 15.5px;
      margin: 5px 8px;
    }
    .active{
      border:1px solid #5197FC;
      background: #D7EBFF;
      color:#4A4A4A
    }
  }
  .myswipe img{
    transform: translateY(-2px);
  }
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
        background-color: rgba(73,76,83,0.3);
        z-index: 200;
        text-align: center;
        padding-top: 97px;
        .subjectBox{
          background: #fff;
          .popupTitle{
            text-align: left;
            width: 100%;
            padding-left: 15px;
            padding-top: 15px;
            color: #5197FC;
            font-size: 14px;
            font-weight: bold;
          }
        }
        .typeItem{
          // border-bottom:2px solid  #303231;
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
    .isIOS{
      position: -webkit-sticky;  
      position: sticky;
      top: -5px;;  
      left: 0; 
      z-index: 201; 
    }
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

  .grade-boxs{
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    .grade-box{
      flex:1;
      height: 160px;
      overflow: auto;

      .grade-item{
        padding: 0px 12px;
        line-height: 41px;
        background: #f4f4f4;
        &.active{
          background: #fff;
        }
      }
      .grade-items{
        margin: 0px 12px;
        line-height: 40px;
        border-bottom:1px solid #F1F3F8;
        position:relative;
        &.active{
          color: #5197FC;
          &:before{
            position: absolute;
            background: url('../../images/arrow_check.png') no-repeat;
            background-size: 100% auto;
            content: '';
            width: 11px;
            height: 9px;
            right: 10px;
            top: 50%;
            margin-top: -5.5px;
          }
        }
      }
    }
    .grade-left{
      flex-basis:30%;
    }
    .grade-right{
      flex-basis:70%;
    }
  }
</style>
