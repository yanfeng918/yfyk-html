/*
$(function(){
    $("#username").val("");
    $("#email").val("");
    $("#email").val("");
    $("#mobile").val("");
    $("#password").val("");
    var code = getInviteCode("inviteCode");
    if(code=="notExisted"){
        top.location=setting.baseHtml+"register_code.html";
    }
    $("#inviteCode").val(code);
    $("#fm").validate({
        rules: {
            username: {
                required: true,
                minlength:6
            },
            email: {
                required: true,
                email: true
            },
			mobile:{
                number:true,
                required: true,
                maxlength:11,
                minlength:11
            },
            password:{
                required: true,
                minlength:6
            },
            enPassword:{
                required: true,
                equalTo:"#password"
            },
            area_id_select:{
                required: true
            }
        },
        submitHandler: function() {
            getAjax("GET", $('#fm').serialize(),"register/isInviteCodeEffective", checkInviteCallBack,true);
        }
    });
});

$(function(){
   $("#getCaptcha").click(function(){
       //setTime(this);
   });


});

//var countdown=60;
//function setTime(val) {
//    if (countdown == 0) {
//        val.removeAttribute("disabled");
//        val.setAttribute("background-color", "orangered none repeat scroll 0 0");
//        val.value="获取验证码";
//        countdown = 60;
//    } else {
//        val.setAttribute("disabled", true);
//        val.setAttribute("background-color", "gray none repeat scroll 0 0");
//        val.value="重新发送(" + countdown + ")";
//        countdown--;
//    }
//    setTimeout(function() {
//        setTime(val)
//    },1000)
//}

function checkInviteCallBack(data){
    if(data.isExisted=="false"){
        alert("当前未检测到邀请码，请重新确认！");
        top.location=setting.baseHtml+"register_code.html";
    }else if(data.isExisted=="error"){
        top.location=setting.baseHtml+"register_code.html";
    }else if(data.isExisted=="true"){
        //alert("当前可注册,推广人id为:"+data.promoterId);
        getAjax("POST", $('#fm').serialize(),"register/submit",submitCallback,true);
        //top.location=setting.baseHtml+"register.html?inviteCode="+$("#inviteCode").val();
    }
}


function getInviteCode(name) {
    var str = window.location.search;
    if (str.indexOf(name) != -1) {
        var pos_start = str.indexOf(name) + name.length + 1;
        var pos_end = str.indexOf("&", pos_start);
        if (pos_end == -1) {
            return str.substring(pos_start);
        }
        else {
            return str.substring(pos_start, pos_end)
        }
    } else {
        return "notExisted";
    }
}


function submitCallback(data){
    if(data.type=="error"){
        alert(data.content);
        return;
    }else if(data.type=="inviteCodeError"){
        alert(data.content);
        top.location=setting.baseHtml+"register_code.html?";
    }else{

        //设置用户名和token的cookie
        addCookie("yjb_username", data.username, 60*30);
        addCookie("yjb_token", data.token, 60*30);
        addCookie("cityId",data.cityId,60*30);
        addCookie("cityName",data.cityName,60*30);
        window.setTimeout(function(){
            window.location.href="personal_center.html";
        },500);
    }
}
var base = setting.base;
$().ready(function() {
    var $areaId = $("#area_id");
    // 地区选择
    $areaId.lSelect({
        url: base+"/common/area"
    });
})*/



