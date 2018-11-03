<template>
  <div class="searchDiv weui-search-bar_focusing">
    <div class="weui-search-bar__form" :class="{mr0:clearSearBtn}" @click="changeInput">
      <div class="weui-search-bar__box">
        <i class="weui-icon-search mintui"></i>
        <form action="javascript:return true;">
          <input type="search" v-model="inputValue" class="weui-search-bar__input" id="searchInput" placeholder="搜索" @keyup.13="chooseInput"
            ref="input1" />
        </form>
        <a href="javascript:" class="weui-icon-clear" id="searchClear"></a>

      </div>
      <label class="weui-search-bar__label" id="searchText" v-show="!checkInput">
        <i class="mintui mintui-search"></i>
        <span>搜索</span>
      </label>
    </div>
    <div class="screening" @click="chooseScr" v-if="!clearSearBtn">
      筛选
    </div>
    <!-- 筛选 popUp-->
    <mt-popup v-model="chooseScreening" position="right" class="popupRight">
      <div class="popupTitle">
        筛选
      </div>

      <div class="popUpTime" v-if="type!='class'">
        <div v-if="timeType !='month'">
          <div class="timeTitle" v-if="timeType !='now'">
            报名时间
          </div>
          <div class="timeTypes" v-if="timeType !='now'">
            <div class="timeType" :class="{active:day}" @click="checkTime('day')">
              当天
            </div>
            <div class="timeType" :class="{active:week}" @click="checkTime('week')">
              当周
            </div>
            <div class="timeType" :class="{active:month}" @click="checkTime('month')">
              当月
            </div>
          </div>
          <div class="timeDiv" v-if="timeType !='now'">
            <div class="timeTypes">
              <div class="timeChoose" @click="showTime">
                {{startTime}}
              </div>
              <div class="timeInfo">
                至
              </div>
              <div class="timeChoose" @click="showendTime">
                {{endTime}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="timeTitle">
          班型
        </div>
        <div class="timeTypes">
          <div class="timeType" :class="{active:classAll}" @click="checkClass('classAll')">
            全部
          </div>
          <div class="timeType" :class="{active:online}" @click="checkClass('online')">
            线上
          </div>
          <div class="timeType" :class="{active:offline}" @click="checkClass('offline')">
            面授
          </div>
        </div>
      </div>
      <div class="lineHeight">
      </div>
      <div class="department" v-if="!deptShow">
        <div class="timeTitle" v-if="type=='class'">
          状态
        </div>
        <div class="timeTitle" v-else>
          业务部门
        </div>

        <div class="typeBox" v-if="type!='class'">
          <div class="timeTypes">
            <div class="typeList" :class="{active : deptAll}" @click="checkDept('deptAll')">
              全部
            </div>
            <div class="typeList" :class="{ active : item.check}" v-for="(item,index) in sysDeptLists" @click="checkDept(item,index)">
              {{item.name}}
            </div>
          </div>
        </div>
        <div v-else>
          <div class="timeTypes">
            <div class="typeList" :class="{active:statusAll}" @click="classType('statusAll')">
              全部
            </div>
            <div class="typeList" v-if="open!=1" :class="{active:full}" @click="classType('full')">
              已满班
            </div>
            <div class="typeList" :class="{active:under}" @click="classType('under')">
              未满班
            </div>
            <div class="typeList" :class="{active:inClass}" @click="classType('inClass')">
              可开班
            </div>
          </div>
        </div>
      </div>
      <div class="chooseBtn">
        <div class="closeBtn btn" @click="closeChoose">
          重置
        </div>
        <div class="checkBtn btn" @click="closePopUp">
          确认
        </div>
      </div>
    </mt-popup>
    <mt-datetime-picker ref="picker" type="date" :startDate="startDate" @confirm="handleConfirm" year-format="{value} 年" month-format="{value} 月"
      date-format="{value} 日" v-model="pickerValue">
    </mt-datetime-picker>
    <mt-datetime-picker ref="endpicker" type="date" :startDate="endStartDate" @confirm="endhandleConfirm" year-format="{value} 年"
      month-format="{value} 月" date-format="{value} 日" v-model="endPickerValue">
    </mt-datetime-picker>
  </div>
</template>
<script>
  import {
    setStore,
    getStore,
    getWeek,
    getMonth,
    getNowDay,
    getTaskTime,
    getNextDay,
    getNowYear
  } from 'src/config/mUtils'
  import {
    sysDept
  } from 'src/service/course'
  export default {
    data() {
      return {
        pickerValue: new Date(getNowDay()),
        startDate: new Date("2010-01-01"),
        endPickerValue: new Date(),
        endStartDate: new Date(),
        day: false,
        week: false,
        month: false,
        online: false,
        offline: false,
        classAll: true,
        statusAll: true,
        deptAll: true,
        full: false,
        under: false,
        inClass: false,
        olddate: '',
        oldperiod: '',
        period: '',
        date: '',
        startTime: '开始时间',
        endTime: '结束时间',
        inputValue: '',
        checkInput: '',
        chooseScreening: false,
        token: '',
        sysDeptLists: '',
        param: {},
        mode: '',
        status: '',
      }
    },
    props: ['type', 'timeType', 'clearSearBtn', 'open','deptShow','searchTitle'],
    created(){
      if(this.searchTitle){
        this.inputValue = this.searchTitle;
        this.checkInput = true;
      }
    },
    mounted() {
      let _this = this;
      _this.token = getStore('dingToken');
      _this.getSysDept();
      $(".weui-search-bar__form").on('touchstart', function () {
        if (!_this.checkInput) {
          _this.checkInput = true;
          if (_this.$nexttick) {
            _this.$nexttick(_this.changeInput())
          }
        }
      });
    },
    methods: {
      //获取所有部门
      getSysDept() {
        // alert(123)
        // let params = {};
        // params.onsale = 1;
        // params.token = this.token;
        // sysDept(params).then(res => {
        //   this.sysDeptLists = res;
        //   let list = this.sysDeptLists;
        // })
      },
      changeInput() {
        $("#searchInput").focus();
      },
      //切换部门tag
      checkDept(item, index) {
        let list = this.sysDeptLists;
        if (item == 'deptAll') {
          this.deptAll = true;
          for (var i = list.length - 1; i >= 0; i--) {
            list[i].check = false;
          }
          this.deptString = '';
        } else {
          this.deptAll = false;
          item.check = !item.check;
          this.olddept = [];
          this.deptString = '';
          for (var i = list.length - 1; i >= 0; i--) {
            if (list[i].check) {
              this.olddept.push(list[i].id);
            }
          }
          this.deptString = this.olddept.join(',');
          this.$set(this.sysDeptLists, index, item);
        }

      },
      //切换班级
      checkClass(type) {
        this[type] = !this[type];
        if (type == 'classAll') {
          this.mode = '';
          this.offline = false;
          this.online = false;
        } else if (type == 'offline') {
          this.classAll = false;
          this.online = false;
          this.mode = 2;
        } else if (type == 'online') {
          this.classAll = false;
          this.offline = false;
          this.mode = 1;
        }
        this.checkChoose();
      },
      classType(type) {
        this[type] = !this[type];
        if (type == 'statusAll') {
          this.full = false;
          this.inClass = false;
          this.under = false;
          this.status = ''
        } else if (type == 'full') {
          this.status = 10
          this.inClass = false;
          this.under = false;
          this.statusAll = false;
        } else if (type == 'inClass') {
          this.full = false;
          this.under = false;
          this.statusAll = false;
          this.status = 5
        } else if (type == 'under') {
          this.full = false;
          this.inClass = false;
          this.statusAll = false;
          this.status = 1
        }
        this.checkChoose();
        // if(this.full && this.inClass && this.under){
        //   this.status =''
        // }else if(type == 'full' &&  this.full){
        //   this.status = 10
        // }else if(type == 'inClass' &&  this.inClass){
        //   this.status = 5
        // }else if(type == 'under' &&  this.under){
        //   this.status = 1
        // }else {
        //   this.status =''
        // }

      },
      //切换时间tag
      checkTime(type) {
        this.oldperiod = '';
        this.olddate = '';
        this.startTime = '开始时间';
        this.endTime = '结束时间';
        if (type == 'day') {
          this.day = !this.day;
          this.week = false;
          this.month = false;
          if (this.day) {
            this.olddate = getNowDay();
          }
        } else if (type == 'week') {
          this.day = false;
          this.week = !this.week;
          this.month = false;
          if (this.week) {
            this.oldperiod = getWeek();
          }
        } else {
          this.day = false;
          this.week = false;
          this.month = !this.month;
          if (this.month) {
            this.oldperiod = getMonth();
          }
        }
      },
      //清除筛选以及搜索
      closeData() {
        this.deptList = '';
        this.deptList = '';
        this.olddept = [];
        this.deptString = '';
        this.dept = [];
        this.day = false;
        this.week = false;
        this.month = false;
        this.online = false;
        this.offline = false;
        this.classAll = true;
        this.statusAll = true;
        this.full = false;
        this.under = false;
        this.inClass = false;
        this.mode = '';
        this.status = '';
        this.olddate = '';
        this.oldperiod = '';
        this.period = '';
        this.date = '';
        this.startTime = '开始时间';
        this.endTime = '结束时间';
        this.pickerValue = getNowDay();
        this.startDate = new Date("2010-01-01");
        this.endDate = new Date(getNextDay());
        this.endPickerValue = getNowDay();
        this.endStartDate = new Date("2010-01-01");
        let list = this.sysDeptLists;
        for (var i = list.length - 1; i >= 0; i--) {
          list[i].check = false;
        }
      },
      changeInput() {
        $("#searchInput").focus();
      },
      closeChoose() {
        this.closeData();
        this.checkChoose();
        this.chooseScreening = false;

      },
      checkChoose() {
        if (this.startTime != '开始时间' && this.endTime != '结束时间') {
          this.period = this.startTime + '~' + this.endTime
        } else if (this.startTime != '开始时间') {
          this.period = this.startTime + '~' + getNextDay();
        } else if (this.endTime != '结束时间') {
          this.period = '2010-01-01' + '~' + getNextDay();
        } else if (this.oldperiod) {
          this.period = this.oldperiod;
        } else {
          this.period = this.oldperiod;
        }

        this.date = this.olddate;
        // this.dept = this.olddept;
        this.dept = this.deptString;
        // this.getOrderList();

        this.param.status = this.status;
        this.param.mode = this.mode;
        this.param.period = this.period;
        this.param.date = this.date;
        this.param.dept = this.dept;
        this.$emit('getList', this.param, true);
      },
      closePopUp() {
        if (this.type != 'class') {
          this.checkChoose()
        }
        this.chooseScreening = false;
      },
      clearTime() {
        this.day = false;
        this.week = false;
        this.month = false;
      },
      //显示时间选择器
      showTime() {

        this.$refs.picker.open();
      },
      showendTime() {
        this.$refs.endpicker.open();
      },
      chooseScr() {
        this.chooseScreening = true;
      },
      chooseInput() {
        var _this = this;
        if (this.inputValue) {
          // _this.getOrderList();
          this.param.inputValue = this.inputValue;
        } else {
          // _this.getOrderList();
          this.param.inputValue = '';
          this.checkInput = false;
        }
        this.$refs.input1.blur();
        this.$emit('getList', this.param, true)
      },
      handleConfirm(dataTime) {
        this.clearTime();
        let start = getTaskTime(dataTime);
        this.startTime = start;
        this.endStartDate = new Date(start);
      },
      endhandleConfirm(dataTime) {
        this.clearTime();
        this.endTime = getTaskTime(dataTime);
      },
    },
  }

</script>
<style lang="scss" scoped>
  .searchDiv {
    .screening {
      position: absolute;
      right: 16px;
      line-height: 36px;
      font-size: 17px;
      color: #5197FC;
    }
  }

  #addCourse .weui-search-bar_focusing {
    // z-index: 9999;
  }

  .weui-search-bar_focusing {
    // margin-top: 1px;
    padding: 7px 16px;
    position: relative;
    display: flex;
    box-sizing: border-box;
    background-color: #fff;
  }

  .weui-search-bar__form {
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: auto;
    flex: auto;
    background-color: #f1f1f3;
    border-radius: 10px;
    margin-right: 50px;
    line-height: 36px;
  }

  .mr0 {
    margin-right: 0px;
  }

  .weui-search-bar__box {
    position: relative;
    padding-left: 30px;
    padding-right: 50px;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
  }

  .weui-search-bar__box .weui-search-bar__input {
    padding: 4px 0;
    width: 100%;
    height: 1.42857143em;
    border: 0;
    font-size: 14px;
    line-height: 1.42857143em;
    box-sizing: content-box;
    background: transparent;
  }

  .weui-search-bar__box .weui-search-bar__input:focus {
    outline: none;
  }

  .weui-search-bar__box .weui-icon-search {
    position: absolute;
    left: 10px;
    top: 0;
  }

  .weui-search-bar__box .weui-icon-clear {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 10px;
    line-height: 28px;
  }

  .weui-search-bar__label {
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 1px;
    left: 1px;
    z-index: 2;
    border-radius: 10px;
    text-align: center;
    color: #808080;
    background: #f1f1f3;
  }

  .weui-search-bar__label span {
    display: inline-block;
    font-size: 17px;
  }

  .weui-icon-search {
    color: #B2B2B2;
    font-size: 17px;
  }

  .weui-icon-search:before {
    content: "\E604";
  }

  .weui-search-bar__label .weui-icon-search {
    margin-right: 5px;
  }

  .weui-search-bar__cancel-btn {
    display: none;
    margin-left: 10px;
    line-height: 28px;
    color: #09BB07;
    white-space: nowrap;
  }

  .weui-search-bar__input:not(:valid)~.weui-icon-clear {
    display: none;
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }

  .typeBox {
    height: 300px;
    overflow: auto;
  }

  .popupRight {
    width: 77.3%;
    height: 100%;
    background: #eff1f7;
    padding: 6px;
    .popupTitle {
      margin: 40px 0 15px 0;
      font-size: 18px;
      color: #5197FC;
    }
    .timeTitle {
      font-size: 14px;
      color: #5197FC;
    }
    .lineHeight {
      margin: 20px 0;
      height: 1px;
      background: #e5e5e5;
    }
    .timeTypes {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      .typeList {
        flex: 0 0 31%;
        margin: 8px 0;
        background: #fff;
        padding: 8px 0;
        border-radius: 15.5px;
        text-align: center;
        &:nth-of-type(3n+2) {
          flex: 0 0 30%;
          margin: 8px;
        }
        &.active {
          background: #D7EBFF;
          color: #5197FC;
        }
      }
      .timeType {
        flex: 1;
        margin: 8px 0;
        background: #fff;
        padding: 8px 0;
        border-radius: 15.5px;
        text-align: center;
        &:nth-of-type(2) {
          margin: 8px;
        }
        &.active {
          background: #d7ebff;
          color: #5197fc;
        }
      }
      .timeChoose {
        flex: 3;
        margin: 8px 0;
        background: #fff;
        padding: 8px 0;
        border-radius: 15.5px;
        text-align: center;
      }
      .timeInfo {
        flex: 1;
        text-align: center;
        line-height: 50px;
      }
    }
  }

  .chooseBtn {
    position: absolute;
    width: 200px;
    height: 42px;
    bottom: 11px;
    right: 39px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .closeBtn {
      border: 1px solid #5197FC;
      border-radius: 100px 0 0 100px;
      color: #5197FC;
      font-size: 15px;
    }
    .checkBtn {
      font-size: 15px;
      color: #fff;
      background-image: linear-gradient(90deg, #5FA0FE 0%, #88F5FE 100%);
      border-radius: 0 100px 100px 0;
      border: 1px solid #5FA0FE;
    }
    .btn {
      flex: 0 0 50%;
      line-height: 42px;
    }
  }

  .popupBottom {
    height: 50%;
    background: #fff;
    width: 100%;
  }

</style>
