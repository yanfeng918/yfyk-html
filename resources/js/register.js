$(function () {

    $("#mobile").focus();

    $("#btn_register").click(function () {
        var isOk = checkStatus();
        if (isOk) {
            getAjax("POST", $('#registerForm').serialize(), "register/submit", submitCallback, true);
        }
    });

});


function submitCallback(data) {
    if (data.type != "success" && data.type != "inviteCodeError") {
        layer.msg(data.content);
        return;
    }
    if (data.type == "inviteCodeError") {
        displayErrInfo(data.content);
        top.location = "register_code.html";
    } else {
        //设置用户名和token的cookie

        var option = {"path": "/", "expires": 7 * 24 * 60 * 60};
        addCookie("yjb_id", data.id, option);
        addCookie("yjb_username", data.username, option);
        addCookie("yjb_token", data.token, option);
        addCookie("cityId", data.cityId, option);
        addCookie("cityName", data.cityName, option);
        window.setTimeout(function () {
            window.location="house_info/list-table.html";
        }, 500);

    }
}


    function checkStatus() {

        //else if($("#mobileCaptcha").val()==""){
        //    err= "请输入验证码！";
        //$("#mobileCaptcha").focus();
        //}
        if (isUserCorrect($("#username").val().trim())) {
            layer.msg('登录名由数字或字母组成！');
            return false;
        } else if ($("#username").val().trim().length < 6) {
            layer.msg('用户名长度最小为6！');
            return false;
        } else if ($("#password").val() == "") {
            layer.msg('密码不能为空！');
            return false;
        } else if ($("#password").val().indexOf(" ") != -1) {
            layer.msg('密码不能包含空格！');
            return false;
        } else if ($("#password").val().length < 6) {
            layer.msg('密码最小长度为6位！');
            return false;
        } else if ($("#passwordConfirm").val() == "") {
            layer.msg('确认密码不能为空！');
            return false;
        } else if (!(($("#passwordConfirm").val()) == ($("#password").val()))) {
            layer.msg('2次密码输入不一致！');
            return false;
        }

        return true;

    }


function isUserCorrect(str) {
    var b = /^[0-9a-zA-Z]*$/g;
    return !b.test(str);
}

function isEmail(str) {
    var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return !emailReg.test(str);
}

function isMobile(str) {
    var mobileReg = /^[1][3|4|5|7|8][0-9]{9}$/;
    return !mobileReg.test(str);
}




