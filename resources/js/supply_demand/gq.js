/* 
* @Author: dell
* @Date:   2015-09-15 18:41:23
* @Last Modified by:   dell
* @Last Modified time: 2015-09-20 19:12:33
*/

'use strict';
$(function(){
	$(".to_submit").click(function(event) {
		$(".hide").show();
		$(".close").click(function(event) {
			$(".hide").hide();
		});
	});
})