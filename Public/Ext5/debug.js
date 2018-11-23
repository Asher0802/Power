	
	
	//用于编辑表格后改变GridPanel里的记录显示；
	function ChangeRowData(oldRow, newJson, store){
		//oldRow 是一个store的getSelected()对象;
		//newJson是一个form的getValues()得到的对象;
		for (field in newJson){
			oldRow.set(field, newJson[field]);
		}
		if (store!=null){
			store.commitChanges();
		}
	}
	
	
	
	//提示MessageBox
	window.msgTs = function(_Title,_Width,_Msg,_Btn,_Icon,_Time){
		if(_Title == ""){ var _Title = top.SysName;}
		var msgTip = Ext.MessageBox.show({
			title   : _Title,
			width   : _Width,
			msg     : _Msg,
			buttons : _Btn,
			icon    : _Icon
		});
		if(_Time != ""){setTimeout(function(){msgTip.hide();},1000*Number(_Time));}
	}
	
	
	window.formMsgTs = function(){
		var formMsgTip=Ext.MessageBox.show({
			title   : '错误信息',
			width   : 300,
			msg     : '您的表单数据存在错误或非法字符，请拉动滚动条进行检查',
			buttons : Ext.MessageBox.OK,
			icon    : Ext.MessageBox.WARNING
		});
	}
	
	
	//js版的dateAdd
	Date.prototype.dateAdd = function(interval,number) 
	{ 
		var d = this; 
		var k={'y':'FullYear', 'q':'Month', 'm':'Month', 'w':'Date', 'd':'Date', 'h':'Hours', 'n':'Minutes', 's':'Seconds', 'ms':'MilliSeconds'}; 
		var n={'q':3, 'w':7}; 
		eval('d.set'+k[interval]+'(d.get'+k[interval]+'()+'+((n[interval]||1)*number)+')'); 
		return d; 
	}
	
	
	//js版的dateDiff
	Date.prototype.dateDiff = function(interval,objDate2) 
	{ 
		var d=this, i={}, t=d.getTime(), t2=objDate2.getTime(); 
		i['y']=objDate2.getFullYear()-d.getFullYear(); 
		i['q']=i['y']*4+Math.floor(objDate2.getMonth()/4)-Math.floor(d.getMonth()/4); 
		i['m']=i['y']*12+objDate2.getMonth()-d.getMonth(); 
		i['ms']=objDate2.getTime()-d.getTime(); 
		i['w']=Math.floor((t2+345600000)/(604800000))-Math.floor((t+345600000)/(604800000)); 
		i['d']=Math.floor(t2/86400000)-Math.floor(t/86400000); 
		i['h']=Math.floor(t2/3600000)-Math.floor(t/3600000); 
		i['n']=Math.floor(t2/60000)-Math.floor(t/60000); 
		i['s']=Math.floor(t2/1000)-Math.floor(t/1000); 
		return i[interval]; 
	}


    function CloseTab(d) {
        var mTP = Ext.getCmp('MainTabPanel');
        var aTb = mTP.getActiveTab();
        if (d) {
            mTP.remove(aTb.id);
        } else {
            Ext.Msg.confirm('友情提示', '你真的要关闭『' + aTb.title + '』吗？', function (yn) {
                if (yn == 'yes') {
                    mTP.remove(aTb.id);
                }
            });
        }
    }


    function getCloseQtip(title){
	//子功能的关闭按钮提示
		return clsQtip = '<b>关闭'+ title +'</b><br>如果您还需要操作本功能，可以先不关闭。直接打开新的功能页面进行操作。但这将多使用一些内存。';
	}

    function getDateTime(format){
        var dt = new Date();
        if (!format) { format = 'Y-m-d H:i:s'; }
        return dt.format(format);
    }

    function isDisabled(func){
        var role = top._uinfo.r_role;
        var tmp = role.indexOf(func, 0) === -1;
        return tmp;
    }


    function ajaxModify(jsonParams, url, record, func){
        Ext.Ajax.request({
            url:url,
            method:'POST',
            params:jsonParams,
            success : function(response, opts){
                try{
                    var rst = Ext.decode(response.responseText);
                    if (record && rst.status==1) record.commit();
                    // 回调函数传入三个参数：AJAX返回值的JSON对象，AJAX递交值和当前操作的记录
                    if (func) func(rst, jsonParams, record);
                }catch(e){}
            },
            failure : function(response, opts){}
        });
    }

    function money(v, m, r){
        var m = real_money(v, m, r);
        return '<div style="text-align: right; padding-right: 5px;">'+m+'</div>';
    }

    function real_money(v, m, r){
        if (v==null || v=='') v=0;
        if (isNaN(v)) v=0;
        return '￥'+Number(v).toFixed(2);
    }

    function showFormValues(ExtForm){
        var j = ExtForm.getForm().getValues();
        Ext.Msg.alert('开发提示', '<textarea rows="8" cols="80">' + Ext.encode(j) + '</textarea>');
    }

    function building(b){
        Ext.Msg.alert('开发提示', b.text + " 开发中...");
    }