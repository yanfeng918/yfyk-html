/* 
* @Author: dell
* @Date:   2015-08-19 14:29:35
* @Last Modified by:   dell
* @Last Modified time: 2015-09-06 12:06:30
*/

$(function(){

	$(".container_bottom_fixed").hide();

	$(".release_zdy").click(function(event){
		/*$(".container_bottom_fixed").hide();
		$(".container_bottom_zdy").show();*/
		$(this).addClass('release_current');
		$(".release_fixed").removeClass('release_current');
		$("#type").val("zdy");
		$("#selfInfoPrice").show();
		$("#tipA").show();
		$("#tipB").hide();
	});

	$(".release_fixed").click(function(event) {
		/*$(".container_bottom_zdy").hide();
		$(".container_bottom_fixed").show();*/
		$(this).addClass('release_current');
		$(".release_zdy").removeClass('release_current');
		$("#type").val("system");
		$("#selfInfoPrice").hide();
		$("#tipA").hide();
		$("#tipB").show();
	});

	 if (getUrlParam("type")==1) {
		 //$(".release_fixed").click();
		 $("#type").val("system");
		 $("#tipA").hide();
		 $("#tipB").show();
		 $("#selfInfoPrice").hide();
		 $(".release_fixed").addClass('release_current');
		 $(".release_zdy").removeClass('release_current');
      };
})
