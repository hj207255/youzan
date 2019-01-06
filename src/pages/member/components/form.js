import axios from 'axios'
import url from 'js/api.js'

export default{
	data(){
		return {
			id: '',
			name: '',
			tel: '',
			provinceValue: -1,
			cityValue: -1,
			districtValue: -1,
			address: '',
			type: '',
			instance: '',
			addressData: require('@/modules/js/address.json'),
			cityList: null,
			districtList: null
		}
	},
	created(){
		let query=this.$route.query
		this.type=query.type
		this.instance=query.instance

		if(this.type==='edit'){
			let ins=this.instance
			this.provinceValue=parseInt(ins.provinceValue)
			this.name=ins.name
			this.tel=ins.tel
			this.address=ins.address
		}
	},
	methods:{
		add(){
			let {name,tel,provinceValue,cityValue,districtValue,address}=this
			let data={name,tel,provinceValue,cityValue,districtValue,address}
			if(this.type==='add'){
				axios.post(url.addressAdd)
					.then(res=>{
						this.$router.go(-1)
					})
			}
			if(this.type==='edit'){
				data.id=this.id
				axios.post(url.addressUpdate)
					.then(res=>{
						this.$router.go(-1)
					})
			}
		},
		remove(){
			if(window.confirm('确认删除？')){
				axios.post(url.addressRemove,{id:this.id}).then(res=>{
					this.$router.go(-1)
				})
			}
		},
		setDefault(){
			axios.post(url.addressSetDefault,{id:this.id}).then(res=>{
					this.$router.go(-1)
				})
		}
	},
	watch:{
		provinceValue(val){
			if(val===-1){return}
			let list=this.addressData.list
			let index=list.findIndex(item=>{
				return item.value===val
			})
			this.cityList=list[index].children
			this.cityValue=-1
			this.districtValue=-1

			if(this.type==='edit'){
				this.cityValue=parseInt(this.instance.cityValue)
			}
		},
		cityValue(val){
			if(val===-1){return}
			let list=this.cityList
			let index=list.findIndex(item=>{
				return item.value===val
			})
			this.districtList=list[index].children
			this.districtValue=-1

			if(this.type==='edit'){
				this.districtValue=parseInt(this.instance.districtValue)
			}
		}
	}

}