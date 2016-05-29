/**
 * 
 */

			jQuery.validator.addMethod("af",function(value,element,params){
    		if(value.length>1){
    			return false;
    		}
    		if(value>=params[0] && value<=params[1]){
    			return true;
    		}else{
    			return false;
    		}
    		},"必须是一个字母,且a-f");
    	
	    	// 手机号码验证
			jQuery.validator.addMethod("isMobile", function(value, element) {
			var length = value.length;
			/*var mobile =  /^(((13[0-9]{1})|159|153)+\d{8})$/;*/
			var mobile=/(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/;
			//var mobile = /^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/;
			return (mobile.test(value));
			}, "请正确填写您的手机号码");

