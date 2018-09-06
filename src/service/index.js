import axios from 'axios'
import * as util from '../config/mUtils'
import { Toast,Indicator} from 'mint-ui';
const instance = axios.create({
	// baseURL:'/coursecart/rest',
  baseURL:'https://api.tifang.online',
  // baseURL:'http://192.168.1.129:8080/coursecart/rest/v1',
  // baseUrl:'http://localhost:8001/ugc/v2/restaurants/1/ratings?has_content=true&offset=30&limit=10',
  // headers: {'Access-Control-Allow-Origin': '*'},

  timeout: 10000
});
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    Indicator.open();
  return config;

}, function (error) {
	Indicator.close();
  // 对请求错误做些什么
  return Promise.reject(error);
});
instance.defaults.headers.post['Content-Type'] = 'application/json';
//错误处理

instance.interceptors.response.use(function(response) {
	console.log(response);

	Indicator.close();
	if(response.data.respCode == 0){
		return response;
	}else if(response.data.respMsg.indexOf('accessToken')>0){
		
	}else{
		Toast({
		  message: response.data.respMsg,
		  position: 'middle',
		  duration: 2000
		});
	}
}, util.catchError);

export default instance;
