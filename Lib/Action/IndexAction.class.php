<?php
// 本类由系统自动生成，仅供测试用途
class IndexAction extends CommonAction {

    public function index(){
		$this->check_log();
        $this->import(APP_PUBLIC_JS_PATH.'jquery.mini.js');
		$this->import(APP_PUBLIC_CSS_PATH.'debug.css');
		$this->import(APP_PUBLIC_CSS_PATH.'tabIcon.css');
        $this->importExt5js();
        $this->importFa();
		$this->import(APP_PUBLIC_CSS_PATH.'style.css');
        $this->import(APP_TMPL_PATH.'Index/index.js');
		$rst=$this->main_menu();
		//$rst=$this->main_menu();
		$this->push_script('var __main_menu = '.json_encode($rst).';');
		$this->push_script('var username = "'.$_SESSION['user'].'";');
		$this->push_script('var logout_url = "'.U('Login/logout').'";');
		$this->_layout();
    }

	//数据库获取菜单
	public function get_menu_form_db(){
		$model=M('Menu');
		$where=array(
			'status'=>'ok'
		);
		$result=$model->where($where)->select();
		if(!$result){
			$msg='系统错误，拉取不到菜单数据';
			//$this->error($msg);
			//$this->set_log($msg);
		}
		$menu=array();
		foreach($result as $row){
			if($row['m_parent']==0){
				$menu[$row['m_id']]=array(
					'id'=>$row['m_id'],
					'text'=>$row['m_text'],
					'pic'=>$row['m_pic'],
					'icon'=>$row['m_icon'],
					'module'=>$row['m_module'],
					'action'=>$row['m_action'],
					'parent'=>$row['m_parent'],
					'type'=>$row['m_type'],
					'ismenu'=>$row['m_ismenu'],
					'_layer'=>0
				);
			}else{
				$menu[$row['m_parent']]['children'][]=array(
					'id'=>$row['m_id'],
					'text'=>$row['m_text'],
					'pic'=>$row['m_pic'],
					'icon'=>$row['m_icon'],
					'module'=>$row['m_module'],
					'action'=>$row['m_action'],
					'parent'=>$row['m_parent'],
					'type'=>$row['m_type'],
					'ismenu'=>$row['m_ismenu'],
					'_layer'=>1
				);
			}
		}
		$menu=array_values($menu);
		return $menu;
	}
	
	
	//固定菜单设置
	public function main_menu(){
		$rst=array();
		$rst[]=array(
			'id'=>1,
			'text'=>'用户中心',
			'pic'=>1,
			'icon'=>'fa-users',
			'module'=>'B',
			'action'=>'i',
			'parent'=>0,
			'type'=>0,
			'ismenu'=>'yes',
			'_layer'=>0,
			'children'=>array(
				'id'=>11,
				'text'=>'用户管理',
				'pic'=>'',
				'icon'=>'fa-user',
				'module'=>'User',
				'action'=>'index',
				'parent'=>1,
				'type'=>1,
				'ismenu'=>'yes',
				'_layer'=>1
			)
		);
		$rst[]=array(
			'id'=>2,
			'text'=>'产品中心',
			'pic'=>1,
			'icon'=>'fa-calendar-o',
			'module'=>'B',
			'action'=>'i',
			'parent'=>0,
			'type'=>0,
			'ismenu'=>'yes',
			'_layer'=>0,
			'children'=>[array(
				'id'=>21,
				'text'=>'产品管理',
				'pic'=>'',
				'icon'=>'fa-bar-chart',
				'module'=>'Product',
				'action'=>'index',
				'parent'=>2,
				'type'=>1,
				'ismenu'=>'yes',
				'_layer'=>1
			),array(
				'id'=>22,
				'text'=>'产品分类',
				'pic'=>'',
				'icon'=>'fa-list-ul',
				'module'=>'Goods',
				'action'=>'index',
				'parent'=>2,
				'type'=>1,
				'ismenu'=>'yes',
				'_layer'=>1)]
		);
		$rst[]=array(
			'id'=>3,
			'text'=>'公司中心',
			'pic'=>1,
			'icon'=>'fa-university',
			'module'=>'B',
			'action'=>'i',
			'parent'=>0,
			'type'=>0,
			'ismenu'=>'yes',
			'_layer'=>0,
			'children'=>array(
				'id'=>31,
				'text'=>'公司管理',
				'pic'=>'',
				'icon'=>'fa-bar-chart',
				'module'=>'Org',
				'action'=>'index',
				'parent'=>1,
				'type'=>1,
				'ismenu'=>'yes',
				'_layer'=>1
			)
		);
		$rst[]=array(
			'id'=>4,
			'text'=>'分类中心',
			'pic'=>1,
			'icon'=>'fa-list-ul',
			'module'=>'B',
			'action'=>'i',
			'parent'=>0,
			'type'=>0,
			'ismenu'=>'yes',
			'_layer'=>0,
			'children'=>array(
				'id'=>41,
				'text'=>'分类管理',
				'pic'=>'',
				'icon'=>'fa-bar-chart',
				'module'=>'Type',
				'action'=>'index',
				'parent'=>1,
				'type'=>1,
				'ismenu'=>'yes',
				'_layer'=>1
			)
		);
		$rst[]=array(
			'id'=>5,
			'text'=>'评论中心',
			'pic'=>1,
			'icon'=>'fa-comment-o',
			'module'=>'B',
			'action'=>'i',
			'parent'=>0,
			'type'=>0,
			'ismenu'=>'yes',
			'_layer'=>0,
			'children'=>array(
				'id'=>51,
				'text'=>'评论管理',
				'pic'=>'',
				'icon'=>'fa-bar-chart',
				'module'=>'Comment',
				'action'=>'index',
				'parent'=>1,
				'type'=>1,
				'ismenu'=>'yes',
				'_layer'=>1
			)
		);
		return $rst;
	}
	
	public function build(){
        echo "Function in the development.";
    }
	
	
}