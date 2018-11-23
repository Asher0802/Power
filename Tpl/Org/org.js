
Ext.onReady(function(){
    var url= $__app__ + '/Org/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field);

    var org_form = new Ext.form.FormPanel({
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
                    {name:"org_id", fieldLabel:"公司id",hidden:true},
                    {name:"org_name", fieldLabel:"公司名称", allowBlank:false},
                    {name:"org_user", fieldLabel:"联系人", allowBlank:false},
                    {name:"org_tel", fieldLabel:"公司电话", allowBlank:false},
                    {name:"org_qq", fieldLabel:"公司qq", allowBlank:false},
                    {name:"org_addr", fieldLabel:"公司地址", allowBlank:false}
                ]
            }
        ]
    });

    var grid=new Ext.grid.GridPanel({
        region:'center',
        store:store,
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"org_id", width:50, hidden:true},
            {header:"公司名称", dataIndex:"org_name", width:100},
            {header:"联系人", dataIndex:"org_user", width:100},
            {header:"公司电话", dataIndex:"org_tel", width:120},
            {header:"公司qq", dataIndex:"org_qq", width:120},
            {header:"公司地址", dataIndex:"org_addr", width:120,renderer:adderss},
            {header:"添加时间", dataIndex:"org_time", width:120,renderer:time}
        ],
		bbar:new Ext.PagingToolbar({
            pageSize:20,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有公司信息'
        }),
        tbar:[
            {text:'添加',act:'添加',handler:modify},
            '-',
            {text:'编辑',act:'编辑',handler:modify},
            '-',
            {text:'删除',handler:del},
            '-',
            {text:'刷新',handler:function(){store.reload()}}
        ]
    });

    var win=new Ext.Window({
        title : '公司管理',
        width : 300,
        autoHeight:true,
        autoScroll:true,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items : org_form,
        buttons: [
            {text : '保存',handler:doSubmit},
            {text : '关闭', handler:function(){win.hide();}}
        ]
    });

    win.on('hide',function(){
        org_form.getForm().reset();
    });

    new Ext.Viewport({
        layout : 'border',
        items:grid
    })

    function doSubmit(){
        var s = org_form.getForm().getValues();
        if(!org_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Org/save',
            method:'POST',
            params : s,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示','“' + s._name + '”'+info.msg);
                if (ret.status){
                    store.reload();
                    win.hide();
                };
                myMask.hide();
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '“' + s.org_name + '”操作失败！');
            }
        });
    }

    function del(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要删除的公司信息！');
            return;
        }
        var id = row.data.org_id;
        var org_name = row.data.org_name;
        Ext.Msg.confirm('友情提示', '您真的要删除“' + org_name + '”吗？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Org/del',
                    method : 'POST',
                    params : {org_id : id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        store.reload();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '公司信息删除失败！');
                    }
                });
            }
        });
    }

    function modify(b){
        if(b.act=='添加'){
            win.show();   
            win.setTitle('添加公司'); 
        }else{
            var row=SUNLINE.getSelected(grid);
            if(!row){
                Ext.Msg.alert('友情提示','请选择您要修改的公司信息！');
                return;
            }
            win.show();
            win.setTitle('编辑公司信息');
            org_form.getForm().setValues(row.data);
        }
    }


    function time(v){
        var date=new Date(parseInt(v)*1000);
        return Ext.Date.format(date,'Y-m-d h:i:s');
    }

    function adderss(v,r){
		return v;
    }

})