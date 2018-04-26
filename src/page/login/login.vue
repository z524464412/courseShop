<template>
  	<div class="login">
      <img src="../../images/background.png">
      <div class="formDiv">
        <div class="phoneDiv DivItem">
            <img src="../../images/phone.png"/>
            <input type="text" pattern="[0-9]*" v-model="mobile" name="phone" placeholder="手机号码"/>
        </div>
        <div class="keyDiv DivItem">
            <img src="../../images/key.png">
            <input type="text" name="code" v-model="code" placeholder="输入验证码" />
            <button class="getCode" @click="sendCode" v-text="sendText"></button>
        </div>
        <div class="gradeDiv">
          <div class="left">在读年级:</div>
          <div class="gradeSelect" @click="showPicker">
              {{popUpOldTitle}}
          </div>
        </div>
        <div class="gradeBtn" @click="gotoCourse">
          开始选课
        </div>
      </div>
      <mt-popup v-model="pickerVisible" position="bottom" class="mint-popup">
      <mt-picker value-key="name" :slots="popUpSlots" ref="popUp" :visible-item-count="5" @change="popUpChange" :show-toolbar="false"></mt-picker>
      <p><button type="button" @click="popUpClose">取消</button><button type="button" @click="popUpSelect">完成</button></p>
    </mt-popup>
    </div>
</template>
<script>
import { gradeList,AuthLogin,getCodeMsg} from 'src/service/course'

  export default {
      data() {
        return {
          pickerVisible:false,
          allData:{},
          sendText:'发送验证码',
          sending:'',
          code:'',
          mobile:'',
          popUpSlots: [
            { //live picker select
              flex: 1,
              values: [{'id':12,'name':'小学'},{'id':122,'name':'小学1'},{'id':122,'name':'小学1'}],
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
              values: [{'id':1233,'name':'初中'},{'id':1222,'name':'初中2'},{'id':1212,'name':'初中1'}],
              className: 'slot3',
              textAlign: 'left'
            }
          ],
          popUpTitle:'小学三年级',
          popUpOldTitle:'小学三年级',
          gradeId:'',
          gradeOid:''
        }
      },
      created(){
        dd.ready(function() {
          dd.runtime.permission.requestAuthCode({
              corpId: "ding3dbee29ec52c1ef435c2f4657eb6378f",
              onSuccess: function(result) {
                let param = {};
                param.code = result.code;
                AuthLogin(param).then(res=>{
                  console.log(res)
                })
              },
              onFail : function(err) {
                console.log(err)
              }
          })
        });
      },
      mounted () {
        this.getGradeList();
      },
      methods:{
        getGradeList(){
          let _this =this;
          let param = {};
          param.type = 'subject'
          gradeList(param).then(res =>{
            // var res={};
            // res.data ={"respCode":0,"respMsg":"成功","data":[{"id":"125539","name":"小学课程","pid":null,"group":"scope","sub":[{"id":"125540","name":"小学三年级","pid":"125539","group":"grade","sub":null},{"id":"125541","name":"小学四年级","pid":"125539","group":"grade","sub":null},{"id":"125542","name":"小学五年级","pid":"125539","group":"grade","sub":null}]},{"id":"125543","name":"初中课程","pid":null,"group":"scope","sub":[{"id":"125545","name":"初中一年级","pid":"125543","group":"grade","sub":null},{"id":"125546","name":"初中二年级","pid":"125543","group":"grade","sub":null},{"id":"125547","name":"初中三年级","pid":"125543","group":"grade","sub":null},{"id":"125551","name":"初中预备","pid":"125543","group":"grade","sub":null}]},{"id":"125544","name":"高中课程","pid":null,"group":"scope","sub":[{"id":"125548","name":"高中一年级","pid":"125544","group":"grade","sub":null},{"id":"125549","name":"高中二年级","pid":"125544","group":"grade","sub":null},{"id":"125550","name":"高中三年级","pid":"125544","group":"grade","sub":null}]},{"id":"125552","name":"专项课程","pid":null,"group":"scope","sub":[{"id":"125553","name":"小学专项","pid":"125552","group":"grade","sub":null},{"id":"125554","name":"初中专项","pid":"125552","group":"grade","sub":null},{"id":"125555","name":"高中专项","pid":"125552","group":"grade","sub":null}]}]} 
            if(res.data.respCode == 0){
              console.log(res.data.data)
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

        //获取验证码
        sendCode() {
          console.log(this.mobile)
          if(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)){
            if(!this.sending){
              this.sending = true;
              var t = 60;
              var s1;     
              getCodeMsg(this.mobile); 
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
        gotoCourse(){
          console.log(this.gradeOid)
          console.log(this.gradeId)
          let gradeId = this.gradeOid || this.gradeId;
          this.$router.push({path:'/course',query:{gradeId:gradeId}})
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
