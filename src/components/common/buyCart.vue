 <template>
    <section class="cart_module">
        <section class="cart_button">
            <transition name="fade">
            </transition>
            <div class="iconSty" v-show="!btnType" @click.stop="addToCart($event)">
                <img class="add_icon"   src="../../images/plus.png" > 
            </div>
            <div class="iconSty" v-show="btnType" @click.stop="gotoLesson($event)"> 
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
              showMoveDot: [], //控制下落的小圆点显示隐藏
              btnType:false,//课程选中还是没有选中
            }
        },
        
        computed: {
            ...mapState([
                'cartList'
            ])
        },
        props:['courseList'],
        mounted(){
            this.btnType = this.courseList.choose;
            this.query = this.$route.query;
        },
        methods: {
             ...mapMutations([
                'ADD_CART','REDUCE_CART',
            ]),
            
            removeOutCart(){
                this.btnType =!this.btnType;
                this.REDUCE_CART(this.courseList);
            },
            gotoLesson(){
              this.param ={};
              this.param.courseId = this.courseList.id;
              if(this.query.gradeId){
                this.param.gradeId = this.query.gradeId
              }
              if(this.query.scope){
                this.param.scope = this.query.scope
              }
              this.$router.push({path:'/lessonsList',query:this.param})
            },
            //加入购物车，计算按钮位置。
            addToCart(event){
                this.event = event;
                this.param ={};
                this.param.courseId = this.courseList.id;
                if(this.query.gradeId){
                  this.param.gradeId = this.query.gradeId
                }
                if(this.query.scope){
                  this.param.scope = this.query.scope
                }
                this.$router.push({path:'/lessonsList',query:this.param})
                // vuex控制课程列表
                this.ADD_CART(this.courseList);
                // this.btnType =!this.btnType;
                // let elLeft = event.target.getBoundingClientRect().left;
                // let elBottom = event.target.getBoundingClientRect().bottom;
                // this.showMoveDot.push(true);
                // this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);

            },
            //加入购物车,计算按钮位置
            addCourse(){
                let event = this.event;
                this.btnType =!this.btnType;
                let elLeft = event.target.getBoundingClientRect().left;
                let elBottom = event.target.getBoundingClientRect().bottom;
                this.showMoveDot.push(true);
                this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
            },
            //显示规格列表
            showChooseList(foodScroll){
                this.$emit('showChooseList', foodScroll)
            },
            //点击多规格商品的减按钮，弹出提示
            showReduceTip(){
                this.$emit('showReduceTip')
            },
            
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
    

</style>

