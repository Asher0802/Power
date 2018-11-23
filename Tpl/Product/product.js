Ext.onReady(function(){
    Ext.tip.QuickTipManager.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    
	//商品grid数据源
    var url=$__app__ + '/Product/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field);
    
    //分类下拉框数据源
    var url=$__app__ + '/Type/dataJson';
    var field=[];
    var type_store=SUNLINE.JsonStore(url,field);

    //公司下拉框数据源
    var url=$__app__ + '/Org/dataJson';
    var field=[];
    var org_store=SUNLINE.JsonStore(url,field);

    //分类下拉框
    var type_box = new Ext.form.ComboBox({
        width:420,
        value:'',
        fieldLabel:"所属分类",
        labelWidth:100,
        id:'p_type_id',
        labelAlign:"right",
        name:'p_type_id',
        allowBlank:false,
        editable:false,
        store: type_store,
        displayField:'t_name',
        valueField:"t_id"
    });

    //公司下拉框
    var company_box = new Ext.form.ComboBox({
        width:420,
        value:'',
        fieldLabel:"所属公司",
        labelWidth:100,
        id:'p_org_id',
        labelAlign:"right",
        name:'p_org_id',
        allowBlank:false,
        editable:false,
        store: org_store,
        displayField:'org_name',
        valueField:"org_id"
    });

    //渲染函数 start

    function time(v){
       var date=new Date(parseInt(v)*1000);
        return Ext.Date.format(date,'Y-m-d h:i:s');
    }

    //渲染函数 end

    var upload_win=new Ext.Window({
        width:650,
        height:400,
        closeAction:'hide',
        modal:true,
        html:'<iframe width="100%" height="100%" name="pic_iframe"></iframe>'
    })

    var product_form = new Ext.form.FormPanel({
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
                    {name:"p_id", fieldLabel:"产品id",hidden:true},
                    {name:"p_name", fieldLabel:"产品名称", allowBlank:false},
                    company_box,
                    type_box,
                    {name:"p_price", fieldLabel:"价格", allowBlank:false},
                    {name:"p_addr", fieldLabel:"产地", allowBlank:false},
                    {name:"p_remark", fieldLabel:"备注", allowBlank:false},
                    //{name:'p_remark',fieldLable:'备注',defaultType:'textarea'}
                ]
            }
        ]
    });

    var win=new Ext.Window({
        title : '产品管理',
        width : 400,
        autoHeight:true,
        autoScroll:true,
        closeAction : 'hide',
        resizable:false,
        modal:true,
        items : product_form,
        buttons: [
            {text : '保存',handler:doSubmit},
            {text : '关闭', handler:function(){win.hide();}}
        ]
    });

    win.on('hide',function(){
        product_form.getForm().reset();
    });

    var grid=new Ext.grid.GridPanel({
        region:'center',
        store:store,
        loadMask:{msg:'数据载入中，请稍后'},
        viewConfig:{
            emptyText:'没有产品信息',
            deferEmptyText:true
        },
        columns:[
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"u_id", width:50, hidden:true},
            {header:"公司ID", dataIndex:"p_org_id", width:50, hidden:true},
            {header:"类型ID", dataIndex:"p_type_id", width:50, hidden:true},
            {header:"产品名", dataIndex:"p_name", width:120},
            {header:'价格',dataIndex:'p_price',width:100},
            {header:"所属分类", dataIndex:"t_name", width:100},
            {header:"所属公司",dataIndex:'org_name',width:100},
            {header:'图片',dataIndex:'p_img',renderer:formatPic},
            {header:"添加时间",dataIndex:'p_time',width:120,renderer:time},
            {header:"备注", dataIndex:"p_remark", width:120}
        ],
        tbar:[
            {text:'添加',act:'添加',handler:modify},
            '-',
            {text:'编辑',act:'编辑',handler:modify},
            '-',
            {text:'删除',handler:del},
            '-',
            {text:'图片管理',handler:upload_img},
            '-',
            {text:'刷新',handler:function(){store.reload()}},
            '->',
            '快速搜索:',
            {
                xtype:'trigger',
                triggerCls:'x-form-search-trigger',
                id:'hotel_search',
                cls:'search-icon-cls',
                emptyText:'产品名称',
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
        ],
		bbar:new Ext.PagingToolbar({
			pageSize:20,
			store:store,
			displayInfo:true,
			displayMsg:'第{0} 到 {1} 条数据 共{2}条',
			emptyMsg:'没有产品信息'
        })
    });


    new Ext.Viewport({
        layout : 'border',
        items:grid
    })

   function modify(b){
        if(b.act=='添加'){
            win.show();   
            win.setTitle('添加产品'); 
        }else{
            var row=SUNLINE.getSelected(grid);
            if(!row){
                Ext.Msg.alert('友情提示','请选择您要修改的产品信息！');
                return;
            }
            win.show();
            win.setTitle('编辑产品信息');
            product_form.getForm().setValues(row.data);
        }
    }

    function doSubmit(){
        var s = product_form.getForm().getValues();
        if(!product_form.form.isValid()){
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }
        var myMask=SUNLINE.LoadMask('数据提交中，请稍候...');
            myMask.show();
        Ext.Ajax.request({
            url : $__app__ + '/Product/save',
            method:'POST',
            params : s,
            success : function(response, opts){
                var ret = Ext.decode(response.responseText);
                var info=ret.info;
                Ext.Msg.alert('友情提示','“' + s.p_name + '”'+info.msg);
                if (ret.status){
                    store.reload();
                    win.hide();
                };
                myMask.hide();
            },
            failure : function(response, opts){
                myMask.hide();
                Ext.Msg.alert('友情提示', '“' + s.p_name + '”操作失败！');
            }
        });
    }
    
    function del(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要删除的产品信息！');
            return;
        }
        var id = row.data.p_id;
        var p_name = row.data.p_name;
        Ext.Msg.confirm('友情提示', '您真的要删除“' + p_name + '”吗？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Product/del',
                    method : 'POST',
                    params : {p_id : id},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        store.reload();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '产品信息删除失败！');
                    }
                });
            }
        });
    }

    //快速搜索
    function dosearch(){
        var key=Ext.getCmp('hotel_search').getValue();
        SUNLINE.baseParams(store,{skey:key},true);
        store.currentPage=1;
        store.load();
    }

    function upload_img(){
        var row=SUNLINE.getSelected(grid);
        if(!row){
            Ext.Msg.alert('友情提示','请选择您要添加图片的产品信息！');
            return;
        }
        upload_win.show();
        window.pic_iframe.location=$__app__+'/Pic/index/p_id/'+row.data.p_id;
    }

    function formatPic(v,m,r){
        var p_img = r.get("p_img");
        if(p_img!=''){
            p_img=$app_root+p_img;
            return "<img style='height: 20px;' src='" + p_img + "' qtip='<img src=\"" + p_img + "\">'>";
        }else{
            return '';
        }
    }
	
	window.main_reload=function(){
		store.load();
	}
})
