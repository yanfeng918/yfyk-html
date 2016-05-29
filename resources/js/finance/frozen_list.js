/* 
* @Author: dell
* @Date:   2015-08-19 14:29:35
* @Last Modified by:   dell
* @Last Modified time: 2015-08-25 09:15:25
*/
var pageCount;

/**
 * 载入页面初始化数据
 */
$().ready(function() {
    getFrozenList();
})

function getFrozenList(){
    //初始化分页的数据
    var formParam = $("#frozenFm").serialize();
    getAjax("post", formParam,"withDraw/auth/getFrozenDetailList",submitCallback,false);
    //加载充值记录
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
}

function PageClick(pageclickednumber){
    //序列化表格内容为字符串
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#frozenFm").serialize();
    getAjax("post", formParam,"withDraw/auth/getFrozenDetailList",submitCallback,false);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
}
/**
 * 条件查询按钮
 */
$(function(){
    $("#search").click(function(){
        $("#pageNumber").val("1");
        getAjax("POST", $('#frozenFm').serialize(),"withDraw/auth/getFrozenDetailList",submitCallback,false);
        $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
    });
})
 /**
 * 查询回调函数
 * @param data
 */
function submitCallback(data){
    pageCount=data.pageCount;
     if($("#frozenTable tr").length>1) {
         $("#frozenTable tr:gt(0)").remove();
     }
    $.each(data.list, function(i, item){
        var content = "<tr>";
        content+="<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
        content+="<td>"+item.frozenCount+"</td>";
        content+="<td>"+item.frozenType+"</td>";
        content+="</tr>";
        $("#frozenTable").append(content);
    });
}