/* 
* @Author: dell
* @Date:   2015-08-19 14:29:35
* @Last Modified by:   dell
* @Last Modified time: 2015-09-06 17:56:12
*/
var pageCount;

$(function(){
	
    //$(".container_bottom_record").hide();

    ////选项卡切换
    //$(".recharge_record").click(function(event) {
	//	$(".container_bottom_want").hide();
	//	$(".container_bottom_record").show();
	//	$(this).addClass('recharge_current');
	//	$(".recharge_want").removeClass('recharge_current');
	//	//初始化分页的数据-加载充值记录
     //   var formParam = $("#recharge_record_form").serialize();
	//	getAjax("post", formParam,"recharge/auth/getRechargeList",submitCallback,false);
	//	$("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
	//});
    //
    ////选项卡切换
	//$(".recharge_want").click(function(event) {
	//	$(".container_bottom_record").hide();
	//	$(".container_bottom_want").show();
	//	$(this).addClass('recharge_current');
	//	$(".recharge_record").removeClass('recharge_current');
	//});

    /**
     * 按照时间的起始条件进行搜索
     */
    $("#search").click(function(){
        $("#pageNumber").val("1");
        getAjax("POST", $('#recharge_record_form').serialize(),"recharge/auth/getRechargeList",submitCallback,false);
        $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
    });

})

    // 分页 充值记录
    PageClick = function(pageclickednumber) {
        //序列化表格内容为字符串
        $("#pageNumber").val(pageclickednumber);
        var formParam = $("#recharge_record_form").serialize();
        getAjax("post", formParam,"recharge/auth/getRechargeList",submitCallback,false);
        $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
    }


    /**
    * 查询回调函数
    * @param data
    */
    function submitCallback(data){
        pageCount=data.pageCount;
        $("table tbody tr").remove();
        $.each(data.list, function(i, item){

            var content = "<tr>";
            content+="<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
            content+="<td>"+item.amount+"</td>";
            content+="<td style='color: red'>"+item.statsName+"</td>";
            content+="<td>微信支付</td>";
            content+="</tr>";
            $("table tbody").append(content);
        });
    }
    
    //$(function(){
    //    $(".course").hide();
    //    $(".query_course").click(function(event) {
    //        $(".course").show();
    //        $(".course").click(function(event) {
    //        $(this).hide();
    //        });
    //    });
    //})
/**
 * 新增充值记录
 */
$(function(){

    $("#rechargeId").validate({
        rules: {
            amount:{
                required:true,
                digits:true,
                number:true,
                min:10
            },
            rechargeNumber:"required"
        },
        //messages:{
        //    amount:"充值金额在10-2000元之间"
        //},
        submitHandler: function() {
            getAjax("POST", $('#rechargeId').serialize(),"recharge/auth/addRechargetInfo",rechargeCallback,true);
        }
    });

})

function rechargeCallback(data){
    if(data.type=='error'){
        alert(data.content);
    }else {
       /* alert(data.content);
         $("#rechargeNumber").val("");
         $("#amount").val("");*/
        $(".recharge_record").click();
    }
}