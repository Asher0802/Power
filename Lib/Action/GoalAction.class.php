<?php
class GoalAction extends CommonAction{
    protected $_title = '产品'; // 当前页的title
    protected $_where="p_status <> 'del'";  //默认查询的条件

    public function _before_index_layout(){
        $this->import(APP_PUBLIC_JS_PATH . 'sunline.js');
    }

    public function index(){
		$this->check_log();
		$this->import(APP_PUBLIC_JS_PATH . 'jquery.mini.js');
		$this->import(APP_PUBLIC_JS_PATH . 'tablescroll.js');
		$this->import(APP_TMPL_PATH.'Goal/main.js');
		$this->import(APP_TMPL_PATH.'Goal/css.css');
		$this->import(APP_TMPL_PATH.'Goal/dedecms.css');
		$this->import(APP_TMPL_PATH.'Goal/layout.css');
		$model_type=M('Type');
		$where_type['t_status']='ok';
		$type=$model_type->where($where_type)->select();
		$model=M('Product');
		$where['p_id']=$_GET['id'];
		$where['p_status']='ok';
		$join=' left join flower_type on t_id=p_type_id left join flower_org on org_id=p_org_id';
		$result=$model->where($where)->join($join)->find();
		$model_comm=M('Comment');
		$where_comm=array(
			'c_product_id'=>$_GET['id'],
			'c_status'=>'ok',
			'c_aud'=>'审核通过'
		);
		$comm=$model_comm->where($where_comm)->select();
		$this->assign('data',$result);
		$this->assign('type',$type);
		$this->assign('comm',$comm);
		$this->display();
	}
	
	public function product_list(){
		$this->check_log();
		$this->import(APP_PUBLIC_JS_PATH . 'jquery.mini.js');
		$this->import(APP_PUBLIC_JS_PATH . 'tablescroll.js');
		$this->import(APP_TMPL_PATH.'Goal/main.js');
		$this->import(APP_TMPL_PATH.'Goal/css.css');
		$model_type=M('Type'); 
		$where_type['t_status']='ok';
		$type=$model_type->where($where_type)->select();
		$model=M('Product');
		$join=' left join flower_type on t_id=p_type_id left join flower_org on org_id=p_org_id';
		$where['p_status']='ok';
		if($_GET['type']){
			$where['p_type_id']=$_GET['type'];
		}
		if(!$_GET['page']){
			$_GET['page']=1;
		}
		$page=($_GET['page']-1)*4;
		$result=$model->where($where)->join($join)->limit($page,4)->select();
		$this->assign('data',$result);
		$this->assign('type',$type);
		$this->assign('page',$_GET['page']);
		$this->display();
	}
	
	function find_product(){
		$this->import(APP_PUBLIC_JS_PATH . 'jquery.mini.js');
		$this->import(APP_PUBLIC_JS_PATH . 'tablescroll.js');
		$this->import(APP_TMPL_PATH.'Goal/main.js');
		$this->import(APP_TMPL_PATH.'Goal/css.css');
		$this->import(APP_TMPL_PATH.'Goal/dedecms.css');
		$this->import(APP_TMPL_PATH.'Goal/layout.css');
		$model_type=M('Type');
		$where_type['t_status']='ok';
		$type=$model_type->where($where_type)->select();
		$model=M('Product');
		$where['p_name']=array('like','%'.$_POST['p_name'].'%');
		$where['p_status']='ok';
		$result=$model->where($where)->find();
		$model_comm=M('Comment');
		$where_comm=array(
			'c_product_id'=>$_GET['id'],
			'c_status'=>'ok',
			'c_aud'=>'审核通过'
		);
		$comm=$model_comm->where($where_comm)->select();
		$this->assign('data',$result);
		$this->assign('type',$type);
		$this->assign('comm',$comm);
		$this->display('index');
	}


}