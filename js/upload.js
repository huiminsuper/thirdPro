function Upload(obj){
	var _default={
		container:"",//添加图片的容器
		counter:"",//计算还可上传图片数量
		file:"",//上传图片的文件域
		num:3,//最多可上传图片数量
		size:2,//每张图片的大小不超过2M
		scale:0.8,//压缩的比例
		url:"upload.php",//上传图片到后台后的路径
		key:"img"//请求后台图片的关键字
	}
	this.obj=$.extend(_default,obj);//console.log(this.obj);

	this.init();
}
Upload.prototype={
	init:function(){
		this.counter();//统计数量的函数

		//文件file上传会触发change事件，为文件域添加change事件
		var file=$('#'+this.obj.file),that=this,container=$('#'+that.obj.container);
		//文件域file的change事件
		file.on('change',function(){
			//文件与对象.files获取上传文件的信息//当属性名为数字是用[]获取
			//图片格式 jpg jpeg,png,gif
			var files=this.files,
				info=files[0],//console.log(info);
				reg=/(jpg|jpeg|png|gif)$/;//判断图片格式是否正确
				
				//console.log(container)
			//console.log(info.size+"    "+that.obj.size*1024*1024);
			console.log(info.name);
			if(!reg.test(info.name)){//不符合格式
				var mes="请输入jpg,jpeg,png,gif格式的图片";
			}else{//infoe.size的单位k,1M=1024*1024k
				if(info.size>=that.obj.size*1024*1024){
					var mes="请上传小于"+that.obj.size+"M 的图片";	
				}
			}
			//判断有没有通过检测若mes有内容说明有错
			if(mes){
				$.dialog({
					content:mes,
					btn:["取消"]
				})//未通过检测不执行下面代码
				return false;
			}
			//创建存放上传图片的li元素
			var node=$('<li class="up_img">'
						+'<img src="img/" />'
						+'<a href="javascript:;" class="close">关闭</a>'
					  +'</li>');
			//console.log(that.obj.container);
			node.prependTo(container);
			//统计数量
			that.counter();
			//调用压缩图片的函数()
			that.zipImg({
				files:files,//上面获取的要上传的图片的所有信息
				scale:that.obj.scale,//压缩的比例
				callback:function(zipImg){//压缩成功后的回调，返回结果是压缩后的图片
					//判断压缩后的图片是否是数组，若不是需转换成数组
					//console.log(typeof zipImg);//zipImg是字符串需转数组
					//console.log(zipImg.constructor)
					if(zipImg.constructor!=Array){
						zipImg=[zipImg];//字符串zipImg转成数组
					}
					//将压缩后的图片通过后台程序上传到服务器(封装成函数)
					//转成数组后获取元素，zipImg[0](这里是实参)
					that.upimg(zipImg[0]);
				}
			})			
		})
		//点击x号删除图片(写在change事件之外)
		container.on('tap','a.close',function(){
			$(this).parent().remove();
			that.counter();
		})
	
	},
	//统计数量的方法
	counter:function(){//计算数量
		//计算还可上传数量=总数-已经上传的数量
		//已经上传图片的数量=含有class名为up_img的li的数量
		var up_counter=$('#'+this.obj.counter).find('span'),//console.log(up_counter);
			sum=this.obj.num,//总数
			oldnum=$('.up_img').size();//已经上传的
			//console.log(up_counter.eq(0));
			var m=sum-oldnum;
			//还可上传的
			up_counter.eq(0).text(m);
			up_counter.eq(1).text(oldnum);
			if(oldnum>=sum){
				$('#up').hide();
			}else{
				$('#up').show();
			}
	},
	//压缩图片的方法
	zipImg: function(cfg){
	    /*
	     * cfg.files      input对象触发onchange时候的files
	     * cfg.scale      压缩比例
	     * cfg.callback     压缩成功后的回调
	     */
	     var _this = this;
	     var options = cfg;

	    [].forEach.call(options.files, function(v, k){
	      var fr = new FileReader();  
	      fr.onload= function(e) {  
	        var oExif = EXIF.readFromBinaryFile(new BinaryFile(e.target.result)) || {};
	        var $img = document.createElement('img');                         
	        $img.onload = function(){                 
	          _this.fixDirect().fix($img, oExif, options.callback,options.scale);
	        };  
	        // if(typeof(window.URL) != 'undefined'){
	        //  $img.src = window.URL.createObjectURL(v);
	        // }else{
	        //  $img.src = e.target.result;       
	        // }
	        $img.src = window.URL.createObjectURL(v);
	      };  
	      //fr.readAsDataURL(v);
	      fr.readAsBinaryString(v);
	    }); 
	   },
	   //调整图片方向
	   fixDirect: function(){
	    var r = {};
	    r.fix = function(img, a, callback,scale) {
	      var n = img.naturalHeight,
	        i = img.naturalWidth,
	        c = 1024,
	        o = document.createElement("canvas"),
	        s = o.getContext("2d");
	      a = a || {};
	      //o.width = o.height = c;
	      //debugger;
	      if(n > c || i > c){
	        o.width = o.height = c;
	      }else{
	        o.width = i;
	        o.height = n;
	      }
	      a.Orientation = a.Orientation || 1;
	      r.detectSubSampling(img) && (i /= 2, n /= 2);
	      var d, h;
	      i > n ? (d = c, h = Math.ceil(n / i * c)) : (h = c, d = Math.ceil(i / n * c));
	      // var g = c / 2,
	      var g = Math.max(o.width,o.height)/2,
	        l = document.createElement("canvas");
	      if(n > c || i > c){
	        l.width = g, l.height = g;
	      }else{
	        l.width = i;
	        l.height = n;
	        d = i;
	        h =n;
	      }
	      //l.width = g, l.height = g;
	      var m = l.getContext("2d"), u = r.detect(img, n) || 1;
	      s.save();
	      r.transformCoordinate(o, d, h, a.Orientation);
	      var isUC = navigator.userAgent.match(/UCBrowser[\/]?([\d.]+)/i);
	      if (isUC && $.os.android){
	        s.drawImage(img, 0, 0, d, h);
	      }else{
	        for (var f = g * d / i, w = g * h / n / u, I = 0, b = 0; n > I; ) {
	          for (var x = 0, C = 0; i > x; )
	            m.clearRect(0, 0, g, g), m.drawImage(img, -x, -I), s.drawImage(l, 0, 0, g, g, C, b, f, w), x += g, C += f;
	          I += g, b += w
	        }
	      }
	      s.restore();
	      a.Orientation = 1;
	      img = document.createElement("img");
	      img.onload = function(){
	        a.PixelXDimension = img.width;
	        a.PixelYDimension = img.height;
	        //e(img, a);
	      };
	      
	      callback && callback(o.toDataURL("image/jpeg", scale).substring(22));//压缩图片
	    };
	    r.detect = function(img, a) {
	      var e = document.createElement("canvas");
	      e.width = 1;
	      e.height = a;
	      var r = e.getContext("2d");
	      r.drawImage(img, 0, 0);
	      for(var n = r.getImageData(0, 0, 1, a).data, i = 0, c = a, o = a; o > i; ) {
	        var s = n[4 * (o - 1) + 3];
	        0 === s ? c = o : i = o, o = c + i >> 1
	      }
	      var d = o / a;
	      return 0 === d ? 1 : d
	    };
	    r.detectSubSampling = function(img) {
	      var a = img.naturalWidth, e = img.naturalHeight;
	      if (a * e > 1048576) {
	        var r = document.createElement("canvas");
	        r.width = r.height = 1;
	        var n = r.getContext("2d");
	        return n.drawImage(img, -a + 1, 0), 0 === n.getImageData(0, 0, 1, 1).data[3]
	      }
	      return !1;
	    };
	    r.transformCoordinate = function(img, a, e, r) {
	      switch (r) {
	        case 5:
	        case 6:
	        case 7:
	        case 8:
	          img.width = e, img.height = a;
	          break;
	        default:
	          img.width = a, img.height = e
	      }
	      var n = img.getContext("2d");
	      switch (r) {
	        case 2:
	          n.translate(a, 0), n.scale(-1, 1);
	          break;
	        case 3:
	          n.translate(a, e), n.rotate(Math.PI);
	          break;
	        case 4:
	          n.translate(0, e), n.scale(1, -1);
	          break;
	        case 5:
	          n.rotate(.5 * Math.PI), n.scale(1, -1);
	          break;
	        case 6:
	          n.rotate(.5 * Math.PI), n.translate(0, -e);
	          break;
	        case 7:
	          n.rotate(.5 * Math.PI), n.translate(a, -e), n.scale(-1, 1);
	          break;
	        case 8:
	          n.rotate(-.5 * Math.PI), n.translate(-a, 0)
	      }
	    };
	    return r;
   	},
   	//将压缩后的图片上传到服务器函数
   	upimg:function(zipImg){//通过ajax请求一个php数据库
   		//请求数据
   		//console.log(this.obj.key);
   		var obj={}
   			obj[this.obj.key]=zipImg;//为了设置成键值对
   			//console.log(obj);
   		$.ajax({
   			url:this.obj.url,
   			data:obj,//{img:zipImg}
   			type:"post",
   			success:function(rs){
   				//console.log(typeof rs);//字符串需转化为对象
   				var rs=JSON.parse(rs);//或rs=eval("("+rs+")")//console.log(rs);
   				//将得到的对象rs中的url作为放添加图片的li中的img的属性
   				$('.up_img').first().find('img').attr('src',rs.url);
   			},
   			error:function(){
   				$.dialog({
   					content:"请求失败",
   					btn:['取消']
   				})

   			}
   		})
   	}
}