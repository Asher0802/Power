Ext.onReady(function(){
    var url=$__app__ + '/Type/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field);

    var grid=new Ext.grid.GridPanel({
        region:'center',
        store:store,
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"t_id", width:50, hidden:true},
            {header:"分类名称", dataIndex:"t_name", width:150},
            {header:'添加时间',dataIndex:'t_time',width:180,renderer:time}
        ],
        tbar:[
            {text:'添加',act:'添加',handler:modify},
            '-',
            {text:'编辑',act:'编辑',handler:modify},
            '-',
            {text:'删除',handler:del},
            '-',
            {text:'刷新',handler:function(){store.reload()}},
        ],
        bbar:new Ext.PagingToolbar({
            pageSize:20,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有分类信息'
        })
    });

    var type_form = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:5px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:100 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:80,labelAlign:"right" },
                items:[
                    {name:"t_id", fieldLabel:"分类id",hidden:true},
                    {name:"t_name", fieldLabel:"分类名称", allowBlank:false}
                ]
            }
        ]
    });

    var win=new Ext.Window({
        title : '分类管理',
        width : 350,
        autoHeight:true,
        autoScroll:true,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items : type_form,
        buttons: [
            {text : '保存',handler:doSubmit},
            {text : '关闭', handler:function(){win.hide();}}
        ]
    });

    win.on('hide',function(){
        type_form.getForm().reset();
    });
    
    new Ext.Viewport({
        layout : 'border',
        items:grid
    })

    function doSubmit(){
        var s = type_form.getForm().getValues();
        if(!type_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Type/save',
            method:'POST',
            params : s,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示','“' + s.t_name + '”'+info.msg);
                if (ret.status){
                    store.reload();
                    win.hide();
                };
                myMask.hide();
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '“' + s.u_name + '”操作失败！');
            }
        });
    }

    function del(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要删除的分类信息！');
            return;
        }
        var id = row.get('t_id'), t_name = row.get('t_name');
        Ext.Msg.confirm('友情提示', '您真的要删除“' + t_name + '”吗？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Type/del',
                    method : 'POST',
                    params : {t_id : id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        store.reload();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '用户信息删除失败！');
                    }
                });
            }
        });
    }

    function modify(b){
        if(b.act=='添加'){
            win.show();   
            win.setTitle('添加分类'); 
        }else{  
            var row=SUNLINE.getSelected(grid);
            if(!row){
                Ext.Msg.alert('友情提示','请选择您要编辑的分类信息！');
                return;
            }
            win.show();
            win.setTitle('编辑分类信息');
            type_form.getForm().setValues(row.data);
        }
    }
    
	function time(v){
        var date=new Date(parseInt(v)*1000);
        return Ext.Date.format(date,'Y-m-d h:i:s');
    }
	
})