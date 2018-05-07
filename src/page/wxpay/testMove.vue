<template>
<div class="testDiv">
  <div id="app1" @touchmove="move" @touchend="end" @touchstart="start">    <!--绑定按下事件-->
      {{positionX}}
      {{positionY}}
    </div>
    <div id="packageBox" @touchmove="move" @touchend="end" @touchstart="start">
        <i class="packageIcon">1</i>
        <img src="../../images/package1.png">
      </div>
</div>
     
</template>

<script>
  export default {
      data() {
        return {
          positionX:0,
          positionY:0,
          _x_start:0,
          _y_start:0,
          _x_move:0,
          _y_move:0,
          _x_end:0,
          _y_end:0,
          left_start:0,
          top_start:0
        }
      },
      mounted () {

      },
      methods:{
        move(e){
            e.preventDefault();
            let odiv = e.target;    //获取目标元素
            console.log(e.touches)
            this._x_move=e.touches[0].clientX,
            this._y_move=e.touches[0].clientY;
            //移动当前元素
            odiv.style.left = parseFloat(this._x_move)-parseFloat(this._x_start)+parseFloat(this.left_start)+"px"
            odiv.style.top = parseFloat(this._y_move)-parseFloat(this._y_start)+parseFloat(this.top_start)+"px"
        },
        end(e){
          e.preventDefault();
          this._x_end=e.changedTouches[0].clientX;
          this._y_end=e.changedTouches[0].clientY;
        },
        start(e){
          e.preventDefault();
          let odiv = e.target;
          this._x_start=e.touches[0].clientX;
          this._y_start=e.touches[0].clientY;
          this.left_start=odiv.offsetLeft;
          this.top_start=odiv.offsetTop;
        }
      }
  }

</script>

<style lang="scss" scoped>
.testDiv{
  height: 6000px;
}
	 #app1{
    position: fixed;   /*定位*/
    top: 10px;
    left: 10px;
    width: 200px;
    height: 200px;
    background: #666;    /*设置一下背景*/
  }
  #packageBox{
  position: fixed;
  right: 10px;
  bottom: 81px;
  width: 55px;
  z-index: 15;
  transition: all 0.5s ease-in;
  i{
    position: absolute;
    right: 5px;
    background: rgb(218,46,46);
    border-radius: 50%;
    width: 14px;
    text-align: center;
    color: #f4f4f4;
  }
  img{
    position: fixed;
    right: 10px;
    bottom: 81px;
    width: 55px;
    z-index: 15;
    transition: all 0.5s ease-in;
  }
}
</style>
