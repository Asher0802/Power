var _me = window.location.href;
if (top.location.href != _me) top.location.href = _me;
Ext.onReady(function(){

    Ext.QuickTips.init();
    var cp = new Ext.state.CookieProvider();
    Ext.state.Manager.setProvider(cp);

    var tb = Ext.create('Ext.toolbar.Toolbar', { cls:'ziyo-main-bar' });
  //  var tb = Ext.create('Ext.toolbar.Toolbar');

    tb.add({
        xtype: 'tbtext',
        cls : 'logo',
        text: '<span><h1>太原花木</h1></span>'
    });
    var sub_menu = {};
    for (var i=0; i<__main_menu.length; i++){
        var item = __main_menu[i];
        //主菜单
        tb.add( {
            id : 'm_' + item['id'],
            cls : 'mbtn',
            text : '<i class="fa ' + item['icon'] + ' fa-3x"></i><br>' + item['text'],
            handler : function(b){
                var ln = Ext.getCmp('ziyo-left');
                ln.setTitle('<i class="fa fa-bars"></i> ' + sub_menu[b.id].text);
                var html = menu_tpl.apply(sub_menu[b.id]['children']);
                var menu = Ext.fly('ziyo-menu');
                menu.setHtml(html);
                menu.highlight('ffffff', { attr : 'backgroundColor', endColor: '2A3340', easing : 'easeIn', duration : 500});
                bind('ziyo-menu');
            }
        } );
        //子菜单
        sub_menu['m_' + item['id'] ] = item;
    };

    tb.add('->');
    //用户信息
    tb.add({
        id : 'user_info',
        text : '【'+username+'】<span>退出</span>',
        enableToggle: true,
        pressed: false,
        handler: function (btn) {
            window.location.href =logout_url;
        }
    });

    var left_width = 200;
    new Ext.Viewport({
        layout: 'border',
        items:  [{
            region : 'north',
            border : false,
            tbar : tb,
            shadow: true
        },{
            title: '<i class="fa fa-bars"></i> 工作台',
            region:'west',
            floatable: false,
            width: left_width,
            pressed:true,
            id:'ziyo-left',
            cls:'ziyo-left',
            autoScroll : true,
            html:'<div id="ziyo-menu" class="ziyo-menu ziyo-menu-expand"></div>'
        },{
            xtype:'tabpanel',
            reference: 'tabpanel',
            collapsible: false,
            region: 'center',
            id:'MainTabPanel',
            defaults: { autoScroll: true, closable: true },
            items:[
                {
                    title:'工作台',
                    glyph: 11,
                    id:'wq',
                    html:'<div><li><a href="http://fontawesome.io/icons/">font</a><li></div>'
                }
            ]
        }]
    });

    var lp = Ext.getCmp('ziyo-left'), lh = lp.getHeader(),
        collapse_width=40; //collapse_width的宽度请配合样式.ziyo-menu-collapse的宽度
    lh.on('click', function(){
        var menu = Ext.fly('ziyo-menu');
        if (menu.hasCls('ziyo-menu-expand')){
            lp.addCls('ziyo-left-collapse');
            lp.removeCls('ziyo-left-expand');
            lp.setWidth(collapse_width);
            cp.set('ziyo-left-menu', collapse_width);
            menu.addCls('ziyo-menu-collapse');
            menu.removeCls('ziyo-menu-expand');
        }else{
            lp.addCls('ziyo-left-expand');
            lp.removeCls('ziyo-left-collapse');
            lp.setWidth(left_width);
            cp.set('ziyo-left-menu', left_width);
            menu.addCls('ziyo-menu-expand');
            menu.removeCls('ziyo-menu-collapse');
        }
    });

    if (cp.get('ziyo-left-menu') == collapse_width){
        lp.setWidth(collapse_width);
        var menu = Ext.fly('ziyo-menu');
        menu.removeCls('ziyo-menu-expand');
        menu.addCls('ziyo-menu-collapse');
    };

    function getIcon(v){
        v = v ? v : 'fa-file-code-o';
        if (v.substring(0,3)!='fa-') v = 'fa-file-code-o';
        return v;
    };

	//工作台部分
    var menu_data = {}, float_menu_width = 150, current_pm;
    var menu_tpl = new Ext.XTemplate(
        '<ul>',
        '<tpl for=".">',
        '<li>' +
            '<a href="javascript:void(0);" class="{[this._sub_menu_cls(values.children)]} ziyo-menu-items" data-id="{id}">' +
            '<label><i class="fa {[this._icon(values.icon)]}"></i></label>' +
            '<span>{text}</span>' +
            '</a>',
        '{[this._child(values.children)]}',
        '</li>',
        '{[this._load_data(values)]}',
        '</tpl>',
        '</ul>',
        {
            _child : function(v){
                return v ? menu_tpl.apply(v) : '';
            },
            _icon : getIcon,
            _sub_menu_cls : function(v){
                return v ? 'ziyo-sub-menu' : '';
            },
            _load_data : function(v){
                menu_data[v.id] = v;
            }
        }
    );

    var html = menu_tpl.apply(__main_menu);
    var menu = Ext.fly('ziyo-menu');
    menu.insertHtml('afterBegin', html, true);
    menu.highlight('ffffff', { attr : 'backgroundColor', endColor: '2A3340', easing : 'easeIn', duration : 500});

    bind('ziyo-menu');

    function bind(obj, am){
        var menu = Ext.fly(obj);
        var aa = menu.query('a');
        Ext.each(aa, function(item, index, all){
            var ao = Ext.get(item), is_sub_menu = ao.hasCls('ziyo-sub-menu');
            if (is_sub_menu) ao.addCls('ziyo-sub-menu-expand');
            ao.on('click', function (e, t, o) {
                var id = ao.getAttribute('data-id');
                var node = menu_data[id];

                if (is_sub_menu) {
                    var nx = ao.next();
                    nx.setVisibilityMode(Ext.dom.Element.DISPLAY);
                    if (!nx.isHide) {
                        ao.removeCls('ziyo-sub-menu-expand');
                        ao.addCls('ziyo-sub-menu-collapse');
                        nx.isHide = true;
                        nx.hide();
                    } else {
                        ao.removeCls('ziyo-sub-menu-collapse');
                        ao.addCls('ziyo-sub-menu-expand');
                        nx.isHide = false;
                        nx.show();
                    };
                };
                var _type = node.type;
                if (_type!='0'){
                    var module = node.module, _link='';
                    var _mod = module.split('/')[0].toLowerCase();
                    _link = $__app__ + '/' + node.module;
                    if(node.action)_link+='/' + node.action
                    if (_mod=='http:' || _mod=='https:' || _mod=='ftp:'|| _type=='3') _link = module;
                    var css = '';
                    OpenTab(node.text, node.id, css, _link, _type);
                };
            });

            ao.on({
                mouseenter : function(e, t, o){
                    //进入
                    var menu = Ext.fly(obj);
                    var expand = menu.hasCls('ziyo-menu-expand');
                    if ( am && cleaner ) clearTimeout(cleaner);
                    if (expand) return;

                    var id = ao.getAttribute('data-id');
                    var node = menu_data[id];
                    var mid = 'menu-float-'+ node.id;
                    var _menu = Ext.getCmp(mid);
                    current_pm = ao.id;
                    if (!_menu){
                        var html = '<a href="#" class="ziyo-menu-items ziyo-menu-items-float">' + node.text + '</a>';
                        if (node.children) {
                            ao.addCls('ziyo-menu-over');
                            html += menu_tpl.apply(node.children);
                        };

                        _menu = Ext.create('Ext.Component',{
                            floating:true,
                            html : html,
                            width:float_menu_width,
                            id:mid,
                            cls: 'ziyo-menu ziyo-menu-float ziyo-menu-expand',
                            shadow:false,
                            autoShow: true
                        });

                        var xy = ao.getXY(), wh = ao.getSize();
                        _menu.setPosition( (xy[0]+wh.width), xy[1] );
                        bind(mid, true);
                    }else
                        _menu.setStyle({display:'block'});
                },
                mouseleave : function(e, t, o){
                    //离开
                    var menu = Ext.fly(obj);
                    var expand = menu.hasCls('ziyo-menu-expand');
                    if ( am ) cleaner = setTimeout(function(){
                        menu.setStyle({display:'none'});
                    },50);
                    //console.log(current_pm);
                    if (expand) return;

                    var id = ao.getAttribute('data-id');
                    var node = menu_data[id];
                    var mo = Ext.getCmp('menu-float-' + node.id);
                    if (node.children) {
                        cleaner = setTimeout(function(){
                            mo.setStyle({display:'none'});
                        },50);
                    }else{
                        mo.setStyle({display:'none'});
                    }
                }
            });
        });
    }


    function updatePass(){
        var s = _chgPassForm.getForm().getValues();
        if (!_chgPassForm.form.isValid()) {
            Ext.Msg.alert('友情提示', '请核对表单数据是否正确！留意红色边框的区域。');
            return;
        }

        if (s.u_pass != s.u_pass2) {
            Ext.Msg.alert('友情提示', '两次输入的密码不一致，请重新输入。');
            return;
        }

        Ext.Msg.confirm('友情提示', '您真的要修改密码吗？', function(yn){
            if (yn=='yes'){
                Ext.Ajax.request({
                    url : $__app__ + '/Users/updatePass',
                    method : 'POST',
                    params : {u_id:s.u_id,u_password :s.u_pass,u_old:s.u_oldpass},
                    success : function(response, opts){
                        var ret = Ext.decode(response.responseText);
                        Ext.Msg.alert('友情提示', ret.info);
                        _chgPassWin.hide();
                    },
                    failure : function(response, opts){
                        Ext.Msg.alert('友情提示', '用户密码修改失败！');
                    }
                });
            }
        });
    }


});


