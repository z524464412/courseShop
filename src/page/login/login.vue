<template>
  	<div class="login">
      <img class="loginImg" src="../../images/background3.png">
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
        <div class="gradeDiv" v-if="type == 'dingding'">
          <div class="left">学生来源:</div>
          <div class="gradeSelect" @click="showChannel">
              {{popChannel}}
          </div>
        </div>
        <div class="gradeDiv" v-if="type == 'dingding'">
          <div class="left">选择学校:</div>
          <div class="gradeSelect" @click="showRight">
              {{schoolName}}
          </div>
        </div>
        <div class="gradeBtn" @click="gotoCourse" v-if="type!= 'wx' || login">
          开始选课
        </div>
        <div class="payMoney" @click="payMoney" v-else>
          确认信息
        </div>
      </div>
      <mt-popup v-model="pickerRight" position="bottom" class="schoolPopUp">
        <div class="closeBtn" @click="showRight">
            <img src="../../images/close1.png">
        </div>
        <div class="titleInfo">
          区域
        </div>
        <div class="addrBox">
          <div class="addrList" v-for="addrList in addrLists">
            <div class="addrBtn" :class="{chooseBtn:addrList.choose}"  @click="chooseBtn(addrList)">
               {{addrList.name}}
            </div>
          </div>
        </div>
        <div class="borderHeight">
        </div>
        <mt-search
          v-model="value"
          cancel-text="取消"
          placeholder="搜索"
          show
          id="mtsearch"
          >
          <div class="titleDiv">
            <div
              v-for="item in filterList"
              class="searchTitle"
              @click="chooseSearch(item)"
              >
              {{item}}
            </div>
          </div>
        </mt-search>
      </mt-popup>
      <mt-popup v-model="pickerVisible1" position="bottom" class="mint-popup1">
        <mt-picker value-key="text" :slots="popUpSlots1" ref="popUp1" :visible-item-count="5" @change="popUpChange1" :show-toolbar="false"></mt-picker>
        <p><button type="button" @click="popUpClose1">取消</button><button type="button" @click="popUpSelect1">完成</button></p>
      </mt-popup>
      <mt-popup v-model="pickerVisible" position="bottom" class="mint-popup">
      <mt-picker value-key="name" :slots="popUpSlots" ref="popUp" :visible-item-count="5" @change="popUpChange" :show-toolbar="false"></mt-picker>
      <p><button type="button" @click="popUpClose">取消</button><button type="button" @click="popUpSelect">完成</button></p>
    </mt-popup>
    </div>
