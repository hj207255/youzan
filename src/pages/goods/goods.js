import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'
import './good_tran.css'

import Vue from 'vue'
import url from 'js/api.js'
import axios from 'axios'
import mixin from 'js/mixin'
import qs from 'qs'
import Swipe from 'components/Swipe'

let {id}=qs.parse(location.search.substr(1))

let dealTab=['商品详情','本店成交']

// let swipeList=[{clickUrl: ''},{image: 'details.imgs'}]

new Vue({
	el: '#app',
	data: {
		id,
		details: null,
		detailsTab: true,
		deal: null,
		dealTab,
		tabIndex: 0,
		swipeList: null,
		skuType: 1,
		showSku: false,
		mount: 1,
		isDisabled: true,
		isAddCart: false,
		isSucces: true
	},
	created(){
		this.getDetails(),
		this.getSale()
	},
	methods: {
		getDetails(){
			axios.post(url.details,{id})
				.then(res=>{
					this.details=res.data.data
					this.swipeList=[]
					this.details.imgs.forEach(item=>{
						this.swipeList.push({
							clickUrl: '',
							image: item
						})
					})
				})
		},
		changeTab(index){
			this.tabIndex=index
		},
		getSale(){
			axios.post(url.deal,{id})
				.then(res=>{
					this.deal=res.data.data.lists
				})
		},
		chooseSku(type){
			this.skuType=type
			this.showSku=!this.showSku
		},
		changeMount(num){
			this.mount=this.mount+num
			if(num<0&&this.mount===1){
				this.isDisabled=true
				return
			}
			
			this.isDisabled=false
		},
		addCart(){
			axios.post(url.addCart,{
				id,
				number: this.mount
			}).then(res=>{
				if(res.data.status===200){
					this.showSku=false
					this.isAddCart=true
					this.isSucces=false

					setTimeout(()=>{
						this.isSucces=true
					},800)
				}
			})
		}
	},
	mixins:[mixin],
	components: {
		Swipe
	},
	watch:{
		showSku(val,oldVal){
			document.body.style.overflow=val? 'hidden':'auto'
			document.querySelector('html').overflow=val? 'hidden':'auto'
			document.body.style.height=val? '100%':'auto'
			document.querySelector('html').height=val? '100%':'auto'
		}
	}
})