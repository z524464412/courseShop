<template>
  	<div class="login">
      <img src="../../images/background.png">
      <div class="formDiv">
        <div class="phoneDiv DivItem" v-if="!login || type=='dingding'">
            <img src="../../images/phone.png"/>
            <input @blur="getName()" maxlength="20" type="text" pattern="[0-9]*" v-model="mobile" name="phone" placeholder="手机号码"/>
        </div>
        <div class="keyDiv DivItem" v-if="!login">
            <img src="../../images/key.png">
            <input type="text" name="code" v-model="code" placeholder="输入验证码" />
            <button class="getCode" @click="sendCode" v-text="sendText"></button>
        </div>
        <div class="keyDiv DivItem" v-if="!login || type=='dingding'">
            <img src="../../images/man1.png">
            <input type="text" name="man" v-model="man" placeholder="用户姓名" />
            <button class="getCode"></button>
        </div>
        <div class="gradeDiv" v-if="(type=='wx' && login) || type=='dingding'">
          <div class="left">在读年级:</div>
          <div class="gradeSelect" @click="showPicker">
              {{popUpOldTitle}}
          </div>
        </div>
        <div class="gradeBtn" @click="gotoCourse" v-if="type!= 'wx' || login">
          开始选课
        </div>
        <div class="payMoney" @click="payMoney" v-else>
          确认信息
        </div>
      </div>
      <mt-popup v-model="pickerVisible" position="bottom" class="mint-popup">
      <mt-picker value-key="name" :slots="popUpSlots" ref="popUp" :visible-item-count="5" @change="popUpChange" :show-toolbar="false"></mt-picker>
      <p><button type="button" @click="popUpClose">取消</button><button type="button" @click="popUpSelect">完成</button></p>
    </mt-popup>
    </div>
