import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
// import Foot from '../../components/Foot'//配置文件中的路径不起作用
import mixin from 'js/mixin'


new Vue({
	el: '#app',
	data: {
		topList:null,
		rank:null,
		topIndex:0,
		subList:null
	},
	created(){
		this.getToplist(),
		this.getSubList(0,0),
		this.getRank()
	},
	methods: {
		getToplist(){
			axios.get(url.topList)
				.then(res=>{
					this.topList=res.data.lists
				})
		},
		getRank(){
			axios.post(url.rank)
				.then(res=>{
					this.rank=res.data.data
				})
		},
		getSubList(id,index){
			this.topIndex=index
			if(this.index===0){
				this.getRank()
			}else{
				axios.post(url.subList,{id})
					.then(res=>{
						this.subList=res.data.data
					})
			}
		},
		toSearchList(item){
			location.href=`search.html?keyword=${item.name}&id=${item.id}`
		}
	},
	// components: {
	// 	Foot
	// }
	mixins:[mixin]
})