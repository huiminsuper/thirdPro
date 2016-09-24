/*
	获取json数据
	调用插件
*/
;(function($){
function getData(){
	var data=null;
	$.ajax({
		url:"data.json",
		type:"get",
		dataType:"json",
		async:false,//同步
		success:function(result){
			data=result;
			//console.log(data);
		},
		error:function(){
			console.log('请求失败！')
		}
	})
	return data;
}//多个div(first_menu)都用插件用对象级别的

$('.first_menu').menu({
	json:getData()
})
//用构造函数使用插件
new Upload({
	container:"up_box",
	counter:"up_counter",
	file:"file"
})
})(Zepto)