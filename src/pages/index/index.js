import 'css/common.css'
import './index.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
// import Foot from 'components/Foot'//配置文件中的路径不起作用
import Swipe from 'components/Swipe'
import mixin from 'js/mixin'

//引入无限滚动指令
import { InfiniteScroll } from 'mint-ui';
Vue.use(InfiniteScroll);


new Vue({
	el: '#app',
	data: {
		lists: null,
		pageNum: 1,
		pageSize: 6,
		loading: false,
		allLoaded: false,
		bannerList: null
	},
	components:{
		// Foot,
		Swipe
	},
	created(){
		this.getList(),
		this.getBanner()
	},
	methods:{
		getList(){
			//当allLoaded为true时，不在请求数据
			if(this.allLoaded) return
			//当触发一次请求之后，在拖动也不会触发请求
			this.loading=true
			axios.post(url.hotList,{
				pageNum: this.pageNum,
				pageSize: this.pageSize
			}).then(res=>{
				//用于储存已更新的数据
				let currentList=res.data.lists
				//判断所有数据是否加载完毕
				if(currentList.length<this.pageSize){
					this.allLoaded=true
				}
				if(this.lists){
					//滑到底部时再次获取数据并拼接到原数组上
					this.lists=this.lists.concat(currentList)
				}else{
					//第一次请求数据
					this.lists=currentList
				}
				//请求完毕后，可以再次请求
				this.loading=false
				this.pageNum++
			})
		},
		getBanner(){
			axios.get(url.bannerList)
				.then(res=>{
					this.bannerList=res.data.lists
			})
		}
	},
	mixins: [mixin]
})