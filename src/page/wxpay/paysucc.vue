<template>
    <div class="paysucc">
    	<div v-if="paySucc == 0">
    		 <div class="iconDIV">
				<img src="../../images/success.png">
			</div>
			<div class="iconText">
				恭喜您，支付成功
			</div>
    	</div>
      <div v-else-if="paySucc == 1">
        <div class="iconDIV">
          <img src="../../images/error1.jpg">
        </div>
        <div class="iconText2">
          正在支付,请稍后
        </div>
      </div>
    	<div v-else-if="paySucc == 2">
    		<div class="iconDIV">
				<img src="../../images/error1.jpg">
			</div>
			<div class="iconText1">
				支付失败
			</div>
    	</div>
		
    </div>
</template>

<script>
import {checkPayResult,checkAliResult} from 'src/service/course'
import { Toast } from 'mint-ui'
  export default {
      data() {
        return {
         	paySucc:3,
          billId:'',
          param:{}

        }
      },
      mounted () {
      	this.billId = this.$route.query.id;
      	if(this.billId){
          this.checkType();
      	}
      	if(this.$route.query.app_id){
          this.param = this.$route.query
          this.checkAliType();
        }
      },
      methods:{
        checkType(){
          var _this =this;
          this.param.billId = this.billId
          checkPayResult(this.param).then((res)=>{
          if(res.data.respCode == 0){
            this.paySucc = 0;
            setTimeout(function(){
              window.location.href="http://online.tifangedu.com/wap/myselfCenter"
            },3000)
           }else if(res.data.respCode == 880000){
            this.paySucc = 1;
            setTimeout(function(){
              _this.checkType();
            },5000)
           }else{
            this.paySucc = 2;
           }
          })
        },
        checkAliType(){
          var _this =this;
          checkAliResult(_this.param).then((res)=>{
          if(res.data.respCode == 0){
            this.paySucc = 0;
            setTimeout(function(){
              window.location.href="http://online.tifangedu.com/wap/myselfCenter"
            },3000)
           }else if(res.data.respCode == 880000){
            this.paySucc = 1;
            setTimeout(function(){
              _this.checkType();
            },5000)
           }else{
            this.paySucc = 2;
           }
          })
        }

      }
  }

</script>

<style lang="scss" scoped>
	.iconDIV{
		width: 30%;
    	margin: 15% auto;
	}
	.iconText{
		text-align: center;
		color: rgb(129,183,66);
		font-size: 18px;

	}
  .iconText1{
    text-align: center;
    color: #F95353;
    font-size: 18px;
  }
  .iconText2{
    text-align: center;
    color: #F95353;
    font-size: 18px;
  }
  
</style>
