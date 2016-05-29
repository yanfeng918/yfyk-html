/* 
* @Author: dell
* @Date:   2015-08-19 14:29:35
* @Last Modified by:   dell
* @Last Modified time: 2015-09-20 19:37:59
*/
var pageCount;

/**
 * 载入页面初始化数据
 */
$(".region").hide();
$().ready(function() {
    $("#city_id").val(getCookie("cityId"));
    $("#cityName").html(getCookie("cityName"));
    getTown();
    getBrowse();
})


function getTown(){
    var data={"area_id": $("#city_id").val()};
    $("#area_id").val($("#city_id").val());
    getAjax("get", data,"houseInfo/getAreaHouseCountByCity?"+new Date(),getTownCallback,true);
}
/**
 * 获取区域列表回掉函数
 */
function getTownCallback(data){
    if(data.type=="error"){
        alert(data.content);
        return;
    }else{
        var str="";
        $.each(data,function(idx,item){
            str += "<li class=\"datas_detail\" onclick='onclickArea(this)'><input type='hidden' value='"+item.areaId+";"+item.areaName+"'><span class=\"area\">";
            str += item.areaName;
            str += "</span><div class=\"num\"><span>"+item.houseInfoCount+"</span><span>套＞</span></div></li>";
        })

         $("#city_view ul").remove();
        $("#city_view").append("<ul>"+str+"</ul>");
    }
}


/**
 * 获取查看过的数据列表
 */
function getBrowse(){
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"bfhouse/auth/getBrowseHouse",getBrowseCallback,false);
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClickBrowse });
}
function PageClickBrowse(pageclickednumber){
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"bfhouse/auth/getBrowseHouse",getBrowseCallback,false);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClickBrowse });
}
function  getBrowseCallback(data) {
    pageCount=data.pageCount;
    if($("#browseTable tr").length>1) {
        $("#browseTable tr:gt(0)").remove();
    }
    $.each(data.list, function(i, item){
        var content = "<tr><input type='hidden' value='"+item.id+"'>";
        content+="<td  class='price'>"+item.infoPrice+"元</td>";
        content+="<td>"+item.area.fullName+"</td>";
        content+="<td>"+item.community+"</td>";
        if(item.houseShape.indexOf("零室零厅")!=-1){
            content+="<td></td>";
        }else{
            content+="<td>"+item.houseShape+"</td>";
        }
        if(item.areaSize!=0){
            content+="<td>"+item.areaSize+"平米</td>";
        }else{
            content+="<td></td>";
        }
        if(item.salePrice!=0){
            content+="<td>"+item.salePrice+"万元</td>";
        }else{
            content+="<td></td>";
        }
        content+="<td>"+item.ban+"</td>";
        content+="<td>"+item.roomNumber+"</td>";
        content+="<td>"+item.mobile+"</td>";
        if(item.isReported==true){
            content+="<td style='color: red'>已举报</td>";
        }else if(item.isExpired==true){
            content+="<td style='color: orange'>已过举报期</td>";
        }else{
            content+="<td class=\"query operate\" onclick='reportData(this)'><u>举报数据</u></td>";
        }
        content+="<td>"+item.checkStatus+"</td>";
        content+="<td>"+item.checkContent+"</td>";
        content+="</tr>";
        $("#browseTable").append(content);
    });
}
/**
 * 举报数据
 * @param dom
 */

var houseIdXX;
function reportData(dom){
    houseIdXX =$(dom).parent().children().eq(0).val();
    var data={"houseInfo_id":$(dom).parent().children().eq(0).val()};
    getAjax("GET",data,"auth/report/isReportExpired",IsReportExpiredCallback,true);
}
function IsReportExpiredCallback(data){
    if(data == true){
        alert("不能举报，已经过期！");
        return;
    }else{
        document.getElementById('reportId').style.display='block';
        document.getElementById('fade').style.display='block';
        $("#reportHouseid").val(houseIdXX);
    }
}
function reportEnsure(){
    var data={"houseInfo_id":$("#reportHouseid").val(),"reportReason":$("#reportReason").val()};
    getAjax("POST", data,"auth/report/addReportInfo",reportDataCallback,false);
}
function reportDataCallback(data){
    alert(data.content);
    cancle('reportId');
    getBrowse();
}

/**
 * 弹出框取消按钮
 */
function cancle(divid){
    document.getElementById(divid).style.display='none';
    document.getElementById('fade').style.display='none';
}