$(function(){
    var uuidValue = uuid();
// 验证码
    $("#captchaImage").attr("src", setting.base+"common/captcha?captchaId="+uuidValue+"&timestamp=" + new Date());
// 更换验证码
    $(".captchaImage").click( function() {
        $(".captchaImage").attr("src", setting.base+"common/captcha?captchaId="+uuidValue+"&timestamp=" + new Date());
    });
    //document.getElementById("getCaptcha").removeAttribute("disabled");
    //var code = getInviteCode("inviteCode");
    //if(code=="notExisted"){
    //    window.location="register_code.html";
    //}
    //$("#inviteCode").val(code);
    $("#mobile").focus();
    $("#btn_register").click(function(){
        var isOk =checkStatus();
        if(isOk){
            $("#captchaId").val(uuidValue);
            getAjax("POST", $('#register').serialize(),"register/submit",submitCallback,true);
        }
    });
    $("#getCaptcha").click(function(){
        var isSendOk =sendSmsCheck();
        if(isSendOk){
            time(this);
            var smsData = {"mobile":$("#mobile").val(),"type":"2","param":"","captcha":$("#captcha").val(),"captchaId":uuidValue};
            getAjax("GET", smsData,"common/sendSMSCaptcha",sendSMSCaptchaCallback,true);
        }
    });
});

function submitCallback(data){
    if(data.type!="success"&&data.type!="inviteCodeError"){
        displayErrInfo(data.content);
        return;
    }
    if(data.type=="inviteCodeError"){
        displayErrInfo(data.content);
        top.location="register_code.html";
    }else{
        //设置用户名和token的cookie

        var option ={"path":"/","expires":60*30};

        addCookie("yjb_id", data.id, option);
        addCookie("yjb_username", data.username, option);
        addCookie("yjb_token", data.token, option);
        addCookie("cityId",data.cityId,option);
        addCookie("cityName",data.cityName,option);
        window.setTimeout(function(){
            window.location="personal_center.html";
        },500);
        //alert("注册成功");
    }
}

function sendSMSCaptchaCallback(data){
    if(data.type!="smsSendSuccess"){
        showSMSStatus(data.content);
        return;
    }else{
        showSMSStatus("*验证码已发送，30分钟内有效!");
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
        return false;
    }else{
        return true;
    }
}

function showSMSStatus(str){
    $("#sendSMSStatus").html(str);
    $("#sendSMSStatus").show();
}

function getInviteCode(name) {
    var str = window.location.search;
    if (str.indexOf(name) != -1) {
        var pos_start = str.indexOf(name) + name.length + 1;
        var pos_end = str.indexOf("&", pos_start);
        if (pos_end == -1) {
            return str.substring(pos_start);
        }
        else {
            return str.substring(pos_start, pos_end)
        }
    } else {
        return "notExisted";
    }
}

function checkStatus(){
    var err="";
    if($("#mobile").val().trim()==""){
        err="手机号不能为空！";
        //$("#mobile").focus();
    }else if(isMobile($("#mobile").val())){
        //$("#mobile").focus();
        err= "请输入正确的手机号";
    }
    //else if($("#mobileCaptcha").val()==""){
    //    err= "请输入验证码！";
        //$("#mobileCaptcha").focus();
    //}
    else if(isUserCorrect($("#username").val().trim())){
        err="登录名由数字或字母组成";
        //$("#username").focus();
    }else if(isUserCorrect($("#username").val().trim())){
        err="登录名由数字或字母组成";
        //$("#username").focus();
    }else if($("#username").val().trim().length<6){
        err="用户名长度最小为6";
        //$("#username").focus();
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
    }else if($("#area_id").val()==null||$("#area_id").val().length<=0){
        err= "请选择您的居住地";
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

function isUserCorrect(str){
    var b = /^[0-9a-zA-Z]*$/g;
    return !b.test(str);
}

function isEmail(str){
    var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return !emailReg.test(str);
}

function isMobile(str){
    var mobileReg = /^[1][3|4|5|7|8][0-9]{9}$/;
    return !mobileReg.test(str);
}

$(function(){
    var $areaId = $("#area_id");
    // 地区选择
    $areaId.lSelect({
        url: setting.base+"/common/area"
    });

    //document.getElementById("getCaptcha").onclick=function(){
    //    var mobile = $("#mobile").val();
    //    if(isMobile(mobile)){
    //        time(this);
    //    }
    //}
});


