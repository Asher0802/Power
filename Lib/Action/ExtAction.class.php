<?php

class ExtAction extends CommonAction
{

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

    /**功能主JS文件
     * @var string
     */
    protected $_mainjs = '';

    /**功能主JS文件的路径
     * @var string
     */
    protected $_js_path = '';

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

    /**如：单位信息, 用户信息
     * @var string
     */
    protected $_saveTipInfo = '';

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

    /**普通级的标识字段
     * @var string
     */
    protected $_levelField = '';

    /**排除字段 用于field方法
     * @var string
     */
    protected $_remove = '';

    protected $_reject = array('start', 'limit', 'skey');

    /** 字段列表 用于field方法
     * @var string
     */
    protected $_field = '';

    /**是否进行操作权限验证
     * @var bool
     */
    protected $_is_verify = true;

    /**精确的上级单位标识字段
     * @var string
     */
    protected $_pid = '';

    /**子单位模糊查询字段
     * @var string
     */
    protected $_vpid = 'org_layer';

    /**
     * 开启保存时的事务
     * @var bool
     * true 为开启， false为不开启
     */
    protected $_startTrans = false;

    /**
     * 高级过滤规则
     * @var array
     */
    protected $_filter = array();

    protected $_level_site = ''; // 分站级标识字段
    protected $_level_org = ''; // 单位级标识字段
    protected $_level_workgroup = ''; // 部门级标识字段
    protected $_level_user = ''; // 用户级标识字段



    /**
     * 构造函数，初始化必要参数
     */
    public function __construct(){
        parent::__construct();
        // 初始化操作表名
        if (empty($this->_table)) { $this->_table = MODULE_NAME; }
        // 初始化主JS文件
        if (empty($this->_mainjs)) {
            $this->_mainjs = MODULE_NAME . '.js';
            if (ACTION_NAME != C('DEFAULT_ACTION')){
                $this->_mainjs = ACTION_NAME . '.js';
            }
        }
        $this->web_site_fn();
        $jsConst = "var __SUNTOUR__ = " . json_encode($_GET);
        $this->push_script($jsConst);
    }

    /**
     * 默认首页方法
     */
    public function index()
    {
        $this->_verify($this->_is_verify);
        writeLog('访问：'.$this->_title, $this->_table);
        $this->assign('__TITLE__', $this->_title);
        $this->_before_index_layout();
        $this->import($this->getTplPath($this->_js_path) . $this->_mainjs);
        $this->_after_index_layout();
        $this->_layout();
    }

    /**
     * 首页渲染前事件方法
     */
    protected function _before_index_layout(){}

    protected function _after_index_layout(){}
    protected function before_dataJson(&$v){}

