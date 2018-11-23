<?php

/*
*自己玩的函数
*/
class TestAction extends CommonAction{
 
	function test(){
		$result=file_get_contents('http://www.baidu.com/search');
		file_put_contents('test.txt',$result);
		if(!$result){
			echo '查不到东西啊';
		}else{
			var_dump($result);
		}
	}

	function return_data(){
		//echo 11111;
		var_dump($data=0);
	}

	function index(){
		$data=file_get_contents('Log/10_10.txt');
		$data=explode(',',$data);
		var_dump($data);
	}

	function html(){
		$this->import(APP_PUBLIC_JS_PATH . 'jquery.mini.js');
		$this->import(APP_TMPL_PATH.'Test/index.js');
		$this->display('_layout:main');
	}
	
	function mls(){
		$arr1=array(
			'one'=>'apple',
			'two'=>'oringe',
			'three'=>'pen',
			'four'=>'sex'
		);
		
		$arr2=array(
			'one'=>'apple',
			'two'=>'haha',
			'five'=>'pen'
		);
		
		var_dump(array_slice($arr1,3));
		echo '<br>';
		var_dump($arr1);
		echo '<br>';

		var_dump(array_intersect($arr1,$arr2));
		echo '<br>';
		var_dump(array_intersect_assoc($arr1,$arr2));
		echo '<br>';
		var_dump(each($arr1));
		echo '<br>';
		var_dump(array_shift($arr2));
		echo  '<br>';
		
	}
	
	
	/*
		发送邮件
		$to 邮件地址  $msg 邮件内容
	*/
	function set_mail($to='476794913@qq.com',$msg='我的第一封邮件'){
		
		$subject='HTML email';
			
		$header="MIME-Version:1.0".'\r\n';
		$header.="Content-type:text/html;charset=utf-8".'\r\n';
		
		$header.="Form:<webmaster@example.com>".'\r\n';
		$header.='Cc:,myboss@ecample.com'.'\r\n';
		
		$msg=str_replace("\n.","\n..",$msg);
		
		if(!mail($to,$subject,$msg,$header)){
			$this->set_log('发送邮件失败');
		}
	} 
	
	//array_filp 数组键值互换函数
	function fore(){
		$arr=array(
			'a'=>'asher',
			'l'=>'Leo',
			'i'=>'Ice'
		);
		$return=array_flip($arr);
		var_dump($arr);
		echo '<br>';
		var_dump($return);
		echo '<br>';
		$return=array_flip($return);
		var_dump($return);
	}

	//正则验证
	function rega(){
		$aaa=preg_match('/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/','wwqY111,');
		var_dump($aaa);
	}
	
	//去除空格
	function myTrim($str)
	{
		$search = array(" ","　","\n","\r","\t");
		$replace = array("","","","","");
		return str_replace($search, $replace, $str);
	}

	function check(){
		$rst=$this->return_data();
		var_dump(empty($rst[0]));
	}
	function aaa(){
		$arr=array(
			'-1'=>'000'
		);
		$frr[-1]='aaaaa';
		$err=array(
			
			'2'=>'bbb',
			'0'=>'ccc'
		);
		$brr=array(
			'0'=>'vvv'
		);
		foreach($frr as $key=>$row){
			echo $key.'-'.$row;
			echo '<br>';
		}
		
		$crr=array_merge($brr,$arr);
		ksort($arr);
		var_dump($arr);
	}
	
	function sex(){
		$aaa=array('msg'=>'1','aa'=>'2');
		echo "aaaaaa".print_r($aaa);
	}
	
	
	//使用addAll是 每个数组的字段必须相同 不然会失败
	function insert_array(){
		$model=M('User');
		$add=array(array(
			'u_id'=>'1,2,3,4','u_name'=>'asher1','u_realname'=>'哈哈'
			)	
		);
		$result=$model->addAll($add,'','u_name,u_realname');
		echo M()->_sql();
		var_dump($result);
		echo 111;		
	}
	
	/*
		将数组中唯一的分一个数组，不唯一的分另一个数组
	*/
	/*function check_data(){
		$arr=[1,1,2,3,2,4];
		$brr=array_unique($arr);
		foreach($brr as $key=>$row){
			foreach($arr as $k=>$r){
				if($key!=$k){
					$crr[]=$r
				}
			}
		}
		$crr=array_unique($crr);
		$err=array_diff($crr,$brr);
	}
	*/
	
	//使用substr 会出现截取乱码，使用mb_substr不会出现，后者可以设置编码，有默认值
	function check_str(){
		echo '是aa';
		$aa=substr('是aa',0,2);//乱码
		$bb=mb_substr('是aa',0,2,'utf-8');
		
		echo substr('是aa',0,1);
		echo "<br>";
		echo mb_substr('是aa',0,1);
		
	}
	
