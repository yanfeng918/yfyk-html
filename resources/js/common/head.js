$(function(){
	//加载用户名称
	var uname = getCookie("yjb_username");
	if(uname!=null && uname!=""){
		$(".user").html(uname);
		$(".part1 ").hide();
		$(".part2 ").show();
	}else{
		$(".part2 ").hide();
		$(".part1 ").show();
	}
	//用户退出
	$(".exit").click(function(){
		getAjax("get", {},"login/logout",submitCallback,false);
	})

});

/**
 * 用户退出 回调函数
 * @param data
 */
function submitCallback(data){
	//清除cookie
	delCookie("yjb_username");
	delCookie("yjb_token");
	top.location.href=setting.baseHtml+"/login.html";
}
/*导航栏切换*/
$(function(){
	//if (getUrlParam("nav")==1) {
	//	$(".nav ul li").eq(0).removeClass('current');
	//};

});

/*二维码切换*/
$(function(){
	//$(".customer_service").hover(function() {
	//	$(".code").slideDown();
	//}, function() {
	//	$(".code").slideUp();
	//});
	//// nav li 跳转
	//$(".nav li.isLogin").click(function(){
	//	//加载用户名称
	//	var  uname = getCookie("yjb_username");
	//	if(uname==null || uname.length==0){
	//		if($(this).attr("href").indexOf("collect/list.html")>=0){
	//			top.location.href=setting.baseHtml+"collect/forum.html";
	//		}else{
	//			top.location.href=setting.baseHtml+"login.html";
	//		}
	//	}else{
	//		top.location.href=setting.baseHtml+$(this).attr("href");
	//	}
	//})
});