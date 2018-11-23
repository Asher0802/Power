/**
 * Created by zhushaolei on 15-6-1.
 */
/**
 * Ext5.0 不可直接写Date().format('')
 * @param mat 日期格式 Y-m-d
 * @param d 选择时间
 * @returns {format|*|format|format|format|format}
 * @constructor
 */
function DateFormat(mat,d){
    var d2=new Date();
    if(d)d2=new Date(d);
    var fm=Ext.Date.format(d2,mat);
    return fm;
}

/**
 * Ext5.0 LoadMask后要加componet
 * @param msg 提示语
 * @returns {LoadMask}
 * @constructor
 */
function LoadMask(msg){
    return new Ext.LoadMask(Ext.getBody().component, {msg:msg});
}

/**
 * Ext5.0 不再支持getSelected
 * @param grid 数据表
 * @constructor
 */
function GetSelected(grid){
    return grid.getSelectionModel().getSelection()[0];
}

function JsonStore(mod,pageSize,url,field,AutoLoad){
    AutoLoad=AutoLoad?AutoLoad:true;
    Ext.define(mod, {
        extend: 'Ext.data.Model',
        fields: field
    });
    var store = Ext.create('Ext.data.Store', {
        model: mod,
        pageSize:pageSize,
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
        autoLoad:AutoLoad
    });
    return store;
}