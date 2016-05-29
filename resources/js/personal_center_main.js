/* 
* @Author: dell
* @Date:   2015-08-19 14:29:35
* @Last Modified by:   dell
* @Last Modified time: 2015-09-07 10:24:03
*/

$().ready(function() {

    $(".cityName").html(getCookie("cityName"));
    $("#area_id").val(getCookie("cityId"));
    var formParam = $("#pForm").serialize();
    /* 获取昨日收益和全部收益 */
    getAjax("GET","","/income/auth/getIncomeAmount",getIncomeAmountCallback,true);

    /* 今日新增房源数量 */
    var data_areaId = {"area_id":getCookie("cityId")};
    getAjax("GET",data_areaId,"houseInfo/getTodayHouseInfoCount",getTodayHouseInfoCountCallback,true);

    /* 今日新增房源Top10 */
    //getAjax("GET","","houseInfo/getLatestHouseInfoList",getLatestHouseInfoListCallback,true);

    /* 今日新增征集数量 */
    getAjax("GET",data_areaId,"collection/getTodayCollectionCount",getTodayCollectionCountCallback,true);

    /* 今日新增征集Top10 */
    getAjax("post", formParam,"collection/getLatestCollectionList",getLatestCollectionListCallback,false);
    //getAjax("GET","","collection/getLatestCollectionList",getLatestCollectionListCallback,true);
})

    /* 获取昨日收益和全部收益 回调*/
    function getIncomeAmountCallback(data){
        $("#balance").html(data.balance);
        $("#yesterdayIncome").html(data.yesterdaySum);
    }
    /* 今日新增房源数量 回调*/
    function getTodayHouseInfoCountCallback(data){
        $("#todyCount").html(data);
    }

/* 今日新增征集数量 回调*/
function getTodayCollectionCountCallback(data){
    $("#todayCollectionCount").html(data);
}
/* 今日新增征集Top10 回调 */
function getLatestCollectionListCallback(data){
    $("#collectionTable tbody tr").remove();
    if(data.length<=0){
        $("table").append("<tr><td style='color: red;font-weight: bold'>暂无"+getCookie("cityName")+"房源征集</td></tr>");
    }
    $.each(data, function (i, item) {
        var content = "<tr style=\"border-bottom: 1px solid #BABCBF; margin: 1% 0; height: 75px\">" ;
        content+= "<td class=\"td_collection_info\"><span class=\"supply_icon\">"+
            "<img src=\"../resources/images/supply.png\"  style=\"disply:inline-block; vertical-align: middle;\"/>"+" </span>"
            +"<span class=\"blue\">"+item.area.fullName+"</span></td>";

        content += "<td class=\"blue\">"+item.community+"</td>";

        content += "<td class=\"td_collection_info\">辛苦费<span class=\"price\">"+item.collectPrice+"元</span>&nbsp;求"
            +item.area.fullName+
            item.community+
            "房源<br/><span style='color: rgba(171, 167, 175, 0.99); font-size: small'>地址:"+item.address+"<br/>备注:"
            +item.description+"</span>";
        content += "<span ></span></td>";
        content += "<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
        content += "</tr>";
        $("table").append(content);

    });
}

		



	
