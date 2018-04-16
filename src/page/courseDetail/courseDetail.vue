<template>
  	<div>
         <div class="fixtop2">
        <header class="header" ref="header"></header>
        <div class="nav" ref="nav" :class="{isFixed:isFixed}">
          <div class="box" v-for="(item,index) in list" :key="index">
            详情页面
          </div>
        </div>
        
        <ul class="content">
          <li v-for="(item,index) in new Array(50)" :key="index">{{index+1}}</li>
        </ul>

      </div>
    </div>
</template>

<script>
var throttle = require('lodash/throttle'); //从lodash中引入的throttle节流函数
  export default {
      name: 'navScroll2',
      data() {
        return {
          list: [
            { title: 'AAAA', id: 1 },
            { title: 'BBBB', id: 2 },
            { title: 'CCCC', id: 3 },
            { title: 'DDDD', id: 4 },
          ],
          isFixed: false, //是否固定的
          throttleScroll: null, //定义一个截流函数的变量
        };
      },
      mounted () {
         this.$nextTick(() => {
          window.addEventListener('scroll', this.throttleScroll, false);
        });
         this.throttleScroll = throttle(this.handleScroll, 100);
      },
      deactivated() {
        //离开页面需要remove这个监听器，不然还是卡到爆。
        window.removeEventListener('scroll', this.throttleScroll);
      },
      methods:{
         //滚动的函数
        handleScroll() {
          let h = $(this.$refs.header).outerHeight(); //header的高度
          let wh = $(window).scrollTop(); //滚动的距离的，为什么这里使用的jq，因为不用考虑的什么的兼容问题
          let navH = $(this.$refs.nav).outerHeight(); //nav的高度

          if (wh > h) {
            this.isFixed = true;
          } else {
            this.isFixed = false;
          }
        },
      },
  }

</script>

<style lang="scss" scoped>
  .fixtop2 {
  min-height: 100vh;
}

.header {
  height: 5rem;
  width: 100%;
  background-color: red;
}

.nav {
  display: flex;
  width: 100%;
  background-color: pink;
  &.isFixed {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
  }
  .box {
    font-size: 0.3rem;
    padding: 0 0.3rem;
    height: 0.9rem;
    line-height: 0.9rem;
    color: #333333;
    flex: 1;
  }
}

.content {
  height: 20rem;
  li {
    width: 100%;
    height: 1rem;
    border-bottom: 1px solid #000;
  }
}
</style>
