<?php
class UploadAction extends CommonAction{
    protected static $upload;
    public function __construct(){
        import("ORG.Net.UploadFile");
        self::$upload = new UploadFile(); // 实例化上传类
    }

    /**
     * 文件上传保存方法
     * @param string $path 上传文件保存的路径
     * @param array $exts 允许上传文件类型
     * @param int $size 上传文件大小限制
     * @return array
     */
    function upload($path = './UploadTemp/', $exts = array('jpg', 'gif', 'png', 'jpeg'), $size=30720000 ){
        ini_set('memory_limit', '512M');
        $upload = self::$upload;
        $upload->maxSize  = $size ; // 设置附件上传大小
        $upload->allowExts  = $exts; // 设置附件上传类型
        $upload->savePath = $path; // 设置附件上传目录
        //设置需要生成缩略图，仅对图像文件有效
        $upload->thumb = false;
        //设置需要生成缩略图的文件前缀
        $upload->thumbPrefix = '';
        //设置需要生成缩略图的文件后缀
        $upload->thumbSuffix = '_b,_m,_s'; //生产2张缩略图
        //设置缩略图最大宽度
        $upload->thumbMaxWidth = '600,100';
        //设置缩略图最大高度
        $upload->thumbMaxHeight = '600,100';
        //删除原图
        //$upload->thumbRemoveOrigin = false;
        $upload->saveRule = time() . rand(0, 9) . rand(0, 9) . rand(0, 9). rand(0, 9);
        //子目录创建方式
        $upload->autoSub = true;
        $upload->hashLevel = 4;
        $upload->subType = 'date';
        $upload->dateFormat = 'Y/m';
        if(!$upload->upload()){ // 上传错误提示错误信息
            $data = array(
                'success'=>false,
                'info'=>$upload->getErrorMsg(),
            );
        }else{ // 上传成功 获取上传文件信息
            $data = array(
                'success'=>true,
                'data'=> $upload->getUploadFileInfo() ,
            );
        }
        return $data;
    }

    /**
     * 图片异步上传
     * 成功会返回文件相关信息
     */
    public function ajax_upload($bool=false){
        $return = $this->upload();
        if($bool===true) return $return;
        if($return['success']===false){
            $this->error('上传失败','',true);
        }else{
            $this->success($return['data'],'',true);
        }
    }

    /**
     * @param $temp_file 文件原先的临时目录地址
     * @param $array   //文件保存的规则    例如 array('company','card_front','1')   单位为1的证件正面照 会生成company_card_front_1
     * @param $ext 强制后缀  给空值则会根据临时文件路径取值
     */
    public function formal_upload($temp_file,$array,$ext='.jpg'){
        if(empty($array)){
            return false;
        }
        $save_path= './Uploads/';
        if(!$ext){
            $ext='.'.pathinfo($temp_file, PATHINFO_EXTENSION);
        }
        $new_file_name=implode('_',$array).$ext;
        $new_file_name=$save_path.$new_file_name;
        $dir_name=dirname($new_file_name);
        if(!is_dir($dir_name)){
            mkdir($dir_name,0777,true);
        }
        $result=rename($temp_file,$new_file_name);
        if($result){
            return $new_file_name;
        }else{
            return false;
        }
    }

    function form_upload(){
        $data=$this->ajax_upload(true);
        exit(json_encode($data));
    }
}