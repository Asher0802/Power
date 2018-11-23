<?php /* Smarty version Smarty-3.1.6, created on 2018-03-08 16:51:32
         compiled from "./Tpl\Goal\index.html" */ ?>
<?php /*%%SmartyHeaderCode:507938015aa0f994688d99-61456435%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '6278f80605080560671a679c87a230ccad5b5b25' => 
    array (
      0 => './Tpl\\Goal\\index.html',
      1 => 1502320860,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '507938015aa0f994688d99-61456435',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'type' => 0,
    'row' => 0,
    'data' => 0,
    'comm' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.6',
  'unifunc' => 'content_5aa0f994e4ce4',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_5aa0f994e4ce4')) {function content_5aa0f994e4ce4($_smarty_tpl) {?>﻿<?php echo $_smarty_tpl->getSubTemplate ('../_layout/header.html', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

<body>
<table width="992" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td style='width:628;height:88;background:#386C00'>
	<span style='color:#fff;margin-left:30px;font-size:45px;font-weight:bold;'>太原花木信息网</span>
	</td>
    <td width="364" height="88" align="center" valign="top" background="/Power/Public/Images/index_r1_c21.jpg"><table width="200" border="0" cellspacing="0" cellpadding="0">
    </table></td>
  </tr>
</table>

<table width="992" border="0" align="center" cellpadding="0" cellspacing="0" class="mag2">
  <tr>
    <td>  <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="992" height="250">
           <param name="movie" value="flash/top.swf" />
           <param name="quality" value="high" />
		   <param name="wmode" value="opaque" />  <param name="wmode" value="transparent" /> 
           <param name="wmode" value="opaque" />
           <embed src="/Power/Public/Images/top.swf" quality="high" wmode="opaque" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="992" height="250"></embed>
      </object></td>
  </tr>
</table>
<table width="992" border="0" align="center" cellpadding="0" cellspacing="0" class="mag4">
  <tr>
    <td align="left" valign="top"><table width="212" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td height="38" align="right" background="/Power/Public/Images/ny_r2_c2.jpg"></td>
  </tr>
</table>
<table width="212" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td height="156" align="center" valign="top" class="bg3">
	<?php  $_smarty_tpl->tpl_vars['row'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['row']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['type']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['row']->key => $_smarty_tpl->tpl_vars['row']->value){
$_smarty_tpl->tpl_vars['row']->_loop = true;
?>
		<table width="180" border="0" cellspacing="0" cellpadding="0" class="mag2">
      <tr>
        <td width="28"><img src="/Power/Public/Images/ny_r4_c3.jpg" width="28" height="27" /></td>
        <td align="left" background="/Power/Public/Images/ny_r4_c4.jpg" class="green_link pad5"><a href="product_list?type=<?php echo $_smarty_tpl->tpl_vars['row']->value['t_id'];?>
" title="<?php echo $_smarty_tpl->tpl_vars['row']->value['t_name'];?>
"style="color:orange;"><?php echo $_smarty_tpl->tpl_vars['row']->value['t_name'];?>
</a></td>
      </tr>
    </table>
	<?php } ?>   
     </td>
  </tr>
</table>
<table width="212" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td><img src="/Power/Public/Images/ny_r6_c2.jpg" width="212" height="22" /></td>
  </tr>
</table>
<table width="212" border="0" cellspacing="0" cellpadding="0" class="mag6">
  <tr>
    <td><a href="" title="联系方式"><img src="/Power/Public/Images/index_r29_c2.jpg" width="212" height="50" border="0" /></a></td>
  </tr>
</table>
<table width="212" border="0" cellspacing="0" cellpadding="0" class="mag6">
  <tr>
    <td><a href="" title="请您留言"><img src="/Power/Public/Images/index_r31_c2.jpg" width="212" height="50" border="0" /></a></td>
  </tr>
</table>

</td>
    <td align="right" valign="top"><table width="763" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td height="30" align="left" class="yl yl_link pad4">您当前位置：<a href="product_list" title="首页">首页</a>&gt;<a href="" title="产品展示">产品展示</a></td>
        <td align="right"><table width="270" border="0" cellspacing="0" cellpadding="0">
        <form id="search" method="post" action="find_product" style="margin:0;">
          <tr>
            <td width="40%" align="center" class="yll">站内搜索：</td>
            <td width="46%" align="center"><input style='height:25px;' name="p_name" type="text" class="input1" value="产品搜索" /></td>
            <td width="14%" align="center"><input type="submit" class="btn" value="" /></td>
          </tr>
        </form>
        </table></td>
      </tr>
    </table>
    <table width="763" border="0" cellspacing="0" cellpadding="0" class="mag4">
        <tr>
          <td width="11"><img src="/Power/Public/Images/index_r6_c6.jpg" width="11" height="30" /></td>
          <td background="/Power/Public/Images/index_r6_c14.jpg"><table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td width="3%" align="left"><img src="/Power/Public/Images/index_r6_c10.jpg" width="7" height="30" /></td>
                <td width="97%" align="left" class="blue">产品展示</td>
              </tr>
          </table></td>
          <td width="11" background="/Power/Public/Images/index_r6_c22.jpg">&nbsp;</td>
        </tr>
      </table>
      <table width="763" border="0" cellspacing="0" cellpadding="0" class="mag2">
        <tr>
          <td height="30" align="center" class="yll" style="font-size:23px; font-weight:bold;"><?php echo $_smarty_tpl->tpl_vars['data']->value['p_name'];?>
</td>
        </tr>
      </table>        
      <table width="763" border="0" cellspacing="0" cellpadding="0" class="mag2">
        <tr>
          <td width="702" height="528" align="left" valign="top">
            <table width="100%" border="0" cellspacing="10" cellpadding="0">
              <tr>
                <td height="30" align="center"><img class="PicLoad bor" maxwidth="600" showtime="" src="/Power<?php echo $_smarty_tpl->tpl_vars['data']->value['p_img'];?>
" alt="<?php echo $_smarty_tpl->tpl_vars['data']->value['p_name'];?>
" /></td>
              </tr>
            </table>
			<div style="width:100%;height:20px;"></div>
            <table width="100%" border="0" cellspacing="0">
				<tr>
					<td>产地:<?php echo $_smarty_tpl->tpl_vars['data']->value['p_addr'];?>
</td>
				</tr>
				<tr>
					<td>推荐价格:<?php echo $_smarty_tpl->tpl_vars['data']->value['p_price'];?>
元/颗</td>
				</tr>
				<tr>
					<td>所属公司:<?php echo $_smarty_tpl->tpl_vars['data']->value['org_name'];?>
<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=<?php echo $_smarty_tpl->tpl_vars['data']->value['org_qq'];?>
&site=qq&menu=yes">
                <img border="0" src="http://wpa.qq.com/pa?p=2:<?php echo $_smarty_tpl->tpl_vars['data']->value['org_qq'];?>
:52" title="联系人：<?php echo $_smarty_tpl->tpl_vars['data']->value['org_name'];?>
"
                     style="width:25px;height:25px;vertical-align: bottom;"/>
            </a>
            <span style="vertical-align: bottom;">有事请Q我!</span>
            </td>
				</tr>
				<tr style='height:20px;'> 
				</tr>
				<tr>
					<td><h1>描述</h1></td>
				</tr>
				<tr>
					<td align="left" class="yl pad2">
						<h2>&nbsp;&nbsp;<?php echo $_smarty_tpl->tpl_vars['data']->value['p_remark'];?>
</h2>
					</td>
				</tr>
            </table>
			<div style="width:763;height:20px;"></div>
			<div class=" clear center mt1 cmt-box" style="background:#fff;">
				<div width="763">
					<dl class="tbox" width="763">
						<dt>
							<strong>评论列表（网友评论仅供网友表达个人看法，并不表明本站同意其观点或证实其描述）</strong>
						</dt>
						<dd>
							<div class="dede_comment">
								<div class='decmt-box1'>
									<?php if ($_smarty_tpl->tpl_vars['comm']->value==''){?>
										暂无评论
									<?php }?>
									<ul>
									<?php  $_smarty_tpl->tpl_vars['row'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['row']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['comm']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['row']->key => $_smarty_tpl->tpl_vars['row']->value){
$_smarty_tpl->tpl_vars['row']->_loop = true;
?>
									<li>	
								<span class="title"> 游客</span>
								<div class="comment_act">
									<span class="fr">
										<span id='goodfb30'>
											<a style='display:none;' href="#" onclick="postBadGood('goodfb',30)">支持</a>
										</span>
									</span>
									</span><?php echo date('Y-m-d H:i:s',$_smarty_tpl->tpl_vars['row']->value['c_time']);?>
发表
								</div>			
								<p><?php echo $_smarty_tpl->tpl_vars['row']->value['c_content'];?>
</p>
							</li>
							<?php } ?>
						</ul>
					</div>
				</div>
			</dd>
		</dl>
	</div>
	<div class="mt1" width="763">
		<dl class="tbox" style='width:600px;'>
			<dt>
				<strong>发表评论</strong>
			</dt>
			<dd>
				<div class="dede_comment_post">
				<form action="/Power/index.php/Comment/save" method="post" name="feedback">
					<input type="hidden" name="c_product_id" value="<?php echo $_smarty_tpl->tpl_vars['data']->value['p_id'];?>
" />
                    <div class="dcmp-title">
						<small>请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。</small>
					</div>
				    <div class="dcmp-content1">
						<textarea cols="100" name="c_content" rows="5" class="ipt-txt"></textarea>
					</div>					
					<div class="dcmp-post">
						<button type="submit" class="btn-2">发表评论</button>
					</div>
					</div>
                    </form>
				</div>
			</dd>
		</dl>
	</div>
</div>
	<table border="0" cellspacing="0" cellpadding="0" class="mag2">
		<table width="763" border="0" cellspacing="0" cellpadding="0" class="mag2">
			<tr>
				<td width="702" height="28" align="center" class="yl_link"><a href="javascript:window.history.back();" title="返回">[ 返回 ]</a></td>
			</tr>
		</table>
	</table>
	  </td>
  </tr>
</table>
<table width="1002" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td height="143" align="center" valign="bottom" background="/Power/Public/Images/index_r34_c1.jpg" class="witt"><table width="992" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td height="80" align="center" class="witt witt_link" >地址：山西省太原市中北大学 &nbsp;&nbsp;电话：0312-2551905&nbsp;&nbsp;  手机：15110357976<br />
      地址：山西省太原市中北大学  技术支持：<a href="http://www.baidu.com/" target="_blank" title="盘古网络－提供基于互联网的全套解决方案！" style="color:#FFF">盘古网络</a> <a href="http://ks.pangu.us/" target="_blank" title="盘古建站－快速展开网络营销的利器！" style="color:#FFF">[盘古建站]</a>　　<a href="http://www.miitbeian.gov.cn/" target="_blank" title="ICP备案编号：冀ICP备10007191号 " style="color:#FFF">ICP备案编号：冀ICP备10007191号 </a></td>
      </tr>
    </table></td>
  </tr>
</table>
</body>
</html>
<?php }} ?>