    /**
     * JSON数据获取方法
     * @print string
     */
    public function dataJson($type=true)
    {
        $start_time = run_time();
        $this->_verify(false);
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
            $fieldArray = array_keys($list[0]); // 读取字段列表
            $this->cacheDdFieldAndSql($fieldArray, $O->getLastSql()); // 调试用方法
            $list = $this->_filter($list); // 字段过滤
        }else{
            $list=array();
        }
        $this->before_dataJson($list);
        if($type===false) return array('root'=>$list,'total'=>$count);
        $data = json_encode($list);
        /*$end_time = run_time();
        global $global_start;
        $g_end_time = $end_time - $global_start;
        $_POST['_run_time'] = $end_time - $start_time;
        $_POST['_run_global_time'] = $g_end_time;
        $_POST['_memory'] = memory_get_usage() / 1024 . 'Kb';*/
        echo "{total:" . $count . ",root:". $data . ", sql:\"". str_replace('"', '\"', $O->getLastSql()) ."\", PARAMS:". json_encode($_POST) ."}";
        //echo "{total:" . $count . ",root:" . $data . "}";
    }

    protected function _filter($list){
        if (empty($this->_filter)) return $list;
        $tmpData = array();
        foreach ($list as $row){
            foreach($this->_filter as $fld=>$filter){
                if ($filter[1]===true){
                    $__data = $row;
                }else{
                    $__data = $row[$fld];
                }
                $FUNC = $filter[0];
                $row[$fld] = $FUNC($__data);
            }
            $tmpData[]=$row;
        }
        return $tmpData;
    }


    /** 返回所有符合条件的二维数组数据
     * @param string $where
     * 查询条件子句
     * @param string $field
     * 查询字段列表
     * @param string $order
     * 查询排序字段
     * @param string $view
     * 查询视图模式名称
     * @return mixed
     */
    protected function _all_list($where='', $field='', $order='', $view=""){
        $this->_verify(false);
        if (empty($view)){
            $O = M($this->_table);
        }else{
            $O = D($view);
        }
        $this->_model = $O;
        if (!empty($field)){
            $O->field($field);
        }
        if (!empty($where)){
            $O->where($where);
        }
        if (empty($order)) {
            $order = $this->_orderby;
        }
        $O->order($order);
        $rst = $O->select();
        //writeLog($O->getLastSql());
        return $rst;
    }


    protected function before_save_success($id, $model){
        if ($this->_startTrans) $model->commit(); //todo 重载该方法时必须加上事务的判断
    }

    protected function before_save(){}

    /**
     * 表单入库保存
     */
    public function save($data='',$model=''){
        $this->_verify(false);
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
                    if($_REQUEST['out_api'])return $bss;
                    writeLog($message, $this->_table, $pk);
                    $this->success(array( $Pk => $pk , 'msg'=>$message) );
                }else{
                    $message = $O->getError(). ' ' .$O->getLastSql();
                    if ($this->_startTrans) $model->rollback();
                    writeLog($message, $this->_table);
                    if($pk['status']===false)$message=$pk['msg'];
                    $this->error( array( 'msg'=>$message ) );
                }
            }else{
                if (false !== $O->save($data)){
                    $bss=$this->before_save_success($data[$Pk],$model);
                    if($_REQUEST['out_api'])return $bss;
                    $message = $this->_saveTipInfo . '编辑成功！';
                    writeLog($message, $this->_table, $data[$Pk]);
                    $this->success(array( $Pk => $data[$Pk] , 'msg'=>$message));
                }else{
                    $err = $O->getError(). ' '. $O->getLastSql();
                    if ($this->_startTrans) $model->rollback();
                    writeLog($err, $this->_table, $data[$Pk]);
                    $this->error( array( 'msg'=>$err ) );
                }
            }
        } else {

            $message = $O->getError();
            //if (empty($message)) $message = $O->getDbError();
            if (empty($message)) $message = '未知的创建数据时错误！';
            if ($this->_startTrans) $model->rollback();
            writeLog($message, $this->_table);
            $this->error( array( 'msg'=>$message ) );
        }

    }

    public function webSave(){
        //todo 需要做更合理的验证提交的源页面
        if ($this->v_token()) {
            $uinfo = session('userinfo');
            $isTemp = false;
            if (empty($uinfo)) {
                session('userinfo', 'temp');
                $isTemp = true;
            }
            $this->save();
            if (empty($uinfo)) session('userinfo', null);
        }
    }


    public function token(){
        $time = time();
        $this->assign('timestamp', $time );
        $this->assign('token', md5( $time . C('VERIFY_SEED') ));
    }

    public function v_token(){
        $timestamp = $_POST['timestamp'];
        $token = $_POST['token'];
        if ($token == md5( $timestamp . C('VERIFY_SEED') )){
            return true;
        }
        return false;
    }





    public function before_del_success($id, $model, $where=''){
        if ($this->_startTrans) $model->commit();
    }

    /**
     * 删除数据记录
     */
    public function del(){
        $this->_verify(false);
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
            writeLog($message, $this->_table, $_id);
        }
        $where = $Pk .'='. $_id;
        $O->where( $where );
        if ($this->_delTrue){ // 执行真正删除
            if ($O->delete()) {
                $this->_before_true_del($O, $where, $Pk, $_POST);
                $message = $this->_saveTipInfo . '彻底删除成功！';
                $this->before_del_success($_id, $O);
                writeLog($message, $this->_table, $_id);
                $this->success($message);
            } else {
                $message = $this->_saveTipInfo . '删除失败！';
                if ($this->_startTrans) $O->rollback();
                writeLog($message, $this->_table, $_id);
                $this->error($message);
            }
        }else{ // 通过状态字段标识为删除
            if (is_string($this->_delStatus)){ // 兼容以前字符串定义方式
                $delData = array($this->_delStatus => 'del');
            }else if (!empty($this->_delStatus) && is_array($this->_delStatus)){
                $delData = $this->_delStatus;
            }
            if ($O->save($delData)){
                $message = $this->_saveTipInfo . '删除成功！';
                $this->before_del_success($_id, $O);
                writeLog($message, $this->_table, $_id);
                $this->success($message);
            }else{
                if ($this->_startTrans) $O->rollback();
                $message = $this->_saveTipInfo . '删除失败！';
                writeLog($message, $this->_table, $_id);
                $this->error($message);
            }
        }
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
     * 根据主键值获取表单数据
     */
    public function formLoad(){
        $this->_verify(false);
        header("Content-Type:text/html; charset=utf-8");
        $O = D($this->_table);
        $PK = $O->getPk();
        $id = $_POST[$PK];
        $rst = $O->find($id);
        if (!empty($rst))
            $data = array('success'=>true, 'data'=>$rst);
        else
            $data = array('success'=>false, 'error'=>$rst);
        echo json_encode($data);
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
        if ( !empty( $uinfo ) ){
            $_level = $uinfo['u_dj'];
            $u_id = $uinfo['u_id'];
            $w_id = $uinfo['u_workgroup'];
            $o_layer = $uinfo['org_layer'];
            /*
             * array('平台级', '分站级', '单位级', '部门级', '用户级',)
             * 平台级 ：拟实现跨站点功能
             * 分站级 ：相当于原来的系统级，可管控范围是其所在站点内。
             * 单位级 ：可管控范围是其所在的单位内。
             * 部门级 ：可管理所在部门内的信息。
             * 用户级 ：只能管理自己的东西。
             */
            /*if ($_level == '用户级') {
                if ($this->_table=='Org'){
                    $fval = $uinfo['u_jgid'];
                }else{
                    $fval = $uinfo['u_id'];
                }
                $aWhere[] = $this->_levelField . "=" . $fval;
            }*/
            if ($_level == '用户级' && !empty($this->_level_user)) $aWhere[] = $this->_level_user . "=$u_id";
            if ($_level == '部门级' && !empty($this->_level_workgroup)) $aWhere[] = $this->_level_workgroup . "=$w_id";

            //todo 单位级的读数据有点问题
            //todo $this->_level_org in (select org_id from C('DB_PREFIX')compay where org_layer like '$o_layer%')
            //todo 上面这句考虑到使用性能问题 将其分散到每个单位的编辑时处理 生成缓存文件，并set进memcache
            if ($_level == '单位级' && !empty($this->_level_org)) $aWhere[] = $this->_level_org . " like '$o_layer%'";
            if ($_level == '分站级' && !empty($this->_level_site)) $aWhere[] = $this->_level_site . "='". SHORT_NAME ."'";
            // 平台级暂时按分站形式查阅数据，以跨站方式实现
            if ($_level == '平台级' && !empty($this->_level_site)) $aWhere[] = $this->_level_site . "='". SHORT_NAME ."'";

            // 机构级的参数一般在Store里都指定了相关的baseParams，所以这里没有再赋条件。
        }

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
     * @var array
     */
    protected static $_ids = array();
    /**
     * @var array
     */
    protected static $_sub_child = array();

    /**
     * @param $data
     * @param $id
     * @param string $pk
     * @param string $pid
     */
    protected function tree_sub_child($data, $id, $pk='id', $pid='pid'){
   		self::$_ids[] = $id;
   		for ($r=0; $r<sizeof($data); $r++){
   			if (in_array($data[$r][$pid], self::$_ids) ){
   				self::$_ids[] = $data[$r][$pk];
   				self::$_sub_child[] = $data[$r];
   			}
   		}
           for ($rr=sizeof($data); $rr>=0; $rr--){
               if (in_array($data[$rr][$pid], self::$_ids) && !in_array($data[$rr][$pk], self::$_ids) ){
                   self::$_ids[] = $data[$rr][$pk];
                   self::$_sub_child[] = $data[$rr];
               }
           }
   	}


    /**
     * @param $fromid
     * @param $sql
     * @return array
     */
    protected function getSubChild($fromid, $sql){
   		$db = new Model();
   		$rst = $db->query($sql);
   		$this->tree_sub_child($fromid, $rst);
        return array('id'=>self::$_ids, 'data'=>self::$_sub_child);
   	}



    public function ajaxModify(){
        $d = M($this->_table);
        if (false === $d->save($_POST)) {
            $this->error('Error.');
        } else {
            $this->success('Succes.');
        }
    }


    /**
     * 单位、工作组、用户树
     */
    public function treeOWU(){
        // 异步组织单位O、部门W、用户U的树型数据
        $this->_verify();
        $node = $_REQUEST['node'];
        $isIcon = $_REQUEST['icon'];
        $checked = $_REQUEST['ckd'];
        $model = new Model();
        $db_prefix = C('DB_PREFIX');
        if (strncasecmp($node, 'org_', 4)==0){
            // 展开单位机构的数据：部门&子单位
            $node = str_replace('org_', '', $node);
            $data = array();

            // 读取部门信息
            $sql_wgp = "select wg_id, wg_bh, wg_name, ".
                "(select count(1) from {$db_prefix}users where u_workgroup=wg_id and u_zt='ok') as leaf ".
                "from {$db_prefix}workgroup where wg_zt='ok' and wg_org=$node";
            $wgp = $model->query($sql_wgp);
            if ($wgp){
                foreach ($wgp as $row){
                    if ($row['leaf']==0) {$l=true;}else{$l=false;}
                    $list = array(
                        'id' => 'wgp_' . $row['wg_id'],
                        'text' => $row['wg_name'],
                        'wg_bh' => $row['wg_bh'],
                        'leaf' => $l
                    );
                    if (empty($isIcon)){
                        $list['cls'] = 'wgp';
                    }
                    $data[] = $list;
                }
            }

            // 读取子单位
            $sql_org = "select o.org_id, o.org_pid, o.org_bh, o.org_name, o.org_layer,".
                "(select count(1) from {$db_prefix}org oc where oc.org_pid=o.org_id and oc.org_zt='ok') as suborg, ".
                "(select count(1) from {$db_prefix}workgroup where wg_org=o.org_id and wg_zt='ok') as subWgp ".
                "from {$db_prefix}org o where o.org_pid=$node and o.org_zt='ok'";
            $org = $model->query($sql_org);
            //echo "<div>$sql_org</div>";
            if ($org){
                foreach ($org as $row){
                    $l = intval($row['suborg']) + intval($row['subWgp']);
                    if ($l==0) {$l = true;} else { $l=false; }
                    $list = array(
                        'id' => 'org_' . $row['org_id'],
                        'text' => $row['org_name'],
                        'org_pid' => $row['org_pid'],
                        'org_bh' => $row['org_bh'],
                        'org_layer' => $row['org_layer'],
                        'leaf' => $l
                    );
                    if (empty($isIcon)){
                        $list['cls'] = 'org';
                    }
                    $data[] = $list;
                }
            }
            echo json_encode($data);
        }elseif (strncasecmp($node, 'wgp_', 4)==0){
            // 展开部门下的数据：即用户
            $node = str_replace('wgp_', '', $node);
            $sql_user = "select u_id, u_name, u_zname, u_sex from {$db_prefix}users where u_workgroup=$node and u_zt='ok'";
            $users = $model->query($sql_user);
            $data = array();
            if ($users){
                foreach ($users as $row){
                    $list = array(
                        'id' => $row['u_id'],
                        'text' => $row['u_zname']."(". $row['u_name'] .")",
                        'u_sex' => $row['u_sex'],
                        'leaf' => true
                    );
                    if (empty($checked)){
                        $list['checked'] = false;
                    }
                    if (empty($isIcon)){
                        $cls = "um";
                        if ($row['u_sex']=='女'){ $cls="uw"; }
                        $list['cls'] = $cls;
                    }
                    $data[] = $list;
                }
            }
            echo json_encode($data);
        }
        /*
         select org_id, org_pid, org_bh, org_name, org_layer,
        (select count(1) from sloa_org oc where oc.org_pid=o.org_id) as suborg,
        (select count(1) from sloa_workgroup where wg_org=o.org_id) as subWgp
        from sloa_org o where o.org_zt='ok'
        */
    }


    /**
     * 带事务的主表和附表同时操作功能的自动添加
     *---------------------------------------------
     * @param string $myParam
     * 附表操作需要的数据    数据结构见本函数上面的注释数组
     * @param string $modelname
     * 主表的模型名称
     * @param string $submit
     * 是否自动提交(暂时无用)
     * @return mixed
     */
    public function transSave($myParam,$modelname='',$submit=true){
        if($modelname){
            $O = D($modelname);
        }else{
            $O = D($this->_table);
        }
        $this->_model = $O;

        $O->startTrans();

        $Pk = $O->getPk();
        if($O->create()){
            if(empty($_POST[$Pk])){
                $prefixTitle='添加';
                $fRsId=$O->add();
                //echo $O->getLastSql();
                if($fRsId){
                    //print_r('[1]');
                    $fPkAndVal=array($Pk,$fRsId);
                    $lastRs=$this->otherTransSave($fPkAndVal,$myParam);
                }
            }else{
                $prefixTitle='编辑';
                if ($O->save()){
                    $fPkAndVal=array($Pk,$_POST[$Pk]);
                    $lastRs=$this->otherTransSave($fPkAndVal,$myParam);
                }else{
                    $err = $O->getError();
                    if (empty($err)){
                        $lastRs=true;
                    }else{
                        $lastRs=false;
                        $message=$err;
                    }
                }
            }
            //是否自动提交或回滚
            if($submit){
                $idstr=$fRsId?$fRsId:$_POST[$Pk];
                if($lastRs){
                    $O->commit();

                    $message=$this->_saveTipInfo.$prefixTitle.'成功';
                    writeLog($message, $this->_table, $idstr);
                    $this->success($message);
                }else{
                    $O->rollback();

                    $message = $O->getError();
                    writeLog($message, $this->_table, $idstr);
                    $this->error($message);
                }
            }

        }else {
            $message = $O->getError();
            writeLog($message, $this->_table);
            $this->error($message);
        }
    }

    /**
     * 对附表的操作
     *---------------------------------------------
     * @param string $fids
     * 主表的主键的键值对数组 array('table_id',3)
     * @param string $myParam
     * 附表操作的数据
     * @return mixed
     */
    function otherTransSave($fids,$myParam){
        if($fids && $myParam){
            $i=0;
            if($myParam['model']){
                //print_r('[2]');
                $rs=$this->parseTransSave($fids,$myParam);
                if(!$rs){
                    $i++;
                }
            }else{
                foreach($myParam as $myParamV){
                    $rs=$this->parseTransSave($fids,$myParamV);
                    if(!$rs){
                        $i++;
                    }
                }
                //echo '进来没得';
            }
        }
        if($i>0){
            return false;
        }
        return true;
    }


    /**
     * 附表操作所需要的数据的分析
     *---------------------------------------------
     * @param string $fids
     * 主表的主键的键值对数组 array('table_id',3
     * @param string $myParam
     * 附表操作的数据
     * @return mixed
     */
    function parseTransSave($fids,$myParam){
        $Pk=$fids[0];
        $PkVal=$fids[1];

        $Model=M($myParam['model']);
        $data=$myParam['data'];

        //添加、修改时分析data数据
        if($myParam['action']!='delete'){
            $cFieldInData=array_search($Pk,$data);// 查找到以主表的主键为值的Data数组key
            if($cFieldInData){
                //查找到之后 将该key的值替换为新增的主表数据的id值
                $data[$cFieldInData]=$PkVal;
            }
        }
        //print_r($data);
        if($myParam['action']=='add'){
            $lastRs=$Model->add($data);
        }else{
            //修改、删除时需要分析where数据
            $where=$myParam['where'];
            $cFieldInWhere=array_search($Pk,$where);// 查找到以主表的主键为值的Where数组key
            if($cFieldInWhere){
                //查找到之后 将该key的值替换为新增的主表数据的id值
                $where[$cFieldInWhere]=$PkVal;
            }
            if($myParam['action']=='save'){
                $lastRs=$Model->where($where)->save($data);
            }else{
                $lastRs=$Model->where($where)->delete();
            }
        }
        //print_r($Model->getLastSql());
        return $lastRs;
    }


    public function cacheDdFieldAndSql($field=array(), $sql=''){
        $_fld = array();
        foreach ($field as $fld){
            $_fld[] = array('name'=> $fld );
        }
        //todo 生成字段列表
        $content = '"'.implode('","', $field).'"'."\n\n". json_encode($_fld) . "\n\n" . $sql;
        file_put_contents(DATA_PATH . '_'. MODULE_NAME . '_' . ACTION_NAME . '.txt', $content);
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
            //file_put_contents(LOG_PATH.'mg_db.log', date('YmdHis')."\t".var_export( $list,true), FILE_APPEND );
            if ($options['mongo']){
                $tmp = array();
                foreach ($list as $key => $row ){
                    $tmp[] = $row;
                }
                $list = $tmp;
            }
            if (C('APP_DEBUG')) {
                $fieldArray = array_keys($list[0]); // 读取字段列表
                $this->cacheDdFieldAndSql($fieldArray, $model->getLastSql()); // 缓存字段列表与执行SQL，调试用方法
            }

            $list = $this->_filter($list); // 字段过滤
        }
        $data = array('total'=>$count,'root'=>$list,'sql'=>$model->getLastSql());
        if ( C('APP_DEBUG') ){
            $data['sql'] = $model->getLastSql();
            $data['params'] = $_POST;
        }
        return $data;
    }

    function Get_Curl($url){
        //初始化
        $ch = curl_init();
        //设置选项，包括URL
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        //执行并获取HTML文档内容
        $output = curl_exec($ch);
        //释放curl句柄
        curl_close($ch);
        //返回
        return $output;
    }

    /**
     * 最优化占座
     * @param $seats 空座列表 可由SeatAction::parse_surplus方法提供
     * @param $num 需要的座位数量
     * @return array
     */
    function auto_select_seats($seats, $num){
        if (empty($seats)) return array();
        $pre = $seats[0]['s_unique'];
        if ($num==1){
            $tmp = $seats[0];
        }else{
            $tmp = array();
            foreach ($seats as $row){
                $offset = $row['s_unique'] - $pre;
                if ( intval($offset) > 1){
                    $pre = $row['s_unique'];
                    $tmp = array();
                    $tmp[] = $row;
                }else{
                    $tmp[] = $row;
                    $pre = $row['s_unique'];
                }
                if (sizeof($tmp)==$num) break;
            }
            if (sizeof($tmp) < $num) return array();
        }
        return $tmp;
    }

    /**
     * 查询数据库数据
     * @param $options 相关条件
     * @param $id 主键ID
     * @return array|mixed
     */
    function select_find($options,$id=''){
        $tab=M($this->_table);
        if($id){
            if($options['where'])$tab=$tab->where($options['where']);
            if($options['field'])$tab=$tab->field($options['field']);
            if($options['join'])$tab=$tab->join($options['join']);
            $data=$tab->find($id);
        }else{
            $data=$this->get_data($tab,$options);
        }
        return $data;
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
     * 获取用户当前城市
     */
    function get_ip_city($ip=''){
        if(empty($ip)){
            $ip=get_client_ip();
        }
        $res = @file_get_contents('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=' . $ip);
        if(empty($res)){ return false; }
        $jsonMatches = array();
        preg_match('#\{.+?\}#', $res, $jsonMatches);
        if(!isset($jsonMatches[0])){ return false; }
        $json = json_decode($jsonMatches[0], true);
        if(isset($json['ret']) && $json['ret'] == 1){
            $json['ip'] = $ip;
            unset($json['ret']);
        }else{
            return false;
        }
        return $json;
    }

    /**
     * 获取当前站点所在城市
     * @param string $user 用户数据
     * @param string $site 站点数据
     */
    function web_site_fn($user='',$site=''){
        //当用户没登录进执行
        if(!session('web_site')){
            $ip_city=$this->get_ip_city('115.197.138.31');
            $city=array(
                'default_city'=>$ip_city['city'].'市',
                'ip_city'=>$ip_city['city'].'市',
                'city'=>$ip_city['city'].'市'
            );
            session('web_site',$city);
        }

        //当用户登录时执行
        if($user && !$site){
            $city=session('web_site');
            $city['default_city']=$user['org_city'];
            $city['city']=$user['org_city'];
            session('web_site',$city);
        }

        //当选择站点时执行
        if($site){
            $city=session('web_site');
            $city['city']=$site;
            session('web_site',$city);
        }
    }

    //公共下载方法
    function download($filename,$showname,$content,$expire=180){
        import("ORG.Net.Http");
        $download=new Http();
        setlocale(LC_ALL, 'en_US.UTF8');;
        $download->download($filename,$showname,$content,$expire);
    }

}