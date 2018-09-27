<template>
 	<div class="lessons-container cart_module">
    <div class="lessons-type-box">
      <div class="lessons-type-info lessons-type">
        报名课次
      </div>
      <div class="lessons-type-name lessons-type" :class="{active:!isTrial}" @click="changeLessonsType('isTrial',0)">
        报名
      </div>
      <div class="lessons-type-name lessons-type" :class="{active:isTrial}" @click="changeLessonsType('isTrial',1)">
        试听
      </div>
    </div>
    <div class="lessons-type-box">
      <div class="lessons-type-info lessons-type">
        学习资料
      </div>
      <div class="lessons-type-name lessons-type" :class="{active:needBook}" @click="changeLessonsType('needBook',1)">
        需要
      </div>
      <div class="lessons-type-name lessons-type" :class="{active:!needBook}" @click="changeLessonsType('needBook',0)">
        不需要 
      </div>
    </div>
    <div class="lessons-check-container">
      <div class="lessons-check-info">
        选课课次
      </div>
      <div class="lessons-check-checkList" v-for="(item,index) in lessonsList">
        <div class="courseInfo">
          <div class="courseName">
            第{{item.index}}课：{{item.lessonBegin}}
          </div>
          <div class="userBox">
            <div class="manName userItem">
              <div class="gray">
                课节单价: ￥{{courseDetail.lessonPrice}}
              </div>
            </div>
            <addLessons class="coursePlus" :lessonsList=item @chooseLesson="chooseLesson">
            </addLessons>
          </div>
        </div>
      </div>
       <div class="lineHeight"></div>
    </div>
    <section class="buy_cart_container">
        <section class="cart_icon_num">
          <div class="lessonChoose" @click="chooseAllLesson">
            <div class="cart_check" v-if="!allLessons">
              <img src="../../images/checkLesson.png">
            </div>
            <div  class="cart_check" v-if="allLessons">
              <img src="../../images/tick.png">
            </div>
            <div class="cart_icon_container">
                全选
            </div>
          </div>
        	
          <div class="cart_num">
              <div>
                  <span>￥{{checkLessonsPrice}}</span>
              </div>
              <div>
                  <span>共{{checkLessonsLength}}课次</span>
              </div>
          </div>
        </section>
       <div  class="gotopay" @click.stop="checklessons">
       <section class="gotopay_button_style"  v-text="'确定'">
       </section>
      </div>
    </section>
  </div>
</template>
<script>
	import addLessons from 'src/components/common/addLessons'
  import {mapState, mapMutations} from 'vuex'
  import { courseFully } from 'src/service/course'
  import { Toast } from 'mint-ui'
	export default{
		data(){
			return {
          checkLessonsPrice:0,//选中课程价格
          checkLessonsLength:0,//选中课程数量
				  lessonsCheck:false,//是否显示课程课表选项
          lessonsList:[],//课程列表数据
          isTrial:false,//是否是报名
          needBook:false,//是否需要资料费
          query:'',//url传入query参数
          allLessons:false,//是否选中所有课次

			}
		},
    computed: {
      ...mapState([
          'cartList'
      ]),
      //当前商店购物信息
      shopCart: function (){
        return {...this.cartList};
      },

    },
     watch: {
      shopCart: function (value){
        this.initCartList();
      }
    },
		components:{
      addLessons,
    },
    mounted(){
      this.INIT_BUYCART();
      this.query = this.$route.query;
      this.getLessons();
    },
    methods:{
       //vuex数据
      ...mapMutations([
          'INIT_BUYCART','AUDITION','NEW_NEED_BOOK','ADD_LESSON','REDUCE_LESSON'
      ]),
      //初始化和shopCart变化时
      initCartList(){
        let _this =this;
        _this.checkLessonsPrice = 0;
        _this.checkLessonsLength = 0;
        for(let cart of Object.values(_this.shopCart)){
          if(_this.query.courseId == cart.id){
            if(cart.lessonArr){
              _this.checkLessonsLength = Object.keys(cart.lessonArr).length || 0;
              _this.checkLessonsPrice = cart.checkLessonsPrice*_this.checkLessonsLength  || 0;
              if(_this.checkLessonsPrice > 0 && _this.needBook){ 
                  _this.checkLessonsPrice  = _this.checkLessonsPrice+50;
              }
            }
            for(let list of _this.lessonsList){
              if(cart.lessonArr && cart.lessonArr[list.lessonId]){
                list.choose = true;
              }
            }
          }
        }
      },
      //改变课次
      chooseLesson(){

      },
      //是否全选课次
      chooseAllLesson(){
        let _this =this;
        this.allLessons = !this.allLessons;
        if(_this.allLessons){
          _this.checkLessonsPrice = _this.lessonsList.length * _this.courseDetail.lessonPrice
          if(_this.checkLessonsPrice > 0 && _this.needBook){
            _this.checkLessonsPrice  = _this.checkLessonsPrice + 50;
          }
          _this.checkLessonsLength = _this.lessonsList.length
        }else{
          _this.checkLessonsPrice = 0
          _this.checkLessonsLength = 0
        }
        
        for (var i = _this.lessonsList.length - 1; i >= 0; i--) {
          _this.lessonsList[i].choose = this.allLessons;
          console.log(this.allLessons)
          if(this.allLessons){
            _this.ADD_LESSON(_this.lessonsList[i]);
          }else{
            _this.REDUCE_LESSON(_this.lessonsList[i]);
          }
          this.$set(_this.lessonsList,i,_this.lessonsList[i])
        }
      },
      //获取课程课次列表
      getLessons(){
        let _this = this;
        let param = {};
        param.courseId =this.query.courseId;
        courseFully(param).then(res=>{
          if(res.data && res.data.data[0]){
            _this.courseDetail = res.data.data[0];
            let lessonList = res.data.data[0].lessonList;
            for (var i = lessonList.length - 1; i >= 0; i--) {
              lessonList[i].choose = false;
              lessonList[i].lessonPrice =   _this.courseDetail.lessonPrice;
            }
            this.lessonsList = lessonList
            this.initCartList();
          }else{
            Toast('请求错误!')
          }
        })
      },
  		//切换报名类型
      changeLessonsType(type,status){
        this[type] = status;
        let param = {
          courseId :this.query.courseId,
          typeTiltle:type,
          type:status
        }
        this.AUDITION(param)
        this.initCartList();
      },
      checklessons(){
        this.lessonsCheck =false;

        this.$router.push({path:'/course',query:this.$route.query})
        return;
      },
    }
	}
