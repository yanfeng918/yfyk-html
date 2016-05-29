/* 
* @Author: dell
* @Date:   2015-08-19 14:29:35
* @Last Modified by:   dell
* @Last Modified time: 2015-08-20 10:23:38
*/

$(function(){
	$(".container_bottom_bankcard").hide(); 
	$(".container_bottom_cash_record").hide();
	$(".cash_card").click(function(event) {
        getBankAccount();
		$(".container_bottom_bankcard").show();
		$(".container_bottom_bankcard").siblings() .hide();
		$(".container_top").show();
		$(this).addClass('cash_current');
		$(this).siblings() .removeClass('cash_current');
	});

	$(".cash_record").click(function(event) {
        getCashRecord();
		$(".container_bottom_cash_record").show();
		$(".container_bottom_cash_record").siblings() .hide();
		$(".container_top").show();
		$(this).addClass('cash_current');
		$(this).siblings() .removeClass('cash_current');
	});

	$(".cash_apply").click(function(event) {
        applyWithdraw();
		$(".container_bottom_apply").show();
		$(".container_bottom_apply").siblings() .hide();
		$(".container_top").show();
		$(this).addClass('cash_current');
		$(this).siblings() .removeClass('cash_current');
	});

})
