//---------- 获取鼠标的位置，调用locate()之后，变量cx被赋值为鼠标的横坐标，变量cy被赋值为鼠标的纵坐标。
var cx = 0 , cy = 0;
function locate() {
	cx = event.x?event.x:event.pageX;
	cy = event.y?event.y:event.pageY;
	if ( typeof(cx) == "undefined" ) {
		cx = 0;
	}
	if ( typeof(cy) == "undefined" ) {
		cy = 0;
	}
	if ( $.browser.msie ) {
		if ( $.browser.version != "8.0" ) {
			cx += document.documentElement.scrollLeft;
			cy += document.documentElement.scrollTop;
		}
	}
	else if ( $.browser.safari ) {
		cx += document.body.scrollLeft;
		cy += document.body.scrollTop;
	}
}

//---------- 重写event对象，支持多浏览器
function __firefox() {
	HTMLElement.prototype.__defineGetter__("runtimeStyle", __element_style);
	window.constructor.prototype.__defineGetter__("event", __window_event);
	Event.prototype.__defineGetter__("srcElement", __event_srcElement);
}
function __element_style() {
	return this.style;
}
function __window_event() {
	return __window_event_constructor();
}
function __event_srcElement() {
	return this.target;
}
function __window_event_constructor() {
	if ( document.all ) {
		return window.event;
	}
	var _caller = __window_event_constructor.caller;
	while ( _caller != null ) {
		var _argument = _caller.arguments[0];
		if ( _argument ) {
			var _temp = _argument.constructor;
			if( _temp.toString().indexOf("Event") != -1 ) {
				return _argument;
			}
		}
		_caller = _caller.caller;
	}
	return null;
}
if ( window.addEventListener ) {
	__firefox();
}

//---------- 兼容获取xml的标签内容
function gettext(node) {
	if ( $.browser.msie ) {
		return node.text;
	}
	else {
		return node.textContent;
	}
}

//---------- 获取地址栏参数的类，类似request.QueryString()，如Request.id等同于request.QueryString("id")
function UrlSearch() {
	var name,value;
	var str = window.location.href; //取得整个地址栏
	var num = str.indexOf("?");
	str = str.substr(num+1); //取得所有参数
	var arr = str.split("&"); //各个参数放到数组里
	for ( var i = 0; i < arr.length; i++ ) {
		num = arr[i].indexOf("=");
		if ( num > 0 ) {
			name = arr[i].substring(0,num);
			value = arr[i].substr(num+1);
			this[name] = value;
		} 
	} 
}
var Request = new UrlSearch(); //实例化

//---------- 设为首页
function SetHomePage(slink) {
	if ( document.all ) {
		try {
			document.body.style.behavior = "url(#default#homepage)";
			document.body.setHomePage(slink);
		}
		catch (e) {
			alert("对不起，您的IE是测试版本，不支持此功能。如果想将本网站设为首页，请您在“工具-Internet选项”中手动设置。");
		}
	}
	else if ( window.sidebar ) {
		if ( window.netscape ) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}
			catch (e) {
				alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config，然后将首选项 signed.applets.codebase_principal_support 值改为 true。");
			}
		}
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		prefs.setCharPref("browser.startup.homepage",slink);
	}
}

//---------- 加入收藏
function AddFavorite(slink,name) {
	if ( document.all ) {
		window.external.addFavorite(slink,name);
	}
	else if ( window.sidebar ) {
		window.sidebar.addPanel(name,slink,"");
	}
}

//---------- 重写window.prompt
window.prompt = ( function(prompt) {
    if ( window.navigator.appName.toLowerCase().indexOf("microsoft") < 0 ) {
		return prompt;
	}
	else {
		return function(msg) {
     		window.vbs_var = null;
			execScript("window.vbs_var = InputBox(unEscape('" + escape(msg) + "'), '用户提示')",'VBScript');
			return window.vbs_var;
		};
	}
} )(window.prompt);
