<template>
<div id="aliUrl" >
  <div class="bd">
    <p class="tip">由于支付宝支付遇到问题，请在菜单中选择在浏览器中打开，以完成支付。</p><i class="open">
    	<img src="../../images/open_browser.png">
    </i>
  </div>
  <a id="back" href="javascript:history.back(-1);" class="fd_a">返回</a>
</div>
</template>
<script>
import { Toast } from 'mint-ui'//提示
import { Indicator } from 'mint-ui'//加载

export default {
	name: '',
    data () {
    	return {
			layout: false,
			// formData: location.href.split('aliUrl?')[1].split('&'),
			orderNo: '',
			paydata:{
				amount: "0.00",
				cash: 0,
				desc:"数据交易",
				dimension: 4000,//爱情
				isMerchant: 0,
				mobile:'',
				name:"数据交易",
				orderNo: "",
				remark: "爱情银行数据交易",
				target: "",
				tradePwd: 0,
				type: "exchange"
			},
			api:{
				order_state:'/love/order/status/'
			},
    	}
    },
    mounted() {
    	let billId = this.$route.query.id;
    		var ua = navigator.userAgent.toLowerCase();
    		if((ua.match(/MicroMessenger/i) != "micromessenger")){
    			window.location.href = window.location.origin+"/coursecart/rest/v1/bill/doBillPayAlipay"+"?billId="+billId;
  			}
		
    },
    methods:{
    	confirm_order(){
    		
    	},
		// init_platform:function(){
		// 	var ua = navigator.userAgent.toLowerCase();
  //   		if((ua.match(/MicroMessenger/i) != "micromessenger")){
		// 		this.paydata.agent="wap";
		// 		this.$http.post('/h5/alipay',this.paydata).then(function(res){
		// 			if(res.data.respCode=="0"){
		// 				window.location.replace(res.data.data);
		// 			}
		// 		},function(res){
		// 			this.alertMsg(res.data.respMsg);
		// 		})
		// 	} else {
		// 		this.layout = true;
		// 		if(this.paydata.orderNo){
		// 			this.orderNo = this.paydata.orderNo;
		// 		}
		// 	}
		// },
 	// 	confirm_order:function(){
 	// 		var that=this;
		// 	this.$http.get(this.api.order_state+this.orderNo,{
		// 		before:function(){
		// 			Indicator.open("加载中...")
		// 		}
		// 	}).then(function(res){
		// 		Indicator.close();
		// 		if(res.data.respCode=="0"){
		// 			switch(res.data.data.pay_status){
		// 				case 0:that.unpaid();break;//未支付
		// 				case 1:that.paid();break;//已支付
		// 				case 2:that.refund();break;//已拒绝
		// 			}
		// 		}else{
		// 			Toast(res.data.respMsg)
		// 		}
		// 	},function(res){
		// 		Indicator.close();
		// 		Toast('系统错误，请刷新')
		// 	})
 	// 	},
 	// 	paid:function(){
		// 	window.history.go(-2)
 	// 	},
 	// 	unpaid:function(){
 	// 		layer.closeAll();
		// 	this.alertMsg("您未付款，请前往浏览器支付");
 	// 	},
 	// 	refund:function(){
		// 	window.history.go(-2)
 	// 	},
		// alertMsg: function(msg) {
	 //      layer.open({
	 //        content: msg,
	 //        btn: ['确认']
	 //      });
	 //    },
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

