import instance from './index';
import {
	baseUrl
} from '../config/env'
/**
 * 获取全部课程
 */

export const getCourse = params => instance.get(`${baseUrl}/coursecart/rest/courseList`,{params})
