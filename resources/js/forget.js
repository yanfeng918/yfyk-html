$(function(){

	uuidValue = uuid();
// 验证码
	$("#captchaImage").attr("src", setting.base+"common/captcha?captchaId="+uuidValue+"&timestamp=" + new Date());
// 更换验证码
	$(".captchaImage").click( function() {
		$(".captchaImage").attr("src", setting.base+"common/captcha?captchaId="+uuidValue+"&timestamp=" + new Date());
	});

	document.getElementById("getCaptcha").removeAttribute("disabled");
	$("#getCaptcha").click(function(){
		var isSendOk =sendSmsCheck();
		if(isSendOk){
			time(this);
			var smsData = {"mobile":$("#mobile").val(),"type":"1","param":"","captcha":$("#captcha").val(),"captchaId":uuidValue};
			getAjax("GET", smsData,"common/sendSMSCaptcha",sendSMSCaptchaCallback,true);
		}
	});

	$("#btn_forgetPassword").click(function(){
		var isOk =checkStatus();
		if(isOk){
			getAjax("POST", $('#forgetPassword').serialize(),"member/password/resetByMobile",resetByMobileCallback,true);
		}
	});

});

function sendSMSCaptchaCallback(data){
	if(data.type!="smsSendSuccess"){
		showSMSStatus(data.content);
		return;
	}else{
		showSMSStatus("*验证码已发送，30分钟内有效!");
	}
}

function resetByMobileCallback(data){
	if(data.type!="success"){
		displayErrInfo(data.content);
	}else{
		alert("密码修改成功，请重新登录！");
		window.location.href="/login.html";
	}
}

function sendSmsCheck(){
	var err="";
	if($("#mobile").val().trim()==""){
		err="*手机号不能为空！";
		//$("#mobile").focus();
	}else if(isMobile($("#mobile").val())){
		//$("#mobile").focus();
		err= "*请输入正确的手机号";
	}else{
		err= "success";
	}
	if(err!="success"){
		showSMSStatus(err);
		//$("#sendSMSStatus").hide();
		return false;
	}else{
		return true;
	}
}

function showSMSStatus(str){
	$("#sendSMSStatus").html(str);
	$("#sendSMSStatus").show();
}

function checkStatus(){
	var err="";
	if($("#mobile").val().trim()==""){
		err="手机号不能为空！";
		//$("#mobile").focus();
	}else if(isMobile($("#mobile").val())){
		//$("#mobile").focus();
		err= "请输入正确的手机号";
	}else if($("#mobileCaptcha").val()==""){
		err= "请输入验证码！";
		//$("#mobileCaptcha").focus();
	}else if($("#password").val()==""){
		//$("#password").focus();
		err= "密码不能为空！";
	}else if($("#password").val().indexOf(" ")!=-1){
		//$("#password").focus();
		err= "密码不能包含空格";
	}else if($("#password").val().length<6){
		//$("#password").focus();
		err= "密码最小长度为6位！";
	}else if(!(($("#passwordConfirm").val())==($("#password").val()))){
		//$("#passwordConfirm").focus();
		err= "2次密码输入不一致！";
	}else{
		err= "success";
	}
	if(err!="success"){
		displayErrInfo(err);
		return false;
	}else{
		return true;
	}
}

function displayErrInfo(str){
	$("#alert-danger").html(str);
	$("#alert-danger").show();
}

function isMobile(str){
	var mobileReg = /^[1][3|4|5|7|8][0-9]{9}$/;
	return !mobileReg.test(str);
}


$(function(){

})