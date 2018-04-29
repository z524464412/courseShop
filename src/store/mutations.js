import {
	RECORD_ADDRESS,
	ADD_CART,
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
	INIT_DISCOUNT
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
	// 加入购物车
	[ADD_CART](state, courseList) {
		let cart = state.cartList;
		if(courseList){
			courseList.num = 1;
			courseList.choose = true;
			cart[courseList.id] = courseList;
			state.cartList = {...cart}; 
			//存入localStorage
			setStore('buyCart', state.cartList);
		}
	},
	// 移出购物车
	[REDUCE_CART](state, courseList) {
		let cart = state.cartList;
		if (cart && cart[courseList.id]) {
			if (cart[courseList.id].num > 0) {
				cart[courseList.id].num = 0
				courseList.choose = false;
				state.cartList = {...cart};
				//存入localStorage
				setStore('buyCart', state.cartList);
			}
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
