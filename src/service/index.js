import axios from 'axios'
import * as util from '../config/mUtils'
import { Toast,Indicator} from 'mint-ui';
const instance = axios.create({
	// baseURL:'/coursecart/rest',
  // baseURL:'https://api.tifang.online',
 	baseURL:'http://dev.api.tifangedu.com',
  // baseURL:'http://192.168.1.129:8080/coursecart/rest/v1',
  // baseUrl:'http://localhost:8001/ugc/v2/restaurants/1/ratings?has_content=true&offset=30&limit=10',
  // headers: {'Access-Control-Allow-Origin': '*'},
  timeout: 10000
});
let loading ;
//显示loading
function startLoading() {
  Indicator.open('加载中...');
}
//关闭loading
function endLoading() {
  Indicator.close();
}
//判断显示loading
 let needLoadingRequestCount = 0
  function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
//判断关闭loding
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
} 
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    showFullScreenLoading();
  return config;

}, function (error) {
	tryHideFullScreenLoading();
  // 对请求错误做些什么
  return Promise.reject(error);
});
instance.defaults.headers.post['Content-Type'] = 'application/json';
//错误处理

instance.interceptors.response.use(function(response) {
	 tryHideFullScreenLoading();
	// Indicator.close();
	if(response.data.respCode == 0){
		return response;
	}else if(response.data.respMsg.indexOf('accessToken')>0){
		
	}else if(response.data.respCode == 30010 || response.data.respCode ==30000){
		return response;
	}else{
		Toast({
		  message: response.data.respMsg,
		  position: 'middle',
		  duration: 2000
		});
	}
}, util.catchError);

export default instance;
