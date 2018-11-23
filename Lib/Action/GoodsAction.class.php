<?php
class GoodsAction extends CommonAction {
	protected $_title='货品类型管理';
	protected $_where=' c_status <> "del" ';
	protected $_delTrue=false;
	protected $_table='Class';
	protected $_delStatus=array('c_status'=>'del');

    function index(){
		$this->check_log();
        $this->importExt5js();
		$this -> importMainJs();
        $this->import(APP_TMPL_PATH.'Goods/Goods.js');
        $this->display('_layout:main');
    }
	
/*
	function before_save(){
		$model=M('Org');
		$where['org_name']=$_POST['org_name'];
		if($_POST['org_id']){
			$where['org_id']=array('neq',$_POST['org_id']);
		}else{
			$_POST['org_time']=time();
		}
		$result=$model->where($where)->find();
		if($result){
			$this->error('该公司名已存在！');
		}
		
	}
*/

}