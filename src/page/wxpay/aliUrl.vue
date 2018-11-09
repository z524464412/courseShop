<template>
<div id="aliUrl" >
	<div v-if="showHtml">
		<div class="bd">
	    <p class="tip">由于微信限制支付宝支付，请在菜单中选择在浏览器中打开，以完成支付。</p><i class="open">
	    	<img src="../../images/open_browser.png">
	    </i>
	  </div>
	  <a id="back" href="javascript:history.back(-1);" class="fd_a">返回</a>
	</div>
  
  <div v-html="aliHtml">
  	
  </div>

</div>
</template>
<script>
import { Toast } from 'mint-ui'//提示
import { Indicator } from 'mint-ui'//加载
import { httpUrl } from 'src/config/env'
import { h5alipay } from 'src/service/course'
export default {

	name: '',
    data () {
    	return {
			billId: '',
			aliHtml:'',
			showHtml:false,
			bookNum:0,
			addrValue:'',
			check:false
    	}
    },
    created(){
		this.billId = this.$route.query.id;
		this.addrValue = this.$route.query.addrValue
		this.bookNum = this.$route.query.bookNum
		this.check =this.$route.query.check;

    },	
    mounted() {
    	var _this =this;
    	let params = {};
			params.billId = this.billId;
			if(this.bookNum){
				this.bookNum = 1
			}
			if(this.$route.query.url){	
				_this.showHtml =true;
				var ua = navigator.userAgent.toLowerCase();
				if((ua.match(/MicroMessenger/i) == "micromessenger")){

				}else{
						window.location.replace( this.$route.query.url)
				}
			}else{
				params.needBook = this.bookNum;
				params.deliverAddr = encodeURIComponent(this.addrValue);
				var ua = navigator.userAgent.toLowerCase();
				if((ua.match(/MicroMessenger/i) != "micromessenger") || _this.check){
					if(httpUrl && httpUrl.indexOf('tfapi') > 0){
						_this.getAliForm(params).then(res=>{
							// setTimeout(function(){
								// console.log(document.forms[0])
								document.forms[0].submit();
							// },500)
						})
					}else{
						window.location.replace( window.location.origin+"/coursecart/rest/v1/bill/doBillPayAlipay"+"?billId="+_this.billId)
					}
				}else{
					this.showHtml =true;
				}
			}
			
    },
    methods:{
    	getAliForm(params){
    		let _this =this;
    		return new Promise((resolve,reject)=>{
    			//跳转支付宝支付页面
    				window.location.href =  "https://api.tifang.online/coursecart/v1/bill/alipay"+"?billId="+_this.billId+"&needBook="+_this.bookNum+"&deliverAddr="+this.addrValue
    	// 		h5alipay(params).then(res=>{

					// 	if(res.data.indexOf('form') > 0){
					// 		this.aliHtml = res.data;	
					// 	};
					// 	resolve(res.data);
					// })
    		})
    	}
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

