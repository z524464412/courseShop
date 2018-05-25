<template>
  <div class="activity">
    <div class="p10">
      即日起 - 2018年04月30日
    </div>
    <div class="activityImg">
      <img src="../../images/background1.png">
    </div>
    <div class="p15">
      <div>
        对,你没有听错
      </div>
      <div>
        优惠力度就是这么大
      </div>
      <div>
        听到消息的
      </div>
      <div>
        隔壁王阿姨都带着小姐妹们组团来了
      </div>
    </div>
    
    <div class="pickImg">
      <img src="../../images/goods.png">
    </div>
    <div>
      这么诱人的优惠政策
    </div>
    <div>
      趁着<span class="red">四月大优惠</span>
    </div>
    <div class="red">
      乃们还不赶快下手吗
    </div>
    <div class="chooseBtn" to="" @click="gotoPath">
      <img src="../../images/btn1.png">
    </div>
    <div class="lineheight">
      
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
      gotoPath(){
        this.$router.go(-1);
      },
      loadMore() {
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
      
    }
  };
</script>
<style lang="scss" scoped>
  .activity{
    div{
      text-align: center;
      font-size: 16px;
      color: rgb(71,71,71);
      padding: 2px 0;
    }
    .activityImg{
      width: 90%;
      margin: 0 auto;
    }
    .p10{
      padding:10px  0;
    }
    .pickImg{
      width: 53px;
      height: 53px;
      margin: 0 auto;
      margin-bottom: 2px;
    }
    .red{
      font-size: 16px;
      color: #da2e2e;
    }
    .chooseBtn{
      position: fixed;
      bottom: -2px;

    }
  }
</style>


