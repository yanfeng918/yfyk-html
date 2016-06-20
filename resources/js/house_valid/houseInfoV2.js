/* 
 * @Author: dell
 * @Date:   2015-08-19 14:29:35
 * @Last Modified by:   dell
 * @Last Modified time: 2015-09-20 19:37:59
 */
//var pageCount;

/**
 * 载入页面初始化数据
 */

$(".region").hide();
$().ready(function() {
    $("#city_id").val(getCookie("cityId"));
    $("#cityName").html(getCookie("cityName"))
    getTown();
    getHouseInfo();

})
/**
 * 城市更改
 */
$(function(){
    $("#city_id").change(function(){
        getTown();
        $(".region").hide();
    });
})
/**
 * 触发售价下拉框查询
 */
$(function(){
    $("#salePrice").change(function(){
        getHouseInfo();
    });
})
/**
 * 触发面积下拉框查询
 */
$(function(){
    $("#areaSize").change(function(){
        getHouseInfo();
    });
})
/**
 * 触发房型下拉框查询
 */
$(function(){
    $("#houseShape").change(function(){
        getHouseInfo();
    });
})

/**
 * 搜索房源信息列表
 */
$(function(){
    $("#searchHouseInfo").click(function(){
        $(".ac_results").hide();
        getHouseInfo();
    });
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
 * 获取区域下级板块和房源信息
 */
function onclickArea(dom) {

    $(".region").show();
    $("#area_id").val(dom.firstChild.value);
    getRegionInfo(dom.firstChild.value)
}
/**
 * 获取板块信息
 */
function getRegionInfo(region_id){
    var areaInfo=region_id.split(";");
    $("#town_name").html(areaInfo[1]);
    var data={"parentId": areaInfo[0]};
    $("#area_id").val(areaInfo[0]);
    getAjax("get", data,"common/area?"+new Date(),getRegionInfoCallback,false);
    //$(".main_R_nav ul li").eq(0).click();
    getHouseInfo();
}
/**
 * 获取板块回调函数
 */
function getRegionInfoCallback(data){
    var str="";
    $.each(data, function(i, item){
        str +="<span onclick='regionInfoOnclick(this)'><input type='hidden'  value='"+i+"'>"+item+"</span>  ";
    });
    $("#region_id").html(str);
}
/**
 * 点击板块动作
 */
function regionInfoOnclick(dom){
    $("#area_id").val(dom.firstChild.value);
    getHouseInfo();
}
/**
 * 获取房源数据列表
 */
var pageCount;
function getHouseInfo(){
    $("#pageNumber").val(1);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"houseInfoValid/auth/getHouseInfoList",getHouseInfoCallback,false);
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
}
function PageClick(pageclickednumber){
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"houseInfoValid/auth/getHouseInfoList",getHouseInfoCallback,false);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });

}

function getHouseInfoCallback(data){
    pageCount=data.pageCount;
    if($("#houseTable tr").length>1) {
        $("#houseTable tr:gt(0)").remove();
    }
    pageScroll();
    $.each(data.list, function(i, item){
        var content = "<tr><input type='hidden' value='"+item.id+"'>";
//content+="<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
        content+="<td class='price'>"+item.infoPrice+"元</td>";
        content+="<td>"+new Date(parseInt(item.createDate)).format("yyyy-MM-dd hh:mm")+"</td>";
        content+="<td>"+item.area_fullName+"</td>";
        content+="<td>"+item.community+"</td>";
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
        content+="<td>"+item.ban+"&nbsp;</td>";
         var roomNumber="";
        (item.roomNumber == null)? roomNumber="":roomNumber==item.roomNumber;
        content+="<td>"+item.roomNumber+"&nbsp;</td>";
        //content+="<td>"+item.name+"&nbsp;</td>";
        content+="<td>"+item.mobile+"</td>";
        if(item.status=="SUCCESS"&&item.available==true){
            content+="<td class=\"query operate\" onclick='queryData(this)'><u>查看数据</u></td>";
        }else if(item.status=="FAIL"&&item.available==true){
            content+="<td>已下架</td>";
        }else if(item.available==false){
            content+="<td>被举报</td>";
        }
        //if(item.favouriteStatus==true){
        //    content+="<td style='color: red;'><u>已收藏</u></td>";
        //}else{
        content+="<td class=\"collect operate\" onclick='favoriteHouse(this)'><u>收藏</u></td>";
        //}
        content+="</tr>";
        $("#houseTable").append(content);
    });
}
/**
 * 收藏房源
 * @param dom
 */
