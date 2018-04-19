<template>
  	<div class="login">
      <img src="../../images/background.png">
      <div class="formDiv">
        <div class="phoneDiv DivItem">
            <img src="../../images/phone.png"/>
            <input type="text" name="phone" placeholder="手机号码"/>
        </div>
        <div class="keyDiv DivItem">
            <img src="../../images/key.png">
            <input type="text" name="code" placeholder="输入验证码" />
            <button class="getCode" @click="getCode">获取验证码</button>
        </div>
        <div class="gradeDiv">
          <div class="left">在读年级:</div>
          <div class="gradeSelect" @click="showPicker">
              初中一年级
          </div>
        </div>
        <div class="gradeBtn" @click="gotoCourse">
          开始选课
        </div>
      </div>
      <mt-popup v-model="pickerVisible" position="bottom" class="mint-popup">
      <mt-picker :slots="popUpSlots" ref="lives" :visible-item-count="5" @change="popUpChange" :show-toolbar="false"></mt-picker>
      <p><button type="button" @click="popUpClose">取消</button><button type="button" @click="popUpSelect">完成</button></p>
    </mt-popup>
    </div>
</template>
<script>
  export default {
      data() {
        return {
          pickerVisible:false,
          popUpSlots: [
            { //live picker select
              flex: 1,
              values: ['小学','初中','高中'],
              className: 'slot1',
              textAlign: 'right',
              defaultIndex: 0
            },
            {
              divider: true,
              content: '-',
              className: 'slot2'
            },
            {
              flex: 1,
              values: ['四年级','五年级','六年级'],
              className: 'slot3',
              textAlign: 'left'
            }
          ],
        }
      },
      mounted () {

      },
      methods:{
        //获取验证码
        getCode(){

        },
        //显示popup
        showPicker(){
          $('.mint-popup').css('opacity', 1)
          this.pickerVisible = !this.pickerVisible;
        },
        //popup改变
        popUpChange(){

        },
        //popup取消
        popUpClose(){
          this.pickerVisible = false;
        },
        //popup选择
        popUpSelect(){
          this.pickerVisible = false;
        },
        gotoCourse(){
          this.$router.push({path:'/course'})
        }
      }
  }

</script>

<style lang="scss" scoped>
 @import 'src/style/common';
  .login img{
    width: 100%;
    overflow: hidden;
  }
  .formDiv{
    width: 65.6%;
    position: absolute;
    top: 25.3%;
    left: 17.3%;
  }
  .DivItem{
    position: relative;
    border-bottom: 1px solid #fff;
    margin-bottom: 30px;
    img{
      width: 20px;
      height: 30px;
      position: absolute;
      left: 0;
      bottom: 1px;
    }
    input::-webkit-input-placeholder {
       color: #fff;
       font-size: 12px;
       opacity: 0.7;
    }
    input{
      margin-left: 24px;
      width: 90%;
      padding-top: 15px;
      background:rgba(0,0,0,0);
      color: #fff;
      padding-bottom: 4px;
      font-size: 12px;
    }
    .getCode{
      position: absolute;
      right: 0;
      top: 10px;
      background: transparent;
      bottom: 4px;
      color: #fff;
      font-size: 13px;
      // opacity: 0.7;
    }
  }
    .gradeDiv{
      line-height: 25px;
      color: #fff;
      // opacity: 0.7;
      .gradeSelect{
        width: 75%;
        margin: 40px auto;
        margin-left: 25%;
        text-align: center;
        letter-spacing: 4px;
        font-size: 14px;
        border-bottom: 1px solid #fff;
        position: relative;
        &:before{
          content: '';
          position: absolute;
          right: 0;
          bottom: 10px;
          display: inline-block; 
          border-left: 2px solid; border-bottom: 2px solid;  
          width: 8px; height: 8px;  
          transform: rotate(-45deg); 
        }
      }
    }
    .gradeBtn{
      color: #62a2fb;
      font-size: 18px;
      border-radius: 5px;
      width: 100%;
      text-align: center;
      line-height: 40px;
      background: #fff;
      box-shadow: 0 4px 10px 0 #62a2fb;
    }
</style>
