SUNLINE = {
    /*CONFIG:{
     pj_type:_sunline_.pj_type,
     js_around:_sunline_.js_around,
     qx_grade:_sunline_.qx_grade,
     product_type:_sunline_.product_type,
     company_type:_sunline_.company_type,
     group : _sunline_.group,
     seat : [['0','不对号入座'],['1','对号入座（系统随机）'],['2','对号入座（人工选择）']],
     user_level : ['平台级', '分站级', '单位级', '部门级', '用户级']
     },*/

    //子单位控件
    'subOrg':function(opt,config){
        if (!opt) opt={};
        if(!opt.width) opt.width=230;
        if(!opt.fieldLabel) opt.fieldLabel = '选择单位';
        if(!opt.type) opt.type='buyer';
        var conf={
            name: 'p_org_name',
            loadingText:'正在加载单位信息',
            emptyText:'请选择单位',
            fieldLabel: opt.fieldLabel,
            editable:false,
            mode: 'local',
            triggerAction:'all',
            forceSelection:true,
            tpl: "<tpl for='.'><div style='height:200px'><div id='org_treepanel_div'></div></div></tpl>",
            store :new Ext.data.SimpleStore({fields:['org_name','org_id'],data:[[ _uinfo.org_name,_uinfo.u_jgid]]}) ,
            value:_uinfo.u_jgid,
            displayField :'org_name',
            valueField:'org_id',
            width :  opt.width,
            listWidth : 240
        }
        if (config) conf = Ext.apply(conf, config);
        if (opt.width) conf.width = opt.width;
        if (opt.listWidth) conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) conf.allowBlank = opt.allowBlank;
        window.org_ComboBox = new Ext.form.ComboBox(conf);
        function orgTreeSearch(){
            var skey = Ext.getCmp('org_tree_Search').getValue();
            var tLoader = org_treePanel.getLoader(), _root=org_treePanel.getRootNode();
            tLoader.baseParams = {skey : skey};
            tLoader.load(_root);
            _root.expand();
        }
        if(opt.type=='buyer'){
            json_url=$__app__ + '/Company/subOrgJson';
        }else if(opt.type=='seller'){
            json_url=$__app__ + '/Company/subOrgJson/type/seller';
        }
        org_treePanel = new Ext.tree.TreePanel({
            region : 'west',
            useArrows: true,
            rootVisible:false,
            autoScroll: true,
            animate: true,
            height:300,
            split:true,
            containerScroll: true,
            border: false,
            dataUrl:json_url,
            tbar:[
                '->','快速搜索：',
                {
                    xtype:'trigger',
                    triggerClass : 'x-form-search-trigger',
                    id:'org_tree_Search',
                    emptyText : '单位名称、编号、电话等',
                    width:150,
                    autoCreate : {tag: "input", type: "text", autocomplete: "off",  'x-webkit-speech':'', lang:'zh-CN'},
                    onTriggerClick:function(e){ orgTreeSearch(); },
                    listeners :{
                        "specialkey" : function(_t, _e){
                            if (_e.keyCode==13){ orgTreeSearch(); }
                        }
                    }
                }
            ],
            root:{
                nodeType: 'async',
                text: '所有单位',
                expanded : true
            },
            listeners: {
                "checkchange": function(node, state) {
                    var parentNode=node.parentNode;
                    var childCount = parentNode.childNodes.length;
                    parentNode.expandChildNodes();
                    if(node.text=='所有单位'){
                        if (childCount > 1) {
                            for (var i = 1; i < childCount; i++) {
                                var child = parentNode.childNodes[i];
                                var checkBox = child.getUI().checkbox;
                                child.attributes.checked = node.attributes.checked;
                                checkBox.checked = node.attributes.checked;
                            }
                            if(node.attributes.checked){
                                org_ComboBox.setValue('全部单位');
                                window.org_id_str='all';
                            }else{
                                org_ComboBox.setValue('');
                                window.org_id_str='';
                            }
                        }
                    }else{
                        var str='',value_str='';
                        if (childCount > 1) {
                            for(var i = 1; i < childCount; i++) {
                                var child = parentNode.childNodes[i];
                                if(child.attributes.checked){
                                    str+=child.text+',';
                                    value_str+=child.id+',';
                                }
                            }
                            value_str=value_str.substr(0,value_str.length-1)
                        }else{
                            var child = parentNode.childNodes[0];
                            if(child.attributes.checked){
                                str+=child.text;
                                value_str+=child.id;
                            }
                        }
                        window.org_id_str=value_str;
                        org_ComboBox.setValue(str);
                    }
                }
            }
        });
        org_ComboBox.on('expand',function(){
            org_treePanel.render('org_treepanel_div');
        });
        return org_ComboBox;
    },

    //自动完成控件 store是提供自动完成的数据源
    autoComplete:function (opt) {
        if (!opt) return null;
        if (!opt.store) return null;
        if (!opt.displayField) return null;
        if (!opt.valueField) return null;
        if (!opt.id) opt.id = Ext.id();
        if (!opt.width) opt.width = 100;
        if (!opt.fieldLabel) opt.fieldLabel = '';
        if (opt.allowBlank == null) opt.allowBlank = true;
        if (!opt.emptyText) opt.emptyText = '请输入或选择' + opt.fieldLabel;
        if (!opt.hiddenName) opt.hiddenName = opt.id + '_h';

        var _combo_config = {
            id:opt.id,
            name:opt.id,
            hiddenName:opt.hiddenName,
            fieldLabel:opt.fieldLabel,
            emptyText:opt.emptyText,
            allowBlank:opt.allowBlank,
            width:opt.width,
            queryDelay:300,
            minChars:2,
            queryParam:'skey',
            triggerAction:"all",
            store:opt.store,
            displayField:opt.displayField,
            valueField:opt.valueField,
            mode:"remote"
        };
        if (opt.maxLength) _combo_config.maxLength = opt.maxLength;
        if (opt.tpl) _combo_config.tpl = opt.tpl;
        if (opt.onChange) {
            _combo_config.listeners = {
                change:opt.onChange
            }
        };
        return new Ext.form.ComboBox(_combo_config);
    },

    /**
     * 日历控件
     obj = {
            id: string 生成对象的ID
            width: number 宽度
            fieldLabel: string 表单字段说明文本
            gang: string 联动对象的ID
            start: bool 如果是联动模式，前一个日期对象必须指定为true，后者可省略该参数
         }
     */
    ExtDateField:function (obj) {
        if (!obj) obj={};
        if (!obj.gang) obj.gang = false;
        if (!obj.id) obj.id = 'sdate';
        if (!obj.name) obj.name = obj.id;
        if (!obj.width) obj.width = 120;
        if (!obj.fieldLabel && obj.fieldLabel!==false) obj.fieldLabel = '开始时间';
        if (!obj.allowBlank) obj.allowBlank = false;
        if (!obj.editable) obj.editable = false;
        var gang = obj.gang, start = obj.start
        var config = {
            format:'Y-m-d'
        };
        if (gang) {
            config.listeners = {
                select:function (_t, _d) {
                    var sdate = _d, isChg = false;
                    var edate = Ext.getCmp(gang).getValue();
                    if (start) {
                        if (sdate > edate) isChg = true;
                    } else {
                        if (sdate < edate) isChg = true;
                    };
                    if (isChg) {
                        var ed =Ext.Date.format(_d,'Y-m-d');
                        Ext.getCmp(gang).setValue(ed);
                    };
                }
            }
        };
        config = Ext.apply(config, obj);
        return new Ext.form.DateField(config);
    },

    //票价类型Combo 门市价、同行价、代理价
    tikPriceCombo:function (id) {
        if (!id) id = 'org_fare_type';
        return new Ext.form.ComboBox({
            id:id,
            name:id,
            fieldLabel:"票价类型",
            store:new Ext.data.SimpleStore({
                fields:['value'],
                data:[['门市价'],['同行价'],['代理价']]
            }),
            mode:'local',
            valueField:'value',
            displayField:'value',
            allowBlank:false,
            triggerAction:'all',
            readOnly:false,
            editable:false
        });
    },

    //产品类型Combo update 2013.6.6
    /*productTypeCombo:function (opt) {
     if (!opt) return null;
     if (!opt.id) opt.id = Ext.id();

     return new Ext.form.ComboBox({
     id:opt.id + '_cmb',
     name:opt.id + '_cmb',
     hiddenName:opt.id,
     fieldLabel:"产品类型",
     store:new Ext.data.SimpleStore({
     fields:['value','text'],
     data:SUNLINE.CONFIG.product_type
     }),
     mode:'local',
     valueField:'value',
     displayField:'text',
     allowBlank:false,
     triggerAction:'all',
     //value:SUNLINE.CONFIG.product_type[0][0],
     editable:false
     });
     },*/

    //组别Combo update 2013.6.14
    /*groupCombo:function (opt) {
     if (!opt) return null;
     if (!opt.id) opt.id = Ext.id();
     if (!opt.fieldLabel) opt.fieldLabel = "区域分组";

     return new Ext.form.ComboBox({
     id:opt.id + '_cmb',
     name:opt.id + '_cmb',
     hiddenName:opt.id,
     fieldLabel:opt.fieldLabel,
     store:new Ext.data.SimpleStore({
     fields:['value'],
     data:SUNLINE.CONFIG.group
     }),
     mode:'local',
     valueField:'value',
     displayField:'value',
     allowBlank:false,
     triggerAction:'all',
     editable:false
     });
     },*/

    //产品列表combo
    /*productsCombo:function (opt) {
     if (!opt) return null;
     if (!opt.id) opt.id = Ext.id();
     if (!opt.fieldLabel) opt.fieldLabel = '选择产品';
     if (!opt.width) opt.width = 200;
     if (!opt.lWidth) opt.lWidth = 80;
     if(!opt.storeUrl) opt.storeUrl = $__app__ + '/Products/comboData';

     //线路列表CombobBox
     var xlComboTpl = new Ext.XTemplate(
     '<tpl for="."><div class="x-combo-list-item suntour_combo_item {p_status}" qtip="{[ values.p_type ]}:{[ values.p_name ]}">' +
     '<label style="width:' + opt.lWidth + 'px;">{[ values.p_num ]}</label>{[ this.formatName(values) ]}</div>' +
     '</tpl>',
     {
     formatName:function (values) {
     var _name = values.p_name, pname = _name.split(' '), s='';
     if (pname.length > 1) {
     for (var i=1; i<pname.length; i++){
     s += pname[i] + ' ';
     };
     _name = s;
     };
     return _name;
     }
     }
     );
     var _field = [
     {name:'p_id'},
     {name:'p_num'},
     {name:'p_name'},
     {name:'p_type'},
     {name:'p_status'}
     ];
     var _xlStore = SUNLINE.JsonStore(opt.storeUrl, _field, false);
     var config = {
     id:opt.id + '_txt',
     name:opt.id + '_txt',
     emptyText:opt.fieldLabel,
     fieldLabel:opt.fieldLabel,
     width:opt.width,
     hiddenName:opt.id,
     hiddenId:opt.id,
     allQuery:'',
     loadingText:'正在加载线路信息',
     minChars:2,
     queryDelay:300,
     tpl:xlComboTpl,
     queryParam:'skey',
     triggerAction:'all',
     selectOnFocus:true,
     forceSelection:true,
     store:_xlStore,
     displayField:'p_name',
     valueField:'p_id',
     mode:'remote',
     pageSize:20
     };
     if (opt.listWidth) config = Ext.apply(config, {listWidth:opt.listWidth});
     var _xlCombo = new Ext.form.ComboBox(config);
     return _xlCombo;
     },*/

    //结算周期Combo
    settleCombo:function (id) {
        if (!id) id = 'org_clearing';
        var v_settle_day = new Ext.form.ComboBox({
            id:id + '_txt',
            name:id + '_txt',
            hiddenName:id,
            fieldLabel:"结算周期",
            store:new Ext.data.SimpleStore({
                fields:['value', 'text'],
                data:[[15,"半月"],[30,"一个月"]]
            }),
            mode:'local',
            displayField:'text',
            valueField:'value',
            triggerAction:'all',
            allowBlank:false,
            readOnly:false,
            editable:false
        });
        return v_settle_day;
    },

    //结算周期的渲染函数
    /*renderSettle : function (v) {
     var _s = SUNLINE.CONFIG.js_around, _d = '未知周期' + v;
     if (v == '' || v == null) return _d;
     for (var i = 0; i < _s.length; i++) {
     if (v == _s[i][0]) return _s[i][1];
     };
     return _d;
     },*/

    //权限等级Combo '平台级', '分站级', '单位级', '部门级', '用户级',
    gradeCombo:function () {
        return new Ext.form.ComboBox({
            id:"u_dj",
            name:"u_dj",
            fieldLabel:"用户等级",
            store:new Ext.data.SimpleStore({
                fields:['value'],
                data:[['平台级'],['分站级'],['单位级'],['部门级'],['用户级']]
            }),
            mode:'local',
            valueField:'value',
            displayField:'value',
            triggerAction:'all',
            allowBlank:false,
            readOnly:false,
            editable:false
        });
    },

    //单位
    OrgCombo:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
        if (!opt.isall) opt.isall = 'yes';
        if (!opt.labelWidth) opt.labelWidth = 60;
        if (!opt.value) opt.value = '顶级单位';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/combo', ["org_id", "org_bh", "org_name"], false);

        var org_conf = {
            id : opt.id,
            name : opt.id,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载单位信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_id',
            displayField:'org_name',
            mode:'remote',
            /*forceSelection:true,*/
            typeAhead:true,
            value:opt.value,
//            pageSize:20,
/*            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
                '<label style="width:60px;">{[ values.org_bh ]}</label>{[ this.showName(values.org_name) ]}</div>' +
                '</tpl>',
                {
                    showName : function(name){
                        var n = name.split(' '), l= n.length, s='';
                        if (l==1) return name;
                        if (l==2) return n[1];
                        for (var i=1; i<l; i++){
                            s += n[i] + " ";
                        };
                        return s;
                    }
                }
            )*/
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
//        return new Ext.form.ComboBox(org_conf);
        return Ext.create('Ext.form.ComboBox',org_conf);
    },
    //出发地
    OrgCombo_Sation:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/StationStart/combo', ["sd_id", "sd_start_type", "sd_name"], false,{pageSize:20});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载出发地信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'sd_name',
            displayField:'sd_name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //省份
    OrgCombo_Province:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Store/combo', ["id"], false,{pageSize:10});
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载省份信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'name',
            displayField:'name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    OrgCombo_Sation2:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/StationStart/combo2', ["sd_id", "sd_start_type", "sd_name"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载出发地信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'sd_name',
            displayField:'sd_name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,forceSelection:false
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    OrgCombo_res_name:function (opt, config) {     //资源名称
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Ticket/all_combo', ["sd_id"], false,{pageSize:10});
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在资源信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'name',
            displayField:'name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:false
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.labelWidth) org_conf.labelWidth = opt.labelWidth;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //微信
    OrgCombo_WxKeyword:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/WxKeyword/combo', ["wk_id",'wk_keyword','wk_msg_type'], true,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载微信信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'wk_keyword',
            displayField:'wk_keyword',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //产品
    OrgCombo_Products:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/Ticket/combo', ["p_id"], true,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载产品信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'p_name',
            displayField:'p_name',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.valueField) org_conf.valueField = opt.valueField;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //一出来不加载
    OrgCombo_Products_false:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/Ticket/combo', ["p_id"], false,{pageSize:10});
        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载产品信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'p_name_num',
            displayField:'p_name_num',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:true,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{p_num} -- {p_name}</li>',
                '</tpl>' +
                '</ul>'
            ),
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.valueField) org_conf.valueField = opt.valueField;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //导游
    OrgCombo_Guide:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamPlanTpl/guide_combo', ["gu_id"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载导游信息',
            emptyText:'可直接填写全陪导游名字',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'u_realname',
            displayField:'u_realname',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,forceSelection:false,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_realname} -- {u_mobile}</li>',
                '</tpl></ul>'
            ),
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //地陪导游
    OrgCombo_Local_Guide:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamPlanTpl/local_guide_combo', ["gu_id"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载导游信息',
            emptyText:'可直接填写地陪导游名字',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'u_realname',
            displayField:'u_realname',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,forceSelection:false,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_realname} -- {u_mobile}</li>',
                '</tpl></ul>'
            ),
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //司机
    OrgCombo_Drivers:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamPlanTpl/drivers_combo', ["d_id"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载司机信息',
            emptyText:'可直接填写司机名字',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'u_realname',
            displayField:'u_realname',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:false,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{u_realname} -- {u_mobile}</li>',
                '</tpl></ul>'
            ),
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //车
    OrgCombo_Car:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__+'/TeamPlanTpl/car_combo', ["c_id"], false,{pageSize:10});

        var org_conf = {
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            emptyText:'可直接填写车牌号',
            loadingText:'正在加载车牌号',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'c_mark',
            displayField:'c_mark',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            labelAlign:"right",
            editable:true,
            forceSelection:false,
            tpl:Ext.create('Ext.XTemplate',
                '<ul class="x-list-plain"><tpl for=".">',
                '<li role="option" class="x-boundlist-item">{c_mark} -- {c_people}人</li>',
                '</tpl></ul>'
            ),
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.name) org_conf.name = opt.name;
        if (opt.id) org_conf.id = opt.id;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        if (opt.listConfig) org_conf.listConfig = opt.listConfig;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:OrgDs};
    },
    //旅游天数
    OrgCombo3:function (opt, config,day) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.isall) opt.isall = 'yes';
        if (!opt.name) opt.name = 'ti_day';
        if(!day)day=5;
        var arr={},brr={},crr={};
        var day_store;
        var j;
        for(var i=0;i<day;i++){
            //arr[opt.name]=i+1;
            j=i+1;
            arr['ti_day']=j;
            brr[i]=arr;
        }
        crr['root']=brr;
        crr=Ext.encode(crr);
        var org_conf = {
            store : crr,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载旅游天数信息',
            minChars:2,
            labelWidth:opt.labelWidth,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'ti_day',
            displayField:'ti_day',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            pageSize:20,
            editable:true,forceSelection:true
        }
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        var dict_box=Ext.create('Ext.form.ComboBox',org_conf);
        return {box:dict_box,store:crr};
    },

    //单位
    allCompany : function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/comboAll', ["org_id", "org_bh", "org_name"], false);

        var org_conf = {
            id : opt.id,
            name : opt.id,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载单位信息',
            minChars:2,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_id',
            displayField:'org_name',
            mode:'remote',
            forceSelection:true,
            pageSize:20,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
                '<label style="width:60px;">{[ values.org_bh ]}</label>{[ this.showName(values.org_name) ]}</div>' +
                '</tpl>',
                {
                    showName : function(name){
                        var n = name.split(' '), l= n.length, s='';
                        if (l==1) return name;
                        if (l==2) return n[1];
                        for (var i=1; i<l; i++){
                            s += n[i] + " ";
                        };
                        return s;
                    }
                }
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        return new Ext.form.ComboBox(org_conf);
    },

    allWorkGroup : function(opt, config){
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '选择部门';
        if (!opt.isall) opt.isall = 'yes';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Workgroup/comboAll', ["wg_id", "wg_bh", "wg_name"], false);

        var org_conf = {
            id : opt.id,
            name : opt.id,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载部门信息',
            minChars:2,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'wg_id',
            displayField:'wg_name',
            mode:'remote',
            forceSelection:true,
            pageSize:20,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.wg_name ]}">' +
                '<label style="width:60px;">{[ values.wg_bh ]}</label>{[ values.wg_name ]}</div>' +
                '</tpl>'
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        return new Ext.form.ComboBox(org_conf);
    },

    //所有站点信息
    /*allSiteData : function (opt, config) {
     if (!opt) opt = {};
     if (!opt.id) opt.id = Ext.id();
     if (!opt.fieldLabel) opt.fieldLabel = '选择站点';
     if (!opt.isall) opt.isall = 'yes';
     var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/getSiteList', ["name", "value"], false);

     var site_conf =  {
     id : opt.id,
     name : opt.id,
     queryDelay:300,
     queryParam:'skey',
     width:100,
     minChars:2,
     loadingText:'正在加载数据',
     allQuery:'',
     forceSelection:true,
     triggerAction:"all",
     displayField:"name",
     valueField:"value",
     mode:"remote",
     emptyText:"请选择站点",
     fieldLabel:'选择站点:',
     store:OrgDs
     }

     if (config) site_conf = Ext.apply(site_conf, config);
     if (opt.width) site_conf.width = opt.width;
     if (opt.listWidth) site_conf.listWidth = opt.listWidth;
     if (opt.allowBlank!==null) site_conf.allowBlank = opt.allowBlank;
     return new Ext.form.ComboBox(site_conf);
     },*/

    //所有站点单位
    /*allCompanySite : function (opt, config) {
     if (!opt) opt = {};
     if (!opt.id) opt.id = Ext.id();
     if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
     if (!opt.isall) opt.isall = 'yes';
     var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/comboAllSite', ["org_id", "org_bh", "org_name"], false);

     var org_conf = {
     id : opt.id,
     name : opt.id,
     store : OrgDs,
     allQuery : '',
     fieldLabel : opt.fieldLabel,
     loadingText:'正在加载单位信息',
     minChars:2,
     queryDelay:300,
     queryParam:'skey',
     triggerAction:'all',
     valueField:'org_id',
     displayField:'org_name',
     mode:'remote',
     forceSelection:true,
     pageSize:20,
     tpl:new Ext.XTemplate(
     '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
     '<label style="width:60px;">{[ values.org_bh ]}</label>{[ this.showName(values.org_name) ]}</div>' +
     '</tpl>',
     {
     showName : function(name){
     var n = name.split(' '), l= n.length, s='';
     if (l==1) return name;
     if (l==2) return n[1];
     for (var i=1; i<l; i++){
     s += n[i] + " ";
     };
     return s;
     }
     }
     )
     };
     if (config) org_conf = Ext.apply(org_conf, config);
     if (opt.width) org_conf.width = opt.width;
     if (opt.listWidth) org_conf.listWidth = opt.listWidth;
     if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
     return new Ext.form.ComboBox(org_conf);
     },*/

    //单位
    company : function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
        if (!opt.isall) opt.isall = 'yes';
        if (!opt.identity) opt.identity = 'buyer';
        if (!opt.func) opt.func='buyer';
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/' + opt.func, ["org_id", "org_bh", "org_name"], false);
        OrgDs.baseParams['from'] = opt.identity;

        var org_conf = {
            id : opt.id,
            name : opt.id,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载单位信息',
            minChars:2,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_id',
            displayField:'org_name',
            mode:'remote',
            forceSelection:true,
            pageSize:20,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
                '<div style="width:100%; line-height:20px; height:20px;overflow:hidden;">' +
                '<label style="width:60px;display:inline-table;*display:block;*float:left;overflow:hidden;">{[ values.org_bh ]}&nbsp;</label>{[ this.showName(values.org_name) ]}</div>' +
                '</div>' +
                '</tpl>',
                {
                    showName : function(name){
                        var n = name.split(' '), l= n.length, s='';
                        if (l==1) return name;
                        if (l==2) return n[1];
                        for (var i=1; i<l; i++){
                            s += n[i] + " ";
                        };
                        return s;
                    }
                }
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        return new Ext.form.ComboBox(org_conf);
    },


    /**
     * 选择单位的下拉列表
     * @param opt
     * @param config
     * @return {Ext.form.ComboBox}
     * @constructor
     */
    CompanyCombo:function (opt, config) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.name) opt.name = opt.id;
        if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
        //if (!opt.isall) opt.isall='yes';
        var field = ["org_id", "org_bh", "org_name"];
        var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/combo', field, false);
        if (opt.baseParams) OrgDs.baseParams = Ext.apply(OrgDs.baseParams, opt.baseParams);
        var org_conf = {
            id : opt.id + '_txt',
            name : opt.id + '_txt',
            hiddenName : opt.name,
            store : OrgDs,
            allQuery : '',
            fieldLabel : opt.fieldLabel,
            loadingText:'正在加载单位信息',
            minChars:2,
            queryDelay:300,
            queryParam:'skey',
            triggerAction:'all',
            valueField:'org_id',
            displayField:'org_name',
            mode:'remote',
            forceSelection:true,
            pageSize:20,
            //listWidth : 300,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
                '<label style="width:60px;">{[ values.org_bh ]}</label>{[ this.showName(values.org_name) ]}</div>' +
                '</tpl>',
                {
                    showName : function(name){
                        var n = name.split(' '), l= n.length, s='';
                        if (l==1) return name;
                        if (l==2) return n[1];
                        for (var i=1; i<l; i++){
                            s += n[i] + " ";
                        };
                        return s;
                    }
                }
            )
        };
        if (config) org_conf = Ext.apply(org_conf, config);
        if (opt.width) org_conf.width = opt.width;
        if (opt.listWidth) org_conf.listWidth = opt.listWidth;
        if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
        return new Ext.form.ComboBox(org_conf);
    },


    //公司类型
    CompanyTypeComob:function (id) {

        if (!id) id = 'org_type';
        return new Ext.form.ComboBox({
            id:id + '_txt',
            name:id + '_txt',
            hiddenName:id,
            fieldLabel:"单位类型",
            store:new Ext.data.SimpleStore({
                fields:['value', 'text'],
                data:[["1","银行"],['2','保险公司'],['3','汽车公司']]
            }),
            mode:'local',
            displayField:'text',
            valueField:'value',
            triggerAction:'all',
            allowBlank:false,
            readOnly:false,
            editable:false
        });
    },
    LocalComob:function(opt){
        var _cof={
            xtype:"combo",
            name:opt.id,
            width:90,
            allowBlank:false,
            store:new Ext.data.SimpleStore({
                fields:opt.fields,
                data:opt.data
            }),
            triggerAction:"all",
            editable:false,
            valueField:opt.id,
            displayField:opt.id,
            mode:"local"
        };
        _cof=Ext.apply(_cof,opt.config);
        var local_box=Ext.create('Ext.form.ComboBox', _cof);
        return local_box;
    },
    //知识库类型的选择控件
    KnowhowComob:function(){
        var opt = { id:'k_type', fieldLabel:"类型" , type:'知识库'};
        return new SUNLINE.DictComboBox(opt);
    },

    //用户列表
    UsersCombo:function (opt) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.width) opt.width = 200;
        if (!opt.listWidth) opt.listWidth = opt.width;
        if (!opt.hiddenName) opt.hiddenName = opt.id + '_hidden';
        if (!opt.fieldLabel) opt.fieldLabel="选择用户";
        if (!opt.identity) opt.identity = 'buyer';
        var UserDs = new SUNLINE.JsonStore($__app__ + '/Users/comboData', ["u_id","u_name","u_zname","u_zt"], false);
        if(opt.user_id) UserDs.baseParams["u_jgid"]=opt.user_id;
        if(opt.baseParams) {
            var bpm = UserDs.baseParams;
            var nb = Ext.apply(bpm, opt.baseParams)
            UserDs.baseParams = nb;
        };
        UserDs.baseParams['identity'] = opt.identity;
        var _usersBox = new Ext.form.ComboBox({
            id:opt.id,
            name:opt.id,
            hiddenName:opt.hiddenName,
            queryDelay:300,
            minChars:2,
            fieldLabel:opt.fieldLabel,
            loadingText:'正在加载用户信息',
            allQuery:'',
            queryParam:'skey',
            triggerAction:"all",
            store:UserDs,
            displayField:"u_zname",
            valueField:"u_id",
            mode:"remote",
            //forceSelection:true,
            pageSize:15,
            width:opt.width,
            listWidth:opt.listWidth,
            tpl:new Ext.XTemplate(
                '<tpl for="."><div class="x-combo-list-item suntour_combo_item {[values.u_zt]}" qtip="{[ values.u_name ]}:{[ values.u_zname ]}">' +
                '<label style="width:60px;">{[ values.u_name ]}</label>{[ values.u_zname ]}</div>' +
                '</tpl>'
            )
        });
        return _usersBox;
    },

    /**
     * 字典表对应控件
     * @param option
     * @constructor
     */
    DictComboBox:function (option) {
        if (!option) return null;
        if (!option.type) return null; // 字典表里的分组标识
        if (!option.id) option.id = Ext.id();
        if (option.hideLabel == null) option.hideLabel = false;
        if (!option.fieldLabel) option.hideLabel = true;
        if (option.allowBlank == null) option.allowBlank = true;
        if (option.forceSelection == null) option.forceSelection = true;
        if (option.editable == null) option.editable = false;
        var url = $__app__ + '/Dict/getDictType/';
        var DictJson = new SUNLINE.JsonStore(url, ["id","text"], false);
        DictJson.baseParams = {type:option.type};
        var opt = {
            id:option.id,
            name:option.name ? option.name : option.id,
            hideLabel:option.hideLabel,
            fieldLabel:option.fieldLabel,
            queryDelay:300,
            minChars:2,
            loadingText:'正在加载信息',
            allQuery:'',
            queryParam:'skey',
            triggerAction:"all",
            store:DictJson,
            displayField:"text",
            valueField:"text",
            mode:"remote",
            allowBlank: option.allowBlank,
            forceSelection:option.forceSelection,
            editable:option.editable
        };
        if (option.emptyText) opt.emptyText = option.emptyText;
        return new Ext.form.ComboBox(opt);
    },

    //省份、城市
    provinceCity:function () {
        var stStore = new Ext.data.Store({
            proxy:new Ext.data.HttpProxy({url:$__app__ + '/City/provniceData'}),
            reader:new Ext.data.JsonReader({totalProperty:'total',root:'root'}, ['state'])
        });

        var provinceCombo = new Ext.form.ComboBox({
            fieldLabel:'省份',
            name:'org_province',
            editable:false,
            store:stStore,
            triggerAction:'all',
            displayField:'state',
            valueField:'state',
            mode:'remote',
            allowBlank:false,
            listeners:{
                collapse:function (_t) {
                    //  if(Ext.getCmp(id)) Ext.getCmp(id).setValue('');
                    ctStore['baseParams'] = {state:_t.getValue()};
                    ctStore.load();
                }
            },
            pageSize:20,
            listWidth:250
        });
        var ctStore = new Ext.data.Store({
            proxy:new Ext.data.HttpProxy({url:$__app__ + '/City/dataJson'}),
            reader:new Ext.data.JsonReader({
                totalProperty:'total',
                root:'root'
            }, [
                {name:'id'},
                {name:'city'}
            ])
        });
        var cityCombox = new Ext.form.ComboBox({
            fieldLabel:"城市",
            allowBlank:false,
            id:'org_city',
            loadingText:'正在加载城市信息',
            minChars:1,
            queryDelay:300,
            queryParam:'skey',
            selectOnFocus:true,
            forceSelection:true,
            store:ctStore,
            triggerAction:'all',
            displayField:'city',
            valueField:'city',
            pageSize:20,
            mode:'remote',
            listWidth:230
        });
        return [provinceCombo, cityCombox];
    },

    //省份选择控件
    provinceCombo : function(name){
        if (!name) name = 'org_province';
        var provinceStore = SUNLINE.JsonStore($__app__ + '/CityThree/province',[ 'name', 'ename', 'id'],false);
        return new Ext.form.ComboBox({
            fieldLabel:'省份',
            name:name,
            editable:false,
            store:provinceStore,
            triggerAction:'all',
            displayField:'name',
            valueField:'name',
            mode:'remote',
            allowBlank:false
        });
    },

    //市选择控件
    cityCombo : function(name){
        if (!name) name = 'org_city';
        var cityStore = SUNLINE.JsonStore($__app__ + '/CityThree/city', [ 'name', 'ename', 'id'], false);
        return new Ext.form.ComboBox({
            fieldLabel:"城市",
            allowBlank:false,
            id:name,
            name:name,
            loadingText:'正在加载城市信息',
            minChars:1,
            queryDelay:300,
            queryParam:'skey',
            selectOnFocus:true,
            forceSelection:true,
            store:cityStore,
            triggerAction:'all',
            displayField:'name',
            valueField:'name',
            pageSize:20,
            mode:'remote'
        });
    },

    //地区/县选择控件
    countyCombo : function(name, allowBlank){
        if (!name) name = 'org_county';
        if (allowBlank==null) allowBlank = false;
        var countyStore = SUNLINE.JsonStore($__app__ + '/CityThree/county', [ 'name', 'ename', 'id'], false);
        return new Ext.form.ComboBox({
            fieldLabel:"区/县",
            allowBlank:allowBlank,
            id:name,
            name:name,
            loadingText:'正在加载区/县信息',
            minChars:1,
            queryDelay:300,
            queryParam:'skey',
            selectOnFocus:true,
            forceSelection:true,
            store:countyStore,
            triggerAction:'all',
            displayField:'name',
            valueField:'name',
            pageSize:20,
            mode:'remote'
        });
    },


    OrgTreePanel:function (config) {
        var cfg = {
            useArrows:true,
            autoScroll:true,
            animate:true,
            height:200,
            containerScroll:true,
            border:false,
            dataUrl:$__app__ + '/Company/dataJson',

            root:{
                nodeType:'async',
                text:ORGTree.rootText,
                id:ORGTree.rootId,
                expanded:true
            }
        };
        if (!config) { config = {} };

        var option = Ext.apply(cfg, config);

        return new Ext.tree.TreePanel(option);
    },
    //通用的创建JsonStore数据源方法
    JsonStore:function (url, field, autoLoad, opt) {
        /*if (!reader) {
         reader = { totalProperty:'total', root:'root' };
         };
         if (autoLoad == null) autoLoad = true;
         var tempStore = new Ext.data.Store({
         proxy:new Ext.data.HttpProxy({url:url}),
         reader:new Ext.data.JsonReader(reader, field),
         autoLoad:autoLoad
         });
         return tempStore;*/
        if (autoLoad == null) autoLoad = true;
        Ext.define('Company',{
            extend: 'Ext.data.Model',
            fields: field
        });

        var pageSize=pageSize?pageSize:20;
        var _opt={
            model: 'Company',
            pageSize:pageSize,
            groupField: 'wg_type',
            proxy: {
                type: 'ajax',
                url : url,
                actionMethods:{
                    create:'POST',
                    read:'POST',
                    update:'POST',
                    destroy:'POST'
                },
                reader: {
                    type: 'json',
                    root : 'root',
                    totalProperty  : 'total'
                },
               // extraParams:reader
            },
            autoLoad:autoLoad
        };
        _opt=Ext.apply(_opt,opt);
        var store = Ext.create('Ext.data.Store', _opt);
        return store;
    },

    //创建分组显示的数据源
    GroupingStore:function (url, field, grouping, autoLoad, reader) {
        /*if (!grouping) return null;
         if (!reader) {
         reader = { totalProperty:'total', root:'root' };
         };
         if (autoLoad == null) autoLoad = true;
         var _config = {
         proxy:new Ext.data.HttpProxy({url:url}),
         reader:new Ext.data.JsonReader(reader, field),
         autoLoad:autoLoad
         };
         _config = Ext.apply(_config, grouping);

         var tempStore = new Ext.data.GroupingStore(_config);
         return tempStore;*/
        if (autoLoad == null) autoLoad = true;
        Ext.define('Company',{
            extend: 'Ext.data.Model',
            fields: field
        });

        var pageSize=pageSize?pageSize:20;
        var _config={
            model: 'Company',
            pageSize:pageSize,
            groupField: 'wg_type',
            proxy: {
                type: 'ajax',
                url : url,
                actionMethods:{
                    create:'POST',
                    read:'POST',
                    update:'POST',
                    destroy:'POST'
                },
                reader: {
                    type: 'json',
                    root : 'root',
                    totalProperty  : 'total'
                }
            },
            autoLoad:autoLoad
        };
        _config = Ext.apply(_config, grouping);
        var store = Ext.create('Ext.data.Store', _config);
        return store;
    },

    //周几有效的选择控件
    weekCheckboxGroup:function (opt) {
        if (!opt) opt = {};
        if (!opt.fieldLabel) opt.fieldLabel = "周几有效";
        if (!opt.width) opt.anchor = '100%';
        if (!opt.name) opt.name = 'week';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_field = new Ext.form.Hidden({name:opt.hiddenName});

        var wconf = {
            fieldLabel:opt.fieldLabel,
            columns:8,
            items:[
                {boxLabel:'全选',name:'all',listeners:{ 'change':function (gp,nv,ov,eOpts) {
                    // 全选
                    if(nv && !ov)
                        return wCheckboxGroup.eachBox(function(box,idx){
                            box.setRawValue(true);
                            //wCheckboxGroup.setValue([true, true, true, true, true, true, true, true]);
                        });
                    // 反选
                    if(ov && !nv)
                        return wCheckboxGroup.eachBox(function(box,idx){
                            box.setRawValue(false);
                        });
                } }},
                {boxLabel:'周一', name:opt.name + '[]', id:opt.name + '1', inputValue:'1'},
                {boxLabel:'周二', name:opt.name + '[]', id:opt.name + '2', inputValue:'2'},
                {boxLabel:'周三', name:opt.name + '[]', id:opt.name + '3', inputValue:'3'},
                {boxLabel:'周四', name:opt.name + '[]', id:opt.name + '4', inputValue:'4'},
                {boxLabel:'周五', name:opt.name + '[]', id:opt.name + '5', inputValue:'5'},
                {boxLabel:'周六', name:opt.name + '[]', id:opt.name + '6', inputValue:'6'},
                {boxLabel:'周日', name:opt.name + '[]', id:opt.name + '0', inputValue:'0'}
            ]
        };
        if (opt.anchor) wconf.anchor = opt.anchor;
        if(opt.config) Ext.apply(wconf,opt.config);
        var wCheckboxGroup=Ext.create('Ext.form.CheckboxGroup',wconf);
        wCheckboxGroup.on('change', function (cg, chk,ov,eOpts) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                }
            };
            real_field.setValue(ckd_val.join(','));
        });

        function selectAll(v) {
            wCheckboxGroup.setValue([v, v, v, v, v, v, v, v]);
        };

        var obj = [wCheckboxGroup];
        if (opt.id) obj.push(real_field);
        return obj[0];
    },
    //周几有效分3列
    weekCheckboxGroupThree:function (opt) {
        if (!opt) opt = {};
        if (!opt.fieldLabel) opt.fieldLabel = "周几有效";
        if (!opt.width) opt.anchor = '100%';
        if (!opt.name) opt.name = 'week';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_field = new Ext.form.Hidden({name:opt.hiddenName});

        var wconf = {
            fieldLabel:opt.fieldLabel,
            columns:4,
            items:[
                {boxLabel:'全选',name:'all',listeners:{ 'change':function (gp,nv,ov,eOpts) {
                    // 全选
                    if(nv && !ov)
                        return wCheckboxGroup.eachBox(function(box,idx){
                            box.setRawValue(true);
                            //wCheckboxGroup.setValue([true, true, true, true, true, true, true, true]);
                        });
                    // 反选
                    if(ov && !nv)
                        return wCheckboxGroup.eachBox(function(box,idx){
                            box.setRawValue(false);
                        });

                } }},
                {boxLabel:'周一', name:opt.name + '[]', id:opt.name + '1', inputValue:'1'},
                {boxLabel:'周二', name:opt.name + '[]', id:opt.name + '2', inputValue:'2'},
                {boxLabel:'周三', name:opt.name + '[]', id:opt.name + '3', inputValue:'3'},
                {boxLabel:'周四', name:opt.name + '[]', id:opt.name + '4', inputValue:'4'},
                {boxLabel:'周五', name:opt.name + '[]', id:opt.name + '5', inputValue:'5'},
                {boxLabel:'周六', name:opt.name + '[]', id:opt.name + '6', inputValue:'6'},
                {boxLabel:'周日', name:opt.name + '[]', id:opt.name + '0', inputValue:'0'}
            ]
        };
        if (opt.anchor) wconf.anchor = opt.anchor;
        if(opt.config) Ext.apply(wconf,opt.config);
        var wCheckboxGroup=Ext.create('Ext.form.CheckboxGroup',wconf);
        wCheckboxGroup.on('change', function (cg, chk,ov,eOpts) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                }
            };
            real_field.setValue(ckd_val.join(','));
        });

        function selectAll(v) {
            wCheckboxGroup.setValue([v, v, v, v, v, v, v, v]);
        };

        var obj = [wCheckboxGroup];
        if (opt.id) obj.push(real_field);
        return obj[0];
    },
    LoadMask:function(msg){
        return new Ext.LoadMask(Ext.getBody().component, {msg:msg});
    },
    getSelected:function(grid){
        return grid.getSelectionModel().getSelection()[0];
    },
    //渲染周几有效的函数
    weekRenderer:function (value, metaData, record, rowIndex, colIndex, store) {
        var str = "一,二,三,四,五,六,日";
        if (value) {
            value = value.replace('1', '一');
            value = value.replace('2', '二');
            value = value.replace('3', '三');
            value = value.replace('4', '四');
            value = value.replace('5', '五');
            value = value.replace('6', '六');
            value = value.replace('0', '日');
            value = value.replace('7', '日'); //兼容老数据

            var tmp = value.split(',');
            for (var i=0; i<tmp.length; i++){
                str = str.replace(tmp[i], "<span>"+ tmp[i] +"</span>");
            };
        };
        return '<span class="weekly">'+str+'</span>';
    },

    //设置周几有效的值（选中状态）
    weekSetValues:function (chechboxGroup, value) {
        if (!value) return false;
        var va = value.split(',');
        var values = [false, false, false, false, false, false, false, false];
        for (var i = 0; i < va.length; i++) {
            var xb = (va[i]==0) ? 7 : va[i];
            values[xb] = true;
        };
        if (va.length == 7) values[0] = true;
        chechboxGroup.eachBox(function(box,idx){
            if(values[idx]){
                box.setRawValue(true);
            }
        });
    },

    //获取周几有效的值
    weekGetValues:function (chechboxGroup) {
        if (chechboxGroup[1])
            return chechboxGroup[1].getValue();
        else
            return null;
    },

    //产品类型选择控件
    productType : function(opt){
        if (!opt.fieldLabel) opt['fieldLabel'] = '产品类型';
        if (!opt.name) opt.name = 'product_type';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.width) opt.anchor = '100%';
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_field = new Ext.form.Hidden({name:opt.hiddenName});

        var data = [[10,"短线"],[11,"长线"]];
        var items = [];
        for (var $i=0; $i<data.length; $i++){
            items.push({ boxLabel:data[$i][1], name:opt.name + '[]', id:opt.name + $i, inputValue:data[$i][0] });
        };

        var cg_conf = {
            fieldLabel:opt.fieldLabel,
            columns:3,
            items:items
        };
        if (opt.anchor) cg_conf.anchor = opt.anchor;
        var ptCheckboxGroup = new Ext.form.CheckboxGroup(cg_conf);
        ptCheckboxGroup.on('change', function (cg, chk) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                };
            };
            real_field.setValue(ckd_val.join(','));
        });
        return [ptCheckboxGroup,real_field];
    },

    //设置周几有效的值（选中状态）
    productTypeSetValues:function (chechboxGroup, value) {
        if (!value) return false;
        var data = _sunline_.product_type_id;
        var va = value.split(',');
        var values = [];
        for (var i = 0; i < data.length; i++) {
            var val = true, ext=false;
            for (var v=0; v<va.length; v++){
                if ( va[v] == data[i] ){
                    ext = true; break;
                };
            };
            if ( !ext ) val = false;
            values.push(val);
        };
        chechboxGroup[0].setValue(values);
    },

    seat_type_renderer : function(v,m,r){
        var data = SUNLINE.CONFIG.seat;
        for (var i=0; i<data.length; i++){
            var item = data[i];
            if (item[0] == v){
                return item[1];
            };
        };
        return '未知';
    },

    order_status_combo : function(opt){
        if (!opt) {
            opt = {id:"o_status", width:100, name:"o_status"};
        };
        if (!opt.width) opt.width = 100;
        if (!opt.emptyText) opt.emptyText = '请选择订单状态';
        var option = {
            triggerAction:"all",
            store:new Ext.data.SimpleStore({
                fields:['o_status'],
                data:[
                    ['全部状态'],['待确认'],['待付款'],['已付款'],
                    ['申请退票'],['交易成功'],['退票'],['结算中'],
                    ['已结算'],['问题订单']
                ]
            }),
            displayField:"o_status",
            valueField:"o_status",
            mode:"local",
            editable : false,
            fieldLabel:"订单状态"
        };
        option = Ext.apply(option, opt);
        return new Ext.form.ComboBox(option);
    },

    stop_sale_time_tool: function (opt) {
        if (!opt) opt = {};
        if (!opt.id) opt.id = Ext.id();
        if (!opt.fieldLabel) opt.fieldLabel = '停售时间';
        if (!opt.defaultTime) opt.defaultTime = 30;
        if (!opt.hiddenField) opt.hiddenField = 'bl_stop_sale';
        var option = {
            loadingText: '正在加载时间选择工具',
            emptyText: '请填写时间',
            editable: false,
            mode: 'local',
            triggerAction: 'all',
            forceSelection: false,
            listWidth: 300,
            tpl: "<tpl for='.'><div style='height:100px'><div id='time_tool_div_" + opt.id + "'></div></div></tpl>",
            store: new Ext.data.SimpleStore({fields: [], data: [
                []
            ]})
        };
        option = Ext.apply(option, opt);
        var time_tool = new Ext.form.ComboBox(option);
        var show_tip, show_tip_unit;
        var time_tool_form = new Ext.form.FormPanel({
            //frame : true,
            border: false,
            labelAlign: 'top',
            bodyStyle: 'padding:5px',
            defaults: { anchor: '100%'},
            defaultType: 'radio',
            items: [
                {xtype: 'displayfield', hideLabel: true, value: '请设定一个发团前停止售票的时间。'},
                {fieldLabel: '时间间隔',labelWidth:60,id: 'time_value_' + opt.id, name: 'time_value', xtype: 'numberfield', maxValue: 999, minValue: 0, value: opt.defaultTime, allowDecimals: false},
                {fieldLabel: '时间单位',labelWidth:60,
                    id: 'time_unit_m_' + opt.id,
                    checked: ($product_type == 10) ? true : false,
                    boxLabel: '分钟',
                    cls: 'time_unit',
                    name: 'time_unit',
                    inputValue: '分钟'
                },
                {
                    fieldLabel: ' ',labelWidth:60,labelSeparator:'',
                    boxLabel: '小时',
                    checked: ($product_type == 11) ? true : false,
                    cls: 'time_unit',
                    name: 'time_unit',
                    inputValue: '小时'
                },
                {
                    fieldLabel:' ',labelWidth:60,labelSeparator:'',
                    boxLabel: '天',
                    checked: ($product_type == 20) ? true : false,
                    cls: 'time_unit',
                    name: 'time_unit',
                    inputValue: '天'
                }
            ],
            buttonAlign: 'center',
            buttons: [
                { text: '确定', handler: function () {
                    var v = time_tool_form.getForm().getValues();
                    if (!v.time_value) {
                        //Ext.Msg.alert('友情提示','请填写正确的时间间隔数值。');
                        if (!show_tip) {
                            show_tip = new Ext.ToolTip({
                                target: 'time_value_' + opt.id,
                                anchor: 'top',
                                anchorOffset: 20, // center the anchor on the tooltip
                                html: '请填写正确的时间间隔数值。'
                            });
                        }
                        ;
                        show_tip.show();
                    }
                    ;
                    if (!v.time_unit) {
                        if (!show_tip_unit) {
                            show_tip_unit = new Ext.ToolTip({
                                target: 'time_unit_m_' + opt.id,
                                anchor: 'right',
                                anchorOffset: 3,
                                html: '请选择时间单位。'
                            });
                            show_tip_unit.show();
                        }
                        ;
                    }
                    ;
                    time_tool.setValue('提前' + v.time_value + v.time_unit);
                    time_tool.collapse();
                }}
            ]
        });

        var unit = {'10': '分钟', '11': '小时', '20': '天'};
/*        time_tool.on('boxready',function(){
            alert(111);

        });*/
        time_tool.on('expand', function () {
            if(Ext.get('time_tool_div_' + opt.id).getHtml()==''){
                time_tool_form.render('time_tool_div_' + opt.id);
            }
            var sv = time_tool.getValue();
            if (sv) {
                sv = sv.replace('提前', '');
                var tv = parseInt(sv), tu = sv.replace(tv, '');
                tu = tu ? tu : unit[$product_type] ? unit[$product_type] : '分钟';
                var json = {time_value: tv, time_unit: tu};
                setTimeout(function () {
                    time_tool_form.getForm().setValues(json);
                }, 300);
            }
        });

        return time_tool;
    },

    /**
     * 供应商选择列表
     * @param option
     * @return {*}
     */
    supplier_combo : function(option){
        if (!option['identity']) option['identity'] = 'buyer'; // seller
        var conf = {
            type : 'supplier',
            rootText: '所有供应商',
            emptyText:'请选择供应商',
            id : option.id,
            fieldLabel: option.fieldLabel?option.fieldLabel:'供应商',
            baseParams:{_in:'org_type::single,,many', type:'supplier', identity:option['identity']}
        };
        var _otype = _uinfo.org_type;
        if ( in_array( _uinfo.u_dj, SUNLINE.CONFIG.user_level )>2 ){
            if (_otype == 'many' || _otype=='single'){
                conf['disabled']=true;
            }
        }

        return SUNLINE.org_tree_combo(conf);
    },

    /**
     * 团队供应商选择列表
     * @param option
     * @return {*}
     */
    /*team_supplier_combo : function(option){
     if (!option['identity']) option['identity'] = 'buyer'; // seller
     var conf = {
     type : 'supplier',
     rootText: '所有供应商',
     emptyText:'请选择供应商',
     id : option.id,
     fieldLabel: option.fieldLabel?option.fieldLabel:'供应商',
     baseParams:{_in:'org_type::single,,many,,team,,team_temp', type:'supplier', identity:option['identity']}
     };
     var _otype = _uinfo.org_type;
     if ( in_array( _uinfo.u_dj, SUNLINE.CONFIG.user_level )>2 ){
     if (_otype == 'many' || _otype=='single'){
     conf['disabled']=true;
     }
     }

     return SUNLINE.org_tree_combo(conf);
     },*/

    /**
     * 团队单位选择列表
     * @param option
     * @return {*}
     */
    /*Team_Company : function (opt, config) {
     if (!opt) opt = {};
     if (!opt.id) opt.id = Ext.id();
     if (!opt.fieldLabel) opt.fieldLabel = '选择单位';
     if (!opt.isall) opt.isall = 'yes';
     if (!opt.org_types) opt.isall = 'yes';
     var OrgDs = SUNLINE.JsonStore($__app__ + '/Company/Team_Company', ["org_id", "org_bh", "org_name", "org_type"], false);
     OrgDs.baseParams['org_types'] = opt.org_types;
     var org_conf = {
     id : opt.id,
     name : opt.id,
     store : OrgDs,
     allQuery : '',
     fieldLabel : opt.fieldLabel,
     loadingText:'正在加载单位信息',
     minChars:2,
     queryDelay:300,
     queryParam:'skey',
     triggerAction:'all',
     valueField:'org_id',
     displayField:'org_name',
     mode:'remote',
     forceSelection:true,
     pageSize:20,
     tpl:new Ext.XTemplate(
     '<tpl for="."><div class="x-combo-list-item suntour_combo_item" qtip="{[ values.org_name ]}">' +
     '<label style="width:60px;">{[ values.org_bh ]}</label>{[ this.showName(values.org_name) ]}</div>' +
     '</tpl>',
     {
     showName : function(name){
     var n = name.split(' '), l= n.length, s='';
     if (l==1) return name;
     if (l==2) return n[1];
     for (var i=1; i<l; i++){
     s += n[i] + " ";
     };
     return s;
     }
     }
     )
     };
     if (config) org_conf = Ext.apply(org_conf, config);
     if (opt.width) org_conf.width = opt.width;
     if (opt.listWidth) org_conf.listWidth = opt.listWidth;
     if (opt.allowBlank!==null) org_conf.allowBlank = opt.allowBlank;
     return new Ext.form.ComboBox(org_conf);
     },*/

    /**
     * 分销商选择列表
     * @param option
     * @return {*}
     */
    reseller_combo : function(option){
        if (!option['identity']) option['identity'] = 'buyer'; // seller
        var conf = {
            type : 'sales',
            rootText: '所有分销商',
            emptyText:'请选择分销商',
            id : option.id,
            fieldLabel: option.fieldLabel?option.fieldLabel:'分销商',
            baseParams:{type:'sales', identity:option['identity']}
        };
        var _otype = _uinfo.org_type;
        if ( in_array( _uinfo.u_dj, SUNLINE.CONFIG.user_level )>2 ){
            if (_otype == 'sales'){
                conf['disabled']=true;
            }
        }
        return SUNLINE.org_tree_combo(conf);
    },

    /**
     * 单位选择列表
     * @param config
     * @return {Array}
     */
    org_tree_combo : function (config) {
        if (!config) config = {} ;
        if (!config.type) config.type = 'all';
        if (!config.rootText) config.rootText = '所有单位';
        if (!config.rootId) config.rootId = '0';
        if (!config.id) config.id = Ext.id();
        if (!config.name) config.name = config.id;
        if (!config.emptyText) config.emptyText = '请选择单位';
        if (!config.fieldLabel) config.fieldLabel = '选择单位';
        if (!config.values) config.values = [_uinfo.u_jgid, _uinfo.org_name];
        if (!config.identity) config.identity = 'buyer' // seller;

        var tree_cfg = {
            useArrows:true,
            autoScroll:true,
            animate:true,
            height:200,
            containerScroll:true,
            border:false,
            dataUrl:$__app__ + '/Company/treeJson/' ,

            root:{
                nodeType:'async',
                text:config.rootText,
                id:config.rootId,
                expanded:true
            }
        };
        var _org_tree = new Ext.tree.TreePanel(tree_cfg);
        var _org_tree_loader = _org_tree.getLoader();
        _org_tree_loader.baseParams = Ext.apply(_org_tree_loader.baseParams, config.baseParams);
        //_org_tree_loader.baseParams['type'] = config.type;
        //_org_tree_loader.baseParams['identity'] = config.identity;
        _org_tree.on('click', function(node){
            var v = node.text;
            v = v.replace('<b>','').replace('</b>','');
            var id = node.id;
            _combo.setValue(v);
            _hidden_name.setValue(id);
            _combo.collapse();
            var orgObj = {org_id:id, org_name:v, org_layer:node.attributes.org_layer, org_bh:node.attributes.org_bh};
            _combo.fireEvent( 'treeClick', orgObj, node.attributes );
        });

        var combo_conf = {
            loadingText:'正在加载单位信息',
            mode: 'local',
            triggerAction:'all',
            forceSelection:true,
            tpl: "<tpl for='.'><div style='height:200px'><div id='org_tree_panel_div_"+ config.id +"'></div></div></tpl>",
            store : new Ext.data.SimpleStore({fields:[],data:[[]]}),
            value : config.values[1]
        };
        combo_conf = Ext.apply(combo_conf, config);
        combo_conf['id'] = config.id + '_txt';
        combo_conf['name'] = config.name + '_txt';

        var _combo = new Ext.form.ComboBox(combo_conf);
        var _hidden_name = new Ext.form.Hidden({name:config.name, value:config.values[0]});

        _combo.on('expand', function(){
            _org_tree.render("org_tree_panel_div_"+ config.id );
        });

        return [_combo,_hidden_name];
    },

    /**
     * 获取单位选择框的值
     * @param obj
     * @return {Array}
     */
    get_org_tree_combo : function(obj){
        try{
            var id = obj[1].getValue(), name = obj[0].getValue();
            return [id, name];
        } catch(e){}
    },

    /**
     * 设置单位选择框的值
     * @param obj
     * @param values
     */
    set_org_tree_combo : function(obj, values){
        try {
            obj[1].setValue(values[0]);
            obj[0].setValue(values[1]);
        } catch (e) {}
    },


    /**
     * 图表控件
     * @param option
     */
    chart : function(option){
        if (!option) return false;
        var $o = option, $data_url, $element, $obj, $chart_path, $chart_type, $width, $height, $data_type;
        $data_url = $o.data_url ? $o.data_url : '';
        //if ( !$data_url ) return false;
        $element = $o.element ? $o.element : '';
        $chart_path = $app_public_path + 'charts/';
        $chart_type = $o.type ? $o.type : 'Column3D';
        $width = $o.width ? $o.width : 400;
        $height = $o.height ? $o.height : 300;
        $data_type = $o.data_type=='xml' ? 'xml' : 'json';

        var $js = new FusionCharts( $chart_path + $chart_type + '.swf?from=FUSIONCHARTS.COM', '_id_'+ new Date().getTime() , $width, $height, "0" );
        if ( $data_type == 'xml' && $data_url) $js.setXMLUrl($data_url);
        if ( $data_type == 'json' && $data_url) $js.setJSONUrl($data_url);
        if ( $element != '' ) $js.render($element);
        return $js;
    },
    /**
     * 附件上传插件
     * @param opt
     * @param bool
     * @param url
     * @param fields
     * @returns {GridPanel|*}
     * @constructor
     */
    UploadPanel : function(opt,bool,url,fields){
        var upload_url = $__app__ + '/Attachment/UploadJson';
        var upload_field = [ 'at_id','at_number','at_name','at_type','at_size','at_time','at_class','at_url','at_user','at_class'];
        if(url)upload_url=url;
        if(fields)upload_field=fields;
        bool=bool?bool:false;
        var upload_store = new SUNLINE.JsonStore(upload_url, upload_field,bool);
        var pageSize=20;
        upload_store.baseParams = { start:0, limit:pageSize};
        function size_format(e){
            return Math.ceil(e/1000)+'KB';
        }
        function upload_type(v,m,r){
            var t= r.get('at_type');
            if(t=='jpg' || t=='gif' || t=='png'){
                return '<a href="'+$__root__+'/'+v+'" target="_blank">' +
                    '<img src="'+$__root__+'/'+v+'" width="20px" height="20px" title="点击查看原图"></a>'
            }
            return v;
        }
        var upload_cm = new Ext.grid.ColumnModel({
            columns:[
                new Ext.grid.RowNumberer(),
                {header:"ID", dataIndex:"at_id", width:150, hidden:true},
                {header:"文件名称", dataIndex:"at_name", width:150},
                {header:"系统类别", dataIndex:"at_class", width:150},
                {header:"文件类型", dataIndex:"at_type", width:60},
                {header:"文件大小", dataIndex:"at_size", width:60,renderer:size_format},
                {header:"上传时间", dataIndex:"at_time", width:150},
                {header:"文件路径", dataIndex:"at_url", width:60,renderer:upload_type,align:'center'},
                {header:"操作人", dataIndex:"at_user", width:80}
            ],
            defaults:{sortable:true}
        });

        opt.disable=opt.disable?opt.disable:false;
        opt.value=opt.value?opt.value:'';
        opt.tit=opt.tit?opt.tit:'';
        if(opt.value)window.visa_type=opt.value;
        var at_box=SUNLINE.DictComBox({
            id:'at_class',name:'at_class',
            fieldLabel:'附件类型',
            displayField:"d_text",
            valueField:"d_text",
            disabled:opt.disable,
            value:opt.value,
            emptyText:' ==== 请选择附件类型 ===='
        },{d_type:"附件类型"});

        var upload_where={
            region:'center',
            height:200,
            border:false,
            cm:upload_cm,
            store:upload_store,
            loadMask:{msg:'数据载入中，请稍后'},
            viewConfig:{
                emptyText:'没有附件信息',
                deferEmptyText:true
            },
            tbar:[
                {text:'添加'+opt.tit,id:'att_add', iconCls:'button-add',handler:add_pic},
                '-',
                {text:'删除'+opt.tit,id:'att_del', iconCls:'button-del',handler:upload_del},
                '-',
                {text:'刷新', iconCls:'button-ref', handler:function () {
                    upload_store.reload();
                }},
                '->',
                at_box.box
            ],
            bbar:new Ext.PagingToolbar({
                pageSize:pageSize,
                store:upload_store,
                displayInfo:true,
                displayMsg:'第{0} 到 {1} 条数据 共{2}条',
                emptyMsg:'没有征信信息'
            })
        };
        upload_where = Ext.apply(opt,upload_where);
        var upload_grid = new Ext.grid.GridPanel(upload_where);
        Ext.getCmp('at_class').on({
            'select':function(c,r,i){
                upload_store.baseParams['at_class']= r.get('d_text');
                window.visa_type=r.get('d_text');
                upload_store.load();
            }
        });

        window.upload_win=new Ext.Window({
            title:'上传文件',
            width:400,
            height:140,
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            html:'<iframe id="ifm_upload" name="ifm_upload" src="" width="100%" height="140" frameborder=0></iframe>',
            buttons:[
                { text:'确认上传',handler:function(){
                    { window.ifm_upload.upload_fn(window.list_no,window.visa_type)}
                }},
                { text:'关闭',handler:function(){
                    upload_win.hide();
                }}
            ]
        });
        upload_win.on('show',function(){
            var url = $__app__ + '/Attachment/upload_win?_dc=' + time();
            window.ifm_upload.location = url;
        });

        function add_pic(){
            upload_win.show();
        }
        window.upImg=function(){
            //upload_store.baseParams={at_number:window.list_no};
            upload_grid.store.load();
        };

        function upload_del(){
            var row = upload_grid.getSelectionModel().getSelected();
            if (!row) {
                Ext.Msg.alert('友情提示', '请选择要删除的附件信息');
                return;
            };
            Ext.MessageBox.confirm('友情提示', '确定删除选中的附件信息吗？', callBack);
            function callBack(id) {
                if (id == 'yes') {
                    var mask = new Ext.LoadMask(Ext.getBody(), { msg:'正在删除，请稍后...'});
                    mask.show();
                    var s = row.data;
                    Ext.Ajax.request({
                        url:$__app__ + '/Attachment/del',
                        params:{at_id:s.at_id},
                        method:'POST',
                        success:function (response, otps) {
                            mask.hide();
                            var result = Ext.decode(response.responseText);
                            Ext.Msg.alert('友情提示', "附件信息删除成功!");
                            if(result.status ==1){
                                upload_grid.store.remove(upload_grid.getSelectionModel().getSelected());
                            }
                        },
                        failure:function (response, otps) {
                            mask.hide();
                            Ext.Msg.alert('友情提示', '删除失败');
                        }
                    })
                }
            }
        }
        return {grid:upload_grid,store:upload_store};
    },
    /**
     * 系统字典选择器插件
     * @param opt
     * @param where
     * @param url
     * @param fields
     * @returns {ComboBox}
     * @constructor
     */
    DictComBox : function(opt,where,url,fields){
        var dict_url = $__app__ + '/Dict/dict_json';
        var dict_fields=['d_id','d_text','code'];
        if(url)dict_url=url;
        if(fields)dict_fields=fields;
        var dict_store = SUNLINE.JsonStore(dict_url , dict_fields , true);
        if(where)dict_store.proxy.extraParams=where;
        //dict_store.extraParams=where;
        var opt1 = {
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            forceSelection:true,
            triggerAction:"all",
            displayField:'d_text',
            valueField:'d_text',
            mode:'remote',
            store:dict_store
        };
        opt1=Ext.apply(opt1,opt);
        var dict_box=new Ext.form.ComboBox(opt1);
        return {box:dict_box,store:dict_store};
    },
    DictComBox_false : function(opt,where,url,fields){
        var dict_url = $__app__ + '/Dict/dict_json';
        var dict_fields=['d_id','d_text','code'];
        if(url)dict_url=url;
        if(fields)dict_fields=fields;
        var dict_store = SUNLINE.JsonStore(dict_url , dict_fields , false);
        if(where)dict_store.proxy.extraParams=where;
        //dict_store.extraParams=where;
        var opt1 = {
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            queryParam:'skey',
            forceSelection:true,
            triggerAction:"all",
            displayField:'d_text',
            valueField:'d_text',
            mode:'remote',
            typeAhead:true,
            value:opt.value,
            store:dict_store
        };
        opt1=Ext.apply(opt1,opt);
        var dict_box=new Ext.form.ComboBox(opt1);
        return {box:dict_box,store:dict_store};
    },
    StationStartComBox : function(opt,where,url,fields){
        var dict_url = $__app__ + '/Dict/dict_json';
        var dict_fields=['d_id','d_text','code'];
        if(url)dict_url=url;
        if(fields)dict_fields=fields;
        var dict_store = SUNLINE.JsonStore(dict_url , dict_fields , true);
        if(where)dict_store.proxy.extraParams=where;
        //dict_store.extraParams=where;
        var opt1 = {
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            forceSelection:true,
            triggerAction:"all",
            displayField:'d_text',
            valueField:'d_text',
            mode:'remote',
            store:dict_store
        };
        opt1=Ext.apply(opt1,opt);
        var dict_box=new Ext.form.ComboBox(opt1);
        return {box:dict_box,store:dict_store};
    },
    /**
     * 面签材料插件
     * @param opt
     * @constructor
     */
    VisaView : function(){
        var visa_form = new Ext.form.FormPanel({
            border:false,
            layout:'column',
            bodyStyle:'background:none; padding:10px;',
            defaults:{
                bodyStyle:'background:none;',
                layout:'form',
                defaultType:'textfield',
                labelWidth:80,
                labelAlign:'right',
                border:false
            },
            items:[
                {
                    columnWidth:1,
                    cls:'tcol-left',
                    items:[
                        {id:'at_class1',name:'at_class',fieldLabel:'附件类别',value:'面签材料',xtype:'hidden'},
                        {id:'at_number1',name:'at_number',fieldLabel:'征信序号',disabled:true,itemCls:'ct-box-30',width:'100%'},
                        {id:'vip_name',name:'vip_name',fieldLabel:'购车人姓名',disabled:true,itemCls:'ct-box-30',labelWidth:70,width:'100%'},
                        {id:'ip_card',name:'vip_card',fieldLabel:'身份证',disabled:true,itemCls:'ct-box-40',width:'100%'}
                    ]
                }
            ]
        });
        var visa_grid=SUNLINE.UploadPanel({region:'south'});
        var visa_win = new Ext.Window({
            width:750,
            title:'面签材料管理',
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            items:[visa_form,visa_grid.grid],
            buttons:[
                {text:'面签确定提交',handler:visa_fn},
                {text:'关闭', handler:function () {
                    visa_win.hide();
                }}
            ]
        });

        visa_win.on('show',function(){
            var f = visa_form.getForm();
            f.reset();
            var opt=window.visa_order;
            window.list_no=opt.o_list_no;
            window.visa_type='面签附件';
            var d={
                at_number:opt.o_list_no,
                vip_name:opt.o_vip_name,
                ip_card:opt.o_vip_card
            };
            f.setValues(d);
        });

        function visa_fn(){
            var count = visa_grid.grid.getStore().getCount();
            if(count<=0){
                Ext.Msg.alert('友情提示', '请上传面签材料！');
                return;
            };
            var s=visa_form.getForm().getValues();
            s['at_number']=Ext.getCmp('at_number1').getValue();
            var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
            mask.show();
            Ext.Ajax.request({
                url:$__app__ + '/OrderCar/visa_save',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    mask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status==1) {
                        Ext.Msg.alert('友情提示','面签材料提交成功!');
                        visa_win.hide();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '面签材料提交失败！');
                }
            })
        };
        return {win:visa_win,store:visa_grid.store};

    },
    /**
     * 初审单内下拉列表插件
     * @param opt
     * @param action
     * @constructor
     */
    ComBoxFn : function(opt,action){
        var type_url = $__app__ + '/Dict/dist_json';
        var fields=['d_id','d_text','code','d_type'];
        var local_store;
        if(action.mode=='local'){
            local_store= new Ext.data.SimpleStore({fields : fields,data : action.storeData});
        }else{
            action.mode="remote";
            local_store = SUNLINE.JsonStore(type_url , fields , false);
        }
        var opt1 = {
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            forceSelection:true,
            triggerAction:"all",
            displayField:"d_text",
            valueField:"d_text",
            mode:action.mode,
            store:local_store
        };
        var _Box_fid_opt1 = Ext.apply(opt, opt1);
        new Ext.form.ComboBox(_Box_fid_opt1);
        if(action.mode=="remote"){
            Ext.getCmp(opt.id).on({
                'beforequery':function(){
                    if(action.baseParams['d_type']=='城市')action.baseParams['city']=window.province_val;
                    if(action.baseParams['d_type']=='区县')action.baseParams['city']=window.city_val;
                    if(action.baseParams['d_type']=='职业或职务')action.baseParams['duty']=window.duty_val;
                    local_store.baseParams=action.baseParams;
                    local_store.load();
                }
            })
        }
    },
    /**
     * 初审单项目渲染
     * @param opt
     * @param obj
     * @constructor
     */
    ItemsListTpl : function(opt,obj){
        var is_this=$(opt.id),items_tt='',fn=[],date_fn=[],order_json=opt.store;
        if(opt['items'][0]['items'].length>0){
            $.each(opt.items,function(i,v){
                var df=default_tpl(v);
                fn=fn.concat(df['fn']);
                date_fn=date_fn.concat(df['date_fn']);
                items_tt+=df['tpl']
            });
            is_this.html()
        }else{
            var df=default_tpl(opt['items']);
            items_tt=df['tpl'];
            fn=df['fn'];
            date_fn=df['date_fn'];
        }
        is_this.html(items_tt);
        //下拉框
        if(fn.length>0){
            for(var i=0;i<fn.length;i++){
                var vl=fn[i];
                if(!vl.ext_data)vl.ext_data={};
                if(vl.value)vl.ext_data.value=vl.value;
                var Ext_data=vl.ext_data;
                Ext_data.id=vl.id+'id';
                Ext_data.name=vl.name;
                Ext_data.renderTo=vl.id;
                if(!Ext_data.cls)Ext_data.cls='form_data';
                SUNLINE.ComBoxFn(Ext_data,{
                    mode:vl.mode,
                    storeData:vl.storeData,
                    baseParams:vl.params
                });
            }
        }
        var df_list=$('.df-list');
        $.each(df_list,function(i,v){
            var li=df_list.eq(i);
            var li_width=li.width();
            var lt_w=li.find('.layout-title').width();
            li.find('.form-info').width(li_width-(lt_w+10));
        });

        /*时间控件*/
        if(date_fn.length>0){
            for(var j=0;j<date_fn.length;j++){
                var va=date_fn[j];
                if(!va.ext_data)va.ext_data={};
                if(va.value){
                    va.ext_data.value=int2date(va.value);
                }
                var Ext_date=va.ext_data;
                Ext_date.id=va.id+'id';
                Ext_date.name=va.name;
                Ext_date.renderTo=va.id;
                if(!Ext_date.cls)Ext_date.cls='form_data';
                Ext_date.cls+=' '+va.type;
                SUNLINE.ExtDateField(Ext_date);
            }
        }

        if(obj)obj();
        function default_tpl(data){
            var title_h='';
            var items_info=items_list_fn(data);
            var items_list=items_info['tpl'];
            if(!data.TitleCls)data.TitleCls='';
            if(data.title)title_h='<div class="ob-title '+data.TitleCls+'">'+data.title+'</div>';
            if(data.html)title_h+=data.html;
            var tpl='<div class="df-box '+data.id+'">' + title_h +
                '<div class="ob-info"><ul>'+items_list+'</ul>' +
                '</div></div>';
            return {tpl:tpl,fn:items_info['fn'],date_fn:items_info['date_fn']};
        }
        function items_list_fn(data){
            var items=data.items;
            var items_tpl='';
            var it=['style','LayoutCls','fCls','ItemsCls','cls','TextCls','value'];
            var fn=[],date_fn=[],headler=[];
            for(var i=0;i<items.length;i++){
                var v=items[i],title_t='',form_item='',style='',read_bool='',read_cls='',date_check='';
                if(data.index>0 || v.index>0){
                    var ix=0;
                    if(data.index)ix=data.index;
                    if(v.index)ix=v.index;
                    var i_n=(ix-1);
                    v.id= v.id+'-'+i_n;
                    if(typeof order_json=='object'){
                        var i_v=order_json[(v.name).replace('[]','')];
                        if(i_v)v.value=i_v[i_n];
                    }
                }else if(typeof order_json=='object'){
                    var v_name=v.name;
                    if(v_name.indexOf('[]')>0){
                        var iv_data=order_json[(v.name).replace('[]','')];
                        if(typeof iv_data=='object'){
                            $.each(iv_data,function(ii,iv){
                                if(v.value==iv){
                                    v.checked=true;
                                    return false;
                                };
                            });
                        }
                    }else{
                        if(order_json[v.name]==0)order_json[v.name]='';
                        if(order_json[v.name]){
                            v.value=order_json[v.name];
                            date_check='checked="checked"';
                        }
                        if(v.form && order_json[v.form.name])v.form.value=order_json[v.form.name];
                    }
                }
                $.each(it,function(si,sv){ if(!v[sv])v[sv]=''; });
                var tl=items_style_fn(v, v.style);
                var check_id='<input type="checkbox" value="1" class="form-check" '+date_check+'>';
                if(v.title){
                    var title_val=v.title;
                    var title_v=title_val.replace(':','');
                    if(v.check==true) title_val+=check_id;
                    title_t='<span class="layout-title '+ v.LayoutCls+'" title="'+title_v+'">'+title_val+'</span>';
                }
                //验证条件
                var verify='',checked_v='';
                if(v.verify)verify= ' '+v.verify;
                if(v.type && v.type!='date'){
                    if(tl)style='style="'+tl+'"';
                    if(v.readOnly==true){
                        read_bool='readOnly';
                        read_cls=' readOnly_cls';
                    }
                    if(v.checked==true){
                        checked_v='checked="checked"';
                    }
                    if(v.type=='textarea'){
                        form_item='<textarea id="'+v.id+'" name="'+v.name+'" class="form_data '+ v.fCls+read_cls+verify+'" ' +
                            ''+style+' '+read_bool+'>'+ v.value+'</textarea>';
                    }else{
                        form_item='<input type="'+v.type+'" id="'+v.id+'" name="'+v.name+'" value="'+ v.value+'" ' +
                            'class="form_data '+ v.fCls+read_cls+verify+'" '+style+' '+read_bool+' '+checked_v+'>';
                        if(v.form){
                            if(!v.form.cls)v.form.cls='';
                            if(!v.form.value)v.form.value='';
                            form_item+='<input type="text" id="'+ v.form.id+'" name="'+ v.form.name+'" ' +
                                'class="'+ v.form.cls+'" value="'+ v.form.value+'" '+read_bool+'>';
                        }
                    }
                }else{
                    if(tl)style='style="'+tl+'"';
                    form_item='<em class="item-fn" '+style+' id="'+v.id+'"></em>';
                    if(verify)v.ext_data.cls='form_data '+verify;
                    if(v.type=='date'){
                        if(!v.value)v.value=order_json.server_date;
                        date_fn[date_fn.length]=v;
                    }else{
                        fn[fn.length]=v;
                    }

                }
                var style_li='';
                if(v.type=='hidden')style_li='style="display:none"';
                //提交信息
                var hint='';
                if(v.hint)hint='<i class="hint-box"><i class="fa fa-times-circle"></i> <font class="hb-t">'+v.hint+'</font><i class="fa fa-caret-down"></i></i>';
                items_tpl+='<li class="df-list '+data.ItemsCls+' '+ v.cls+' '+ (v.name).replace('[]','')+'-box" '+style_li+'><label>' +title_t+
                    '<span class="form-info'+ v.TextCls+'">'+form_item+hint+'</span>' +
                    '</label></li>';
                if(v.headler)headler[headler.length]=v;
            }
            return {tpl:items_tpl,fn:fn,date_fn:date_fn};
        }
        function items_style_fn(v,s){
            var ItemStyle={},Item_s='';
            if(Math.ceil(v.width)>0){
                ItemStyle.width= v.width+'px';
            }else{
                if(v.width)ItemStyle.width= v.width;
            };
            if(v.height)ItemStyle.height= v.height+'px';
            if(v.align)ItemStyle['text-align']=v.align;
            if(ItemStyle){
                $.each(ItemStyle,function(i,v){
                    Item_s+=i+':'+ v+';';
                });
            }
            s=Item_s+s;
            return s;
        }
    },
    RulesView : function(opt,obj){
        var rules_form = new Ext.form.FormPanel({
            border:false,
            layout:'column',
            defaultType : "textfield",
            bodyStyle:'background:#fff; padding:10px;',
            defaults:{
                bodyStyle:'background:none;',
                layout:'form',
                defaultType:'textfield',
                labelWidth:60,
                labelAlign:'right',
                border:false
            },
            items:[]
        });
        var rules_win = new Ext.Window({
            width:550,
            title:'通融申请<font color="red">(通融申请最多可申请两次)</font>',
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            items:[rules_form],
            buttons:[
                {text:'保存',handler:rules_add,id:'rsw-id'},
                {text:'关闭', handler:function () {
                    rules_win.hide();
                }}
            ]
        });
        rules_win.on('show',function(){
            if(window.rules_total>1){
                Ext.getCmp('rsw-id').setDisabled(true);
            }else{
                Ext.getCmp('rsw-id').setDisabled(false);
            }
        });
        function rules_add(){
            var f=rules_form.getForm();
            if (!f.isValid()) {
                Ext.Msg.alert('友情提示', '红色边框显示为必填项');
                return;
            };
            var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
            mask.show();
            var s = f.getValues();
            Ext.Ajax.request({
                url:$__app__ + '/StretchRules/save',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    mask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status==1) {
                        Ext.Msg.alert('友情提示','操作成功!');
                        rules_win.hide();
                        if(obj)obj(msg);
                    }else{
                        Ext.Msg.alert('友情提示', msg);
                    };
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        }
        return {win:rules_win,form:rules_form};
    },
    VerifyView : function(opt){
        var visa_type_box=SUNLINE.DictComBox({
            id:'v_result',name:'v_result',
            fieldLabel:'审核结果',
            displayField:"d_text",
            valueField:"d_text",
            itemCls:'ct-box-20',
            width:480,
            allowBlank:false
        },{d_type:opt.text+"结果"});

        var visa_vf_form = new Ext.form.FormPanel({
            region:'center',
            border:false,
            layout:'column',
            bodyStyle:'background:none; padding:10px;',
            defaults:{
                bodyStyle:'background:none;',
                layout:'form',
                defaultType:'textfield',
                labelWidth:80,
                labelAlign:'right',
                border:false
            },
            items:[
                {
                    columnWidth:1,
                    items:[
                        visa_type_box.box,
                        {id:'v_type',name:'v_type',fieldLabel:'审核类型',value:opt.text,xtype:'hidden',width:480,allowBlank:false},
                        {id:'v_number',name:'v_number',fieldLabel:'订单编号',xtype:'hidden',width:480,allowBlank:false},
                        {id:'v_info',name:'v_info',fieldLabel:'审核备注',xtype:'textarea',width:480,allowBlank:false},
                        {id:'v_uid',name:'v_uid',fieldLabel:'审核人员ID',xtype:'hidden',width:150,value:_uinfo.u_id},
                        {id:'v_user',name:'v_user',fieldLabel:'审核人员',width:150,allowBlank:false,value:_uinfo.u_zname,itemCls:'ct-box-40-left',disabled:true},
                        {id:'v_time',name:'v_time',fieldLabel:'审核时间',width:150,itemCls:'ct-box-40-left',disabled:true}
                    ]
                }
            ]
        });

        var items=[visa_vf_form];
        var visa_grid=SUNLINE.UploadPanel({region:'south'});
        if(opt.text=='面签审核'){
            items=[visa_vf_form,visa_grid.grid];
        }


        var visa_vf_win = new Ext.Window({
            width:600,
            title:opt.text+'管理',
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            items:items,
            buttons:[
                {text:'确认提交', handler:vf_save},
                {text:'确认退回', handler:vf_save},
                {text:'关闭', handler:function () {
                    visa_vf_win.hide();
                }}
            ]
        });

        visa_vf_win.on('show',function(){
            var f=visa_vf_form.getForm();
            f.reset();
            var d={
                v_number:ROW.data.o_number
            }
            f.setValues(d);
        });

        function vf_save(e){
            var f=visa_vf_form.getForm();
            if (!f.isValid()) {
                Ext.Msg.alert('友情提示', '红色边框显示为必填项');
                return;
            };
            var s = f.getValues();
            if((s.v_result).indexOf('退单')>0){
                s.v_status='退单';
            }else{
                s.v_status='通过';
            }
            if(e.text=='确认退回')s.v_status='退回';
            Ext.MessageBox.confirm('友情提示','你确定要'+s.v_result+'吗?',function(y){
                if(y!='yes')return false;
                var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
                mask.show();
                Ext.Ajax.request({
                    url:$__app__ + '/OrderCar/verify_save',
                    params:s,
                    method:'POST',
                    success:function (response, otps) {
                        mask.hide();
                        var result = Ext.decode(response.responseText);
                        var msg = result.info;
                        if (result.status==1) {
                            Ext.Msg.alert('友情提示','操作成功!');
                            f.reset();
                            opt.store.load();
                            visa_vf_win.hide();
                        }else{
                            Ext.Msg.alert('友情提示', msg);
                        };
                    },
                    failure:function (response, otps) {
                        mask.hide();
                        Ext.Msg.alert('友情提示', '操作失败！');
                    }
                })
            });
        }
        return {win:visa_vf_win,store:visa_grid.store};
    },
    safe_to_govern:function(opt){
        var today_date=int2date(server_date);
        var stand_box=SUNLINE.DictComBox({
            id:'st_stand_user',name:'st_stand_user',
            fieldLabel:'理赔专员',
            displayField:"d_text",
            valueField:"d_text",itemCls:'ct-box-40',width:130
        },{d_type:"业务员"});

        var safe_org_box=SUNLINE.DictComBox({
            id:'st_safe_org',name:'st_safe_org',
            fieldLabel:'保险公司',
            displayField:"d_text",
            valueField:"d_text",itemCls:'ct-box-100',width:476
        },{d_type:"保险公司"});

        var nature_box=SUNLINE.DictComBox({
            id:'st_nature',name:'st_nature',
            fieldLabel:'案件性质',
            displayField:"d_text",
            valueField:"d_text",itemCls:'ct-box-100',width:476
        },{d_type:"案件性质"});

        var play_type_box=SUNLINE.DictComBox({
            id:'st_play_type',name:'st_play_type',
            fieldLabel:'打款方式',
            displayField:"d_text",
            valueField:"d_text",itemCls:'ct-box-65',width:274,listWidth:'auto'
        },{d_type:"打款方式"});

        var safe_date=SUNLINE.ExtDateField({id:'st_safe_date',name:'st_safe_date',fieldLabel:'出险日期',itemCls:'ct-box-40',width:140,value:today_date});
        var seized_date=SUNLINE.ExtDateField({id:'st_seized_date',name:'st_seized_date',fieldLabel:'受理日',itemCls:'ct-box-30 label-box-60',width:100,value:today_date});
        var to_date=SUNLINE.ExtDateField({id:'st_to_date',name:'st_to_date',fieldLabel:'送交日',itemCls:'ct-box-30 label-box-60',width:95,value:today_date});
        var quit_date=SUNLINE.ExtDateField({id:'st_quit_date',name:'st_quit_date',fieldLabel:'退单日',itemCls:'ct-box-35',width:120,value:today_date});
        var again_date=SUNLINE.ExtDateField({id:'st_again_date',name:'st_again_date',fieldLabel:'再送交日',itemCls:'ct-box-30',width:95,value:today_date});
        var reckon_date=SUNLINE.ExtDateField({id:'st_reckon_date',name:'st_reckon_date',fieldLabel:'收到计算书日期',itemCls:'ct-box-40 label-box-120',width:110,value:today_date});
        var aging_date=SUNLINE.ExtDateField({id:'st_aging_date',name:'st_aging_date',fieldLabel:'时效日',itemCls:'ct-box-30 label-box-60',width:95,value:today_date});
        var go_time=SUNLINE.ExtDateField({id:'st_go_time',name:'st_go_time',fieldLabel:'回寄时间',itemCls:'ct-box-30',width:100,value:today_date});
        var play_date=SUNLINE.ExtDateField({id:'st_play_date',name:'st_play_date',fieldLabel:'打款日',itemCls:'ct-box-35',width:120,value:today_date});

        var form = new Ext.form.FormPanel({
            border:false,
            layout:'column',
            bodyStyle:'background:none; padding:5px;',
            defaults:{
                bodyStyle:'background:none;',
                layout:'form',
                defaultType:'textfield',
                labelAlign:'right',
                labelWidth:80,
                border:false
            },
            items:[
                {
                    columnWidth:1,
                    cls:'tcol-left',
                    items:[
                        {id:'st_id',name:'st_id',fieldLabel:'id',xtype:'hidden'},
                        {id:'st_number',name:'st_number',fieldLabel:'订单编号',xtype:'hidden'},
                        {id:'st_vip',name:'st_vip',fieldLabel:'客户名称',itemCls:'ct-box-50',width:200,readOnly:true},
                        {id:'st_plate',name:'st_plate',fieldLabel:'车牌号',itemCls:'ct-box-50 label-box-60',width:210},
                        {id:'st_face',name:'st_face',fieldLabel:'临牌号',itemCls:'ct-box-35',width:120},
                        {id:'st_remit',name:'st_remit',fieldLabel:'汇款账号',itemCls:'ct-box-65',width:274},
                        {id:'st_safe_id',name:'st_safe_id',fieldLabel:'保险公司ID',xtype:'hidden'},
                        safe_org_box.box,
                        safe_date,
                        seized_date,
                        to_date,
                        nature_box.box,
                        {id:'st_duty',name:'st_duty',fieldLabel:'事故责任',itemCls:'ct-box-100',width:476},
                        {id:'st_survey_price',name:'st_survey_price',fieldLabel:'代勘察费（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_fix_price',name:'st_fix_price',fieldLabel:'修理费（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_three_price',name:'st_three_price',fieldLabel:'三者修理费（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_out_price',name:'st_out_price',fieldLabel:'其他相关费用（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_total_price',name:'st_total_price',fieldLabel:'合计金额（索赔）',itemCls:'ct-box-50 label-box-130',width:135},
                        {id:'st_stand_price',name:'st_stand_price',fieldLabel:'获赔金额',itemCls:'ct-box-50 label-box-130',width:135},
                        quit_date,
                        {id:'st_quit_reason',name:'st_quit_reason',fieldLabel:'退单原因',itemCls:'ct-box-65',width:274},
                        again_date,
                        reckon_date,
                        aging_date,
                        play_date,
                        play_type_box.box,
                        {id:'st_go_user',name:'st_go_user',fieldLabel:'回寄人',itemCls:'ct-box-30',width:100},
                        go_time,
                        {id:'st_stand_uid',name:'st_stand_uid',fieldLabel:'理赔专员ID',xtype:'hidden'},
                        stand_box.box,
                        {id:'st_remark',name:'st_remark',fieldLabel:'备注',itemCls:'ct-box-100',width:476},
                        {id:'st_uid',name:'st_uid',fieldLabel:'录入人ID',xtype:'hidden',value:_uinfo.u_id},
                        {id:'st_user',name:'st_user',fieldLabel:'录入人',itemCls:'ct-box-30',width:100,value:_uinfo.u_zname,readOnly:true},
                        {id:'st_time',name:'st_time',fieldLabel:'录入日期',itemCls:'ct-box-70',width:100,value:today_date,readOnly:true}
                    ]
                }
            ]
        });

        Ext.getCmp('st_safe_org').on({
            'select':function(c,r,i){
                Ext.getCmp('st_safe_id').setValue(r.get('d_id'));
            }
        });

        var safe_win = new Ext.Window({
            width:600,
            title:'理赔记录',
            autoHeight:true,
            closeAction:'hide',
            resizable:false,
            modal:true,
            items:[form],
            buttons:[
                {text:'保存',handler:safe_save},
                {text:'关闭', handler:function () {
                    safe_win.hide();
                }}
            ]
        });

        safe_win.on('show',function(){
            var f=form.getForm();
            f.reset();
            var d={
                st_number:opt.data.o_number,
                st_vip:opt.data.o_vip_name
            };
            f.setValues(d);
        });

        function safe_save(){
            if (!form.getForm().isValid()) {
                Ext.Msg.alert('友情提示', '红色边框显示为必填项');
                return;
            };
            var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
            mask.show();
            var s = form.getForm().getValues();
            var dt=['st_safe_date','st_seized_date','st_to_date','st_quit_date','st_again_date','st_reckon_date','st_aging_date','st_play_date','st_go_time','st_time'];
            for(var i=0;i<dt.length;i++){ s[dt[i]]=str2date(s[dt[i]]); }
            Ext.Ajax.request({
                url:$__app__+'/OrderDetails/safe_to_ajax',
                params:s,
                method:'POST',
                success:function (response, otps) {
                    mask.hide();
                    var result = Ext.decode(response.responseText);
                    var msg = result.info;
                    if (result.status==1) {
                        safe_win.hide();
                        opt.store.load();
                    };
                    Ext.Msg.alert('友情提示', msg);
                },
                failure:function (response, otps) {
                    mask.hide();
                    Ext.Msg.alert('友情提示', '操作失败！');
                }
            })
        };
        return safe_win;
    },
    AjaxPost:function(opt,obj){
        var mask = new Ext.LoadMask(Ext.getBody(), {msg:'正在保存，请稍后...'});
        mask.show();
        Ext.Ajax.request({
            url:opt.url,
            params:opt.data,
            method:'POST',
            success:function (response, otps) {
                mask.hide();
                var result = Ext.decode(response.responseText);
                var msg = result.info;
                if (result.status==1) {
                    if(obj)obj(msg)
                }else{
                    Ext.Msg.alert('友情提示', msg);
                }
            },
            failure:function (response, otps) {
                mask.hide();
                Ext.Msg.alert('友情提示', '操作失败！');
            }
        })
    },
    OrderPanel:function(opt,obj){
        var pageSize=20;
        var url = $__app__ + '/Order/OrderJson';
        var field = [ 'o_id','o_number','o_vip_name','o_vip_card','o_list_no','o_uname','o_uid','o_branch','o_vip_tel','o_status'];
        if(opt.field)field=field.concat(opt.field);
        if(opt.url)url=opt.url;
        var store = new SUNLINE.JsonStore(url, field);
        if(opt.params)store.baseParams=opt.params;
        store.baseParams['start']=0;
        store.baseParams['limit']=pageSize;
        function status_fn(v){
            var r_v='';
            switch (v){
                case '征信提交':
                    r_v='<font color="red"><b>'+v+'</b></font>';
                    break;
                case '征信查询':
                    r_v='<font color="green"><b>'+v+'</b></font>';
                    break;
                case '初审提交':
                    r_v='<font color="blue"><b>'+v+'</b></font>';
                    break;
                case '初审通过':
                    r_v='<font color="blue"><b>'+v+'</b></font>';
                    break;
                case '面签提交':
                    r_v='<font color="green"><b>'+v+'</b></font>';
                    break;
                case '终审提交':
                    r_v='<font color="blue"><b>'+v+'</b></font>';
                    break;
                case '审核员审核通过':
                    r_v='<font color="green"><b>'+v+'</b></font>';
                    break;
                case '作废':
                    r_v='<font color="#aaa"><b>'+v+'</b></font>';
                    break;
                default :
                    r_v='<b>'+v+'</b>';
            }
            return r_v;
        }
        var cm=[
            new Ext.grid.RowNumberer(),
            {header:"ID", dataIndex:"o_id", width:150, hidden:true},
            {header:"送件序号", dataIndex:"o_list_no", width:90},
            {header:"订单编号", dataIndex:"o_number", width:90,hidden:true},
            {header:"客户名称", dataIndex:"o_vip_name", width:70},
            {header:"身份证", dataIndex:"o_vip_card", width:70,hidden:true},
            {header:"信贷专员", dataIndex:"o_uname", width:70},
            {header:"部门", dataIndex:"o_branch", width:70},
            {header:"状态", dataIndex:"o_status", width:120,renderer:status_fn}
        ];
        if(opt.cm)cm=cm.concat(opt.cm);
        var order_cm = new Ext.grid.ColumnModel({
            columns:cm,
            defaults:{sortable:true}
        });
        var width=460;
        if(opt.width)width=opt.width;
        var grid = new Ext.grid.GridPanel({
            region:'west',
            border:false,
            cm:order_cm,
            store:store,
            width : width,
            maxWidth : (width+40),
            minWidth : (width-60),
            style : 'border-right-width:2px;',
            loadMask:{msg:'数据载入中，请稍后'},
            viewConfig:{
                emptyText:'没有征信信息',
                deferEmptyText:true
            },
            tbar:[
                '<b>订单信息</b>'
            ],
            bbar:new Ext.PagingToolbar({
                pageSize:pageSize,
                store:store,
                displayInfo:true,
                displayMsg:'第{0} 到 {1} 条数据 共{2}条',
                emptyMsg:'没有征信信息'
            })
        });
        return {grid:grid,store:store};
    },
    baseParams:function(store,opt,extra){
        if(extra){
            Ext.apply(store.proxy.extraParams, opt);
        }else{
            store.proxy.extraParams=opt;
        }
    },
    /**
     * 城市多级联动
     * @param opt id:标示;appTo:指定父级;actionTo:指定要操作的字级;where:指定传到后台的数据;config:指定Combox的属性
     * @returns {*}
     * @constructor
     */
    ComBoxCity:function(opt){
        var _opt={};
        _opt={
            id:opt.id,
            fields:[ 'id','code','name','pid'],url:$__app__ + '/City/city_json',
            config:{displayField:'name',valueField:'name',width:150}
        }
        if(opt.where)_opt.where=opt.where;
        if(opt.appTo)_opt.appTo=opt.appTo;
        if(opt.appTo)_opt.actionTo=opt.actionTo;
        if(opt.items_type)_opt.items_type=opt.items_type;
        if(opt.config)Ext.apply(_opt.config,opt.config);
        return this.ComBoxPlus(_opt);
    },
    ComBoxPlus:function(opt,obj){
        var mode_this=this;
        var local_store={};
        if(opt.action=='local'){
            local_store= new Ext.data.Store({
                fields:opt.fields,
                data : opt.storeData
            });
        }else{
            opt.action="remote";
            local_store = SUNLINE.JsonStore(opt.url , opt.fields , false);
            if(opt.items_type==true)opt.where['items_type']=true;
            if(opt.where)this.baseParams(local_store,opt.where);
        }
        var _opt={
            queryDelay:300,
            Style:'display: inline-block;',
            minChars:2,
            loadingText:'正在加载数据',
            allQuery:'',
            triggerAction:"all",
            displayField:opt.id,
            valueField:opt.id,
            id:opt.id+'_id',
            name:opt.id,
            mode:opt.action,
            store:local_store
        };
        if(opt.config) _opt = Ext.apply(_opt,opt.config);
        var ComBox;
        if(opt.type=='Tag'){
            ComBox=new Ext.form.field.Tag(_opt);
        }else{
            ComBox=new Ext.form.ComboBox(_opt);
        }
        if(opt.action=="remote" && opt.actionTo){
            ComBox.on({
                'select':function(c,r,o){
                    var row= r[0];
                    var to_id=Ext.getCmp(opt.actionTo+'_id');
                    /*var store_sel=to_id.getStore();
                    mode_this.baseParams(store_sel,{type:row.get('id')});*/
                    to_id.setValue('');
                    //store_sel.load();
                }
            });
        };
        if(opt.appTo){
            ComBox.on({
                'beforequery':function(c,r,o) {
                    var city_id = Ext.getCmp(opt.appTo + '_id');
                    var append_val = city_id.getValue();
                    var append_data={append_to: append_val};
                    if(opt.items_type==true) append_data['items_type']=true;
                    mode_this.baseParams(local_store, append_data);
                    local_store.load();
                }
            });
        };
        return ComBox;
    },
    checkBoxGroup:function(opt,data){
        if (!opt.fieldLabel) opt['fieldLabel'] = '';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.name) opt.name = 'checkbox_'+opt.id;
        if (!opt.width) opt.anchor = '100%';
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_field = new Ext.form.Hidden({name:opt.hiddenName});
        var data = data['root']
        var items = [];
        for (var $i=0; $i<data.length; $i++){
            items.push({ boxLabel:data[$i]['d_text'], name:opt.name + '[]', id:opt.name + $i, inputValue:data[$i]['d_text']});
        };
        var cg_conf = {
            fieldLabel:opt.fieldLabel,
            columnWidth:1,
            items:items
        };
        cg_conf=Ext.apply(cg_conf,opt);
        /*  if (opt.anchor) cg_conf.anchor = opt.anchor;
         if (!opt.columnWidth) cg_conf.columnWidth = opt.columnWidth;
         if (opt.columns) cg_conf.columns = opt.columns;*/
        var ptCheckboxGroup = new Ext.form.CheckboxGroup(cg_conf);
        ptCheckboxGroup.on('change', function (cg, chk) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                };
            };
            real_field.setValue(ckd_val.join(','));
        });
        return [ptCheckboxGroup,real_field,data];
    },
    checkBoxGroup2:function(opt,data){
        if (!opt.fieldLabel) opt['fieldLabel'] = '';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.name) opt.name = 'checkbox_'+opt.id;
        if (!opt.width) opt.anchor = '100%';
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_field = new Ext.form.Hidden({name:opt.hiddenName});
        var data = data['root']
        var items = [];
        items.push({
        boxLabel:data[0]['d_text'],name:opt.name + '[]',id:opt.name + 0, inputValue:data[0]['d_text'],  listeners:{ 'change':function (gp,nv,ov,eOpts) {
            // 全选
            if(nv && !ov)
                return ptCheckboxGroup.eachBox(function(box,idx){
                    box.setRawValue(true);
                    //wCheckboxGroup.setValue([true, true, true, true, true, true, true, true]);
                });
            // 反选
            if(ov && !nv)
                return ptCheckboxGroup.eachBox(function(box,idx){
                    box.setRawValue(false);
                });
        }},
        });
        for (var $i=1; $i<data.length; $i++){
            items.push({ boxLabel:data[$i]['d_text'], name:opt.name + '[]', id:opt.name + $i, inputValue:data[$i]['d_text']});
        };
        var cg_conf = {
            fieldLabel:opt.fieldLabel,
            columnWidth:1,
            items:items
        };
        cg_conf=Ext.apply(cg_conf,opt);
        if (opt.anchor) items.anchor = opt.anchor;

        var ptCheckboxGroup = new Ext.form.CheckboxGroup(cg_conf);
        ptCheckboxGroup.on('change', function (cg, chk) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                };
            };
            real_field.setValue(ckd_val.join(','));
        });
        return [ptCheckboxGroup,real_field,data];
    },
    checkBoxGroup3:function(opt,data){
        if (!opt.fieldLabel) opt['fieldLabel'] = '';
        if (!opt.id) opt.id = Ext.id();
        if (!opt.name) opt.name = 'checkbox_'+opt.id;
        if (!opt.width) opt.anchor = '100%';
        if (!opt.hiddenName) opt.hiddenName = opt.id;
        var real_field = new Ext.form.Hidden({name:opt.hiddenName});
        var data = data['root']
        var items = [];
        items.push(
            {boxLabel:'全选',name:'all',listeners:{ 'change':function (gp,nv,ov,eOpts) {
                // 全选
                if(nv && !ov)
                    return ptCheckboxGroup.eachBox(function(box,idx){
                        box.setRawValue(true);
                        //wCheckboxGroup.setValue([true, true, true, true, true, true, true, true]);
                    });
                // 反选
                if(ov && !nv)
                    return ptCheckboxGroup.eachBox(function(box,idx){
                        box.setRawValue(false);
                    });
            }},
        });
        for (var $i=1; $i<data.length; $i++){
            items.push({ boxLabel:data[$i]['d_text'], name:opt.name + '[]', id:opt.name + $i, inputValue:data[$i]['d_text']});
        };
        var cg_conf = {
            fieldLabel:opt.fieldLabel,
            columnWidth:1,
            items:items
        };
        cg_conf=Ext.apply(cg_conf,opt);
        if (opt.anchor) items.anchor = opt.anchor;

        var ptCheckboxGroup = new Ext.form.CheckboxGroup(cg_conf);
        ptCheckboxGroup.on('change', function (cg, chk) {
            var ckd_val = [];
            for (var i = 0; i < chk.length; i++) {
                var val = chk[i].getRawValue();
                if (val != 'on') {
                    ckd_val.push(val);
                };
            };
            real_field.setValue(ckd_val.join(','));
        });
        return [ptCheckboxGroup,real_field,data];
    },
    checkBoxGroupSetValues:function(chechkboxGroup, value) {
        if (!value) return false;
        var data = chechkboxGroup[2];
        var va = value.split(',');
        var values = {};
        values[chechkboxGroup[0].name+'[]']=[];
        for (var i = 0; i < data.length; i++) {
            var val = true, ext=false;
            for (var v=0; v<va.length; v++){
                if ( va[v] == data[i]['d_text'] ){
                    ext = true;
                    break;
                };
            };
            if (ext)
                values[chechkboxGroup[0].name+'[]'].push(data[i]['d_text']);
        };
        chechkboxGroup[0].setValue(values);
     },
    UserCompanyBox:function(opt,obj){
        var _cof={
            id:'p_org_name',
            fields:['id','text','org_bh'],url:$__app__ + '/Users/users_company',
            config:{
                displayField:'text',
                valueField:'id',
                fieldLabel:'所属单位',
                labelWidth:60,
                width:300,
                labelAlign:'right',
                value:_uinfo.org_name
            }
        };
        _cof=Ext.apply(_cof,opt);
        var com_box=this.ComBoxPlus(_cof);
        return com_box;
    },
    CompanyBox:function(opt,obj){
        var _cof={
            id:'p_org_name',
            fields:['id','text','org_bh'],url:$__app__ + '/Company/treeJson',
            config:{
                displayField:'text',
                valueField:'id',
                fieldLabel:'所属单位',
                labelWidth:60,
                width:300,
                labelAlign:'right',
                value:_uinfo.org_name
            }
        };
        _cof=Ext.apply(_cof,opt);
        var com_box=this.ComBoxPlus(_cof);
        return com_box;
    },
    CompanyBox_guide:function(opt,obj){  //导游报账
        var _cof={
            id:'p_org_name',
            fields:['id','text','org_bh'],url:$__app__ + '/Company/treeJson',
            config:{
                displayField:'text',
                valueField:'id',
                hiddenName:'id',
                fieldLabel:'',
                labelSeparator:'',
                labelWidth:0,
                width:250,
                listConfig:{minWidth:300},
                labelAlign:'right',
                value:_uinfo.org_name
            }
        };
        if (opt.id) _cof.config.id = opt.id;
        _cof=Ext.apply(_cof,opt);
        var com_box=this.ComBoxPlus(_cof);
        return com_box;
    },
    WxAppCombo:function(opt){
        var wxapp_store = SUNLINE.JsonStore($__app__ + '/WxApp/dataJson', '', opt.autoLoad);
        var config={
            fieldLabel: '选择公众号',
            labelAlign:'right',
            labelWidth:70,
            name: 'wa_id',
            triggerAction:'all',
            store:wxapp_store,
            displayField: 'wa_name',
            valueField: 'wa_appid',
            emptyText:' 请选择公众号 ',
            allowBlank: false
        };
        if(opt){
            config=Ext.apply(config,opt.config);
        };
        return new Ext.form.ComboBox(config);
    },
    /**
     * 出发口岸下拉控件
     * @param opt
     * @returns {*}
     * @constructor
     */
    StartSiteBox:function(opt){
        var _cof={
            id:'start_site',
            fields:['id','text'],url:$__app__ + '/StationStart/start_site_data',
            config:{
                displayField:'text',
                valueField:'id',
                fieldLabel:'出发口岸',
                labelWidth:60,
                width:220,
                labelAlign:'right',
                value:'全部口岸'
            }
        };
        if(opt)_cof=Ext.apply(_cof,opt);
        var company_site=SUNLINE.ComBoxPlus(_cof);
        return company_site;
    },
    ItemsList:function(opt,obj,sct_type_select){
        //计算方式
        var items_cost_store=opt.store;
        //默认情况下有车辆与导游

        if(opt.team_plan!=true){
            var empty_store=[
                {type_new:'车辆',insti_name:'北京中型车',cs_type_name:'中型大巴',sort:-8},
                {type_new:'导游',insti_name:'北京地接导游',cs_type_name:'北京地接优秀导游',sort:-8},
            ];
            Ext.each(empty_store,function(emv,emi){
                EmptyItemsStore(emv);
            })
        }

        function EmptyItemsStore(data){
            if(!data.type_new || !data.insti_name) return false;
            var items_data={
                ti_insti_name:data.insti_name?data.insti_name:'',//资源名称
                ti_name_id:data.ti_name_id?data.ti_name_id:'',//资源ID
                ti_cs_type_name:data.cs_type_name?data.cs_type_name:'',//资源项目名称
                ti_cs_type_name_id:data.cs_type_name_id?data.cs_type_name_id:'',//资源项目ID
                ti_type_new:data.type_new?data.type_new:'',//资源类型
                ti_type_mode:data.type_mode?data.type_mode:'按人计算',//计量方式
                ti_insti_type:data.insti_type?data.insti_type:'现金',//计算方式
                ti_all_money:data.all_money?data.all_money:0,//总金额
                ti_num:data.num?data.num:1,//数量
                ti_trade_price:data.trade_price?data.trade_price:0,//结算单价
                ti_remark:data.remark?data.remark:'',//备注
                ti_day:data.day?data.day:'-1',//天数
                ti_sct_type:data.sct_type?data.sct_type:'成人票'//票种类型,
            };
            items_data.ti_sort=sort_fn(items_data.ti_type_new);
            var items_arr=[],items_remove=[];
            items_cost_store.each(function(v){
                var row= v.data;
                items_arr.push(row.ti_type_new);
            });
            if(in_array(data.type_new,items_arr)==-1){
                items_cost_store.add(items_data);
            }
            return items_data;
        }
        var items_cost_group=Ext.create('Ext.grid.feature.Grouping',{
            collapsible:false,
            groupHeaderTpl:['','<div><span class="items-group-cls">{rows:this.values_rows}</span>{name:this.format_keyword} (共 {[values.rows.length]} 项成本)</div>',{
                format_keyword:function(name){
                    if(name=="-1"){
                        return '按团计费';
                    }else if(name=="-2"){
                        return '分公司报价';
                    }else{
                        if(parseFloat(name)>0) name='第'+name+'天';
                        return name;
                    }
                },
                values_rows:function(row){
                    if(row.length>0){
                        var items_type={},money= 0,money_total=0;
                        Ext.each(row,function(v,i){
                            var rw=v.data;
                            money+=parseFloat(rw['ti_trade_price']);
                            money_total+=parseFloat(rw['ti_all_money']);
                        });
                    }
                    return '[总额小计:<font class="blue-cls">￥'+money_total.toFixed(2)+'</font>元] [单价小计:<font class="red-cls">￥'+money.toFixed(2)+'</font>元]';
                }
            }]
        });
        //表头标注
        //删除项目
        function items_del(){
            return '<i class="fa fa-minus-circle" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以删除"></i>';
        };
        //结算总额显示
        function all_money(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
                }else{
                    return '￥'+ parseFloat(v).toFixed(2)
                }
            }
        };

        //结算单价显示
        function trade_price_new(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '￥'+parseFloat(v).toFixed(2);
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '￥'+parseFloat(v).toFixed(2);
                }else{
                    return '<div style="color:green">￥'+parseFloat(v).toFixed(2)+'</div>';
                }
            }
        };

        //天数显示
        function days_format(v,m){
            if(v<0)return '-';
            return '第'+v+'天';
        };

        //项目类型
        var ti_type_mode_box=SUNLINE.LocalComob({
            id:'ti_type_mode',
            fields:['ti_type_mode'],
            data:[['按团计算'],['按人计算']],
            config:{
                id:"ti_type_mode_id",
                listeners:{ change:ti_type_mode }
            }
        });

        //结算方式
        var si_settle_type_box=SUNLINE.LocalComob({
            id:'ti_insti_type',
            fields:['ti_insti_type'],
            data:[['签单'],['现金'],['预付']],
            config:{
                id:"ti_insti_type_id"
            }
        });

        var _cof={
            displayField:'text',
            valueField:'text',
            listConfig:{minWidth:285},
            allowBlank:false,
            listWidth:250,
            editable:true,
            forceSelection:false,
            pageSize:20
        };
        //搜索项目数据
        var insti_name_box=SUNLINE.ComBoxPlus({
            id:'insti_name',
            fields:['id','text'],url:$__app__ + '/Team/items_data',
            config:_cof
        });
        //搜索项目中内项目数据
        var cs_type_name_box=SUNLINE.ComBoxPlus({
            id:'cs_type_name',
            fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
            config:_cof
        });

        //票种类型Box
        var sct_type_box=SUNLINE.LocalComob({
            id:'sct_type',
            fields:['sct_type'],
            data:[['成人票'],['儿童票'],['婴儿票']],
            config:{
                id:"sct_type_id",
                listeners:{
                    select:sct_type_select
                }
            }
        });

        //处理状态
        var deal_status_box=SUNLINE.LocalComob({
            id:'ti_status_box',
            fields:['ti_status_box'],
            data:[['未处理'],['处理中'],['已处理']],
            config:{
                value:'未处理'
            }
        });

        //消费项目表头
        var items_cost_cm=[
            new Ext.grid.RowNumberer({width:30}),
            {header:"ti_id", dataIndex:"ti_id", width:10, hidden:true},
            {header:"", dataIndex:"items_del", width:25,renderer:items_del},
            {header:"排序", dataIndex:"ti_sort", width:80, hidden:true},
            {header:"ti_product_id", dataIndex:"ti_product_id", width:10, hidden:true},
            {header:"ti_ticket_id", dataIndex:"ti_ticket_id", width:10, hidden:true},
            {header:"资源名称", dataIndex:"ti_insti_name", width:160,editor:insti_name_box},
            {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
            {header:"项目名称", dataIndex:"ti_cs_type_name", width:140,editor:cs_type_name_box},
            {header:"项目名称ID", dataIndex:"ti_cs_type_name_id", width:50,hidden:true},
            {header:"项目类型", dataIndex:"ti_type_new", width:80,hidden:opt.type?true:false},
            {header:"票种类型", dataIndex:"ti_sct_type", width:80,hidden:opt.type?false:true,editor:sct_type_box},
            {header:"计量方式", dataIndex:"ti_type_mode", width:80,editor:ti_type_mode_box},
            {header:"结算方式", dataIndex:"ti_insti_type", width:70,editor:si_settle_type_box},
            {header:"第几天", dataIndex:"ti_day",hidden:opt.type?true:false, width:80,renderer:days_format,
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_day_new'
                })
            },
            {header:"总金额",dataIndex:"ti_all_money", width:95,align:'right',sortable:true,renderer:all_money,
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_all_money_new',
                    listeners:{ change:ti_settle_money }
                })
            },
            {header:"数量", dataIndex:"ti_num", width:50,align:'center',sortable:true,
                editor:new Ext.form.NumberField({
                    minValue:1,selectOnFocus:true,id:'ti_num_new',
                    listeners:{ change:ti_settle_num }
                })
            },
            /*{header:"结算单价", dataIndex:"ti_sense_price",sortable:true,renderer:trade_price_new, width:85,align:'right',
             editor:new Ext.form.NumberField({
             selectOnFocus:true,id:'ti_sense_price',
             listeners:{ change:ti_settle_price }
             })
             },*/
            {header:"结算单价", dataIndex:"ti_trade_price",sortable:true,renderer:trade_price_new, width:90,align:'right',
                editor:new Ext.form.NumberField({
                    selectOnFocus:true,id:'ti_trade_price_new',
                    listeners:{ change:ti_settle_price }
                })
            },
            /*{header:"毛利", dataIndex:"ti_profit",sortable:true,renderer:trade_price_new, width:70,align:'right',
             editor:new Ext.form.NumberField({
             selectOnFocus:true,id:'ti_profit',
             listeners:{ change:ti_settle_price }
             })
             },*/
            {header:"备注", dataIndex:"ti_remark", width:150,editor:new Ext.form.TextField({id:'ti_remark_new'}),renderer:function(v){
                if(!v)return '';
                return '<font title="'+v+'" color="blue">'+v+'</font>';
            }},
            {header:'签单号',dataIndex:'ti_sign',width:130,editor:new Ext.form.TextField({id:'ti_sign'}),hidden:opt.team_plan?false:true},
            {header:'处理状态',dataIndex:'ti_deal_status',width:80,editor:deal_status_box,hidden:opt.team_plan?false:true,renderer:function(v){
                if(!v)return '未处理';
                return v;
            }},
            {header:'签单号',dataIndex:'ti_man_tel',width:130,editor:new Ext.form.TextField({id:'ti_man_tel'}),hidden:true},
            {header:'联系人',dataIndex:'ti_man',width:150,editor:new Ext.form.TextField({id:'ti_man'}),hidden:opt.team_plan?false:true,renderer:function(v,m,r){
                if(!v && !r.get('ti_man')) return '';
                if(!v)v='';
                var tel=r.get('ti_man_tel');
                if(!tel)tel='';
                return v+'-'+ r.get('ti_man_tel');
            }}
        ];
        //组织tbar项目
        var items_data=[];
        Ext.each(opt.items_list,function(v,i){ items_data[i]={ text: v.text,id: v.id,handler:tbar_items } });
        items_data=items_data.concat([
            /*'-',{text:'删除项目', id:'_del_item', iconCls:'button-del',handler:items_cost_del},*/
            '->',
            {text:'按项目类型分组',id:'_group_by',iconCls:"searchico",field:'ti_type_new',handler:setGroup,
                menu:{
                    items :[
                        {text:'按天分组',field:'ti_day',handler:setGroup,xtype:opt.type?'hidden':''},
                        {text:'按项目类型分组',field:'ti_type_new',handler:setGroup},
                        {text:'按结算方式',field:'ti_insti_type',handler:setGroup,xtype:opt.type?'hidden':''}
                    ]
                }
            }
        ]);

        var grid_items={
            region:'center',
            loadMask: {msg : '数据传输中，请稍候...'},
            store: items_cost_store,
            columns: items_cost_cm,
            autoHeight : true,
            features: [items_cost_group],
            autoScroll : true,
            modal : true,
            closeAction : 'hide',
            cls : 'suntour_dataView',
            layout : 'fit',
            minWidth:500,
            minHeight:500,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            tbar:items_data
        };
        if(opt.plan_type=='height_false'){
            grid_items.autoHeight=false;
            grid_items.height=Ext.getBody().getHeight()-200;
        }

        if(opt.team_plan==true){
            if(opt.team_guide!=true){
                grid_items.bbar=[
                    '<b>其他事项：</b>','->',
                    '备用金领款：',
                    {xtype:'numberfield', id:'team_total_fee_2', name:'team_total_fee'}
                ];
                grid_items.buttons=[
                    '->',
                    {xtype : 'tbtext', id:'total_info', text:'&nbsp;' }
                ];
            }

        };

        //画出表格
        var items_cost_grid=new Ext.grid.GridPanel(grid_items);
        var car_grid=ITEMS_YUN.CarPrice({
            load_type:'yes'
        });
        //选择车辆信息
        var car_win=Ext.create('Ext.window.Window', {
            title: '车辆规则选择',
            autoHeight:true,
            closeAction : 'hide',
            layout : 'border',
            resizable:false,
            fixed:true,
            modal:true,
            height: 500,
            width: 1000,
            items:car_grid,
            buttons:[
                {text:'确认选择',handler:car_grid_fn},
                {text:'关闭', handler:function () {
                    car_win.hide();
                }}
            ]
        });
        car_win.on({
            show:function(){
                //根据人数、团队级等筛选、日期时间
                var where={};
                if(items_cost_grid.car_store){
                    var where=items_cost_grid.car_store(car_grid);
                    //日期时间
                    //开始
                    where.cap_start_date=items_cost_grid.ticket_date.start_date;
                    //结束
                    where.cap_end_date=items_cost_grid.ticket_date.end_date;
                    car_grid.where=where;
                }
                SUNLINE.baseParams(car_grid.store,where);
                car_grid.store.load();
            }
        });

        //确认选择车辆规则
        function car_grid_fn(t){
            var row=SUNLINE.getSelected(car_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要使用的车辆规则！');
                return false;
            }
            var cap_money=row.get('cap_money')?parseFloat(row.get('cap_money')):0;
            var cap_num=parseFloat(row.get('cap_num'));
            if(cap_num==0)cap_num=1;
            var itmes_row=SUNLINE.getSelected(items_cost_grid);
            itmes_row.set('ti_insti_name', row.get('cap_name'));
            itmes_row.set('ti_cs_type_name', row.get('cap_type'));
            itmes_row.set('ti_remark', row.get('cap_remark'));

            if(opt.reckon_type=='ti_all_money'){
                //团队业务中 车辆人数=成人+儿童
                var pop=items_cost_grid.pop;
                cap_num=parseFloat(pop.big)+parseFloat(pop.small);
            }
            itmes_row.set('ti_all_money', cap_money);
            itmes_row.set('ti_num', cap_num);
            itmes_row.set('ti_trade_price', Math.round(cap_money/cap_num).toFixed(2));
            car_win.hide();
        }

        //点击事件操作,操作车辆信息
        insti_name_box.on({
            focus:function( t, e, es){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='车辆'){
                    Ext.MessageBox.confirm('友情提示','是否需要通过车辆规则选择?',function(y){
                        if(y=='yes'){
                            car_win.show();
                        }
                    })
                }
            }
        });

        //加载资源信息
        insti_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var insti_name_box_store=insti_name_box.store;
                SUNLINE.baseParams(insti_name_box_store,{type:row.get('ti_type_new')});
                insti_name_box_store.load();

            }
        });
        //选择资源信息
        insti_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                row.set('ti_name_id', r.get('id'));
                row.set('ti_cs_type_name', '');
                //联系人信息赋值
                row.set('ti_man_tel', r.get('rc_mobile'));
                row.set('ti_man_name', r.get('rc_name'));
            }
        });

        //加载资源项目信息
        cs_type_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var cs_type_name_box_store=cs_type_name_box.store;
                SUNLINE.baseParams(cs_type_name_box_store,{type:row.get('ti_type_new'),at_id:row.get('ti_name_id'),start_date:items_cost_grid.ticket_date.start_date,end_date:items_cost_grid.ticket_date.end_date});
                cs_type_name_box_store.load();
            }
        });
        //选择资源项目信息
        cs_type_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                var ti_num=row.get('ti_num');
                var price= parseFloat(r.get('price'));
                var sct_type='成人票';
                //选择项目后金额改变
                if(row.get('ti_type_new')=='购物店'){
                    var ti_remark='';
                    if(r.get('sp_one_price'))ti_remark=r.get('sp_one_price')+'/人';
                    if(r.get('sp_pct_num'))ti_remark=ti_remark?(ti_remark+'+'+r.get('sp_pct_num')+'%'):r.get('sp_pct_num')+'%';
                    if(r.get('sp_remark'))ti_remark=ti_remark?(ti_remark+' 说明:'+r.get('sp_remark')):r.get('sp_remark');
                    row.set('ti_insti_type', '签单');
                    row.set('ti_remark', ti_remark);
                }else{
                    if(row.get('ti_type_new')=='住宿')price=price/2;
                    if(row.get('ti_type_new')=='景区')sct_type= r.get('t_type');
                    row.set('ti_insti_type', r.get('pay_type'));
                    row.set('ti_trade_price', price.toFixed(2));
                    row.set('ti_num',ti_num);
                    row.set('ti_all_money',parseFloat(price*ti_num).toFixed(2));
                    row.set('ti_remark', r.get('remark'));
                }
                row.set('ti_sct_type', sct_type);
            }
        });


        //操作结算总额
        function ti_settle_money(t,nv,ov,o){
            //操作总额同步操作单价
            var row=SUNLINE.getSelected(items_cost_grid);
            //按人计算是单价=总金额*数量
            var price=Math.round(parseFloat(nv)/parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算'){
                //按团计算是单价=总金额/数量
                price=parseFloat(nv).toFixed(2);
            }
            row.set('ti_trade_price',round_format(price));
        }

        //按团切换事件
        function ti_type_mode(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(nv=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
            }else{
                var price=Math.round(parseFloat(row.get('ti_all_money'))/parseFloat(row.get('ti_num'))).toFixed(2);
                row.set('ti_trade_price',round_format(price));
            }
        }

        //操作数量时，操作结算总额和结算单价
        function ti_settle_num(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=0;
            if(row.get('ti_type_mode')=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
                return false;
            }
            if(opt.reckon_type=='ti_trade_price'){
                if(row.get('ti_type_new')=='住宿'){
                    //如果是住宿计算总额
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }else{
                    //如果是其他计算单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }
            }else{
                if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                    //如果是车辆与导游计算修改单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }else{
                    //其他计算总价
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }
            }
        }

        //操作单价时,操作结算总额
        function ti_settle_price(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=(parseFloat(nv)*parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算')price=parseFloat(nv);
            row.set('ti_all_money',round_format(price));
        }

        //双击删除项目
        items_cost_grid.on({
            celldblclick:function(t, td, c, r, tr, ri, e, opt){
                if(c==2){
                    var _row=SUNLINE.getSelected(items_cost_grid);
                    items_cost_store.remove(_row);
                }
            }
        });
        items_cost_store.on({
            update:function(){
                items_total_money();
            },
            datachanged:function(){
                items_total_money();
            }
        });


        //计算最终金额
        function items_total_money(){
            var total_money= 0,items_num={},money= 0,items_type={};
            items_cost_store.each(function(v){
                var row= v.data;
                items_num[row.ti_type_new]=items_num[row.ti_type_new]?(parseFloat(items_num[row.ti_type_new])+1):1;
                if(opt.reckon_type=='ti_trade_price'){
                    //1.根据结算单价计算
                    money=parseFloat(row.ti_trade_price);
                    if(row.ti_type_new=='住宿'){
                        money=parseFloat(row.ti_all_money);
                    }
                    total_money+=money;
                }else{
                    //2.根据结算总额计算
                    money=parseFloat(row.ti_all_money);
                    total_money+=money;
                }
                items_type[row.ti_insti_type]=items_type[row.ti_insti_type]?(items_type[row.ti_insti_type]+parseFloat(row.ti_all_money)):parseFloat(row.ti_all_money);
            });
            Ext.each(opt.items_list,function(v,i){
                if(items_num[v.text]>0){
                    Ext.getCmp(v.id).setText(v.text+'(<font style="color:red;font-size:12px">'+items_num[v.text]+'</font>)');
                }else{
                    Ext.getCmp(v.id).setText(v.text);
                }
            });
            if(obj)obj(total_money,items_cost_store,items_type);
            items_cost_grid.total_money=total_money;

            if(opt.team_plan==true){
                if(opt.team_guide!=true){
                    //计算面签，现金，预付的明细
                    var text_money='实时统计信息：';
                    for(var itv in items_type){
                        text_money+=itv+'金额：<b>￥'+parseFloat(items_type[itv]).toFixed(2)+'</b>元;';
                    }
                    text_money+='总金额为:<b>￥'+parseFloat(total_money).toFixed(2)+'</b>元';
                    Ext.getCmp('total_info').setText(text_money);
                    //Ext.getCmp('team_total_fee').setValue(parseFloat(items_type['现金']).toFixed(2));
                }
            }
        }

        //分组操作
        function setGroup(b){
            var g = Ext.getCmp('_group_by');
            g.setText(b.text);
            items_cost_store.group(b.field);
            g.field = b.field;
        };

        //添加项目
        function tbar_items(v){
            var v_text= v.text;
            if(v_text.indexOf('(')>0){
                v_text= v_text.split('(');
                v.text=v_text[0];
            }
            if(v.text=='车辆'){
                var type='按人计算';
                var day_new='-1';
                var name='北京中型车'
                var type_name='中型大巴'
            }else if(v.text=='导游'){
                var type='按人计算';
                var day_new='-1';
                var name='北京地接导游'
                var type_name='北京地接优秀导游'
            }else if(v.text=='住宿'){
                var type='按人计算';
                var day_new='-1';
                var name=''
                var type_name=''
            }else{
                var type='按人计算';
                var day_new=1;
                var name=''
                var type_name=''
            }
            var pop_num=1;
            if(items_cost_grid.pop_num)pop_num=items_cost_grid.pop_num;
            //车辆公式计算=成人数量+儿童数量
            if(v.text=='车辆' && typeof items_cost_grid.pop=='object'){
                var pop=items_cost_grid.pop;
                pop_num=parseFloat(pop.big)+parseFloat(pop.small);
            }

            var items_data={
                ti_insti_name:name,
                ti_cs_type_name:type_name,
                ti_type_new: v.text,
                ti_type_mode:type,
                ti_insti_type:'现金',
                ti_sct_type:'成人票',
                ti_day:day_new,
                ti_all_money:'0',
                ti_num:pop_num,
                ti_trade_price:'0',
                ti_remark:''
            };
            items_data.ti_sort=sort_fn(items_data.ti_type_new);
            items_cost_store.add(items_data);
        }

        //删除成本项目
        function items_cost_del(){
            var _row=SUNLINE.getSelected(items_cost_grid);
            if (!_row){
                Ext.Msg.alert('友情提示', '请选择您想要删除的该成本项目。');
                return;
            };
            items_cost_store.remove(_row);
        }
        return items_cost_grid;
    },


    ItemsList2:function(opt,obj,sct_type_select){
        //计算方式
        var items_cost_store=opt.store;

        function EmptyItemsStore(data){
            if(!data.type_new || !data.insti_name) return false;
            var items_data={
                ti_insti_name:data.insti_name?data.insti_name:'',//资源名称
                ti_name_id:data.ti_name_id?data.ti_name_id:'',//资源ID
                ti_cs_type_name:data.cs_type_name?data.cs_type_name:'',//资源项目名称
                ti_cs_type_name_id:data.cs_type_name_id?data.cs_type_name_id:'',//资源项目ID
                ti_type_new:data.type_new?data.type_new:'',//资源类型
                ti_type_mode:data.type_mode?data.type_mode:'按人计算',//计量方式
                ti_insti_type:data.insti_type?data.insti_type:'现金',//计算方式
                ti_all_money:data.all_money?data.all_money:0,//总金额
                ti_num:data.num?data.num:1,//数量
                ti_trade_price:data.trade_price?data.trade_price:0,//结算单价
                ti_remark:data.remark?data.remark:'',//备注
                ti_day:data.day?data.day:'-1',//天数
                ti_sct_type:data.sct_type?data.sct_type:'成人票'//票种类型,
            };
            items_data.ti_sort=sort_fn(items_data.ti_type_new);
            var items_arr=[],items_remove=[];
            items_cost_store.each(function(v){
                var row= v.data;
                items_arr.push(row.ti_type_new);
            });
            if(in_array(data.type_new,items_arr)==-1){
                items_cost_store.add(items_data);
            }
            return items_data;
        }
        var items_cost_group=Ext.create('Ext.grid.feature.Grouping',{
            collapsible:false,
            groupHeaderTpl:['','<div><span class="items-group-cls">{rows:this.values_rows}</span>{name:this.format_keyword} (共 {[values.rows.length]} 项成本)</div>',{
                format_keyword:function(name){
                    if(name=="-1"){
                        return '按团计费';
                    }else if(name=="-2"){
                        return '分公司报价';
                    }else{
                        if(parseFloat(name)>0) name='第'+name+'天';
                        return name;
                    }
                },
                values_rows:function(row){
                    if(row.length>0){
                        var items_type={},money= 0,money_total=0;
                        Ext.each(row,function(v,i){
                            var rw=v.data;
                            money+=parseFloat(rw['ti_trade_price']);
                            money_total+=parseFloat(rw['ti_all_money']);
                        });
                    }
                    return '[总额小计:<font class="blue-cls">￥'+money_total.toFixed(2)+'</font>元] [单价小计:<font class="red-cls">￥'+money.toFixed(2)+'</font>元]';
                }
            }]
        });
        //表头标注
        //删除项目
        function items_del(){
            return '<i class="fa fa-minus-circle" style="cursor:pointer;line-height:20px;color:#999;font-size:16px;" title="双击一下可以删除"></i>';
        };
        //结算总额显示
        function all_money(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '<div style="padding-right: 5px;color:green">￥'+parseFloat(v).toFixed(2)+'</div>'
                }else{
                    return '￥'+ parseFloat(v).toFixed(2)
                }
            }
        };

        //结算单价显示
        function trade_price_new(v,m,r){
            if(opt.reckon_type=='ti_all_money'){
                return '￥'+parseFloat(v).toFixed(2);
            }else{
                if(r.data.ti_type_new=='住宿'){
                    return '￥'+parseFloat(v).toFixed(2);
                }else{
                    return '<div style="color:green">￥'+parseFloat(v).toFixed(2)+'</div>';
                }
            }
        };

        //天数显示
        function days_format(v,m){
            if(v<0)return '-';
            return '第'+v+'天';
        };

        //项目类型
        var ti_type_mode_box=SUNLINE.LocalComob({
            id:'ti_type_mode2',
            fields:['ti_type_mode'],
            data:[['按团计算'],['按人计算']],
            config:{
                id:"ti_type_mode_id2",
                listeners:{ change:ti_type_mode }
            }
        });

        //结算方式
        var si_settle_type_box=SUNLINE.LocalComob({
            id:'ti_insti_type2',
            fields:['ti_insti_type'],
            data:[['签单'],['现金'],['预付']],
            config:{
                id:"ti_insti_type_id2"
            }
        });

        var _cof={
            displayField:'text',
            valueField:'text',
            listConfig:{minWidth:285},
            allowBlank:false,
            listWidth:250,
            editable:true,
            forceSelection:false,
            pageSize:20
        };
        //搜索项目数据
        var insti_name_box=SUNLINE.ComBoxPlus({
            id:'insti_name2',
            fields:['id','text'],url:$__app__ + '/Team/items_data',
            config:_cof
        });
        //搜索项目中内项目数据
        var cs_type_name_box=SUNLINE.ComBoxPlus({
            id:'cs_type_name2',
            fields:['id','text'],url:$__app__ + '/Team/items_data_detail',
            config:_cof
        });

        //票种类型Box
        var sct_type_box=SUNLINE.LocalComob({
            id:'sct_type2',
            fields:['sct_type'],
            data:[['成人票'],['儿童票'],['婴儿票']],
            config:{
                id:"sct_type_id2",
                listeners:{
                    select:sct_type_select
                }
            }
        });

        //处理状态
        var deal_status_box=SUNLINE.LocalComob({
            id:'ti_status_box2',
            fields:['ti_status_box'],
            data:[['未处理'],['处理中'],['已处理']],
            config:{
                value:'未处理'
            }
        });

        //消费项目表头
        var items_cost_cm;
        if(opt.no_update==true){
            items_cost_cm=[
                new Ext.grid.RowNumberer({width:30}),
                {header:"ti_id", dataIndex:"ti_id", width:10, hidden:true},
                {header:"排序", dataIndex:"ti_sort", width:80, hidden:true},
                {header:"ti_product_id", dataIndex:"ti_product_id", width:10, hidden:true},
                {header:"ti_ticket_id", dataIndex:"ti_ticket_id", width:10, hidden:true},
                {header:"资源名称", dataIndex:"ti_insti_name", width:160},
                {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
                {header:"项目名称", dataIndex:"ti_cs_type_name", width:140},
                {header:"项目名称ID", dataIndex:"ti_cs_type_name_id", width:50,hidden:true},
                {header:"项目类型", dataIndex:"ti_type_new", width:80,hidden:opt.type?true:false},
                {header:"票种类型", dataIndex:"ti_sct_type", width:80,hidden:opt.type?false:true},
                {header:"计量方式", dataIndex:"ti_type_mode", width:80},
                {header:"结算方式", dataIndex:"ti_insti_type", width:70},
                {header:"第几天", dataIndex:"ti_day"},
                {header:"总金额",dataIndex:"ti_all_money", width:95,align:'right'},
                {header:"数量", dataIndex:"ti_num", width:50,align:'center'},
                {header:"结算单价", dataIndex:"ti_trade_price",sortable:true,renderer:trade_price_new, width:90,align:'right'},
                {header:"备注", dataIndex:"ti_remark", width:150},
                {header:'签单号',dataIndex:'ti_sign',width:130,hidden:opt.team_plan?false:true},
                {header:'处理状态',dataIndex:'ti_deal_status',width:80,hidden:opt.team_plan?false:true,renderer:function(v){
                    if(!v)return '未处理';
                    return v;
                }},
                {header:'签单号',dataIndex:'ti_man_tel',width:130,hidden:true},
                {header:'联系人',dataIndex:'ti_man',width:150,hidden:opt.team_plan?false:true,renderer:function(v,m,r){
                    if(!v && !r.get('ti_man')) return '';
                    if(!v)v='';
                    var tel=r.get('ti_man_tel');
                    if(!tel)tel='';
                    return v+'-'+ r.get('ti_man_tel');
                }}
            ];
        }else{
            items_cost_cm=[
                new Ext.grid.RowNumberer({width:30}),
                {header:"ti_id", dataIndex:"ti_id", width:10, hidden:true},
                {header:"", dataIndex:"items_del", width:25,renderer:items_del},
                {header:"排序", dataIndex:"ti_sort", width:80, hidden:true},
                {header:"ti_product_id", dataIndex:"ti_product_id", width:10, hidden:true},
                {header:"ti_ticket_id", dataIndex:"ti_ticket_id", width:10, hidden:true},
                {header:"资源名称", dataIndex:"ti_insti_name", width:160,editor:insti_name_box},
                {header:"资源名称ID", dataIndex:"ti_name_id", width:50,hidden:true},
                {header:"项目名称", dataIndex:"ti_cs_type_name", width:140,editor:cs_type_name_box},
                {header:"项目名称ID", dataIndex:"ti_cs_type_name_id", width:50,hidden:true},
                {header:"项目类型", dataIndex:"ti_type_new", width:80,hidden:opt.type?true:false},
                {header:"票种类型", dataIndex:"ti_sct_type", width:80,hidden:opt.type?false:true,editor:sct_type_box},
                {header:"计量方式", dataIndex:"ti_type_mode", width:80,editor:ti_type_mode_box},
                {header:"结算方式", dataIndex:"ti_insti_type", width:70,editor:si_settle_type_box},
                {header:"第几天", dataIndex:"ti_day",hidden:opt.type?true:false, width:80,renderer:days_format,
                    editor:new Ext.form.NumberField({
                        selectOnFocus:true,id:'ti_day_new2'
                    })
                },
                {header:"总金额",dataIndex:"ti_all_money", width:95,align:'right',sortable:true,renderer:all_money,
                    editor:new Ext.form.NumberField({
                        selectOnFocus:true,id:'ti_all_money_new2',
                        listeners:{ change:ti_settle_money }
                    })
                },
                {header:"数量", dataIndex:"ti_num", width:50,align:'center',sortable:true,
                    editor:new Ext.form.NumberField({
                        minValue:1,selectOnFocus:true,id:'ti_num_new2',
                        listeners:{ change:ti_settle_num }
                    })
                },
                /*{header:"结算单价", dataIndex:"ti_sense_price",sortable:true,renderer:trade_price_new, width:85,align:'right',
                 editor:new Ext.form.NumberField({
                 selectOnFocus:true,id:'ti_sense_price2',
                 listeners:{ change:ti_settle_price }
                 })
                 },*/
                {header:"结算单价", dataIndex:"ti_trade_price",sortable:true,renderer:trade_price_new, width:90,align:'right',
                    editor:new Ext.form.NumberField({
                        selectOnFocus:true,id:'ti_trade_price_new2',
                        listeners:{ change:ti_settle_price }
                    })
                },
                /*{header:"毛利", dataIndex:"ti_profit",sortable:true,renderer:trade_price_new, width:70,align:'right',
                 editor:new Ext.form.NumberField({
                 selectOnFocus:true,id:'ti_profit2',
                 listeners:{ change:ti_settle_price }
                 })
                 },*/
                {header:"备注", dataIndex:"ti_remark", width:150,editor:new Ext.form.TextField({id:'ti_remark_new2'}),renderer:function(v){
                    if(!v)return '';
                    return '<font title="'+v+'" color="blue">'+v+'</font>';
                }},
                {header:'签单号',dataIndex:'ti_sign',width:130,editor:new Ext.form.TextField({id:'ti_sign2'}),hidden:opt.team_plan?false:true},
                {header:'处理状态',dataIndex:'ti_deal_status',width:80,editor:deal_status_box,hidden:opt.team_plan?false:true,renderer:function(v){
                    if(!v)return '未处理';
                    return v;
                }},
                {header:'签单号',dataIndex:'ti_man_tel',width:130,editor:new Ext.form.TextField({id:'ti_man_tel2'}),hidden:true},
                {header:'联系人',dataIndex:'ti_man',width:150,editor:new Ext.form.TextField({id:'ti_man2'}),hidden:opt.team_plan?false:true,renderer:function(v,m,r){
                    if(!v && !r.get('ti_man')) return '';
                    if(!v)v='';
                    var tel=r.get('ti_man_tel');
                    if(!tel)tel='';
                    return v+'-'+ r.get('ti_man_tel');
                }}
            ];
        }

        //组织tbar项目
        var items_data=[];
        Ext.each(opt.items_list,function(v,i){ items_data[i]={ text: v.text,id: v.id,handler:tbar_items } });
        if(opt.no_update==true){

        }else{
            items_data=items_data.concat([
                /*'-',{text:'删除项目', id:'_del_item', iconCls:'button-del',handler:items_cost_del},*/
                '->',
                {text:'按项目类型分组',id:'_group_by2',iconCls:"searchico",field:'ti_type_new',handler:setGroup,
                    menu:{
                        items :[
                            {text:'按天分组',field:'ti_day',handler:setGroup,xtype:opt.type?'hidden':''},
                            {text:'按项目类型分组',field:'ti_type_new',handler:setGroup},
                            {text:'按结算方式',field:'ti_insti_type',handler:setGroup,xtype:opt.type?'hidden':''}
                        ]
                    }
                }
            ]);
        }

        var grid_items={
            region:'center',
            loadMask: {msg : '数据传输中，请稍候...'},
            store: items_cost_store,
            columns: items_cost_cm,
            autoHeight : true,
            features: [items_cost_group],
            autoScroll : true,
            modal : true,
            closeAction : 'hide',
            cls : 'suntour_dataView',
            layout : 'fit',
            minWidth:500,
            minHeight:500,
            maxHeight:Ext.getBody().getHeight()-200,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            tbar:items_data
        };

        if(opt.team_plan==true){
            if(opt.team_guide!=true){
                grid_items.bbar=[
                    '<b>其他事项：</b>','->',
                    '备用金领款：',
                    {xtype:'numberfield', id:'team_total_fee2', name:'team_total_fee'}
                ];
                grid_items.buttons=[
                    '->',
                    {xtype : 'tbtext', id:'total_info2', text:'&nbsp;' }
                ];
            }

        };

        //画出表格
        var items_cost_grid=new Ext.grid.GridPanel(grid_items);
        var car_grid=ITEMS_YUN.CarPrice({
            load_type:'yes'
        });
        //选择车辆信息
        var car_win=Ext.create('Ext.window.Window', {
            title: '车辆规则选择',
            autoHeight:true,
            closeAction : 'hide',
            layout : 'border',
            resizable:false,
            fixed:true,
            modal:true,
            height: 500,
            width: 1000,
            items:car_grid,
            buttons:[
                {text:'确认选择',handler:car_grid_fn},
                {text:'关闭', handler:function () {
                    car_win.hide();
                }}
            ]
        });
        car_win.on({
            show:function(){
                //根据人数、团队级等筛选、日期时间
                var where={};
                if(items_cost_grid.car_store){
                    var where=items_cost_grid.car_store(car_grid);
                    //日期时间
                    //开始
                    where.cap_start_date=items_cost_grid.ticket_date.start_date;
                    //结束
                    where.cap_end_date=items_cost_grid.ticket_date.end_date;
                    car_grid.where=where;
                }
                SUNLINE.baseParams(car_grid.store,where);
                car_grid.store.load();
            }
        });

        //确认选择车辆规则
        function car_grid_fn(t){
            var row=SUNLINE.getSelected(car_grid);
            if(row==null) {
                Ext.Msg.alert('友情提示', '请选择您要使用的车辆规则！');
                return false;
            }
            var cap_money=row.get('cap_money')?parseFloat(row.get('cap_money')):0;
            var cap_num=parseFloat(row.get('cap_num'));
            if(cap_num==0)cap_num=1;
            var itmes_row=SUNLINE.getSelected(items_cost_grid);
            itmes_row.set('ti_insti_name', row.get('cap_name'));
            itmes_row.set('ti_cs_type_name', row.get('cap_type'));
            itmes_row.set('ti_remark', row.get('cap_remark'));

            if(opt.reckon_type=='ti_all_money'){
                //团队业务中 车辆人数=成人+儿童
                var pop=items_cost_grid.pop;
                cap_num=parseFloat(pop.big)+parseFloat(pop.small);
            }
            itmes_row.set('ti_all_money', cap_money);
            itmes_row.set('ti_num', cap_num);
            itmes_row.set('ti_trade_price', Math.round(cap_money/cap_num).toFixed(2));
            car_win.hide();
        }

        //点击事件操作,操作车辆信息
        insti_name_box.on({
            focus:function( t, e, es){
                var row=SUNLINE.getSelected(items_cost_grid);
                if(row.get('ti_type_new')=='车辆'){
                    Ext.MessageBox.confirm('友情提示','是否需要通过车辆规则选择?',function(y){
                        if(y=='yes'){
                            car_win.show();
                        }
                    })
                }
            }
        });

        //加载资源信息
        insti_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var insti_name_box_store=insti_name_box.store;
                SUNLINE.baseParams(insti_name_box_store,{type:row.get('ti_type_new')});
                insti_name_box_store.load();

            }
        });
        //选择资源信息
        insti_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                row.set('ti_name_id', r.get('id'));
                row.set('ti_cs_type_name', '');
                //联系人信息赋值
                row.set('ti_man_tel', r.get('rc_mobile'));
                row.set('ti_man_name', r.get('rc_name'));
            }
        });

        //加载资源项目信息
        cs_type_name_box.on({
            beforequery:function( c, r, i, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var cs_type_name_box_store=cs_type_name_box.store;
                SUNLINE.baseParams(cs_type_name_box_store,{type:row.get('ti_type_new'),at_id:row.get('ti_name_id'),start_date:items_cost_grid.ticket_date.start_date,end_date:items_cost_grid.ticket_date.end_date});
                cs_type_name_box_store.load();
            }
        });
        //选择资源项目信息
        cs_type_name_box.on({
            select:function( c, r, e ){
                var row=SUNLINE.getSelected(items_cost_grid);
                var r= r[0];
                var ti_num=row.get('ti_num');
                var price= parseFloat(r.get('price'));
                var sct_type='成人票';
                //选择项目后金额改变
                if(row.get('ti_type_new')=='购物店'){
                    var ti_remark='';
                    if(r.get('sp_one_price'))ti_remark=r.get('sp_one_price')+'/人';
                    if(r.get('sp_pct_num'))ti_remark=ti_remark?(ti_remark+'+'+r.get('sp_pct_num')+'%'):r.get('sp_pct_num')+'%';
                    if(r.get('sp_remark'))ti_remark=ti_remark?(ti_remark+' 说明:'+r.get('sp_remark')):r.get('sp_remark');
                    row.set('ti_insti_type', '签单');
                    row.set('ti_remark', ti_remark);
                }else{
                    if(row.get('ti_type_new')=='住宿')price=price/2;
                    if(row.get('ti_type_new')=='景区')sct_type= r.get('t_type');
                    row.set('ti_insti_type', r.get('pay_type'));
                    row.set('ti_trade_price', price.toFixed(2));
                    row.set('ti_num',ti_num);
                    row.set('ti_all_money',parseFloat(price*ti_num).toFixed(2));
                    row.set('ti_remark', r.get('remark'));
                }
                row.set('ti_sct_type', sct_type);
            }
        });


        //操作结算总额
        function ti_settle_money(t,nv,ov,o){
            //操作总额同步操作单价
            var row=SUNLINE.getSelected(items_cost_grid);
            //按人计算是单价=总金额*数量
            var price=Math.round(parseFloat(nv)/parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算'){
                //按团计算是单价=总金额/数量
                price=parseFloat(nv).toFixed(2);
            }
            row.set('ti_trade_price',round_format(price));
        }

        //按团切换事件
        function ti_type_mode(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            if(nv=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
            }else{
                var price=Math.round(parseFloat(row.get('ti_all_money'))/parseFloat(row.get('ti_num'))).toFixed(2);
                row.set('ti_trade_price',round_format(price));
            }
        }

        //操作数量时，操作结算总额和结算单价
        function ti_settle_num(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=0;
            if(row.get('ti_type_mode')=='按团计算'){
                row.set('ti_trade_price',row.get('ti_all_money'));
                return false;
            }
            if(opt.reckon_type=='ti_trade_price'){
                if(row.get('ti_type_new')=='住宿'){
                    //如果是住宿计算总额
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }else{
                    //如果是其他计算单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }
            }else{
                if(row.get('ti_type_new')=='车辆' || row.get('ti_type_new')=='导游'){
                    //如果是车辆与导游计算修改单价
                    price=(parseFloat(row.get('ti_all_money'))/parseFloat(nv)).toFixed(2);
                    row.set('ti_trade_price',round_format(price));
                }else{
                    //其他计算总价
                    price=(parseFloat(row.get('ti_trade_price'))*parseFloat(nv)).toFixed(2);
                    row.set('ti_all_money',round_format(price));
                }
            }
        }

        //操作单价时,操作结算总额
        function ti_settle_price(t,nv,ov,o){
            var row=SUNLINE.getSelected(items_cost_grid);
            var price=(parseFloat(nv)*parseFloat(row.get('ti_num'))).toFixed(2);
            if(row.get('ti_type_mode')=='按团计算')price=parseFloat(nv);
            row.set('ti_all_money',round_format(price));
        }

        //双击删除项目
        items_cost_grid.on({
            celldblclick:function(t, td, c, r, tr, ri, e, opt){
                if(c==2){
                    var _row=SUNLINE.getSelected(items_cost_grid);
                    items_cost_store.remove(_row);
                }
            }
        });
        items_cost_store.on({
            update:function(){
                items_total_money();
            },
            datachanged:function(){
                items_total_money();
            }
        });


        //计算最终金额
        function items_total_money(){
            var total_money= 0,items_num={},money= 0,items_type={};
            items_cost_store.each(function(v){
                var row= v.data;
                items_num[row.ti_type_new]=items_num[row.ti_type_new]?(parseFloat(items_num[row.ti_type_new])+1):1;
                if(opt.reckon_type=='ti_trade_price'){
                    //1.根据结算单价计算
                    money=parseFloat(row.ti_trade_price);
                    if(row.ti_type_new=='住宿'){
                        money=parseFloat(row.ti_all_money);
                    }
                    total_money+=money;
                }else{
                    //2.根据结算总额计算
                    money=parseFloat(row.ti_all_money);
                    total_money+=money;
                }
                items_type[row.ti_insti_type]=items_type[row.ti_insti_type]?(items_type[row.ti_insti_type]+parseFloat(row.ti_all_money)):parseFloat(row.ti_all_money);
            });
            Ext.each(opt.items_list,function(v,i){
                if(items_num[v.text]>0){
                    Ext.getCmp(v.id).setText(v.text+'(<font style="color:red;font-size:12px">'+items_num[v.text]+'</font>)');
                }else{
                    Ext.getCmp(v.id).setText(v.text);
                }
            });
            if(obj)obj(total_money,items_cost_store,items_type);
            items_cost_grid.total_money=total_money;

            if(opt.team_plan==true){

            }
        }

        //分组操作
        function setGroup(b){
            var g = Ext.getCmp('_group_by2');
            g.setText(b.text);
            items_cost_store.group(b.field);
            g.field = b.field;
        };

        //添加项目
        function tbar_items(v){
            if(opt.no_update==true){

            }else{
                var v_text= v.text;
                if(v_text.indexOf('(')>0){
                    v_text= v_text.split('(');
                    v.text=v_text[0];
                }
                if(v.text=='车辆'){
                    var type='按团计算';
                    var day_new='-1';
                    var name='北京中型车'
                    var type_name='中型大巴'
                }else if(v.text=='导游'){
                    var type='按团计算';
                    var day_new='-1';
                    var name='北京地接导游'
                    var type_name='北京地接优秀导游'
                }else if(v.text=='住宿'){
                    var type='按团计算';
                    var day_new='-1';
                    var name=''
                    var type_name=''
                }else{
                    var type='按人计算';
                    var day_new=1;
                    var name=''
                    var type_name=''
                }
                var pop_num=1;
                if(items_cost_grid.pop_num)pop_num=items_cost_grid.pop_num;
                //车辆公式计算=成人数量+儿童数量
                if(v.text=='车辆' && typeof items_cost_grid.pop=='object'){
                    var pop=items_cost_grid.pop;
                    pop_num=parseFloat(pop.big)+parseFloat(pop.small);
                }

                var items_data={
                    ti_insti_name:name,
                    ti_cs_type_name:type_name,
                    ti_type_new: v.text,
                    ti_type_mode:type,
                    ti_insti_type:'现金',
                    ti_sct_type:'成人票',
                    ti_day:day_new,
                    ti_all_money:'0',
                    ti_num:pop_num,
                    ti_trade_price:'0',
                    ti_remark:''
                };
                items_data.ti_sort=sort_fn(items_data.ti_type_new);
                items_cost_store.add(items_data);
            }

        }

        //删除成本项目
        function items_cost_del(){
            var _row=SUNLINE.getSelected(items_cost_grid);
            if (!_row){
                Ext.Msg.alert('友情提示', '请选择您想要删除的该成本项目。');
                return;
            };
            items_cost_store.remove(_row);
        }
        return items_cost_grid;
    },
};

