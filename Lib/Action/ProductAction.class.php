<?php
class ProductAction extends CommonAction {
	protected $_title='产品管理';
	protected $_where=' p_status <> "del" ';
	protected $_delTrue=false;
	protected $_table='Product';
	protected $_delStatus=array('p_status'=>'del');
	protected $_likelist=array('p_name');
	protected $_field='flower_type.t_name,flower_type.t_id as p_type_id,flower_org.org_name,flower_org.org_id as p_org_id,flower_product.*'; 
	protected $_join=' left join flower_org on org_id=p_org_id left join flower_type on t_id=p_type_id';

    function index(){
		$this->check_log();
		$this->importFa();
        $this->importExt5js();
		$this -> importMainJs();
        $this->import(APP_TMPL_PATH.'Product/product.js');
        $this->display('_layout:main');
    }
	
	function before_save(){
		$model=M('Product');
		$where['p_name']=$_POST['p_name'];
		if($_POST['p_id']){
			$where['p_id']=array('neq',$_POST['p_id']);
		}else{
			$_POST['p_time']=time();
		}
		$result=$model->where($where)->find();
		if($result){
			$this->error('该分类已存在！');
		}	
	}

}