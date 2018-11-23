<?php
return array(
	//'配置项'=>'配置值'
	'DB_TYPE'               => 'mysqli',     // 数据库类型
    'DB_HOST'               => 'localhost', // 服务器地址
    'DB_NAME'               => 'flower',          // 数据库名
    'DB_USER'               => 'root',      // 用户名
    'DB_PWD'                => '',          // 密码
    'DB_PORT'               => '',        	// 端口
    'DB_PREFIX'             => 'flower_',    	// 数据库表前缀
	'TMPL_ENGINE_TYPE'		=> 'Smarty',	//模板引擎
    'TITLE_VAL'             => '绝对领域',     //设置title名称
    'TMPL_PATH'             => '',
	
	//发送邮件配置
	'MAIL_HOST' =>'smtp.exmail.qq.com',
	'MAIL_SMTPAUTH'  =>TRUE, //启用smtp认证
	'MAIL_USERNAME'  =>'476794913@qq.com',
	'MAIL_FROM'  =>'476794913@qq.com',
	'MAIL_FROMNAME'  =>'Asher',
	'MAIL_PASSWORD'  =>'w15110357976',
	'MAIL_CHARSET'  =>'utf-8',
	'MAIL_ISHTML'  =>TRUE, // 是否HTML格式邮件
	
	'SHOW_PAGE_TRACE'=>true,
);
?>