<?php /* Smarty version Smarty-3.1.6, created on 2018-03-08 15:20:53
         compiled from "./Tpl\Login\index.html" */ ?>
<?php /*%%SmartyHeaderCode:5429866925aa0e4557d30e0-78221584%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'd2f1d91dd514d2f68351f6b93138636a9c59006a' => 
    array (
      0 => './Tpl\\Login\\index.html',
      1 => 1502320580,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '5429866925aa0e4557d30e0-78221584',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.6',
  'unifunc' => 'content_5aa0e456452bf',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5aa0e456452bf')) {function content_5aa0e456452bf($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('../_layout/header.html', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

<body>
<div id="logoo" style='display:none'>
    <img src="__PUBLIC__/Images/Home/login_logo.png">
</div>
<form action="<?php echo U('Login/login');?>
" method="post">
    <div id="co-box">
        <div class="head">
            <div class="text">用户名/账号登录</div>
        </div>
        <div class="content">
            <i class="fa fa-user"></i>
            <i class="fa fa-lock"></i>
            <i class="fa fa-qrcode" id="fa-qrcode"></i>
            <input type="text" id="user" name="u_name" class="in-box" placeholder="已验证手机/用户名">
            <input type="password" id="password" name="u_password" class="in-box" placeholder="密码">
            <input type="text" id="capt" name="capt" placeholder="验证码">
            <div class="yzm-img" id="yzm-img_id">
                <img src="__APP__/Login/getVerify " id = "code" alt=""/>看不清？换一张
                <div id="kanbudao">点击显示</div>
            </div>
        </div>
        <div class="link">
            <span class="link-reg"><a href="">忘记登录密码？</a></span>
            <span ><a href="javascript:;" id = "sub">免费注册</a></span>
        </div>
        <input type="submit" class="button" id="login_click" value="登       录"  name="login_submit">
        <div class="button-div" id="input_button_div">正在登录 . . .</div>
        <div class="login-msg" id="login-msg_id"></div>
    </div>
</form>
<div id="lo-bottom">
    <div class="bo-cen">
        <div class="bo-list">版权所有：绝对领域</div>
        <div class="bo-list">技术支持：绝对领域</div>
        <div class="bo-list">网站备案号：赣ICP备15006270号-1</div>
        <div class="clear"></div>
    </div>
</div>

</body>
</html>
<?php }} ?>