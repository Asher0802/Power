/**
 * Created by Administrator on 15-12-25.
 */
 $(function(){
        $('.img-li').toggle(function(){
            $(this).addClass('img-check');
        },function(){
            $(this).removeClass('img-check');
        })

        $('.del-btn').click(function(){
            var del_arr=[];
            if($('.img-check').length<=0){
                Ext.Msg.alert('提示','请先选至少一张图片！');
                return;
            }
            if($('.img-check').hasClass('img-cover')){
                Ext.Msg.alert('提示','包含封面图片不能删除！');
                return;
            }
            Ext.MessageBox.confirm('友情提示','确定删除吗？',function(id){
                if (id == 'yes') {
                    $('.img-check').each(function(i,v){
                        del_arr.push($(this).attr('data-index'));
                    })
                    $.ajax({
                        url:$__app__+'/Pic/del',
                        type:'post',
                        data:{ 'i_id':del_arr},
                        success:function(data){
                            if(data.status=='1'){
                                Ext.Msg.alert('提示','删除成功！');
                                //$('.img-check').remove();
                                $('.img-check').parents('.li-list').remove();
                            }else{
                                Ext.Msg.alert('提示',data.info);
                            }
                        }
                    })
                }
            })


        })

        $('.save-btn').click(function(){
            if($('.img-check').length!=1){
                Ext.Msg.alert('提示','只能选择一张图片！');
                return;
            }
            if($('.img-check').hasClass('img-cover')){
                Ext.Msg.alert('提示','该图片已经是封面了！');
                return;
            }
            Ext.MessageBox.confirm('友情提示','确定设为封面吗？',function(id){
                if (id == 'yes') {
                    var save_url=$('.img-check').find('img').attr('data-url');
                    $.ajax({
                        url:$__app__+'/Pic/save_cover',
                        type:'post',
                        data:{ 'i_url':save_url,'p_id':param.table_id},
                        success:function(data){
                            Ext.Msg.alert('提示',data.info,function(){
                                if(data.status==1){
                                    parent.main_reload();
                                }
                            });
                            $('.img-cover').removeClass('img-cover');
                            $('.img-check').addClass('img-cover');
                        }
                    })
                }
            })
        })

        $('#upload_file').uploadify({
            'queueSizeLimit' : 5,
            'fileSizeLimit' : '500KB',
            'buttonText' : '上传图片',
            'buttonClass':'upload-btn',
            'fileExt'     : '*.jpg;*.gif;*.png,*.swf',
            'swf'      : $__public__ + '/Js/uploadify/uploadify.swf',
            'uploader' : $__app__ + '/Pic/upload_pic',
            'multi': true,
            itemTemplate:'<span style="display: none"></span>',
            formData:param,
            'onUploadSuccess' : function(file, data, response) {
                var data = jQuery.parseJSON(data);
                if(data['status']==1){
                    var i_id=data['info'].i_id;
                    var i_url=$app_root+data['info'].i_url;
                    var html='<div class="li-list"><div class="img-li" data-index='+i_id+'><i class="fa fa-camera"></i><img src='+i_url+' alt="" data-url='+data['info'].i_url+'>';
                    $('.img-ul').append(html);
                    $('.img-li').removeClass('img-check');
                    $.each($('.img-li'),function(i,v){
                        $('.img-li').eq(i).toggle(function(){
                            $('.img-li').eq(i).addClass('img-check')
                        },function(){
                            $('.img-li').eq(i).removeClass('img-check')
                        })
                    });
                }else{
                    Ext.Msg.alert('提示',data.info);
                }
            },
            'onQueueFull': function (event,queueSizeLimit) {
                Ext.Msg.alert('提示','上传文件太多');
                return false;
            },
            onSelectError:function(){
                Ext.Msg.alert('提示',"上传文件太大");
            },
            'onError': function (event,ID,fileObj,errorObj) {
                Ext.Msg.alert('提示',errorObj.type + ' Error: ' + errorObj.info);
            },
            'onAllComplete' : function(event,data) {
                Ext.Msg.alert('提示',data.filesUploaded + ' files uploaded successfully!');
            }
        });

    })

