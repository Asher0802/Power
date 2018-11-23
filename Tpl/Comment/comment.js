Ext.onReady(function(){
    var url=$__app__ + '/Comment/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field,true);

    //渲染函数 start
    function time(v){
        var date=new Date(parseInt(v)*1000);
        return Ext.Date.format(date,'Y-m-d h:i:s');
    }
	
	function status(v){
		if(v){
			if(v=='审核通过'){
				return '<span style="color:green">'+v+'</span>';
			}else{
				return '<span style="color:red">'+v+'</span>';
			}
		}
		
	}

    //渲染函数 end

    var comment_form = new Ext.form.FormPanel({
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
                    {name:"c_id", fieldLabel:"id",hidden:true},
                    {name:"p_name", fieldLabel:"评论产品"},
                    {name:"c_content", xtype:'textarea',fieldLabel:"评论内容"},
                ]
            }
        ]
    });

    var win=new Ext.Window({
        title : '评论信息',
        width : 400,
        autoHeight:true,
        autoScroll:true,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items : comment_form,
        buttons: [
            {text : '关闭', handler:function(){win.hide();}}
        ]
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
            {header:"ID", dataIndex:"c_id", width:50, hidden:true},
            {header:'产品名',dataIndex:'p_name',width:100},
            {header:'评论内容', dataIndex:"c_content", width:250},
            {header:'评论时间',dataIndex:'c_time',width:150,renderer:time},
            {header:'审核状态',dataIndex:'c_aud',width:100,renderer:status}
        ],
        tbar:[
            {text:'查看',handler:modify},
            '-', 
			{text:'审核通过',id:'pass',act:'审核通过',handler:aud_status},
            '-',
			{text:'审核驳回', id:'nopass',act:'审核未通过',handler:aud_status},
            '-',
            {text:'删除',handler:del},
            '-',
            {text:'刷新',handler:function(){store.reload()}}
        ],
		bbar:new Ext.PagingToolbar({
            pageSize:20,
            store:store,
            displayInfo:true,
            displayMsg:'第{0} 到 {1} 条数据 共{2}条',
            emptyMsg:'没有分类信息'
        })
    });


    new Ext.Viewport({
        layout : 'border',
        items:grid
    })
	
	grid.on('select',function(){
		 var row=SUNLINE.getSelected(grid);
		 if(row.data.c_aud!='未审核'){
			Ext.getCmp('pass').setDisabled(true);
			Ext.getCmp('nopass').setDisabled(true);
		 }else{
			Ext.getCmp('pass').setDisabled(false);
			Ext.getCmp('nopass').setDisabled(false);
		 }
	})

    function modify(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要查看的评论信息！');
            return;
        }
        win.show();
        comment_form.getForm().setValues(row.data);
    }
        
    function del(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要删除的评论信息！');
            return;
        }
        var id = row.data.c_id;
        Ext.Msg.confirm('友情提示', '您确定要删除么？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Comment/del',
                    method : 'POST',
                    params : {c_id : id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        store.reload();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '删除失败！');
                    }
                });
            }
        });
    }
	
	function aud_status(){
		var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要审核的评论信息！');
            return;
        }
		var act=this.act;
        var id = row.data.c_id;
        Ext.Msg.confirm('友情提示', '您确定要进行'+act+'操作么？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Comment/aud_status',
                    method : 'POST',
                    params : {c_id : id, act : act},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        store.reload();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                });
            }
        });
	}

	//快速搜索
    function dosearch(){
        var key=Ext.getCmp('search').getValue();
        SUNLINE.baseParams(store,{'p_name':key},true);
        store.currentPage=1;
        store.load();
    }

})