;(function($){
	$.fn.menu=function(obj){
		var obj=$.extend({json:null},obj);
		//console.log(obj);
		return $(this).each(function(index,ele){
			var key=$(this).data("key"),keyVal='',options='<option>请选择</option>',sel=$(this).find('select'),selTwo=$(this).next().find('select');
			
			//console.log(key);
			//console.log(obj.json[key]);//localArea是数组，ObjectType是对象
			if(Object.prototype.toString.call(obj.json[key])==="[object Array]"){//判断是否为数组
				keyVal=obj.json[key];
				//console.log(keyVal);
			}else{
				keyVal=obj.json[key].option;
				//console.log(keyVal);
			}
			$.each(keyVal,function(index,ele){
				var name=ele.name||ele.text,//区域 || 品牌
					id=ele.id||ele.value;//区域和品牌对应的value
					
				options+="<option value="+id+">"+name+"</option>"
			})
			sel.html(options);
			//console.log(sel.find('option')[0].text);
			//将第一个文本的option的text写到label中（默认值）
			sel.parent().find('label').text(sel.find('option')[0].text)
			//点击一级菜单  内容改变  显示二级菜单 渲染二级菜单
			sel.on('change',function(){				
				//内容改变
				var inx=this.selectedIndex,//选中项的下标//alert(inx);
					opts=this.options,//获取所有option//console.log(opts);
					txt=this.options[inx].text,//获取选中项的文本值//console.log(txt);
					label=$(this).parent().find('label'),//console.log(label);
					submenu=$(this).parent().next(),//二级菜单对应的div
					subsel=submenu.find('select');
					label.text(txt);//选中项的文本放到label中
				//显示二级菜单
				if(txt!='请选择'){					
					var ops="";
					submenu.css('visibility','visible');
					//console.log(inx-1);
					suboptions=keyVal[inx-1].option;
					//console.log(keyVal[inx-1].option[0].name);
					$.each(suboptions,function(i,val){
						var subname=suboptions[i].name||suboptions[i].text,//二级菜单文本
							subid=suboptions[i].id||suboptions[i].value;//二级菜单对应的value
							//console.log(subname+" "+subid);
						ops+="<option value='"+subid+"'>"+subname+"</option>";
					})
					subsel.html(ops);//将二级数据添加到submenu
					submenu.find('label').text(subsel.find('option')[0].text);
				}else{
					submenu.css('visibility','hidden');
				}
			})
			//点击二级菜单
			selTwo.on('change',function(){
				var indTwo=this.selectedIndex;
				//console.log($(this).find('option')[indTwo].text);
				$(this).prev().text($(this).find('option')[indTwo].text)
			})
		})
	}
})(Zepto)