window.loadTime = new Date();
window.org_id = 1;
window.org_name = '北京国都之旅国际旅行社有限公司';
window.org_layer = '';
window.org_bh = 'BJGD';
window.ORG = {};
var tree_id=false;


function isLoad(){
    return top.loadTime > loadTime;
}

Ext.onReady(function(){

    window.org_ComboBox = new Ext.form.ComboBox({
        name  : 'p_org_name',
        loadingText:'正在加载单位信息',
        emptyText:'请选择单位',
        fieldLabel:'所属单位',
        editable:false,
        mode: 'local',
        triggerAction:'all',
        forceSelection:true,
        selectOnFocus :true,
        autoScroll:false,
        cls:'combox_company',
        tpl: "<tpl for='.'><div style='height:200px'><div id='org_treepanel_div'></div></div></tpl>",
        store : new Ext.data.SimpleStore({fields:[],data:[[]]}),
        value : '',
        width : 350,
        resizable:true,
        listConfig : {
            width:250,
            minWidth:250
        }
    });

    var tree_store=Ext.create('Ext.data.TreeStore', {
        proxy : {
            type : 'ajax',
            url : $__app__ + '/Company/treeJson'
        },
        root: {
            expanded: true,
            text:'所有单位'
        }
    });

    function dictSearch(){
        var skey = Ext.getCmp('org_tree_Search').getValue();
        var tLoader = _org_treePanel.getLoader(), _root=_org_treePanel.getRootNode();
        tLoader.baseParams = {skey : skey};
        tLoader.load(_root);
        _root.expand();
    }

    var _org_treePanel = new Ext.tree.Panel({
        tbar : [
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'dict_Search',
                emptyText : '名称、拼音简称等',
                width:150,
                onTriggerClick:function(e){
                    dictSearch();
                },
                listeners :{
                    "specialkey" : function(_t, _e){
                        if (_e.keyCode==13)
                            dictSearch();
                    }
                }
            }
        ],
        region : 'west',
        useArrows: true,
        autoScroll: true,
        animate: true,
        height:300,
        split:true,
        containerScroll: true,
        border: false,
        store: tree_store,
        rootVisible: true
    });

    /*window._org_treePanel=Ext.create('Ext.panel.Panel',{
        tbar : [
            '快速搜索：',
            {
                xtype:'trigger',
                triggerCls : 'x-form-search-trigger',
                id:'org_tree_Search',
                emptyText : '单位名称、编号、电话等',
                width:180,
                autoCreate : {tag: "input", type: "text", autocomplete: "off",  'x-webkit-speech':'', lang:'zh-CN'}
            }
        ],
        autoHeight:true,
        width:280,
        items:[left_tree]
    });*/



    org_ComboBox.on('expand',function(){
        if (isLoad()){
            var root = _org_treePanel.getRootNode();
            _org_treePanel.getLoader().load(root);
            root.expand(true);
            window.loadTime = new Date();
        }
        if(tree_id==false){
            _org_treePanel.render('org_treepanel_div');
            tree_id=true;
        }
    });



});