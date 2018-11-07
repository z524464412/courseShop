import payvue from '../payvue'

const paysucc =r =>require.ensure([],()=>r(require('../page/wxpay/paysucc')),'paysucc')

export default [{
    path: '/',
    component: payvue, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
          path: '',
          redirect: '/paysucc'
        } 
    ]
}]