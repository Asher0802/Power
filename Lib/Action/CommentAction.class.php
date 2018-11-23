<?php
class CommentAction extends CommonAction {
	protected $_title='评论管理';
	protected $_where=' c_status <> "del" ';
	protected $_delTrue=false;
	protected $_table='Comment';
	protected $_likelist=array('p_name','c_content');
	protected $_delStatus=array('c_status'=>'del');
	protected $_field=' flower_product.p_name,flower_comment.* ';
	protected $_join=' left join flower_product on p_id=c_product_id ';


    function index(){
		$this->check_log();
        $this->importExt5js();
		$this -> importMainJs();
        $this->import(APP_TMPL_PATH.'Comment/comment.js');
        $this->display('_layout:main');
    }

	function save(){
		$model=M('Comment');
		$_POST['c_time']=time();
		if(!$_POST['c_content']){
			echo "<script language='javascript'>alert('请先填写评论信息！');</script>";
			echo "<script language='javascript'>location.href='../Goal/index?id=".$_POST['c_product_id']."';</script>";
			exit;
		}
		$result=$model->add($_POST);
		if($result==false){
			echo "<script language='javascript'>alert('评论失败！');</script>";	
		}else{
			echo "<script language='javascript'>alert('评论成功，请等待审核');</script>";
		}
		echo "<script language='javascript'>location.href='../Goal/index?id=".$_POST['c_product_id']."';</script>";
	}
	
	function aud_status(){
		$model=M('Comment');
		$save['c_aud']=$_POST['act'];
		$where['c_id']=$_POST['c_id'];
		$result=$model->where($where)->save($save);
		if($result===false){
			$this->error('审核操作失败');
		}
		$this->success('审核操作成功');
	}
	
}