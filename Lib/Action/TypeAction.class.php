<?php
class TypeAction extends CommonAction {
	protected $_title='分类管理';
	protected $_where=' t_status <> "del" ';
	protected $_delTrue=false;
	protected $_table='Type';
	protected $_delStatus=array('t_status'=>'del');

    function index(){
		$this->check_log();
        $this->importExt5js();
		$this -> importMainJs();
        $this->import(APP_TMPL_PATH.'Type/type.js');
        $this->display('_layout:main');
    }
	
	function before_save(){
		$model=M('Type');
		$where['t_name']=$_POST['t_name'];
		$where['t_status']='ok';
		if($_POST['t_id']){
			$where['t_id']=array('neq',$_POST['t_id']);
		}else{
			$_POST['t_time']=time();
		}
		$result=$model->where($where)->find();
		if($result){
			$this->error('该分类已存在！');
		}	
	}
	
}