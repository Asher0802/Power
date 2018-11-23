

	//自己玩的模块
	
	var arr1={'1':'1','2':'2','3':'3','4':'4'};
	var arr2={'1':'1','2':'2','3':'3','4':'4'};
	var arr3={'1':'1','2':'2','3':'3','4':'4'};
	var arr4={'1':'1','2':'2','3':'3','4':'4'};
	var arr5={'1':'1','2':'2','3':'3','4':'4'};
	
	//var make_arr=['1'=>'2','3'=>'4'];    这里是一个错误的例子，js创建的数组不能有索引？
	//console.log(make_arr);

	var arr=[arr1,arr2,arr3,arr4,arr5];
	console.log(arr);
	console.log(arr.length);
	delete arr[1];
	console.log(arr.length);
	console.log(arr);

	delete arr[4];
	console.log(arr);
	console.log(arr.length);
	
	//浏览器对象
	console.log(navigator);
	console.log(navigator.userAgent);
	
	//创建方法对象
	var aa=function test(str){
		alert(str);
	}
	
	//jquery扩展方法
	$.extend({
		bb:function(str){
			alert(str);
		}
	});
	
	//函数作为参数传递
	function bb(str,test){
		if(str){
			test(str);
		}
	}
	
	bb('123',$.bb);
	
	//正则验证
	var str=/^[0-9]$/;
	alert(str.test(1));
	
	
	function check(str){
		var arr=[0,1,2,3,4,5,6,7,8,9];
		for(var i=0;i<arr.length;i++){
			if(str==arr[i]){
				return true;
			}
		}
		return false;
	}
	
	alert(check(1));
	
	var data='{"stockout_no":"1-200","0":"100-100","status":"1-100","src_order_type":"1-150","src_order_no":"1-100","operator_id":"1-100","logistics_id":"1-100","logistics_no":"1-100","warehouse_name":"1-100","post_cost":"1-100","goods_count":"1-100","goods_type_count":"1-100","remark":"1-100","created":"1-100","consign_time":"1-100"}';
	alert(data.length);
	

	
	
	