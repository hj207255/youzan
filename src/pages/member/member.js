
//1.使用vue-route
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//路由配置文件,数组形式
let routes=[{
	path:'/',
	components: require('./components/member.vue')
},{
	path:'/address',
	components: require('./components/address.vue'),//需要加入子路由来显示
	children: [{
		path: '',
		//components: require('./components/all.vue')
		redirect: 'all'
	},{
		path: 'all',
		name: 'all',
		components: require('./components/all.vue')
	},{
		path: 'form',
		name: 'form',
		components: require('./components/form.vue')
	}]
}]

//2.创建router实例
let router=new Router({
	routes
})

new Vue({
	el: '#app',
	router//注入router实例
})