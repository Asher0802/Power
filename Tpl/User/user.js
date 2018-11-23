Ext.onReady(function(){
    var url=$__app__ + '/User/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field);

    //渲染函数 start
    function time(v){
		var date=new Date(parseInt(v)*1000);
        return Ext.Date.format(date,'Y-m-d h:i:s');
    }

    //渲染函数 end

    var user_form = new Ext.form.FormPanel({
        border:false,
        layout : 'column',
        bodyStyle:'background:none; padding:5px;',
        defaults :{
            bodyStyle:'background:none;',
            layout : 'form',
            defaultType : 'textfield',
            defaults:{ width:200 },
            labelWidth:80,
            labelAlign:'right',
            border : false
        },
        items:[
            {
                columnWidth:1,
                defaults:{ width:80,labelAlign:"right" },
                items:[
                    {name:"u_id", fieldLabel:"用户id",hidden:true},
                    {name:"u_realname", fieldLabel:"真实姓名", allowBlank:false},
                    {name:"u_name", fieldLabel:"账号", allowBlank:false},
                    {name:"u_password", fieldLabel:"密码", allowBlank:false}
                ]
            }
        ]
    });

    var win=new Ext.Window({
        title : '用户管理',
        width : 300,
        autoHeight:true,
        autoScroll:true,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items : user_form,
        buttons: [
            {text : '保存',handler:doSubmit},
            {text : '关闭', handler:function(){win.hide();}}
        ]
    });


    win.on('hide',function(){
        user_form.getForm().reset();
    });

    var grid=new Ext.grid.GridPanel({
        region:'center',
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有用户信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"u_id", width:50, hidden:true},
            {header:"用户名", dataIndex:"u_name", width:110},
            {header:"真实姓名", dataIndex:"u_realname", width:130},
            {header:"用户密码", dataIndex:"u_password", width:130},
            {header:'添加时间',dataIndex:'u_time',width:160,renderer:time}
        ],
		bbar:new Ext.PagingToolbar({
            pageSize:20,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有公司信息'
        }),
        tbar:[
            {text:'添加',iconCls:'add',act:'添加',handler:modify},
            '-',
            {text:'编辑',act:'编辑',handler:modify},
            '-',
            {text:'删除',handler:del},
            '-',
            {text:'刷新',handler:function(){store.reload();}
            },
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'search',
                cls:'search-icon-cls',
                emptyText:'用户名',
                width:170,
                onTriggerClick:function (e) {
                    dosearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13){
                            dosearch();
                        }
                    }
                }
            }
        ]
    });

    new Ext.Viewport({
        layout : 'border',
        items:grid
    })

   function modify(b){
        if(b.act=='添加'){
            win.show();   
            win.setTitle('添加用户'); 
        }else{
            var row=SUNLINE.getSelected(grid);
            if(!row){
                Ext.Msg.alert('友情提示','请选择您要修改的用户信息！');
                return;
            }
            win.show();
            win.setTitle('编辑用户信息');
            user_form.getForm().setValues(row.data);
        }
    }

    function doSubmit(){
        var s = user_form.getForm().getValues();
        if(!user_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/User/save',
            method:'POST',
            params : s,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示','“' + s.u_name + '”'+info.msg);
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
            Ext.Msg.alert('友情提示','请选择您要删除的用户信息！');
            return;
        }
        var id = row.data.u_id;
        var u_name = row.data.u_name;
        Ext.Msg.confirm('友情提示', '您真的要删除“' + u_name + '”吗？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/User/del',
                    method : 'POST',
                    params : {u_id : id},
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

    //快速搜索
    function dosearch(){
        var key=Ext.getCmp('search').getValue();
        SUNLINE.baseParams(store,{'u_name':key},true);
        store.currentPage=1;
        store.load();
    }
})