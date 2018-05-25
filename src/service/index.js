import axios from 'axios'
import * as util from '../config/mUtils'
import { Toast} from 'mint-ui';
const instance = axios.create({
	// baseURL:'/coursecart/rest',
  // baseURL: 'http://rap2api.taobao.org/app/mock/224',
  // baseURL:'http://192.168.1.129:8080/coursecart/rest/v1',
  // baseUrl:'http://localhost:8001/ugc/v2/restaurants/1/ratings?has_content=true&offset=30&limit=10',
  // headers: {'Access-Control-Allow-Origin': '*'},

  timeout: 10000
});
instance.defaults.headers.post['Content-Type'] = 'application/json';
//错误处理
instance.interceptors.response.use(function(response) {
	if(response.data.respCode == 0){
		return response;
	}else{
		Toast({
		  message: response.data.respMsg,
		  position: 'middle',
		  duration: 2000
		});
		return response;
	}
  
}, util.catchError);

export default instance;