</template>
<script>
import{ mapState,mapMutations} from 'vuex';
import { Toast } from 'mint-ui';
import {setStore,getStore} from 'src/config/mUtils';
import { gradeList,AuthLogin,getCodeMsg,manName,checkCode,addOrder} from 'src/service/course'

  export default {
      data() {
        return {
          pickerVisible:false,
          allData:{},
          sendText:'发送验证码',
          sending:'',
          code:'',
          mobile:'',
          man:'',
          login:true,
          type:'wx',
          popUpSlots: [
            { //live picker select
              flex: 1,
              values: [],
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
              values: [],
              className: 'slot3',
              textAlign: 'left'
            }
          ],
          popUpTitle:'小学三年级',
          popUpOldTitle:'小学三年级',
          gradeId:'',
          gradeOid:'',
          query:'',
          ids:''
        }
      },
      created(){
        let _this =this;
        _this.query = _this.$route.query;
        if(_this.query.classes){
          _this.ids = _this.query.classes;
          _this.login = _this.query.login;
        }else{
          this.login = true;
        }
        dd.ready(function() {
          dd.runtime.permission.requestAuthCode({
            corpId: "ding3dbee29ec52c1ef435c2f4657eb6378f",
            onSuccess: function(result) {
              let param = {};
              param.code = result.code;
              AuthLogin(param).then(res=>{
                if(res.data.respCode == 0){
                  _this.type = 'dingding';
                }
              })
            },
            onFail : function(err) {
              console.log(err)
            }
          })
        });
      },

      deactivated() {
        console.log(_this.info);

      },
      mounted () {
        this.getGradeList();
        console.log(this.$route.query.classes)
        if(!this.$route.query.classes){
          console.log(123)
          window.localStorage.removeItem('buyCart');  
          this.CLEAR_CART();
        }
        this.INIT_DISCOUNT();
        
      },
      methods:{
        ...mapMutations([
          'INIT_DISCOUNT','CLEAR_CART','RECORD_USERINFO'
        ]),
        getGradeList(){
          let _this =this;
          let param = {};
          param.type = 'subject'
          gradeList(param).then(res =>{
            if(res.data.respCode == 0){
              _this.allData = res.data.data;
              var allName =  _this.getNameDta(res.data.data);
              _this.popUpSlots[0].values = allName;
              _this.getGrade(allName[0])
            }else{
              
            }
          },function(res){
            Indicator.close();
            MessageBox('系统错误,请刷新!')
          })
        },
        //获取姓名
        getName(){
          if(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)){
            let param ={};
            param.phoneNo = this.mobile;
            manName(param).then(res=>{
              if(res.data.respCode == 0){
                this.man = res.data.data.username
              }
            })
          }
        },
        //获取验证码
        sendCode() {
          if(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)){
            if(!this.sending){
              this.sending = true;
              var t = 60;
              var s1;
              let param = {};
              param.phoneNo = this.mobile;
              getCodeMsg(param).then(res=>{
                console.log(res)
              }); 
              s1 = setInterval(() => {
                if(t>1){
                  this.sending = true;
                  t--;
                  this.sendText = t+'s';
                }else{
                  clearInterval(s1);
                  this.sendText = '重新发送';
                  this.sending = false;
                }
              },1000)
            }else{
              return false;
            } 
          }else{
            var container1=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn"><div class="zvalid-resultformat">请先输入正确的手机号</div></div></div></div>');
            container1.appendTo($("body"));
            setTimeout(function(){
              container1.remove();
            },1500)
          }
        },
        getOptId(opt, name) {//通过name获取ID
          var result;
          for (var i in opt) {
            if (opt[i].name == name) {
              result = opt[i].ide;
            }
          }
          return result;
        },
        //获取所有的name
        getNameDta(arr) {
          var result = new Array();
          for (var i in arr) {
            if (arr[i].name != '') {
              result.push(arr[i].name);
            }
          }
          return result;
        },
        //获取二级菜单
         getGrade: function(placeName) {
              var _this = this;
              var place = Object.values(_this.allData);
              for (let item of place) {
                if (item.name == placeName) {
                  _this.popUpSlots[2].values = item.sub;
                }
              }
            },
        //显示popup
        showPicker(){
          $('.mint-popup').css('opacity', 1)
          this.pickerVisible = !this.pickerVisible;
        },
        //popup改变
        popUpChange(picker,values){
          this.getGrade(picker.getSlotValue(0))
          if(picker.getSlotValue(1)){
              this.popUpTitle = picker.getSlotValue(1).name;
              this.gradeId = picker.getSlotValue(1).id;
          }
        },
        //popup取消
        popUpClose(){
          this.pickerVisible = false;
        },
        //popup选择
        popUpSelect(){
          this.pickerVisible = false;
          this.popUpOldTitle = this.popUpTitle;
          this.gradeOid =this.gradeId;
        },
        //去选课
        gotoCourse(){
          let gradeId = this.gradeOid || this.gradeId;
          let param ={};
          param.vCode = this.code
          let info = {};
          info.code = this.code;
          info.name = this.man;
          info.phone = this.mobile;
          info.login = this.login;
          info.type = this.type;
          setStore('user',info);
          if(info.type == 'dingding'){
            if(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)){

            }else{
              var container1=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn"><div class="zvalid-resultformat">请先输入正确的手机号</div></div></div></div>');
              container1.appendTo($("body"));
              setTimeout(function(){
                container1.remove();
              },1500)
              return 
            }
            if(!info.name){
              var container1=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn"><div class="zvalid-resultformat">请输入姓名</div></div></div></div>');
              container1.appendTo($("body"));
              setTimeout(function(){
                container1.remove();
              },1500)
              return
            }else{
            }
            this.$router.push({path:'/course',query:{gradeId:gradeId}})
          }
          if(info.type == 'wx' && info.login){
            this.$router.push({path:'/course',query:{gradeId:gradeId}})
          }
          if(info.type =='wx' && !info.login){
            if(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)){
            }else{
              var container1=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn"><div class="zvalid-resultformat">请先输入正确的手机号</div></div></div></div>');
              container1.appendTo($("body"));
              setTimeout(function(){
                container1.remove();
              },1500)
              return 
            }
            if(!info.name){
              var container1=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn"><div class="zvalid-resultformat">请输入姓名</div></div></div></div>');
              container1.appendTo($("body"));
              setTimeout(function(){
                container1.remove();
              },1500)
              return
            }
          }
        },
        payMoney(){
          let info = {};
          let _this = this;
          info.code = this.code;
          info.name = this.man;
          info.phone = this.mobile;
          info.login = this.login;
          info.type = this.type;
          setStore('user',info);
          var param ={};
          param.vCode = this.code;
          param.phoneNo = this.mobile;
          if(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)){
          }else{
            var container1=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn"><div class="zvalid-resultformat">请先输入正确的手机号</div></div></div></div>');
            container1.appendTo($("body"));
            setTimeout(function(){
              container1.remove();
            },1500)
            return 
          }
          if(!info.name){
            var container1=$('<div class="field-tooltipWrap"><div class="field-tooltipInner"><div class="field-tooltip fieldTipBounceIn"><div class="zvalid-resultformat">请输入姓名</div></div></div></div>');
            container1.appendTo($("body"));
            setTimeout(function(){
              container1.remove();
            },1500)
            return
          }

          checkCode(param).then(res=>{
            if(res.data.respCode == 0){
              _this.query.phoneNo = _this.mobile;
              _this.query.userName = _this.man;
              let params = {};
              params.classes = _this.query.classes;
              params.discount = _this.query.discount;
              params.phoneNo = _this.mobile;
              params.price = _this.query.price;
              params.userName = _this.man;
              console.log(JSON.stringify(params))
            addOrder(params).then(res=>{
              if(res.data.respCode == 0){
                _this.$router.push({path:'/orderList',query:{id:res.data.data}});
              }else{
                 Toast(res.data.respMsg)
              }
            })
            }else{
              Toast(res.data.respMsg)
              return
            }
          })
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
  .namelabel{
    float: left;
    line-height: 30px;
    color: #fff;
  }
  // .nameDiv{
  //   position: relative;
  //   border-bottom:1px solid #fff;
  //   margin-left: 60px;
  //   line-height: 30px;
  //   font-size: #fff;
  //   input{
  //     background: transparent;
  //     color: #fff;
  //   }
  //   input::-webkit-input-placeholder {
  //      color: #fff;
  //      font-size: 12px;
  //      opacity: 0.7;
  //   }
  // }
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
      object-fit: contain
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
    .payMoney{
      color: #fff;
      font-size: 18px;
      border-radius: 5px;
      width: 100%;
      text-align: center;
      line-height: 40px;
      background: #ffa351;
    }
</style>