//附件渲染方法
function _attach(v){
    var tmp = "&nbsp;";
    if (v){
        var t = v.split(',');
        tmp = "<div class='button-attach' qtip='已绑定"+ t.length +"个附件'>&nbsp;</div>";
    };
    return tmp;
};


function product_type(v){
    var com_type=_sunline_.product_type,len=com_type.length;
    for(var i=0;i<len;i++){
        if(com_type[i][0]==v){ return com_type[i][1]; }
    };
    return com_type[i][0];
};

function Import(js, id){
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("script");
    if (!id) oScript.id = id;
    oScript.type = "text/javascript";
    oScript.src= js ;
    oHead.appendChild( oScript);
};


Ext.Ajax.on('requestcomplete', function(conn, response, options, eOpts){
    var _rt = response.responseText;
    try{
        var _ajax_return = Ext.decode(_rt);
        if (_ajax_return.status==0 && _ajax_return.logout==1){
            top.Ext.Msg.show({
                title: '错误信息',
                message: '您当前的会话已<span style="color: #ff9b2d">超时</span>，请<span style="color: blue">重新登录</span>！',
                width: 300,
                buttons: Ext.Msg.OK,
                buttonText: { ok: '我知道了' },
                fn: function(){
                    top.location.href = _ajax_return.url;
                },
                icon: Ext.MessageBox.INFO
            });
        }
    }catch(e){
       /* console.log(response);
        console.log(options);*/
    }
});

