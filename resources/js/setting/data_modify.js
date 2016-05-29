$(function(){

	//加载个人的信息
	getAjax("POST", $('#fm').serialize(),"member/auth/load",laodInfo,true);

	//修改个人的信息
	$("#fm").validate({
 		 rules: {
 			username: "required",
            email:"email",
            //name: "required",
            mobile:"required"
 		},
   	   submitHandler: function() {
           getAjax("POST", $('#fm').serialize(),"member/auth/modify",submitCallback,true);
		}
	});

})

function laodInfo(data){
	$("#id").val(data.id);
	$("#username").val(data.username);
	$("#email").val(data.email);
	$("#name").val(data.name);
	$("#mobile").val(data.mobile);
	$("#phone").val(data.phone);
}

function submitCallback(data){
    alert(data.content);    
}