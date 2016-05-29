/* 
* @Author: dell
* @Date:   2015-08-19 14:29:35
* @Last Modified by:   dell
* @Last Modified time: 2015-09-10 12:07:51
*/

$(function(){
	$(".container_bottom_record").hide();
	$(".recharge_record").click(function(event) {
		$(".container_bottom_want").hide();
		$(".container_bottom_record").show();
		$(this).addClass('recharge_current');
		$(".recharge_want").removeClass('recharge_current');
	});

	$(".recharge_want").click(function(event) {
		$(".container_bottom_record").hide();
		$(".container_bottom_want").show();
		$(this).addClass('recharge_current');
		$(".recharge_record").removeClass('recharge_current');
	});

	$(".course").hide();	
	$(".query_course").click(function(event) {
		$(".course").show();
	});
	


})
