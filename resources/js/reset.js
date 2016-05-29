$(function(){
    $("#fm").validate({
        rules: {
            password:{
                required: true,
                minlength:6
            },
            enPassword:{
                required: true,
                equalTo:"#password"
            }
        },
        submitHandler: function() {
            getAjax("POST", $('#fm').serialize(),"member/password/reset",submitCallback,true);
        }
    });
})
function submitCallback(data){
    alert(data.content);
    if(data.type=="error"){
        window.location.href="forget.html";
    }else{
        window.location.href="../login.html";
    }
}
var base = setting.base;
$().ready(function() {
    $("#username").val(getUrlParam("username"));
    $("#key").val(getUrlParam("key"));
})