 <template>
    <section class="cart_module">
      <section class="cart_button">
          <transition name="fade">
          </transition>
          <div class="iconSty" v-show="!lessonsList.choose" @click.stop="addToCart($event)">
              <img class="add_icon"   src="../../images/plus.png" > 
          </div>
          <div class="iconSty" v-show="lessonsList.choose" @click.stop="removeOutCart($event)"> 
              <img class="add_icon" src="../../images/tick.png">
          </div>
      </section>
    </section>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
    export default {
      data(){
            return{
              day:true,
              showMoveDot: [], //控制下落的小圆点显示隐藏
              btnType:false,
              lessonsCheck:true,
            }
        },
        watch:{
        },
        computed: {
          ...mapState([
              'cartList'
          ]),
        },
        props:['lessonsList'],
        mounted(){
        },
        methods: {
             ...mapMutations([
                'ADD_LESSON','REDUCE_LESSON',
            ]),
            removeOutCart(){
                this.lessonsList.choose =false
                this.REDUCE_LESSON(this.lessonsList);
            },
            //加入购物车，计算按钮位置。
            addToCart(event){
                this.lessonsList.choose =true;
                this.ADD_LESSON(this.lessonsList);
                // let elLeft = event.target.getBoundingClientRect().left;
                // let elBottom = event.target.getBoundingClientRect().bottom;
                // this.showMoveDot.push(true);
                // this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);

            }
        },
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
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
        .choose_specification{
            .choose_icon_container{
                display: flex;
                align-items: center;
                .show_chooselist{
                    display: block;
                    @include sc(.55rem, #fff);
                    padding: .1rem .2rem;
                    background-color: $blue;
                    border-radius: 0.2rem;
                    border: 1px solid $blue;
                }
            }
        }
    }
    .showReduce-enter-active, .showReduce-leave-active {
        transition: all .3s ease-out;
    }
    .showReduce-enter, .showReduce-leave-active {
        opacity: 0;
        transform: translateX(1rem);
    }
    .fade-enter-active, .fade-leave-active {
        transition: all .3s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .fadeBounce-enter-active, .fadeBounce-leave-active {
        transition: all .3s;
    }
    .fadeBounce-enter, .fadeBounce-leave-active {
        opacity: 0;
        transform: scale(.7);
    }
    .lessons-container{
      top: 0;
      left: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: 999;
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
          .manName div{
            padding-left: 0px; 
          }
          .courseName{
            text-indent: 0px;

          }
        }
      }
      
    }

</style>

