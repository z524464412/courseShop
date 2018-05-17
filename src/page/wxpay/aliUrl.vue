<template>
<div id="aliUrl" >
  <div class="bd">
    <p class="tip">由于微信限制支付宝支付，请在菜单中选择在浏览器中打开，以完成支付。</p><i class="open">
    	<img src="../../images/open_browser.png">
    </i>
  </div>
  <a id="back" href="javascript:history.back(-1);" class="fd_a">返回</a>
</div>
</template>
<script>
import { Toast } from 'mint-ui'//提示
import { Indicator } from 'mint-ui'//加载
import { httpUrl } from 'src/config/env'

export default {
	name: '',
    data () {
    	return {
			billId: '',
    	}
    },
    created(){
		this.billId = this.$route.query.id;
    },
    mounted() {
    	var _this =this;
		var ua = navigator.userAgent.toLowerCase();
		if((ua.match(/MicroMessenger/i) != "micromessenger")){
			if(httpUrl && httpUrl.indexOf('tfapi') > 0){
				window.location.href = window.location.origin+"/v1/bill/alipay"+"?billId="+_this.billId
			}else{
				window.location.replace( window.location.origin+"/coursecart/rest/v1/bill/doBillPayAlipay"+"?billId="+_this.billId)
			}
		}else{
			// window.alert(window.location.origin+"/v1/bill/alipay"+"?billId="+_this.billId);
		}
    },
    methods:{
    	
    },
}
</script>

<style lang="scss">
#aliUrl {
	height: 100%;
	.bd{
		position: relative;
		.tip{
			padding: 25% 20% 0;
			line-height: 1.5;
			text-align: center;
		}
		.open{
			position: absolute;
			top: 15px;
			right: 15px;
			img{
				width: 40px;
				height: 60px;
			}
		}
	}
	.fd_a{
		position: absolute;
		top: 0;
		left: 50%;
		margin-left: -30%;
		display: block;
	    width: 60%;
	    line-height: 40px;
	    color: #fff;
	    font-size: 1.25em;
	    background: #ff646e;
	    outline: none;
	    border: 0;
	    -webkit-border-radius: 6px;
	    border-radius: 6px;
	    text-decoration: none;
	    text-align: center;
	}
	#back{
		top: 50%;
	}
	#confirm{
		top: 40%;
	}
}
</style>