</script>
<style lang="scss" scoped>
  @import '../../style/common';
  @import '../../style/mixin';
  .lineHeight{
  	height: 60px;
  }
  .cart_module{
        .iconSty{
            width: 40px;
            height: 40px;
            display: flex;
        }
        .add_icon{
            width: 20px;
            position: relative;
            z-index: 12;
            margin:auto;
            margin-right: 0;
        }
        .cart_button{
            display: flex;
            align-items: center;
        }
        svg{
            @include wh(.9rem, .9rem);
            fill: #3190e8;
        }
        .specs_reduce_icon{
            fill: #999;
        }
        .cart_num{
            @include sc(.65rem, #666);

            min-width: 1rem;
            text-align: center;
            font-family: Helvetica Neue,Tahoma;
        }
    }
    .buy_cart_container{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 9999999;
        display: flex;
        width: 100%;
        height: 45px;
         background-color: rgba(255,255,255, 1);
        .cart_icon_num{
            flex: 1;
            .cart_check{
              position: absolute;
              width: 20px;
              top: 11px;
              height: 25px;
              left: 10px;
            }
            .cart_icon_container{
                display: flex;
                position: absolute;
                left: 40px;
    						bottom: 15px;
                .cart_icon{
                  width: 50px;
                  height: 50px;
                }
                .cart_list_length{
                    position: absolute;
                    top: 5px;
                    right: 1px;
                    background-color: rgb(218,46,46);
                    line-height: 18px;
                    text-align: center;
                    border-radius: 50%;
                    min-width: 18px;
                    height: 18px;
                    @include sc(.5rem, #fff);
                    font-family: Helvetica Neue,Tahoma,Arial;
                }
            }
            .cart_num{
                @include ct;
                left: 3.5rem;
                &.noIcon{
                  left: 12px;
                }
                div:nth-of-type(1){
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: .1rem;
                    color: rgb(218,46,46);
                    span{
                      // color: rgb(12,12,12);
                      font-size: 14px;
                      font-weight: bold;
                    }
                }
                div:nth-of-type(2){
                    font-size: 14px;
                    color: rgb(153,153,153);
                    &.borderType{
                      position: relative;
                      &:before{
                        content: '';
                        height: 1px;
                        background: rgb(153,153,153);
                        position: absolute;
                        width: 100%;
                        top: 50%;
                      }
                    }
                    .borderType{
                      position: relative;
                      &:before{
                        content: '';
                        height: 1px;
                        background: rgb(153,153,153);
                        position: absolute;
                        width: 100%;
                        top: 50%;
                      }
                    }
                }
            }
        }
        .buy_cart_info{
          position: absolute;
          height: 30px;
          line-height: 30px;
          width: 100%;
          text-align: center;
          background: rgba(253,249,216,0.9);
          top:-30px;
        }
        .gotopay{
            position: absolute;
            right: 0;
            background-color: #d52829;
            @include wh(6.6rem, 100%);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            .gotopay_button_style{
                @include sc(.7rem, #f6cece);
                font-weight: bold;
                letter-spacing: 2px;
                &.noPay{
                  color: #fff;
                }
            }
            &.noPay{
              @include sc(.7rem, #bbb);
              color: #fff;
              background: #bbb;
            }
        }
    }
	.lessons-container{
      top: 0;
      left: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: 999;
      overflow: auto;
      .lessons-type-box{
        display: flex;
        padding: 10px;
        &:nth-child(2){
          border-bottom: 1px solid #F1F3F8;
        }
        .lessons-type{
          flex: 0 0 25%;
          height: 32px;
          line-height: 32px;
        }
        .lessons-type-name{
          background: #F1F3F8;
          border-radius: 15.5px;
          text-align: center;
          
          margin-right: 8px;
          &.active{
            background: #d7ebff;
            color: #5197fc;
          }
        }
      }
      .lessons-check-container{
        margin: 0 10px;
        .lessons-check-info{
          padding: 10px 0;
        }
        .lessons-check-checkList{
          border-bottom: 1px solid #F1F3F8;
          padding: 10px 0;
         	position: relative;
          .iconSty{
            position: absolute;
            right: 10px;
          }
          .manName div{
            padding-left: 0px; 
          }
          .courseName{
            text-indent: 0px;
          }
          .courseName{
          	margin: 10px 0;
          }
        }
      }
    }
    .coursePlus{
    	position: absolute;
			right: 10px;
			bottom: 5px;
    }
</style>



