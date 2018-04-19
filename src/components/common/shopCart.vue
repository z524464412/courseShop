<template>
	<section class="buy_cart_container">
          <section class="cart_icon_num buy_cart_info">
            共1门课程已减<span class="red">¥200</span>，再选<span class="red">¥5520</span>减<span class="red">¥800</span>!
          </section>
          <section class="cart_icon_num">
              <div class="cart_icon_container" ref="cartContainer">
                  <span v-if="totalNum" class="cart_list_length">
                      {{totalNum}}
                  </span>
                  <div class="cart_icon">
                    <img src="../../images/package.png">  
                  </div>
              </div>
              <div class="cart_num">
                  <div>¥ {{totalPrice}}</div>
                  <div>¥{{discountPrice}}</div>
              </div>
          </section>
          <router-link :to="{path:'/payList'}" class="gotopay" >
           <section class="gotopay_button_style">立即支付</section>
          </router-link>
      </section>
</template>
<script>
	export default{
		data(){
			return{
				totalNum:3,//选择数
				totalPrice: 2690, //总共价格
      	discountPrice:2690,//折扣价格
			}
		}
	}
</script>
<style lang="scss" scoped>
  @import 'src/style/common';
  @import 'src/style/mixin';
	  .buy_cart_container{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 13;
        display: flex;
        width: 100%;
        height: 45px;
        .cart_icon_num{
            flex: 1;
            background-color: rgba(255,255,255, 0.9);
            .cart_icon_container{
                display: flex;
                position: absolute;
                left: 12px;
                bottom: 8px;
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
                div:nth-of-type(1){
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: .1rem;
                    color: rgb(218,46,46);
                }
                div:nth-of-type(2){
                    font-size: 14px;
                    color: rgb(153,153,153)
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
            }
        }
    }
</style>