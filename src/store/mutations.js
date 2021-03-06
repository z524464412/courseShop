import {
	RECORD_ADDRESS,
	ADD_CART,
	ADD_LESSON,
	REDUCE_LESSON,
	REDUCE_CART,
	INIT_BUYCART,
	CLEAR_CART,
	RECORD_SHOPDETAIL,
	RECORD_USERINFO,
	GET_USERINFO,
	CONFIRM_REMARK,
	CONFIRM_INVOICE,
	CHOOSE_SEARCH_ADDRESS,
	SAVE_GEOHASH,
	CONFIRM_ADDRESS,
	CHOOSE_ADDRESS,
	NEED_VALIDATION,
	SAVE_CART_ID_SIG,
	SAVE_ORDER_PARAM,
	CHANGE_ORDER_PARAM,
	ORDER_SUCCESS,
	SAVE_SHOPID,
	SAVE_ORDER,
	OUT_LOGIN,
	RETSET_NAME,
	SAVE_AVANDER,
	SAVE_ADDRESS,
	SAVE_ADDDETAIL,
	SAVE_QUESTION,
	ADD_ADDRESS,
	BUY_CART,
	ADD_DISCOUNT,
	INIT_DISCOUNT,
	CHOOSE_CART,
	NEED_BOOK,
	NEW_NEED_BOOK,
	AUDITION,
	ADDALLLESSONS

} from './mutation-types.js'

import {setStore, getStore} from '../config/mUtils'

import {localapi, proapi} from 'src/config/env'

