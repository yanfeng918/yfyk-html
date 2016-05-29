$(function(){
	$(".btn_Login").click(function(event) {
		$(".register").hide();
		$(".login").show();
	});
	$(".btn_Register").click(function(event){
		$(".login").hide();
		$(".register").show();
	});
		$("#marqueeId").click(function(event){
			window.location.href="../announcement.html";
		});
})