<?php /* Smarty version Smarty-3.1.6, created on 2018-03-08 15:20:54
         compiled from "C:\Users\Asher\Documents\GitHub\Power\Tpl\_layout\header.html" */ ?>
<?php /*%%SmartyHeaderCode:3211183615aa0e4566951d9-92537484%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'fa2034d24045ecdecf67f5627d3867eb0fdfac62' => 
    array (
      0 => 'C:\\Users\\Asher\\Documents\\GitHub\\Power\\Tpl\\_layout\\header.html',
      1 => 1502320201,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '3211183615aa0e4566951d9-92537484',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'TITLE_VAL' => 0,
    '_HEAD_CSS_JS' => 0,
    'v' => 0,
    '_javaScript' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.6',
  'unifunc' => 'content_5aa0e45682531',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5aa0e45682531')) {function content_5aa0e45682531($_smarty_tpl) {?><html>
<head>
    <title><?php echo $_smarty_tpl->tpl_vars['TITLE_VAL']->value;?>
</title>
    <meta charset = "utf-8"/>
    <?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['_HEAD_CSS_JS']->value['css']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
    <link rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['v']->value;?>
">
    <?php } ?>
    <?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['_HEAD_CSS_JS']->value['js']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
    <script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['v']->value;?>
"></script>
    <?php } ?>
	<script type = "text/javascript">
		<?php  $_smarty_tpl->tpl_vars['v'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['v']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['_javaScript']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['v']->key => $_smarty_tpl->tpl_vars['v']->value){
$_smarty_tpl->tpl_vars['v']->_loop = true;
?>
			<?php echo $_smarty_tpl->tpl_vars['v']->value;?>

		<?php } ?>
	</script>
</head>
<body><?php }} ?>