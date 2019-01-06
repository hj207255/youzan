<template>
	<div class="container " style="min-height: 597px;">
	    <div class="block-list address-list section section-first js-no-webview-block" v-if='addressList&&addressList.length'>
	      <a class="block-item js-address-item address-item " v-for='item in addressList' :key='item.id' @click='toEdit(item)' :class="{'address-item-default':item.isDefault}">
	        <div class="address-title">{{item.name}} {{item.tel}}</div>
	        <p>{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</p>
	        <a class="address-edit">修改</a>
	      </a>
	    </div>
	    <div v-if='addressList&&!addressList.length'>
	    	暂无地址，请添加
	    </div>
	    <div class="block stick-bottom-row center">
	      <router-link class="btn btn-blue js-no-webview-block js-add-address-btn" 
	      :to="{name: 'form',query:{type: 'add'}}">
	            新增地址
	       </router-link>
	    </div>
	 </div>
</template>

<script>
	import axios from 'axios'
	import url from 'js/api.js'

	export default {
		data(){
			return {
				addressList: null
			}
		},
		created(){
			this.getAddressList()
		},
		methods: {
			toEdit(item){
				//this.$router.push({path:'/address/form'})
				this.$router.push({name:'form',query:{
					type: 'edit',
					instance: item
				}})
			},
			getAddressList(){
				axios.get(url.addressList)
					.then(res=>{
						this.addressList=res.data.lists
					})
			}
		}
	}
</script>


