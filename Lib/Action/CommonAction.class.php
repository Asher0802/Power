<?php
class CommonAction extends Action {
    protected $_js_css = array();
    protected $javaScript = array();
    /**当前操作的表名
     * @var array|mixed|null|string
     */
    protected $_table = '';

    /**默认查询条件
     * @var string
     */
    protected $_where = '';

    /**当前页的title
     * @var string
     */
    protected $_title = '';
    /**模糊查询条件的字段列表
     * @var array
     */
    protected $_likelist = array();

    /**主排序
     * @var string
     */
    protected $_orderby = '';

    /**
     * 联表
     * @var string
     */
    protected $_join = '';

    /**删除状态字段
     * @var string || array
     * 如org_zt
     * 或array('fieldName'=>'删除状态的值')
     */
    protected $_delStatus = array();

    /**是否真正删除
     * @var bool
     */
    protected $_delTrue = false;

    /**视图名称
     * @var string
     */
    protected $_viewName = '';

    /**当前操作创建的数据模型对象
     * @var null
     */
    protected $_model = null;

    /**排除字段 用于field方法
     * @var string
     */
    protected $_remove = '';

    protected $_reject = array('start', 'limit', 'skey');

    /** 字段列表 用于field方法
     * @var string
     */
    protected $_field = '';
    /**
     * 开启保存时的事务
     * @var bool
     * true 为开启， false为不开启
     */
    protected $_startTrans = false;

    protected $_saveTipInfo = '';



    public function __construct(){
        parent::__construct();
        define('APP_PUBLIC_PATH', __PUBLIC__);
        define('APP_PUBLIC_JS_PATH',APP_PUBLIC_PATH.'/Js/');
        define('APP_PUBLIC_CSS_PATH',APP_PUBLIC_PATH.'/Css/');
        define('APP_PUBLIC_EXT_PATH',APP_PUBLIC_PATH.'/Ext5/');
        define('APP_PUBLIC_IMAGES_PATH',APP_PUBLIC_PATH.'/Images/');
        define('APP_TMPL_PATH',__ROOT__.'/Tpl/');
        $this -> push_script('var $__app__ = "' . __APP__.'"');
        $this -> push_script('var $__tpl__ = "' . APP_TMPL_PATH.'"');
        $this -> push_script('var $__public__ = "' . __PUBLIC__.'"');
        $this -> push_script('var $app_root = "' . __ROOT__.'"');
        $this -> push_script('var $img_path = "' . APP_PUBLIC_IMAGES_PATH.'"');
        $this -> assign('TITLE_VAL',C('TITLE_VAL'));
    }

    /**
     * dataJson之前调用函数
     */
    public function before_dataJson(){}

