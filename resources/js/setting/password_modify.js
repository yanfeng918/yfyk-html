$(function(){
	//修改密码
	$("#fm").validate({
 		 rules: {
 			      currentPassword: "required",
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
      getAjax("POST", $('#fm').serialize(),"member/password/auth/update",submitCallback,true);
		}
	});
})

function submitCallback(data){
    alert(data.content);    
}