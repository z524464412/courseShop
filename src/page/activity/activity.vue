<template>
  <div class="page-infinite-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
    <div id="swipeDiv" ref="header">
      <mt-swipe class="myswipe" :auto="3000" >
        <mt-swipe-item v-for="(banner,index) in 3" :data-value="banner.url" class="swiper-slide">
          <img src="../../images/banner.png">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div >
      <ul class="page-infinite-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="20">
        <shop-list v-for="item in list"></shop-list>
      </ul>
      <p v-show="loading" class="page-infinite-loading">
        <mt-spinner type="fading-circle"></mt-spinner>
        加载中...
      </p>
    </div>
  </div>
</template>
<script type="text/babel">
import shopList from 'src/components/common/shopList'
  export default {
    data() {
      return {
        banners:[{url:'../../images/banner.png',title:'图片'}],
        list: [],
        loading: false,
        allLoaded: false,
        wrapperHeight: 0
      };
    },
    components:{
        shopList
    },
    methods: {
      loadMore() {
        console.log(123)
        this.loading = true;
        setTimeout(() => {
          let last = this.list[this.list.length - 1];
          for (let i = 1; i <= 10; i++) {
            this.list.push(last + i);
          }
          this.loading = false;
        }, 500);
      }
    },

    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      for (let i = 1; i <= 20; i++) {
        this.list.push(i);
      }
    }
  };
</script>
<style lang="scss">
  #swipeDiv{
      .mint-swipe {
        height: 120px;
        color: #fff;
        font-size: 30px;
        text-align: center;
      }
    }
</style>


