<template>
	<div>
		<div v-html="aliHtml">
			
		</div>
	</div>
</template>
<script>	

	import { h5alipay } from 'src/service/course'

	export default{
		data(){
			return{
				aliHtml:''
			}
		},
		mounted(){
			let query = this.$route.query
			let params = {};
			params.billId = query.id;
			h5alipay(params).then(res=>{
				this.aliHtml = res.data;
				setTimeout(function(){
					document.forms[0].submit();
				},500)
				
			})
		}
	}
</script>