    public function getServer(){
        $http = array(
            'host' => $_SERVER['HTTP_HOST'],
            'REQUEST_URI' => $_SERVER['REQUEST_URI'],
            'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME']
        );
        return $http;
    }
    public function push_script($str){
        $key = md5($str);
        $this -> javaScript[$key] = $str;
        $this -> assign('_javaScript',$this -> javaScript);
    }
    /**
     *  导入JS  CSS
     *  @param $file
     */
     function import($file){
         $impData = explode('.',$file);
         $len = count($impData)-1;
         $key=md5($file);
         $port=$impData[$len];
         $this->_js_css[$port][$key]=$file;
         $this -> assign('_HEAD_CSS_JS',$this->_js_css);
    }
	
	 /**
     * 导入一个图标库
     */
    protected function importFa($ver='4.2.0'){
        //参考：http://fontawesome.io/icons
        //示例：http://fontawesome.io/examples/
        //标签写法：<i class="fa fa-user"></i>
        $this->import('http://cdn.bootcss.com/font-awesome/'.$ver.'/css/font-awesome.min.css');
    }


    /**
     * 导入ExtJS类库
     */
    protected function importExt5js(){
        $this->import(APP_PUBLIC_EXT_PATH . 'packages/ext-theme-neptune/build/resources/ext-theme-neptune-all.css');
        $this->import(APP_PUBLIC_EXT_PATH . 'Ext_style.css');
        $this->import(APP_PUBLIC_EXT_PATH . 'ext-all.js');
        $this->import(APP_PUBLIC_EXT_PATH . 'packages/ext-theme-neptune/build/ext-theme-neptune.js');
        $this->import(APP_PUBLIC_EXT_PATH . 'function.js');
        $this->import(APP_PUBLIC_EXT_PATH . 'ext-locale-zh_CN.js');
        $this->import(APP_PUBLIC_EXT_PATH . 'debug.js');
    }

    /**
     *      导入主要JS文件  *
     */
    protected function importMainJs(){
        $this->import(APP_PUBLIC_JS_PATH . 'jquery.mini.js');
        $this->import(APP_PUBLIC_JS_PATH . 'sunline.js');
    }
    /**
     * 重载控制器的success方法
     * @param string $message
     * @param string $jumpUrl
     * @param bool $ajax
     */
    protected function success($message,$jumpUrl='',$ajax=false){
        C('TMPL_ENGINE_TYPE','Think');
        parent::success($message,$jumpUrl,$ajax);
        exit();
    }


    /**
     * 重载控制器的error方法
     * @param string $message
     * @param string $jumpUrl
     * @param bool $ajax
     */
    protected function error($message,$jumpUrl='',$ajax=false) {
        C('TMPL_ENGINE_TYPE','Think');
        parent::error($message,$jumpUrl,$ajax);
    }


    /**
     * 重定义display方法，主要用于后台ExtJS的模板（只需要一个模板）
     * @param string $tpl
     */
    public function _layout($tpl=''){
        if (empty($tpl)){
            $tpl = '_layout:main';
        }
        $this->display($tpl);
    }


    /**
     * 重定义display方法，用于显示PHP模板引擎
     * @param string $tpl
     */
    public function layout_php($tpl=''){
        C('TMPL_ENGINE_TYPE','php');
        C('TMPL_TEMPLATE_SUFFIX','.php');
        $this->display($tpl);
    }

    /**
     * 获取数据的方法
     * @param $model
     * @param array $options
     * @return array
     *
     * $options可定义以下键名：
     * where,distinct,field,group,having,join,limit,lock,order,page,union,!field
     * 各键名对应的值，请参考TP 6.18查询语言
     * !field 指要排除的字段
     */
    protected function get_data( $model, $options=array() ){
        //$O = D( $table_name );
        $this->_model = $model;
        //file_put_contents(LOG_PATH.'get_data.txt', var_export($options, true));
        if ($options['where']) $model->where($options['where']);
        if($options['join']) $model->join($options['join']);
        $count = $model->count(); // 获取满足条件的记录总数
        $allow_option = array("where","distinct","field","group","having","join","limit","lock","order","page","union");
        $list = array();
        if ($count) {
            foreach ($options as $key=>$val){
                if (in_array($key, $allow_option)){
                    $model->$key($val);
                }else if ($key=='!field'){
                    $model->field($val, true);
                }
            }

            $list = $model->select();
            if ($options['mongo']){
                $tmp = array();
                foreach ($list as $key => $row ){
                    $tmp[] = $row;
                }
                $list = $tmp;
            }
        }
        $data = array('total'=>$count,'root'=>$list,'sql'=>$model->getLastSql());
        return $data;
    }

    /**
     * 获取查询条件
     * @param $fields
     * @param string $alias
     * @return string
     */
    protected function getWhere($fields, $alias=''){
        $alias = empty($alias) ? "" : $alias . ".";
        if (!empty($_REQUEST['skey'])) $skey = $_REQUEST['skey'];
        $aWhere = array();
        if (!empty($this->_where)){
            $aWhere[] = $alias. $this->_where;
        }
        if (is_array($this->_likelist) && !empty($skey)){
            $tmpWhere = '(';
            $tmpWhereArray = array();
            foreach ($this->_likelist as $_like){
                $_like = $alias. $_like;
                $tmpWhereArray[] = "$_like like '%$skey%'";
            }
            $tmpWhere .= implode(' or ', $tmpWhereArray) . ')';
            // (org_pym like '%ljs%' or org_bh like '%ljs%')
            $aWhere[] = $tmpWhere;
        }
        $uinfo = session('userinfo');
        $post = $this->parsePost($fields, $alias);
        if (!empty($post)){
            foreach ($post as $k){
                $aWhere[] = $k;
            }
        }

        $in = $this->parseIn(); // 2013.6.13 新增in条件解析
        foreach ($in as $w){
            $aWhere[] = $w;
        }
        return implode(' and ', $aWhere);
    }
    /**
     * 解析POST数据
     * @param $fields
     * @return array
     */
    protected function parsePost($fields, $alias=''){
        $tmp = array();
        $data = $_POST;
        if (!empty($data)) {
            if (empty($this->_viewName)) {
                if (is_array($fields)) {
                    foreach ($data as $key => $val) {
                        if (!empty($val)) { //todo 请注意值为0的字段参数
                            if (in_array($key, $fields)) {
                                if ($this->_vpid == $key) {
                                    $tmp[] = "$alias$key like '$val%'";
                                } else {
                                    $tmp[] = "$alias$key = '$val'";
                                }
                            }
                        }
                    }
                }
            } else {
                foreach ($data as $key => $val) {
                    if (in_array($key, $this->_reject))  continue;
                    if ($val == 0)  continue;
                    $tmp[] = "$key = '$val'";
                }
            }
        }
        return $tmp;
    }
    /**
     * 解析In条件
     * @return array
     */
    protected function parseIn(){
        /**
         * 数据格式：字段1::value1,,value2,,value3::类型;;字段2::value1,,value2,,value3::类型
         * 如： 'org_type::sales,,bus::s'
         * $_POST['_in'] = 'org_type::sales,,bus::s;;org_id::1,2,3,4;;';
         */
        $tmp = array();
        $in = $_POST['_in'];
        if (empty($in)) return $tmp;

        $ins = explode(';;', $in);
        foreach ($ins as $w){
            if (empty($w)) continue;
            $ws = explode('::', $w);
            $val = explode(',,', $ws[1]);
            if (strtolower($ws[2])=='s'){
                $inVal = "('". implode("','", $val) ."')";;
            }else{
                $inVal = "(". implode(',', $val) .")";
            }
            $tmp[] = $ws[0] . " in $inVal";
        }
        return $tmp;
    }

    /**
     * JSON数据获取方法
     * @print string
     */
    public function dataJson($type=true){
        //$this->_verify(false);
        header("Content-Type:text/html; charset=utf-8");
        $limit = empty($_POST['limit']) ? C('page_size') : $_POST['limit'];
        $start = empty($_POST['start']) ? 0 : $_POST['start'];
        unset($_POST['page']);
        if (empty($this->_viewName)){
            $O = D($this->_table);
        }else{
            $O = D($this->_viewName);
        }
        $this->_model = $O;
        $fields = $O->getDbFields();
        $where = $this->getWhere($fields);
        if($this->_join){
            $O->join($this->_join);
        }
        $O->where($where);
        $count = $O->count();

        if (!empty($this->_orderby)){
            $O->order($this->_orderby);
        }
        if (!empty($this->_remove)){
            $O->field($this->_remove, true);
        }
        if (!empty($this->_field)){
            $O->field($this->_field);
        }
        if(!empty($this->_join)){
            $O->join($this->_join);
        }
        $list = $O->limit( $start . ',' . $limit )->where($where)->select();
        if ($list) {
            //$fieldArray = array_keys($list[0]); // 读取字段列表
            //$this->cacheDdFieldAndSql($fieldArray, $O->getLastSql()); // 调试用方法
            //$list = $this->_filter($list); // 字段过滤
        }else{
            $list=array();
        }
        $this->before_dataJson($list);
        if($type===false) return array('root'=>$list,'total'=>$count);
        $data = json_encode($list);
        echo "{total:" . $count . ",root:". $data . ", sql:\"". str_replace('"', '\"', $O->getLastSql()) ."\", PARAMS:". json_encode($_POST) ."}";
    }

    protected function before_save_success($id, $model){
        if ($this->_startTrans) $model->commit(); //todo 重载该方法时必须加上事务的判断
    }

    protected function before_save(){}

    /**
     * 表单入库保存
     */
    public function save($data='',$model=''){
        //$this->_verify(false);
        $this->before_save();
        $data = $data ? $data : $_POST;
        $O = D($this->_table);
        if(!$model)$model=$O;
        if ($this->_startTrans)$model->startTrans();
        $this->_model = $O;
        $Pk = $O->getPk();
        foreach ($data as $key=>$value){
            $data[$key] = trim($value);
        }
        if ($O->create()){
            //file_put_contents('dd.txt',var_export($O->getLastSql(),true));
            if (empty($data[$Pk])){
                $pk = $O->add($data);
                if ($pk && $pk['status']!==false){
                    $message = $this->_saveTipInfo . '添加成功！';
                    $bss=$this->before_save_success($pk, $model);
                    $this->success(array( $Pk => $pk , 'msg'=>$message) );
                }else{
                    $message = $O->getError(). ' ' .$O->getLastSql();
                    if ($this->_startTrans) $model->rollback();
                    if($pk['status']===false)$message=$pk['msg'];
                    $this->error( array( 'msg'=>$message ) );
                }
            }else{
                if (false !== $O->save($data)){
                    $bss=$this->before_save_success($data[$Pk],$model);
                    $message = $this->_saveTipInfo . '编辑成功！';
                    $this->success(array( $Pk => $data[$Pk] , 'msg'=>$message));
                }else{
                    $err = $O->getError(). ' '. $O->getLastSql();
                    if ($this->_startTrans) $model->rollback();
                    $this->error( array( 'msg'=>$err ) );
                }
            }
        } else {
            $message = $O->getError();
            //if (empty($message)) $message = $O->getDbError();
            if (empty($message)) $message = '未知的创建数据时错误！';
            if ($this->_startTrans) $model->rollback();
            $this->error( array( 'msg'=>$message ) );
        }
    }

    public function before_del_success($id, $model, $where=''){
        if ($this->_startTrans) $model->commit();
    }
    /**
     * 真正删除前的事件函数
     * @param $model
     * @param $where
     * @param $Pk
     * @param $data
     */
    protected function _before_true_del($model, $where, $Pk, $data){}
    /**
     * 删除数据记录
     */
    public function del(){
        //$this->_verify(false);
        if (empty($this->_delStatus) && !$this->_delTrue){
            $this->error('未知的状态字段。');
        }
        $O = M($this->_table);
        if ($this->_startTrans) $O->startTrans();
        $Pk = $O->getPk();
        $_id = $_POST[$Pk];
        if (empty($_id)){
            $message = '重要参数丢失！请按正确路径访问系统。';
            $this->error($message);
        }
        $where = $Pk .'='. $_id;
        $O->where( $where );
        if ($this->_delTrue){ // 执行真正删除
            if ($O->delete()) {
                $this->_before_true_del($O, $where, $Pk, $_POST);
                $message = $this->_saveTipInfo . '彻底删除成功！';
                $this->before_del_success($_id, $O);
                $this->success($message);
            } else {
                $message = $this->_saveTipInfo . '删除失败！';
                if ($this->_startTrans) $O->rollback();
                $this->error($message);
            }
        }else{ // 通过状态字段标识为删除
            if (is_string($this->_delStatus)){
                $delData = array($this->_delStatus => 'del');
            }else if (!empty($this->_delStatus) && is_array($this->_delStatus)){
                $delData = $this->_delStatus;
            }
            if ($O->save($delData)){
                $message = $this->_saveTipInfo . '删除成功！';
                $this->before_del_success($_id, $O);
                $this->success($message);
            }else{
                if ($this->_startTrans) $O->rollback();
                $message = $this->_saveTipInfo . '删除失败！';
                $this->error($message);
            }
        }
    }
	
	//检测登录
	function check_log(){
		session_start();
		$user=$_SESSION['user'];
		if(!$user){
			$this->redirect('Login/index');
		}
	}
	
	function user_data(){
		session_start();
		$user=$_SESSION['user'];
		return $user;
	}
	
	public function set_log($msg){
            session_start();
            $data['user']=$_SESSION['user'];
            $data['time']=date('Y-m-d-h:i:s',time());
			$data['msg']=$data['user'].'-'.$msg.'-'.$data['time'].',';
            $time=explode("-",$data['time']);
			$url='Log/'.$time[0].'/'.$time[1];
			if(!is_dir($url)){
				mkdir($url,0777,true);
			}
            $name='/'.$time[1].'_'.$time[2].'.txt';
            file_put_contents($url.$name,$data['msg'],FILE_APPEND);
        }
		
	//记录调试信息
	public function console($msg,$status=false){
		if($status){
			file_put_contents('dd.txt',var_export($msg,true),FILE_APPEND);
		}else{
			file_put_contents('dd.txt',var_export($msg,true));
		}
	}
	
	
	
}