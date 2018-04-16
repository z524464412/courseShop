import App from '../App'

const login = r =>require.ensure([],()=>r(require('../page/login/login')),'login')
const course =r =>require.ensure([],()=>r(require('../page/course/course')),'course')
const courseDetail =r =>require.ensure([],()=>r(require('../page/courseDetail/courseDetail')),'courseDetail')
const payList =r =>require.ensure([],()=>r(require('../page/payList/payList')),'payList')
const wxpay =r =>require.ensure([],()=>r(require('../page/wxpay/wxpay')),'wxpay')
const activity =r =>require.ensure([],()=>r(require('../page/activity/activity')),'activity')

export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
          path: '',
          redirect: '/login'
        },
        //登录
        {
          path: '/login',
          component: login
        },
        //课程
        {
          path: '/course',
          component: course
        },
        //课程详情
        {
          path: '/courseDetail',
          component: courseDetail
        },
          //购物车列表
        {
          path: '/payList',
          component: payList
        },
        //支付
        {
          path: '/wxpay',
          component: wxpay
        },
        //活动页面
        {
          path: '/activity',
          component: activity
        }
    ]
}]