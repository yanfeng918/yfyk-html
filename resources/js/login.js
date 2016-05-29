
function check(){
    var isOk = checkStatus();
    if(isOk){
        var data={'username':$("#username").val().toLowerCase(),'password':$("#password").val()};
        getAjax("POST", data,"login/submit",submitCallback,false);
    }
    return false;
}

$(function(){
    $("#username").focus();
});

function submitCallback(data){
    if(data.type=="error"){
        if(data.content.indexOf("未绑定")!=-1){
            //$("#bindingAction").show();
            displayErrInfo(data.content+"请先绑定！");
        }else{
            displayErrInfo(data.content);
            //$("#bindingAction").hide();
        }
        return;
    }else{
        //设置用户名和token的cookie
        addCookie("yjb_username", data.username, 60*30);
        //登录成功后，判断是否已经绑定。
        //if(data.IsActivateMobile=="false"){
            //window.location="../../../bindingMobile.html";
        //}else{{{}
            var option ={"path":"/","expires":60*30};
            addCookie("yjb_id", data.id, option);

            addCookie("yjb_token", data.token, option);
            addCookie("cityId",data.cityId,option);
            addCookie("cityName",data.cityName,option);
            window.location="personal_center.html";
        //}
    }
}

function checkStatus(){
    var err="";
    if($("#username").val().trim()==""){
        err="登录名不能为空！";
    }else if($("#password").val().trim()==""){
        $("#password").focus();
        err= "密码不能为空！";
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