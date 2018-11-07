import instance from './index';
import {
	baseUrl
} from '../config/env'
/**
 * 获取全部课程
 */

// export const courseList = params => instance.get('/v1/classes/getAllClasses',{params});
export const courseList = params => instance.get('/coursecart/v1/course/list',{params});

//获取课程详情
// export const courseDetail = params =>instance.get('/v1/classes/getClassDetail',{params});
export const courseDetail = params =>instance.get('/coursecart/v1/course/detail',{params});
//获取所有的年级列表

// export const gradeList = params => instance.get('/v1/sys/getGradeCombo',{params});
export const gradeList = params => instance.get('/coursecart/v1/grade',{params});
/**
 * 获取课程类型
 */
// export const CourseType = params => instance.get('/v1/sys/getSysLookup',{params});
export const CourseType = params => instance.get('/coursecart/v1/grade/filter',{params});

//钉钉自动登录
// export const AuthLogin = params => instance.get('/v1/auth/dingLogin',{params});
export const AuthLogin = params => instance.get('/coursecart/v1/dingtalk/auth',{params});

//根据手机号获取名字
// export const manName =	params => instance.get('/v1/user/getUserByPhoneNo',{params});
export const manName =	params => instance.get('/coursecart/v1/user/info',{params});


//获取验证码
// export const getCodeMsg = params => instance.get('/coursecart/v1/auth/sendSMSVerify',{params});
export const getCodeMsg = params => instance.get('/coursecart/v1/message/sms',{params});


//验证验证码

// export const checkCode = params => instance.get('/coursecart/v1/auth/checkVerify',{params});
export const checkCode = params => instance.get('/coursecart/v1/message/sms/check',{params});

//创建订单

// export const addOrder = params => instance.post('/v1/bill/createBill',params);
export const addOrder = (params,token) => instance.post('/coursecart/v1/bill/create?'+token,params);

//创建订单1.1

// export const addOrder = params => instance.post('/v1/bill/createBill',params);
export const newAddOrder = (params,token) => instance.post('/coursecart/v1.1/bill/create?'+token,params);

//微信签名
// export const getwxConfig = params =>instance.get('/coursecart/v1/sys/getWeChatSignature',{params});
export const getwxConfig = params =>instance.get('/coursecart/v1/wechat/auth',{params});

//钉钉测试免登

export const testInit = params =>instance.get('/coursecart/v1/bill/setLogonSale?saleId=17');

//钉钉签名

// export const getDingDing = params =>instance.get('/coursecart/v1/sys/getDingSignature?'+params);
export const getDingDing = params =>instance.get('/coursecart/v1/dingtalk/signature?'+params);
//获取优惠规则

// export const discount = params =>instance.post('/v1/classes/getDiscountConfig',{params});
export const discount = params =>instance.get('/coursecart/v1/sale/discount',{params});

//订单详情
// export const orderDetail = params =>instance.get('/coursecart/v1/bill/getBillDetail',{params});
export const orderDetail = params =>instance.get('/coursecart/v1/bill/detail',{params});

//支付接口

// export const aliPay = params => instance.get('/coursecart/v1/bill/doBillPayAlipay',{params});
export const aliPay = params => instance.get('/coursecart/v1/bill/alipay',{params});

//查询订单状态

// export const checkPayResult = params =>instance.get('/coursecart/v1/bill/checkPayResult',{params});
export const checkPayResult = params =>instance.get('/coursecart/v1/bill/pay/result',{params});
//查询ali订单
// export const checkAliResult = params =>instance.post('/v1/bill/checkPayResult',params);
export const checkAliResult = params =>instance.post('/coursecart/v1/bill/pay/result',params);

//支付订单
// export const prePay = params =>instance.get('/coursecart/v1/bill/doBillPayWXOpen',{params});
export const prePay = params =>instance.get('/coursecart/v1/bill/wxopen',{params});
export const h5alipay = params => instance.get('/coursecart/v1/bill/alipay',{params})


// 广分支付
export const quickpassPay = params => instance.get('/coursecart/v1.3/bill/pay/quickpass/url',{params})



//获取openId
// export const getToken = params =>instance.get('/coursecart/v1/sys/getWeChatUserToken',{params});
export const getToken = params =>instance.get('/coursecart/v1/wechat/openid',{params});

//获取所有渠道
export const getChannel = params => instance.get('/coursecart/v1/channel',{params});

//获取所有区

export const getArea = params => instance.get('/coursecart/v1/area',{params});

//获取学校接口

export const getSchool= params => instance.get('/coursecart/v1/school',{params});

//获取所有部门

export const sysDept = params =>instance.get('/oa/v1/sys/dept',{params});

//获取课程详情及课次

export const courseFully = params =>instance.get('/coursecart/v1/course/fully',{params});

//获取订单金额

export const getAmount = (params,token) =>instance.post('/coursecart/v1.1/bill/amount?'+token,params);









