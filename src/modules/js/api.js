let url={
	hotList:'/index/hotLists',
	bannerList:'/index/banner',
	topList:'/category/topList',
	rank:'/category/rank',
	subList:'/category/subList',
	searchList:'/search/list',
	details:'/goods/details',
	deal:'/goods/deal',
	addCart:'/cart/add',
	reduceCart:'/cart/reduce',
	removeCart:'/cart/remove',
	mrremoveCart:'/cart/mrremove',
	cartList:'/cart/list',
	addressList:'/address/list',
	addressAdd:'/address/add',
	addressUpdate:'/address/update',
	addressRemove:'/address/remove',
	addressSetDefault:'/address/setDefault'
}

//开发环境和真实环境的切换

let host='http://rap2api.taobao.org/app/mock/7058'

for(let key in url){
	if(url.hasOwnProperty(key)){
		url[key]=host+url[key]
	}
}

export default url