

$().ready( function() {

    var $loginForm = $("#loginForm");
    var $username = $("#username");
    var $password = $("#password");

    var $isRememberUsername = $("#isRememberUsername");

    // 记住用户名
    if(getCookie("yjb_username") != null) {
        $isRememberUsername.prop("checked", true);
        $username.val(getCookie("yjb_username"));
        $password.focus();
    } else {
        $isRememberUsername.prop("checked", false);
        $username.focus();
    }

    // 表单验证、记住用户名
    $("#loginButton").click( function() {

        if ($username.val() == "") {
            layer.msg('用户名不能为空！');
            return false;
        }
        if ($password.val() == "") {
            layer.msg('密码不能为空');
            return false;
        }

        if ($isRememberUsername.prop("checked")) {
            addCookie("yjb_username", $username.val(), {"path":"/","expires":7 * 24 * 60 * 60});
        } else {
            removeCookie("yjb_username");
        }

        var data={'username':$("#username").val().trim().toLowerCase(),'password':$("#password").val()};

        getAjax("POST", data,"login/submit",submitCallback,true);


    });

});


    function submitCallback(data){
        if(data.type=="error"){
            //if(data.content.indexOf("未绑定")!=-1){
            //    //$("#bindingAction").show();
            //    displayErrInfo(data.content+"请先绑定！");
            //}else{
            //    displayErrInfo(data.content);
            //    //$("#bindingAction").hide();
            //}
            layer.msg(data.content);
            return;
        }else{
            //设置用户名和token的cookie
            var option ={"path":"/","expires":7 * 24 * 60 * 60};
            addCookie("yjb_username", data.username, option);
            addCookie("yjb_id", data.id, option);
            addCookie("yjb_token", data.token, option);
            addCookie("cityId",data.cityId,option);
            addCookie("cityName",data.cityName,option);
            window.location="house_info/list-table.html";

        }
    }


