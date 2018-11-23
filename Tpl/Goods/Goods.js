
Ext.onReady(function(){
    var url= $__app__ + '/Goods/dataJson';
    var field=[];
    var store=SUNLINE.JsonStore(url,field);
	
	
	var data={
        text: 'Root',
        expanded: true,
        children: [
            {
                text: 'Child 1',
                leaf: true
            },
            {
                text: 'Child 2',
                leaf: true
            },
            {
                text: 'Child 3',
                expanded: true,
                children: [
                    {
                        text: 'Grandchild',
                        leaf: true
                    }
                ]
            }
        ]
    };
	
var panl=Ext.create('Ext.tree.Panel', {
    renderTo: document.body,
    title: '产品分类',
    width: 800,
    height: 250,
    root: data
});
	

    

    new Ext.Viewport({
        layout : 'border',
		bodyStyle:'background:#fff; padding:5px;',
        items:panl
    })





})