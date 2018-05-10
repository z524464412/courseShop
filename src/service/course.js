import instance from './index';
import {
	baseUrl
} from '../config/env'
/**
 * 获取全部课程
 */

export const courseList = params => instance.get('/v1/classes/getAllClasses',{params});
//获取课程详情
export const courseDetail = params =>instance.get('/v1/classes/getClassDetail',{params});
//获取所有的年级列表
export const gradeList = params => instance.get('/v1/sys/getGradeCombo',{params});
/**
 * 获取课程类型
 */
export const CourseType = params => instance.get('/v1/sys/getSysLookup',{params});

//钉钉自动登录
export const AuthLogin = params => instance.get('/v1/auth/dingLogin',{params});

//根据手机号获取名字
export const manName =	params => instance.get('/v1/user/getUserByPhoneNo',{params});

//获取验证码
export const getCodeMsg = params => instance.get('/v1/auth/sendSMSVerify',{params});

//验证验证码
export const checkCode = params => instance.get('/v1/auth/checkVerify',{params});

//创建订单

export const addOrder = params => instance.post('/v1/bill/createBill',params);

//微信签名
export const getwxConfig = params =>instance.get('/v1/sys/getWeChatSignature',{params});

//钉钉测试免登

export const testInit = params =>instance.get('/v1/bill/setLogonSale?saleId=17');

//钉钉签名

export const getDingDing = params =>instance.get('/v1/sys/getDingSignature?'+params);
//获取优惠规则
export const discount = params =>instance.post('/v1/classes/getDiscountConfig',{params});

//订单详情
export const orderDetail = params =>instance.get('/v1/bill/getBillDetail',{params});

//支付接口

export const aliPay = params => instance.get('/v1/bill/doBillPayAlipay',{params});

//查询订单状态

export const checkPayResult = params =>instance.get('/v1/bill/checkPayResult',{params});
//查询ali订单
export const checkAliResult = params =>instance.post('/v1/bill/checkPayResult',params);

//支付订单
export const prePay = params =>instance.get('/v1/bill/doBillPayWXOpen',{params});

//获取openId
export const getToken = params =>instance.get('/v1/sys/getWeChatUserToken',{params});



