<template>
	<div id="pay">
    <template>
      <transition name="router-fade" mode="out-in">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        </transition>
        <transition name="router-fade" mode="out-in">
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </transition>
    </template>
    </div>
</template>

<script>
  
  	export default {
      name:'pay',
    data() {
        return {
         	paySucc:3,
          billId:'',
          param:{}

        }
      },
      mounted () {
       setTimeout(function(){
          window.location.href="http://online.tifangedu.com/wap/myselfCenter"
        },3000)
      },
  	}

</script>

<style lang="scss">
  	@import './style/common';
	.router-fade-enter-active, .router-fade-leave-active {
	  	transition: opacity .3s;
	}
	.router-fade-enter, .router-fade-leave-active {
	  	opacity: 0;
	}
</style>
