<?php
class UserAction extends CommonAction {
	protected $_title='用户管理';
	protected $_where=' u_status <> "del" ';
	protected $_likelist=array('u_realname','u_name');
	protected $_delTrue=false;
	protected $_table='User';
	protected $_delStatus=array('u_status'=>'del');

    function index(){
		$this->check_log();
        $this->importExt5js();
		$this -> importMainJs();
        $this->import(APP_TMPL_PATH.'User/user.js');
		$data='进入用户管理模块-UserAction-index';
		$this->set_log($data);
        $this->display('_layout:main');
    }

    function before_save(){
		$model=M('User');
		$where['u_name']=$_POST['u_name'];
		$where['u_status']='ok';
		if($_POST['u_id']){
			$where['u_id']=array('neq',$_POST['u_id']);
		}else{
			$_POST['u_time']=time();
		}
		$result=$model->where($where)->find();
		if($result){
			$this->error('该账号已存在！');
		}
		
	}

}