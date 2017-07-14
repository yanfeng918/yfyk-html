
function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        window.location.href = "http://m.dagongpan.cn";
    }
}

//browserRedirect();
ip="114.215.252.82";
//ip="localhost";
var setting = {
	base: "http://"+ip+"/yjb/",
    baseHtml:"http://"+ip,
    //baseHtml:"http://"+ip+"/yfyk-html/",
	locale: "zh_CN"
};

var messages = {
	"shop.message.success": "操作成功"
};

// 添加Cookie
function addCookie(name, value, options) {
	if (arguments.length > 1 && name != null) {
		if (options == null) {
			options = {};
		}
		if (value == null) {
			options.expires = -1;
		}
		if (typeof options.expires == "number") {
			var time = options.expires;
			var expires = options.expires = new Date();
			expires.setTime(expires.getTime() + time * 1000);
		}
		document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires ? "; expires=" + options.expires.toUTCString() : "") + (options.path ? "; path=" + options.path : "") + (options.domain ? "; domain=" + options.domain : ""), (options.secure ? "; secure" : "");
	}
}

// 获取Cookie
function getCookie(name) {
	if (name != null) {
		var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
		return value ? decodeURIComponent(value[1]) : null;
	}
}

// 移除Cookie
function removeCookie(name, options) {
	addCookie(name, null, options);
}

//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间 
function delCookie1(name){
	var date = new Date(); 
	date.setTime(date.getTime() - 10000); 
	document.cookie = name + "=a; expires=" + date.toGMTString(); 
}

function delCookie(name) {
	var date=new Date();
	date.setTime(date.getTime()-10000);
    document.cookie=name+"=; expire="+date.toGMTString()+"; path=/;";
    //document.cookie=name+"=; expire="+date.toGMTString()+"; path=/yjb-html";
};

//JavaScript生成GUID的算法
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
//JavaScript生成GUID的算法
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
}
/**
 * 统一ajax请求
 * 1、type:请求方法，2、data：请求数据，3、url：请求路径，4、callback：回调函数
 * 返回结果为401时表示为未登入，直接跳转到登入页面。
 */
function getAjax(type,data,url,callback,async){
    $.ajax({
        type: type,
        async:true,
        url: setting.base+url,
        dataType: "json",
        data:data,
        success: function (res) {
            if(res.type=="401"){
                alert(res.content);
                top.location=setting.baseHtml+"login.html";
            }
            callback(res);
        },
        error: function (res) {

        }
    });
}

/**
 * 统一ajax请求(非异步加载)
 * 1、type:请求方法，2、data：请求数据，3、url：请求路径
 * 返回结果为401时表示为未登入，直接跳转到登入页面。
 */
function getAjax(type,data,url,callback){
    $.ajax({
        type: type,
        async:false,
        url: setting.base+url,
        dataType: "json",
        data:data,
        success: function (res) {
            if(res.type=="401"){
                alert(res.content);
                top.location=setting.baseHtml+"login.html";
            }
            callback(res);
        },
        error: function (res) {

        }
    });
}
/* 简单的静态返回顶部，用js模拟滚动效果上滑至顶部 */
function pageScroll(){
    //把内容滚动指定的像素数（第一个参数是向右滚动的像素数，第二个参数是向下滚动的像素数）
    window.scrollBy(0,-100);
    //延时递归调用，模拟滚动向上效果
    scrolldelay = setTimeout('pageScroll()',100);
    //获取scrollTop值，声明了DTD的标准网页取document.documentElement.scrollTop，否则取document.body.scrollTop；因为二者只有一个会生效，另一个就恒为0，所以取和值可以得到网页的真正的scrollTop值
    var sTop=document.documentElement.scrollTop+document.body.scrollTop;
    //判断当页面到达顶部，取消延时代码（否则页面滚动到顶部会无法再向下正常浏览页面）
    if(sTop==0) clearTimeout(scrolldelay);
}

Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var wait=60;
function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");
        o.value="获取验证码";
        wait = 60;
    } else {
        o.setAttribute("disabled", true);
        o.value="重新发送(" + wait + ")";
        wait--;
        setTimeout(function() {
                time(o)
            },
            1000)
    }
}




	
	



