<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swp-page swiper-slide" v-for='item in list'>
        <a class="js-no-follow" :href="item.clickUrl">
          <img class="goods-main-photo fadeIn" :src="item.img?item.img:item.image">
        </a>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
	import Swiper from 'swiper'
	import 'swiper/dist/css/swiper.css'
	// import '../modules/css/swiper.min.css'
	// import '../modules/js/swiper.min.js'

	export default {
		name:'swipe',
		props:{
			list:{
				required: true
			}
		},
		mounted(){
			this.getSwipe()
		},
		methods:{
			getSwipe(){
				new Swiper('.swiper-container',{
			    	loop: true,
			    	pagination: {
			      	el: '.swiper-pagination'
			    	},
					observer:true,//修改swiper自己或子元素时，自动初始化swiper 
					observeParents:false,//修改swiper的父元素时，自动初始化swiper 
				})
			}
		}
	}
</script>

<style>
	
</style>