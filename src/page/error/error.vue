<template>
<div class="error">
  <div >
    <div class="iconDIV">
      <img src="../../images/error1.jpg">
    </div>
    <div class="iconText">
      抱歉,支付失败
    </div>
  </div>
</div>

</template>

<script>
  export default {
      data() {
        return {
        }
      },
      mounted () {

      },
      methods:{

      }
  }

</script>

<style lang="scss" scoped>
.iconDIV{
    width: 30%;
      margin: 15% auto;
  }
  .iconText{
    text-align: center;
    color: #F95353;
    font-size: 18px;
    letter-spacing: 2px;

  }
</style>
