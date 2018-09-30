import App from '../App'

const login = r =>require.ensure([],()=>r(require('../page/login/login')),'login')
const course =r =>require.ensure([],()=>r(require('../page/course/course')),'course')
const courseDetail =r =>require.ensure([],()=>r(require('../page/courseDetail/courseDetail')),'courseDetail')
const payList =r =>require.ensure([],()=>r(require('../page/payList/payList')),'payList')
const wxpay =r =>require.ensure([],()=>r(require('../page/wxpay/wxpay')),'wxpay')
const alipay =r =>require.ensure([],()=>r(require('../page/wxpay/alipay')),'alipay')
const aliUrl = r =>require.ensure([],()=>r(require('../page/wxpay/aliUrl')),'aliUrl')
const paysucc =r =>require.ensure([],()=>r(require('../page/wxpay/paysucc')),'paysucc')
const activity =r =>require.ensure([],()=>r(require('../page/activity/activity')),'activity')
const orderList =r =>require.ensure([],()=>r(require('../page/orderList/orderList')),'orderList')
const error =r =>require.ensure([],()=>r(require('../page/error/error')),'error')

const testMove =r =>require.ensure([],()=>r(require('../page/wxpay/testMove')),'testMove')

const lessonsList =r =>require.ensure([],()=>r(require('../components/common/lessonsList')),'lessonsList')
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
        //订单展示页面
        {
          path: '/orderList',
          component: orderList
        },
        //支付
        {
          path: '/wxpay',
          component: wxpay
        },
        //支付
        {
          path: '/alipay',
          component: alipay
        },
        //阿里支付
        {
          path: '/aliUrl',
          component: aliUrl
        },
        
        //活动页面
        {
          path: '/paysucc',
          component: paysucc
        },
        //活动页面
        {
          path: '/activity',
          component: activity
        },
        {
          path: '/error',
          component: error
        },
        //活动页面
        {
          path: '/testMove',
          component: testMove
        },
        //选课课次页面
        {
          path: '/lessonsList',
          component: lessonsList
        },
        
        
    ]
}]