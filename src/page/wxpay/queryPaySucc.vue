<template>
    <div class="paysucc">
    	<div>
    		 <div class="iconDIV">
				<img src="../../images/success.png">
			</div>
			<div class="iconText">
				恭喜您，支付成功
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
        alert(1231232)
      	// this.billId = this.$route.query.id;
      	// if(this.billId){
       //    console.log(this.billId)
       //    this.checkType();
      	// }

      	// if(this.$route.query.app_id){
       //    this.param = this.$route.query
       //    this.checkAliType();
       //  }
       setTimeout(function(){
          window.location.href="http://online.tifangedu.com/wap/myselfCenter"
        },3000)
      },
      methods:{
        checkType(){
          var _this =this;
          this.param.billId = this.billId
          console.log(222)
          checkPayResult(this.param).then((res)=>{
            console.log(res)
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
