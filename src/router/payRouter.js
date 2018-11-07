import payvue from '../payvue'

const queryPaySucc =r =>require.ensure([],()=>r(require('../page/wxpay/queryPaySucc')),'queryPaySucc')

export default [{
    path: '/',
    component: payvue, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
          path: '',
          redirect: '/queryPaySucc'
        },
         //登录
        {
          path: '/queryPaySucc',
          component: queryPaySucc
        },
    ]
}]