function favoriteHouse(dom){
    var id=dom.parentElement.firstChild.value;
    var houseInfo_id={"houseInfo_id":id};
    getAjax("GET", houseInfo_id,"bfhouse/auth/addFavoriteHouseInfo?"+new Date(),favoriteHouseCallback,true);
}
function favoriteHouseCallback(data){
    alert(data.content);
}
/**
 * 查看数据
 */
function queryData(dom){
    var id=dom.parentElement.firstChild.value;
    var houseInfo_id={"houseInfo_id":id};
    getAjax("GET", houseInfo_id,"houseInfo/auth/getBrowseHouseInfoVO?"+new Date(),queryDataCallback,true);
}

function queryDataCallback(data,houseInfo_id){
    if(data.mine==true){
        showData(data);
    }else if(data.bought==true){
        showData(data);
    }else if(data.balanceEnough==true){
        isPay(data);
    }else if(data.balanceEnough==false){
        notEnough(data);
    }
}
/**
 * 信息弹出框
 * @param data
 */
function showData(data){
    $("#showData tr:gt(0)").remove();
    document.getElementById('light2').style.display='block';
    document.getElementById('fade').style.display='block';
    var content="";
    content+="<tr><td>"+data.houseInfo.area.fullName +"&nbsp&nbsp";
    content+="&nbsp&nbsp"+data.houseInfo.community+"&nbsp&nbsp";
    if(data.houseInfo.houseShape.indexOf("零室零厅")!=-1){
        content+="&nbsp&nbsp户型无&nbsp&nbsp";
    }else {
        content+="&nbsp&nbsp"+data.houseInfo.houseShape+"&nbsp&nbsp";
    }
    content+="&nbsp&nbsp"+data.houseInfo.areaSize+"平</td></tr>";
    content+="<tr><td>楼层"+data.houseInfo.floor+"&nbsp&nbsp";
    content+="&nbsp&nbsp房号"+data.houseInfo.roomNumber+"&nbsp&nbsp";
    content+="&nbsp&nbsp楼栋号"+data.houseInfo.ban+"</td></tr>";
    content+="<tr><td >售价：<span style='color: red'>"+data.houseInfo.salePrice+"</span>万元</td></tr>";
    content+="<tr><td>业主："+data.houseInfo.name+"&nbsp&nbsp";
    content+="&nbsp&nbsp电话：<span style='color: red'>"+data.houseInfo.mobile+"</span></td></tr>";
    $("#showData").append(content);
}
/**
 * 是否支付弹出框
 * @param data
 */
function isPay(data){
    document.getElementById('light1').style.display='block';
    document.getElementById('fade').style.display='block';
    $("#needPayid").html(data.houseInfo.infoPrice);
    $("#houseId").val(data.houseInfo.id);
}
/**
 * 弹出框取消按钮
 */
function cancle(divid){
    document.getElementById(divid).style.display='none';
    document.getElementById('fade').style.display='none';
}
/**
 * 确定支付按钮
 * @param ensureId
 */
function ensure(ensureId){
    cancle(ensureId);
    var houseInfo_id={"houseInfo_id":$("#houseId").val()}
    getAjax("GET", houseInfo_id,"houseInfo/auth/browseHouseInfo?"+new Date(),payData,true);

}
/**
 * 确定支付信息弹出框
 * @param data
 */
function payData(data){
    $("#showData tr:gt(0)").remove();
    document.getElementById('light2').style.display='block';
    document.getElementById('fade').style.display='block';

    var content="";
    content+="<tr><td>"+data.area.fullName +"&nbsp&nbsp";
    content+="&nbsp&nbsp"+data.community+"&nbsp&nbsp";
    content+="&nbsp&nbsp"+data.houseShape+"&nbsp&nbsp";
    content+="&nbsp&nbsp"+data.areaSize+"平</td></tr>";

    content+="<tr><td>楼层"+data.floor+"&nbsp&nbsp";
    content+="&nbsp&nbsp房号"+data.roomNumber+"&nbsp&nbsp";
    content+="&nbsp&nbsp楼栋号"+data.ban+"</td></tr>";

    content+="<tr><td >售价：<span style='color: red'>"+data.salePrice+"</span>万元</td></tr>";

    content+="<tr><td>业主："+data.name+"&nbsp&nbsp";
    content+="&nbsp&nbsp电话：<span style='color: red'>"+data.mobile+"</span></td></tr>";
    $("#showData").append(content);
}
/**
 * 余额不足弹出框
 */
function notEnough(data){
    document.getElementById('light').style.display='block';
    document.getElementById('fade').style.display='block';
    $("#notEnough").html(data.houseInfo.infoPrice);
}





