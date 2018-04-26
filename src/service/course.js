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

//获取验证码
export const getCodeMsg = params => instance.get('/v1/auth/getCodeMsg',{params});