</template>
<script>
import{ mapState,mapMutations} from 'vuex';
import { Toast ,Indicator,MessageBox} from 'mint-ui';
import {setStore,getStore,removeStore} from 'src/config/mUtils';
import { gradeList,AuthLogin,getCodeMsg,manName,checkCode,newAddOrder,getChannel,getArea,getSchool} from 'src/service/course'

  export default {
      data() {
        return {
          pickerVisible:false,
          pickerVisible1:false,
          allData:{},
          sendText:'发送验证码',
          sending:'',
          code:'',
          mobile:'',
          man:'',
          login:true,
          checkLogin:true,
          type:'wx',
          pickerRight:false,
          searchValue:'',
          value:'',
          addrLists:[
            // {title:'浦东新区',id:'1',choose:true},
            // {title:'浦东新区',id:'2',choose:false},
            // {title:'浦东新区',id:'3',choose:false},
            // {title:'浦东新区',id:'4',choose:false},
            // {title:'浦东新区',id:'5',choose:false},
            // {title:'浦东新区',id:'6',choose:false},
            // {title:'浦东新区',id:'7',choose:false},
            // {title:'浦东新区',id:'8',choose:false},
            // {title:'浦东新区',id:'9',choose:false},
            // {title:'浦东新区',id:'4',choose:false},
            // {title:'浦东新区',id:'5',choose:false},
            // {title:'浦东新区',id:'6',choose:false},
            // {title:'浦东新区',id:'7',choose:false},
            // {title:'浦东新区',id:'8',choose:false},
            // {title:'浦东新区',id:'9',choose:false},
            // {title:'浦东新区',id:'9',choose:false},
          ],
          defaultResult:[] ,
          popUpSlots1:[
            {
              flex: 1,
                values: [],
                className: 'slot1',
                textAlign: 'center',
                defaultIndex: 0
            }
          ],
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
          popUpTitle:'高中一年级',
          popUpOldTitle:'高中一年级',
          popChannel:'社群炒作',
          gradeId:'',
          gradeOid:'',
          query:'',
          ids:'',
          scope:'',
          oldscope:'',
          channelList:[],
          channeOId:'',
          channeOTitle:'',
          channeId:'',
          zip:'',
          schoolName:'未选择',
          schoolList:'',
          schoolcode:''
        }
      },
      created(){
        let _this =this;
        _this.query = _this.$route.query;
        if( _this.query.login == 'false' || _this.query.login == false){
          _this.login =false
        }else{
          _this.login =true;
        }
        if(_this.query.classes){
          _this.ids = _this.query.classes;
        }
        if(getStore('type') == 'dingding'){
          _this.type = 'dingding'
        }else{
          _this.type == 'wx'
        }
      },

      deactivated() {
        // console.log(_this.info);
      },
      mounted () {
        this.getGradeList();
        this.getChannel();
        this.getAddr();
        if(!this.$route.query.classes){
          window.localStorage.removeItem('buyCart');  
          this.CLEAR_CART();
        }
        this.INIT_DISCOUNT();
        $('input').bind("focus",function(){
          $(".login").css("position","fixed");
        })
      },
      computed: {  
        filterList:function(){
            return this.defaultResult.filter(value => new RegExp(this.value, 'i').test(value));  
        }
      }, 
      beforeDestroy (){
        let info = JSON.parse(getStore('user'));
        info.login = true;
        setStore('user',info);
      },
      methods:{
        ...mapMutations([
          'INIT_DISCOUNT','CLEAR_CART','RECORD_USERINFO'
        ]),
        chooseSearch(item){
          var _this = this;
          _this.schoolName = item;
          let schoolList = this.schoolList;
          for (var i = schoolList.length - 1; i >= 0; i--) {
            if(item == schoolList[i].name){
              _this.schoolcode = schoolList[i].code;
            }
          }
          _this.showRight();
        },
        getAddr(){
          var _this =this;
          getArea().then(res=>{
            if(res.data.respCode == 0){
              let data =  res.data.data;
              _this.addrLists = [];
              for (var i = data.length - 1; i >= 0; i--) {
                if(data[i].name){
                  data[i].choose = false
                  _this.addrLists.push(data[i]);
                }
              }
              _this.addrLists =_this.addrLists.reverse();
              _this.addrLists[0].choose = true;
              _this.zip = _this.addrLists[0].code;
              _this.getSchool();
            }else{
              Toast(res.data.respMsg)
            }
          })
        },

        //获取学校
        getSchool(){
          var _this = this;
          let param = {};
          param.zip = _this.zip;
          getSchool(param).then(res=>{
            if(res.data.respCode == 0){
              let data =res.data.data;
              _this.schoolList = data;
              _this.defaultResult =[];
              for (var i = data.length - 1; i >= 0; i--) {
                _this.defaultResult.push(data[i].name);
              }
              // _this.defaultResult = _this.defaultResult.reverse();
            }
          })
        },
        //选中区
        chooseBtn(addrList){
          var _this =this;
          for (var i =_this.addrLists.length - 1; i >= 0; i--) {
           _this.addrLists[i].choose = false
          }
          addrList.choose = true;
          _this.zip = addrList.code;
          _this.getSchool();
        },
        showRight(){
          this.pickerRight = !this.pickerRight;
        },
        getChannel(){
          getChannel().then(res=>{
            var _this = this;
            if(res.data.respCode == 0){
              _this.channeId = res.data.data[0].value
              _this.popChannel =res.data.data[0].text;
              _this.channelList = res.data.data;
              _this.popUpSlots1[0].values = res.data.data;
            }
          })
        },
        getGradeList(){
          let _this =this;
          let param = {};
          param.type = 'subject'
          gradeList(param).then(res =>{
            if(res.data.respCode == 0){
              _this.allData = res.data.data;
              let aa = _this.allData[2];
              let bb = _this.allData[0];
              _this.allData[0] = aa;
              _this.allData[2] = bb;
              var allName =  _this.getNameDta(res.data.data);
              _this.popUpSlots[0].values = allName;
              _this.getGrade(allName[0].name)
              _this.gradeOid =_this.allData[0].sub[0].id
              _this.scope = _this.allData[0].id
            }
          },function(res){
            Indicator.close();
            MessageBox('系统错误,请刷新!')
          })
        },
        sortNumber(v1,v2){
          let aa = v2.id - v1.id && v2.id<125552
          return aa
        },
        //获取姓名
        getName(){
          if(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.mobile)){
            let param ={};
            param.phoneNo = this.mobile;
            manName(param).then(res=>{
              if(res.data.respCode == 0){
                this.man = res.data.data.nickName
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
              result = opt[i].id;
            }
          }
          return result;
        },
        getObj(){
          var result ={};
        },
        //获取所有的name
        getNameDta(arr) {
          var result = new Array();
          for (var i in arr) {
            if (arr[i].name != '') {
              let aa = {};
              aa.name =arr[i].name
              aa.id = arr[i].id;
              result.push(aa);
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
        showChannel(){
          $('.mint-popup1').css('opacity', 1)
          this.pickerVisible1 = !this.pickerVisible1;
        },
        //显示popup
        showPicker(){
          $('.mint-popup').css('opacity', 1)
          this.pickerVisible = !this.pickerVisible;
        },
        //popup改变
        popUpChange1(picker,values){
          if(picker.getSlotValue(0)){
            this.channeOId = picker.getSlotValue(0).value;
            this.channeOTitle = picker.getSlotValue(0).text
          }
        },
         //popup改变
        popUpChange(picker,values){

          if(picker.getSlotValue(0)){
            this.getGrade(picker.getSlotValue(0).name)  
            this.oldscope = picker.getSlotValue(0).id;
          }
          if(picker.getSlotValue(1)){
              this.popUpTitle = picker.getSlotValue(1).name;
              if(!this.gradeOid){
                this.gradeOid =  picker.getSlotValue(1).id;
              }else{
                this.gradeId = picker.getSlotValue(1).id;
              }
              if(picker.getSlotValue(1).name.indexOf('专项')  >0){

                this.scope = picker.getSlotValue(0).id;
              }
          }
        },
        //popup取消
        popUpClose1(){
          this.pickerVisible1 = false;
        },
        //popup选择
        popUpSelect1(){
          this.pickerVisible1 = false;
          this.popChannel = this.channeOTitle;
          this.channeId = this.channeOId;
        },
        //popup取消
        popUpClose(){
          this.pickerVisible = false;
        },
        //popup选择
        popUpSelect(){
          this.pickerVisible = false;
          this.popUpOldTitle = this.popUpTitle;
          this.gradeOid = this.gradeId;
          this.scope =this.oldscope
        },
        //去选课
        gotoCourse(){
          var _this =this;
          let user = JSON.parse(getStore('user'));
          let gradeId = this.gradeOid;
          let scope = this.scope;
          let param ={};
          param.vCode = this.code
          let info = {};
          info.code = this.code;
          info.name = this.man;
          info.phone = this.mobile;
          info.login = this.login;
          info.type = this.type;
          info.gradeId = this.gradeId;
          info.scope = this.scope;
          info.school = this.schoolcode;
          info.schoolName = this.schoolName;  
          // if(_this.schoolName =='未选择'){
          //   Toast('请选择学校!')
          //   return;
          // }
          if(info.type == 'wx'){
            if(user){
              setStore('user',user);
            }else{
              setStore('user',info);
            }
          }
          removeStore('user');
          info.channeId  = _this.channeId;
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
            }
            this.$router.push({path:'/course',query:{gradeId:gradeId,scope:scope}})
          }
          if(info.type == 'wx' && info.login){
            this.$router.push({path:'/course',query:{gradeId:gradeId,scope:scope}})
          }
        },
        payMoney(){
          let user = JSON.parse(getStore('user'));
          let info = {};
          let _this = this;
          info.code = this.code;
          info.name = this.man;
          info.phone = this.mobile;
          info.login = this.login;
          info.type = this.type;
          info.scope = this.scope;
          if(this.type == 'wx'){
            info.gradeId = user.gradeId;
            info.school = user.schoolcode;
            info.schoolName = user.schoolName; 
          }else{
            info.gradeId = this.gradeId;
            info.school = this.schoolcode;
            info.schoolName = this.schoolName; 
          }
           
          this.checkLogin = false;
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
              params.deliverAddr = _this.query.deliverAddr;
              params.classes = _this.query.classes;
              params.discount = _this.query.discount;
              params.phoneNo = _this.mobile;
              params.price = _this.query.price;
              params.userName = _this.man;
              param.grade = _this.gradeId
              params.scope = _this.scope;
              params.school = user.schoolName;
              if(res.data.data.userToken){
                setStore('userToken',res.data.data.userToken)
              }
              let token = '';
              let userToken = getStore('userToken');
              let dingToken = getStore('dingToken');
              if(userToken){
                token = 'userToken='+userToken
              }else if(dingToken){
                token = 'dingToken='+dingToken
              }else{
                token = ''
              }
            newAddOrder(params,token).then(res=>{
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
 .mint-search-list{
    padding-top: 70px;
  }
 .login{
  // position:fixed;
 }
  .titleInfo{
    font-size:14px;
    color: #5197FC;
    margin: 10px 0 0 12px;
  }
  .addrBox{
    margin: 0 0 10px 10px;
    overflow: auto;
    margin-bottom: 10px;
  }
  .borderHeight{
    height: 1px;
    margin:0 12px;
    background:#e5e5e5;
  }
  .closeBtn{
    position:fixed;
    right: 10px;
    bottom:10px;
    height: 60px;
    width: 60px;
    z-index: 999;
  }
  .login img{
    width: 100%;
    overflow: hidden;
    position:relative;
    // position: fixed;
    // background-attachment: fixed;
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
  .schoolPopUp{
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    color: #000;
  }
  .titleDiv{
    // padding-top: 20px;
  }
  .searchTitle{
    line-height: 20px;
    margin: 0 20px;
    font-size: 14px;
    width: auto;
    color: #999;
    padding: 4px 0;
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
  .addrList{
    overflow: hidden;
    width: 25%;
    float: left;
    height: auto;
  }
  .addrBtn{
    text-align: center;
    padding: 5px;
    border-radius: 15px;
    font-size:12px;
    margin:9px 9px 0 0;
    background: #fff;
    color: #4A4A4A;
    cursor: pointer;
    font-family: 'PingFang SC';
    
  }
  .chooseBtn{
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
  .DivItem{
    position: relative;
    border-bottom: 1px solid #fff;
    margin-bottom: 15px;
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
       font-size: 16px;
       opacity: 0.7;
    }
    input{
      margin-left: 24px;
      width: 90%;
      padding-top: 15px;
      background:rgba(0,0,0,0);
      color: #fff;
      padding-bottom: 4px;
      font-size: 16px;
    }
    .getCode{
      position: absolute;
      right: 0;
      top: 10px;
      background: transparent;
      bottom: 4px;
      color: #fff;
      font-size: 16px;
    }
  }
    .gradeDiv{
      line-height: 25px;
      color: #fff;
      .gradeSelect{
        width: 75%;
        margin: 30px auto;
        margin-left: 25%;
        text-align: center;
        letter-spacing: 4px;
        font-size: 16px;
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
    .searchDiv{
        position: relative;
        padding: 2px 4px;
        margin: 0 10px;
        border-radius: 5px;
        z-index: 1;
        border: 1px solid #d9d9d9;
        background: none;
        align-items:center;
    }
    #mtsearch{

    }
    
</style>