window.OpenTab = function(name, id, css, link, type, fn) {
    if (type=='0'){return;}
    if (type=='2'){ window.open(link, id); return; }
    if (type=='3'){ try{eval(link);}catch(e){ Ext.Msg.alert( $app_ui_title, '错误提示：<br><textarea style="width:300px; height:80px;">' + e.message +'</textarea>'); } return;}
    if (link==''){link = $__app__ + '/Index/build';}
    //id = id.replace('tree_','').replace('menu_','');
    var tabId = "x-tab_" + id; //为id稍作修改。
    var tabTitle = name;
    var iconCss  = '';
    if (css!=''){iconCss = css;}
    var MainTabPanel = Ext.getCmp('MainTabPanel'); //得到tab组件
    var tab = MainTabPanel.getComponent(tabId); //得到tab页
    var is_load = true;

    if (!tab) {
        is_load = false;
        tab = MainTabPanel.add(
            new Ext.Panel({
                id: tabId,
                title: tabTitle,
                autoScroll: false,
                layout: 'fit',
                border: false,
                closable: true,
                listeners:{
                    activate : function(p){
                        try{
                            var xtheme = Ext.util.Cookies.get('xtheme');
                            eval("window.ifm_" + tabId + ".set_theme({xtheme:'"+xtheme+"'});");
                        }catch(e){
                            //Ext.Msg.alert('友情提示','提示内容：' + e.message + '|||' +xtheme);
                        }
                    }
                },
                html:'<iframe width="100%" height="100%" id="ifm_'+tabId+'"  name="ifm_'+tabId+'" src="' + link + '" frameborder="0"></iframe>'
            })
        );
    };
    MainTabPanel.setActiveTab(tab); //激活加入的tab页
    if (iconCss!=''){
        tab.setIconClass(iconCss)
    };
    if (fn){
        try{
            if(fn=='runReActive'){
                parent.ReActive(link);
            }else{
                if (is_load) {
                    eval("window.ifm_" + tabId + "."+ fn);
                }else{
                    setTimeout(function(){
                        eval("window.ifm_" + tabId + "."+ fn);
                    },1000);
                }
            }
        }catch(e){ }
    };
};

function _changePass(){
    _chgPassWin.show('sunline_home');
};

/**
 * 操作父级下的子级内容
 * @param id
 * @param fn
 * @returns {Window}
 */
window.to_pernet_wind=function(id,fn){
    var tab_id=window.frames[id];
    if(fn){
        fn(tab_id);
    }
    return tab_id;
}