export default {
	// 记录当前经度纬度
	[RECORD_ADDRESS](state, {
		latitude,
		longitude
	}) {
		state.latitude = latitude;
		state.longitude = longitude;
	},

	[RECORD_SHOPDETAIL](state, detail) {
		state.shopDetail = detail;
	},
	//添加一个cart
	[CHOOSE_CART](state,oneCart){
		
	},
	//添加资料费
	[NEED_BOOK](state,id){
		let bookIds = state.bookIds;
		if(id){
			state.bookIds = {...id};
		}
		setStore('bookIds',state.bookIds)
	},
	//新的添加资料费
	[NEW_NEED_BOOK](state,courseId,type){
		let cart = state.cartList;
		if(!cart[courseId]){
		 cart =	JSON.parse(getStore('buyCart'));
		}
		let lessonsList = cart[courseId] = (cart[courseId] || {});
		if(!lessonsList[courseList.lessonId]){
			let lesson  = lessonsList['lessonArr'] = (lessonsList['lessonArr'] || {});
			cart[courseList.courseId].needBook = type;
			state.cartList = {...cart};
			// 存入localStorage
			setStore('buyCart', state.cartList);
		}
	},
	//选择所有课次
	[ADDALLLESSONS](state,{courseList,status}){
		let cart = state.cartList;
		// if(!cart[courseList.courseId]){
		//  cart =	JSON.parse(getStore('buyCart'));
		// }
		// let lessonsList = cart[courseList.courseId] = (cart[courseList.courseId] || {});
		// if(!lessonsList[courseList.lessonId]){
		// 	let lesson  = lessonsList['lessonArr'] = (lessonsList['lessonArr'] || {});
		// 	delete lesson[courseList.lessonId];
		// 	cart[courseList.courseId].checkLessonsPrice = courseList.lessonPrice;
		// 	if(Object.keys(lessonsList.lessonArr).length == 0){
		// 		cart[courseList.courseId].choose = false;
		// 	}
		// 	state.cartList = {...cart};
		// 	// 存入localStorage
		// 	setStore('buyCart', state.cartList);
		// }
	},
	//是否为试听
	[AUDITION](state,{courseId,typeTiltle,type}){
		let cart = state.cartList;
		if(!cart[courseId]){
		 cart =	JSON.parse(getStore('buyCart'));
		}
		cart[courseId][typeTiltle] = type;
		console.log(cart)
		state.cartList = {...cart};
		// 存入localStorage
		setStore('buyCart', state.cartList);
	},
	// 加入购物车
	[ADD_CART](state, courseList) {
		// 第一版本
		// let cart = state.cartList;
		// if(courseList){
		// 	courseList.num = 1;
		// 	courseList.choose = true;
		// 	cart[courseList.id] = courseList;
		// 	state.cartList = {...cart}; 
		// 	//存入localStorage
		// 	setStore('buyCart', state.cartList);
		// }
		// 第二版本
		let cart = state.cartList;
		console.log(courseList);
		if(courseList){
			courseList.num = 0;
			courseList.choose = false;
			cart[courseList.id] = courseList;
			state.cartList = {...cart}; 
			//存入localStorage
			setStore('buyCart', state.cartList);
		}
	},
	// 加入课次
	[ADD_LESSON](state,courseList) {
		console.log(courseList)
		let cart = state.cartList;
		if(!cart[courseList.courseId]){
		 cart =	JSON.parse(getStore('buyCart'));
		}
		let lessonsList = cart[courseList.courseId] = (cart[courseList.courseId] || {});
		if(!lessonsList[courseList.lessonId]){
			courseList.num = 1;
			courseList.choose = true;
			let lesson  = lessonsList['lessonArr'] = (lessonsList['lessonArr'] || {});
			lesson[courseList.lessonId] = courseList;
			console.log(lesson)
			console.log(cart[courseList.courseId])
			cart[courseList.courseId].choose = true;
			if(Object.keys(lesson).length == cart[courseList.courseId].lessons){
				cart[courseList.courseId].allChoose = true;
			}
			cart[courseList.courseId].allPrice = courseList.original_price;
			cart[courseList.courseId].checkLessonsPrice = courseList.lessonPrice
			state.cartList = {...cart};
			console.log(cart) 
			// 存入localStorage
			setStore('buyCart', state.cartList);
		}
	},
	// 移出课次
	[REDUCE_LESSON](state, courseList) {
		let cart = state.cartList;
		console.log(courseList)
		if(!cart[courseList.courseId]){
		 cart =	JSON.parse(getStore('buyCart'));
		}
		let lessonsList = cart[courseList.courseId] = (cart[courseList.courseId] || {});
		if(!lessonsList[courseList.lessonId]){
			let lesson  = lessonsList['lessonArr'] = (lessonsList['lessonArr'] || {});
			delete lesson[courseList.lessonId];
			cart[courseList.courseId].checkLessonsPrice = courseList.lessonPrice;
			if(Object.keys(lessonsList.lessonArr).length == 0){
				cart[courseList.courseId].choose = false;
			}
			cart[courseList.courseId].allChoose = false;
			state.cartList = {...cart};
			console.log(cart)
			// 存入localStorage
			setStore('buyCart', state.cartList);
		}
	},
	// 移出购物车
	[REDUCE_CART](state, courseList) {
		let cart = state.cartList;
		console.log(cart);
		if (cart && cart[courseList.id]) {
			delete cart[courseList.id]
				// cart[courseList.id].num = 0;
				// courseList.choose = false;
				// cart[courseList.id].choose =false;
				state.cartList = {...cart};
				//存入localStorage
				setStore('buyCart', state.cartList);
		}
	},
	//网页初始化缓存中加入优惠规则
	[ADD_DISCOUNT](state,discountList){
		state.discount = discountList;
		setStore('discount',state.discount)
	},
	//网页初始化从缓存中获取优惠规则
	[INIT_DISCOUNT](state){
		let initDiscount = getStore('discount');
		if(initDiscount){
			state.discount = JSON.parse(initDiscount);
		}
	},
	//网页初始化时从本地缓存获取购物车数据
	[INIT_BUYCART](state) {
		let initCart = getStore('buyCart');
		if (initCart) {
			state.cartList = JSON.parse(initCart);
		}
	},
	//清空当前商品的购物车信息
	[CLEAR_CART](state, shopid) {
		state.cartList = null;
		state.cartList = {...state.cartList};
		setStore('buyCart', state.cartList);
	},
	// 记录用户信息
	[RECORD_USERINFO](state, info) {
		state.userInfo = info;
		state.login = true;
		setStore('user', info);
	},
	//获取用户信息存入vuex
	[GET_USERINFO](state, info) {
		if (state.userInfo && (state.userInfo.username !== info.username)) {
			return;
		};
		if (!state.login) {
			return
		}
		if (!info.message) {
			state.userInfo = {...info};
		} else {
			state.userInfo = null;
		}
	}
}
