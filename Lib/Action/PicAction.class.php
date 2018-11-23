<?php
class PicAction extends CommonAction{

    protected $_title = '图片管理'; // 当前页的title
    protected $_delTrue = false; // 是否真正删除
    protected $_delStatus=array('i_status'=>'del');//设置删除的字段以及值
    protected $_where="i_status <> 'del'";  //默认查询的条件
    protected $_viewName = 'Img';
    protected $_table = 'Img';

    function index(){
		$this->importExt5js();
        $this->import(APP_PUBLIC_JS_PATH . 'jquery.mini.js');
        $this->import(APP_PUBLIC_JS_PATH . 'sunline.js');
        $this->import(APP_PUBLIC_JS_PATH.'uploadify/jquery.uploadify.min.js');
        $this->import(APP_TMPL_PATH.'Pic/index.css');
        $this->import(APP_TMPL_PATH.'Pic/index.js');
		//$this->importFa();
		$this->push_script("var param={table_id:".$_GET['p_id']."}");
        $model=M('img');
        $where['i_pid']=$_GET['p_id'];
        $result=$model->where($where)->select();
        $this->assign('data',$result);
		$product=M('Product');
		$where['p_id']=$_GET['p_id'];
		$img_url=$product->where($where)->find();
        $this->assign('img_url',$img_url['p_img']);
		$this->assign("__public__",__PUBLIC__);
		$this->assign("app_root",__ROOT__);
        $this->display();
    }

    function upload_pic(){
        $upload_action=A('Upload');
        $return=$upload_action->upload();
        if($return['success']===false){
             $this->error('上传失败','',true);
        }else{
            $old_file_name=$return['data'][0]['savepath'].$return['data'][0]['savename'];
            $savename= explode(".",$return['data'][0]['savename']);
            $i_url=$upload_action->formal_upload($old_file_name,array($savename[0]));
            if($at_url===false){
                $this->error('图片上传失败','',true);
                return false;
            }
            $Img=M('Img');
            $data['i_pid']=$_POST['table_id'];
            $data['i_url']=$i_url;
            $data['i_time']=time();
            $result=$Img->add($data);
            if($result===false){
                $this->error('数据存储失败，请重试','',true);
            }else{
                $data['i_id']=$result;
                $this->success($data,'',true);
            }
        }
     }

    function save_cover(){
        header("Content-Type:text/html; charset=utf-8");
        $model=M('Product');
        $where['p_id']=$_POST['p_id'];
        $data['p_img']=$_POST['i_url'];
        $result=$model->where($where)->save($data);;
        if($result===false){
            $this->error('图片设置失败,请重试','',true);
        }else{
            $this->success('图片设置成功','',true);
        }
    }

    function del(){
        header("Content-Type:text/html; charset=utf-8");
        if(!$_POST['i_id']){
            $this->error('缺少重要参数');
        }
        $model=M('Img');
        $where['i_id']=array('in',$_POST['i_id']);
		$save['i_status']='del';
        $result=$model->where($where)->save($save);
        if($result===false){
            $this->error('删除失败，请重试');
        }else{
            $this->success("删除成功");
        }
    }

}