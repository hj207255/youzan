import './cart_base.css'
import './cart_trade.css'
import './cart.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin'
import Velocity from 'velocity-animate'

new Vue({
	el: '.container',
	data: {
		cartList: null,
		total: 0,
		editingShop: null,
		editingChecked: false,
		removePopup: false,
		removeData: null,
		removeShopIndex: -1,
		removeMsg:'',
		isEditing: true
	},
	created(){
		this.getcartList()
	},
	computed: {
		checkedAll: {
			get(){
				if(this.cartList&&this.cartList.length){//进入页面是如果页面没有商品，返回false
					return this.cartList.every(shop=>{//根据店铺是否全被选中，定义全选的值
						return shop.isChecked//返回店铺选中的状态
					})
				}
				return false
			},
			set(newVal){//设置全选被点击后的新属性（取反）并将新值付给每一个店铺和商品
				this.cartList.forEach(shop=>{
					shop.isChecked=newVal
					shop.goodsList.forEach(goods=>{
						goods.isChecked=newVal
					})
				})
			}
		},
		removeAll:{
			get(){
				if(this.editingShop){
					return this.editingShop.editingChecked
				}
				return false
			},
			set(newVal){
				this.editingShop.editingChecked=newVal
				this.editingShop.goodsList.forEach(goods=>{
					goods.editingChecked=newVal
				})
			}
		},
		selectList(){//返回给后端的数据，需要一个数组的形式
			if(this.cartList&&this.cartList.length){//先判断购物车中是否有商品
				let arr=[]
				let total=0
				this.cartList.forEach(shop=>{
					shop.goodsList.forEach(goods=>{
						if(goods.isChecked){//判断被选中的商品，并加入到空数组中
							arr.push(goods)
							total += goods.price*goods.number
						}
					})
				})
				this.total=total
				return arr
			}
			return []
		},
		removeList(){
			if(this.editingShop){
				let arr=[]
				this.editingShop.goodsList.forEach(goods=>{//分辨好editingShop的结构
					if(goods.editingChecked){
						arr.push(goods)
					}
				})
				return arr//要记得返回数组，要不然返回的是undefined
			}
			return []
		}
	},
	methods:{
		getcartList(){
			axios.post(url.cartList)
				.then(res=>{
					let list=res.data.cartList
					list.forEach(shop=>{
						shop.isChecked=true
						shop.editing=false
						shop.editingChecked=false
						shop.editingMsg='编辑'
						shop.goodsList.forEach(goods=>{
							goods.isChecked=true
							goods.editingChecked=false
						})
					})
					this.cartList=list
				})
		},
		checkedGood(goods,shop){
			let attr=this.editingShop?'editingChecked':'isChecked'
			goods[attr]=!goods[attr]
			shop[attr]=shop.goodsList.every(goods=>{
				return goods[attr]//店铺的是否选择取决于店铺商品的是否全部选择
				//（从商品选择店铺）
			})
		},
		checkedShop(shop){
			let attr=this.editingShop?'editingChecked':'isChecked'
			shop[attr]=!shop[attr]
			shop.goodsList.forEach(goods=>{//当店铺被选中时，商品的值跟随店铺的值
				goods[attr]=shop[attr]//此处是店铺是否被选中的值
			})

		},
		selsctAll(){
			let attr=this.editingShop?'removeAll':'checkedAll'
			this[attr]=!this[attr]//全选的值根据计算属性的set()值
		},
		chooseEdit(shop,shopIndex,goodsIndex){
			this.removeShopIndex=shopIndex
			this.editingShop=shop.editing?null:shop//要接受当前点击的店铺，还要再次被点击是还原
			shop.editing=!shop.editing
			shop.editingMsg=shop.editing?'完成':'编辑'
			this.cartList.forEach((item,i)=>{
				if(i!==shopIndex){
					item.editingMsg=item.editingMsg?'':'编辑'
				}else{
					item.editingChecked=false
					item.goodsList.forEach(goods=>{
						goods.editingChecked=false
					})
				}
			})
		},
		plus(goods){
			axios.post(url.addCart,{
				id:goods.id,
				number:1
			}).then(res=>{
				goods.number++
			})
		},
		minus(goods){
			if(goods.number===1)return
			axios.post(url.reduceCart,{
				id:goods.id,
				number:1
			}).then(res=>{
				goods.number--
			})
		},
		removeGoods(shop,shopIndex,goods,goodsIndex){
			this.removePopup=true
			this.removeMsg='确定要删除该商品吗？'
			this.removeData={shop,shopIndex,goods,goodsIndex}
		},
		removeGoodsAll(){
			this.removePopup=true
			this.removeMsg=`确定要删除这${this.removeList.length}件商品吗？`
		},
		confirmRemove(){
			if(this.removeMsg==='确定要删除该商品吗？'){
				let {shop,shopIndex,goods,goodsIndex}=this.removeData
				axios.post(url.removeCart,{
					id:goods.id
				}).then(res=>{
					shop.goodsList.splice(goodsIndex,1)
					if(shop.goodsList.length===0){
						this.cartList.splice(shopIndex,1)
						this.removeShopAfter()
					}
					this.removePopup=false
					this.$refs[`goods-${shopIndex}-${goodsIndex}`][0].style.left='0px'
				})
			}else{
				let ids=[]
				this.removeList.forEach(item=>{
					ids.push(item.id)
				})
				axios.post(url.mrremoveCart,{
					ids
				}).then(res=>{//判断removeList中是否存在于editingShop中
					let arr=[]//储存的是没有被选择删掉的商品
					this.editingShop.goodsList.forEach(good=>{
						let index=this.removeList.findIndex(item=>{
							return item.id==good.id//此处使用空数组过度的原因
						})//由于从数组中删除时会影响下标，导致数组后边删除失败
						if(index===-1){
							arr.push(good)//剩下的商品
						}
					})
					console.log(this.removeList)
					if(arr.length){
						this.editingShop.goodsList=arr
						//将没有被选中删掉的商品重新赋值给editingShop
					}else{//这里处理如果editingShop中没有商品，则店铺也要被删除掉
						this.cartList.splice(this.removeShopIndex,1)
						this.removeShopAfter()//店铺被删除之后重新改变其他店铺的值
					}
					this.removePopup=false
				})
			}	
		},
		removeShopAfter(){
			this.editingShop=null//重置选中要编辑的店铺
			this.removeShopIndex=-1//初始化被选择编辑的店铺的下标
			this.editingChecked=false//重置编辑状态的选中状态
			this.removeData=null//重置移除信息（删除单件商品时使用）
			this.cartList.forEach(res=>{//遍历剩余列表中信息
				// res.editing=false//将店铺的
				res.editingMsg='编辑'//重置编辑状态
				res.editingChecked=false//
			})
		},
		start(e,goods){
			goods.startX=e.changedTouches[0].clientX
		},
		end(e,shopIndex,goods,goodsIndex){
			let endX=e.changedTouches[0].clientX
			let left='0'
			if(goods.startX-endX>100){//左划
				left='-60px'
				this.isEditing=false
			}
			if(endX-goods.startX>100){//右划
				left='0px'//Velocity不能识别不带单位的，所以必须带单位px
				this.isEditing=true
			}
			Velocity(this.$refs[`goods-${shopIndex}-${goodsIndex}`],{left})
			//vue中取响应的dom节点
			//需要在html中给dom节点添加属性
		}
	},
	mixins:[mixin]
})