	//倒计时
	function make_countdown(){
		date_default_timezone_set('Asia/Hong_Kong');
		$startTime = '09:00:00';
		$endTime = '18:00:00';
		 
		// 将时间转化为unix时间戳
		$startTimeStr = strtotime($startTime);
		$endTimeStr = strtotime($endTime);
		$total = $endTimeStr - $startTimeStr;
		 
		$restHours = 1; // 休息1小时
		 
		$now = strtotime(date('H:i:s'));
		$remain = $endTimeStr - $now;
		 
		echo '上班时间：'.($total/3600-$restHours).'小时<br>';
		echo '还有：'.floor(($remain/3600)).'小时'.floor($remain/60).'分钟下班';		
	}
	
	//合并数组
	function merge_arr(){
		$arr1=array(
			'1'=>1111,
			'2'=>2222,
			'3'=>3333
		);
		
		$arr2=array(
			'1'=>'aaaa',
			'2'=>'bbbb',
			'3'=>'cccc'
		);
		
		$arr3=array_merge($arr1,$arr2);
		var_dump($arr3);
	
	}
	
	//查询linux服务器使用情况
	function get_used_status(){
	  $fp = popen('top -b -n 2 | grep -E "^(Cpu|Mem|Tasks)"',"r");//获取某一时刻系统cpu和内存使用情况
	  $rs = "";
	  while(!feof($fp)){
	   $rs .= fread($fp,1024);
	  }
	  pclose($fp);
	  $sys_info = explode("\n",$rs);
	  $tast_info = explode(",",$sys_info[3]);//进程 数组
	  $cpu_info = explode(",",$sys_info[4]);  //CPU占有量  数组
	  $mem_info = explode(",",$sys_info[5]); //内存占有量 数组
	  //正在运行的进程数
	  $tast_running = trim(trim($tast_info[1],'running'));
	  //CPU占有量
	  $cpu_usage = trim(trim($cpu_info[0],'Cpu(s): '),'%us');  //百分比
	  //内存占有量
	  $mem_total = trim(trim($mem_info[0],'Mem: '),'k total'); 
	  $mem_used = trim($mem_info[1],'k used');
	  $mem_usage = round(100*intval($mem_used)/intval($mem_total),2);  //百分比
	  
	  /*硬盘使用率 begin*/
	  $fp = popen('df -lh | grep -E "^(/)"',"r");
	  $rs = fread($fp,1024);
	  pclose($fp);
	  $rs = preg_replace("/\s{2,}/",' ',$rs);  //把多个空格换成 “_”
	  $hd = explode(" ",$rs);
	  $hd_avail = trim($hd[3],'G'); //磁盘可用空间大小 单位G
	  $hd_usage = trim($hd[4],'%'); //挂载点 百分比
	  //print_r($hd);
	  /*硬盘使用率 end*/  
	  //检测时间
	  $fp = popen("date +\"%Y-%m-%d %H:%M\"","r");
	  $rs = fread($fp,1024);
	  pclose($fp);
	  $detection_time = trim($rs);
	  /*获取IP地址  begin*/
	  /*
	  $fp = popen('ifconfig eth0 | grep -E "(inet addr)"','r');
	  $rs = fread($fp,1024);
	  pclose($fp);
	  $rs = preg_replace("/\s{2,}/",' ',trim($rs));  //把多个空格换成 “_”
	  $rs = explode(" ",$rs);
	  $ip = trim($rs[1],'addr:');
	  */
	  /*获取IP地址 end*/
	  /*
	  $file_name = "/tmp/data.txt"; // 绝对路径: homedata.dat 
	  $file_pointer = fopen($file_name, "a+"); // "w"是一种模式，详见后面
	  fwrite($file_pointer,$ip); // 先把文件剪切为0字节大小， 然后写入
	  fclose($file_pointer); // 结束
	  */
		$return=array(
			'cpu_usage'=>$cpu_usage,
			'mem_usage'=>$mem_usage,
			'hd_avail'=>$hd_avail,
			'hd_usage'=>$hd_usage,
			'tast_running'=>$tast_running,
			'detection_time'=>$detection_time
		);
		var_dump($return);
	}

	
	//合并数组的两个
	function test_array(){
		$arr=array(
			'11'=>111,
			'222'=>'222',
			'anc'=>2222
		);
		$brr=array(
			'111'=>11111,
			'abd'=>'aasd'
		);
		
		$crr=array_merge_recursive($arr,$brr);
		$drr=$arr+$brr;
		var_dump($crr);
		echo "<br>";
		var_dump($drr);
		
	}
	
	//防止xss攻击 使用htmlspecialchars对输出的文本进行原样输出
	function change_html(){
		$str='<script>alert("xss攻击")</script>';
		echo $str;
		echo htmlspecialchars($str);
	}

	
}