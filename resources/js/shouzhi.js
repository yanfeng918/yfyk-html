/* 
* @Author: dell
* @Date:   2015-08-19 14:29:35
* @Last Modified by:   dell
* @Last Modified time: 2015-09-14 11:52:04
*/

$(function(){
	$(".expense").hide();
	$(".recharge_record").click(function(event) {
		$(".income").hide();
		$(".expense").show();
		$(this).addClass('recharge_current');
		$(".recharge_want").removeClass('recharge_current');
	});

	$(".recharge_want").click(function(event) {
		$(".expense").hide();
		$(".income").show();
		$(this).addClass('recharge_current');
		$(".recharge_record").removeClass('recharge_current');
	});

	


})
