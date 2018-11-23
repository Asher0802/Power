<?php
class LoginAction extends CommonAction{
    
	//登录界面
	function index(){
		$this->import(APP_PUBLIC_CSS_PATH . 'login.css');
		$this->import(APP_PUBLIC_JS_PATH.'jquery.mini.js');
		$this->import(APP_TMPL_PATH.'Login/login.js');
		$this->display();
	}
	
	//登录处理
	function login(){
		$model=M('User');
		$where['u_name']=$_POST['u_name'];
		$where['u_password']=$_POST['u_password'];
		$where['u_status']='ok';
		$result=$model->where($where)->find();
		if($result){
			session_start();
			$_SESSION['user']=$_POST['u_name'];
			echo "<script language='javascript'>location.href='/Power/index.php/Index/index';</script>";	
		}else{
			echo "<script language='javascript'>alert('用户名或密码错误，请重试');</script>";
			echo "<script language='javascript'>location.href='/Power/index.php/Login/index';</script>";
		}
	}
	
	//验证码
	public function getVerify(){
        import('ORG.Util.Image');
        header("Content-type: image/png");
        Image::buildImageVerify(4,5,'png','80','25');
    }
	
	//退出登录
	function logout(){
		session_start();
		$_SESSION["user"]= null;
		$this->redirect('Login/index');
	}

}