function in_array($value, $array){
    if (typeof $array != 'object') return false;
    for (var $i=0; $i<$array.length; $i++){
        if ( $value == $array[$i] ) return $i;
    }
    return -1;
};

//四舍五入保留两位小数点
function round_format(price){
    return Math.round(price).toFixed(2);
}

function sort_fn(v){
    var str='<i class="bus-stor-cls">8</i>'+ v;
    if(v=='导游' || v=='车辆'){
        str='<i class="bus-stor-cls">1</i><font color="blue">'+ v+'<font>';
    }
    return str;
};


//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
window.banBackSpace=function(e){
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源
    var t = obj.type || obj.getAttribute('type');//获取事件源类型
    //获取作为判断条件的事件类型
    var vReadOnly = obj.getAttribute('readonly');
    var vEnabled = obj.getAttribute('enabled');
    //处理null值情况
    vReadOnly = (vReadOnly == null) ? false : vReadOnly;
    vEnabled = (vEnabled == null) ? true : vEnabled;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readonly属性为true或enabled属性为false的，则退格键失效
    var flag1=(ev.keyCode == 8 && (t=="password" || t=="text" || t=="textarea")
    && (vReadOnly==true || vEnabled!=true))?true:false;
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2=(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea") ?true:false;
    //判断
    if(flag2) return false;
    if(flag1) return false;
}
//禁止后退键 作用于Firefox、Opera
window.document.onkeypress=banBackSpace;
//禁止后退键  作用于IE、Chrome
window.document.onkeydown=banBackSpace;