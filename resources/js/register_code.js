$(function(){
    $("#inviteCode").val("");
    $("#inviteCode").focus();


    $("#fm").validate({
        rules: {
            inviteCode: "required",
            max:6
        },
        submitHandler: function() {
           getAjax("GET", $('#fm').serialize(),"register/isInviteCodeEffective",submitCallback,true);
        }
    });
})
function submitCallback(data){
    if(data.isExisted=="false"){
        alert("您输入的邀请码无效，请确认后再输入！");
        $("#inviteCode").val("");
        $("#inviteCode").focus();
    }else if(data.isExisted=="error"){
        alert("系统错误，请重新尝试！");
    }else if(data.isExisted=="true"){
        //alert("当前可注册,推广人id为:"+data.promoterId);
        top.location=setting.baseHtml+"register.html?inviteCode="+$("#inviteCode").val();
    }
}