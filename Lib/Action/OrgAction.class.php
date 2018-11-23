<?php
class OrgAction extends CommonAction {
	protected $_title='公司管理';
	protected $_where=' org_status <> "del" ';
	protected $_likelist=array('org_name');
	protected $_delTrue=false;
	protected $_table='Org';
	protected $_delStatus=array('org_status'=>'del');

    function index(){
		$this->check_log();
        $this->importExt5js();
		$this -> importMainJs();
        $this->import(APP_TMPL_PATH.'Org/org.js');
        $this->display('_layout:main');
    }
	

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

}