/* 
* @Author: dell
* @Date:   2015-08-25 09:15:58
* @Last Modified by:   dell
* @Last Modified time: 2015-09-02 17:07:51
*/

'use strict';

$(function(){

	/*$(".container_bottom_email").hide();*/

	$(".email_bound").click(function(event) {
		$(".container_bottom_mobile").hide();
		$(".container_bottom_email").show();
		$(this).addClass('bound_current');
		$(".mobile_bound").removeClass('bound_current');


	});

	$(".mobile_bound").click(function(event) {
		$(".container_bottom_email").hide();
		$(".container_bottom_mobile").show();
		$(this).addClass('bound_current');
		$(".email_bound").removeClass('bound_current');


	});
	//首先，判断邮件是否已经验证通过
	getAjax("get", {"email":"email"},"member/auth/isEmailActivated",isEmailActivatedCallback,false);

	//邮箱把绑定提交事件
	$("#email_bound").click(function(){
		
		var email = $("#email").val();
		getAjax("post", {"email":email},"member/auth/email_binding",submitCallback,false);
	})

})


function submitCallback(data){
    alert("请前往邮箱验证");
}

function isEmailActivatedCallback(data){

	if(data.type=="error"){
		$("#alreadyBinding").hide();
	}else{
		$("#alreadyBinding").show();
		$("#alreadyBinding span").html(data.content);
		$(".form").hide();

	}

	
}