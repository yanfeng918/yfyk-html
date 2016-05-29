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
    getTown();

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
    $(".main_R_nav ul li").eq(0).click();
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
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"houseInfo/auth/getHouseInfoList",getHouseInfoCallback,true);
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
}
function PageClick(pageclickednumber){
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"houseInfo/auth/getHouseInfoList",getHouseInfoCallback,true);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
}
function getHouseInfoCallback(data){
    pageCount=data.pageCount;
    if($("#houseTable tr").length>1) {
        $("#houseTable tr:gt(0)").remove();
    }
    $.each(data.list, function(i, item){
        var content = "<tr><input type='hidden' value='"+item.id+"'>";
//content+="<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
        content+="<td class='price'>"+item.infoPrice+"</td>";
        content+="<td>"+item.area_fullName+"</td>";
        content+="<td>"+item.community+"</td>";
        /*content+="<td>"+item.houseShape+"</td>";*/
        content+="<td>"+item.areaSize+"</td>";
        content+="<td>"+item.salePrice+"</td>";

        //content+="<td>"+item.roomNumber+"</td>";
        content+="<td>"+item.ban+"</td>";
        content+="<td>"+item.name+"</td>";
        content+="<td>"+item.mobile+"</td>";
        content+="<td class=\"query operate\" onclick='queryData(this)'><u>查看数据</u></td>";
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
    content+="&nbsp&nbsp"+data.houseInfo.houseShape+"&nbsp&nbsp";
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

/**
 * 获取我发布的数据列表
 */
function getRelease(){
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"houseInfo/auth/getReleaseHouseInfo",getReleaseCallback,false);
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClickRelease });
}
function PageClickRelease(pageclickednumber){
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"houseInfo/auth/getReleaseHouseInfo",getReleaseCallback,false);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClickRelease });
}
function getReleaseCallback(data){
    pageCount=data.pageCount;
    if($("#releaseTable tr").length>1) {
        $("#releaseTable tr:gt(0)").remove();
    }
    $.each(data.list, function(i, item){
        var content = "<tr><input type='hidden' value='"+item.id+"'>";
        content+="<td  class='price'>"+item.infoPrice+"</td>";
        content+="<td>"+item.area.fullName+"</td>";
        content+="<td>"+item.community+"</td>";
        content+="<td>"+item.houseShape+"</td>";
        content+="<td>"+item.areaSize+"</td>";
        content+="<td>"+item.salePrice+"</td>";
        content+="<td>"+item.floor+"</td>";
        content+="<td>"+item.roomNumber+"</td>";
        content+="<td>"+item.ban+"</td>";
        content+="<td>"+item.name+"</td>";
        content+="<td>"+item.mobile+"</td>";
        content+="<td>"+item.statusName+"</td>";
        content+="<td class=\"operate\" onclick='changeReleaseHouseInfo(this)'><u>修改</u></td>";
        content+="</tr>";
        $("#releaseTable").append(content);
    });
}

/**
 * 修改数据
 */
function changeReleaseHouseInfo(dom){
    var id=dom.parentElement.firstChild.value;
    var houseInfo_id={"houseInfo_id":id};
    getAjax("GET", houseInfo_id,"houseInfo/auth/checkHouseInfoStatus?"+new Date(),changeReleaseCallback,false);
}
//修改发布数据
function changeReleaseCallback(data){
    if(data.update==true){
        //只能修改价格
        if(data.onlyPrice==true){
            document.getElementById('changePriceId').style.display='block';
            document.getElementById('fade').style.display='block';
            $("#oldInfoPrice").html(data.houseInfo.infoPrice);
            $("#onlyPriceHouseId").val( data.houseInfo.id);



        }else{//可修改
            document.getElementById('changeInfoId').style.display='block';
            document.getElementById('fade').style.display='block';
            $("#infoPrice").val( data.houseInfo.infoPrice);
            $("#id").val( data.houseInfo.id);
            $("#mobile").val(data.houseInfo.mobile);
            $("#name").val(data.houseInfo.name);
            $("#area_ids").val(data.houseInfo.area.id);
            $("#area_ids").attr("treePath", data.houseInfo.area.treePath);
            $("#community").val(data.houseInfo.community);
            $("#ban").val(data.houseInfo.ban);
            $("#floor").val(data.houseInfo.floor);
            $("#roomNumber").val(data.houseInfo.roomNumber);
            $("#areaSizes").val(data.houseInfo.areaSize);
            $("#salePrices").val(data.houseInfo.salePrice);
            $("#address").val(data.houseInfo.address);
            var str=data.houseInfo.houseShape;
            $("#room").val(str.substr(0,1));
            $("#office").val(str.substr(2,1));
            var base = setting.base;
            var $areaIds = $("#area_ids");
            $areaIds.lSelect({
                url: base+"/common/area"
            });
        }
    }else {
        alert("该数据不能被修改");
    }
}
/**
 * 修改房源信息
 */
$(function(){

    $("#changeInfoFrom").validate({
        rules: {
            infoPrice: {
                required:true,
                number:true,
                range:[10,2000]
            },
            mobile:"required",
            name:"required",
            community:"required",
            ban:"required",
            floor:"required",
            roomNumber:"required",
            areaSizes:"required",
            salePrices:"required",
            area_ids:"required"
        },
        submitHandler: function() {
            getAjax("POST", $('#changeInfoFrom').serialize(),"houseInfo/auth/updateHouseInfo",changeOver,false);
        }
    });

})
function changeOver(data){
    cancle('changeInfoId');
    alert(data.content);
}

/* 修改房源信息价格对话框  */

    $(function(){

        $("#onlyInfoPrice").blur(function(){
            var max = parseInt($("#oldInfoPrice").html());
            var info = parseInt($("#onlyInfoPrice").val());
            if(info>max){
                alert("信息价格不能够高于之前价格")
            }
        });

        $("#changePriceForm").validate({
            rules: {
                infoPrice: {
                    required:true
                }
            },
            submitHandler: function() {
                var max = parseInt($("#oldInfoPrice").html());
                var info = parseInt($("#onlyInfoPrice").val());
                if(info>max){
                    alert("信息价格不能够高于之前价格");
                    return;

                }
                getAjax("POST", $('#changePriceForm').serialize(),"houseInfo/auth/updateHouseInfoPrice",changePrice,false);
            }
        });
    })

    function changePrice(){
        cancle('changePriceId');
        alert(data.content);
    }


/**
 * 获取收藏的数据列表
 */
function getfavorites(){
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"bfhouse/auth/getFavoriteHouse",getfavoritesCallback,false);
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClickfavorites });
}
function PageClickfavorites(pageclickednumber){
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"bfhouse/auth/getFavoriteHouse",getfavoritesCallback,false);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClickfavorites });
}
function  getfavoritesCallback(data) {
    pageCount=data.pageCount;
    if($("#favoritesTable tr").length>1) {
        $("#favoritesTable tr:gt(0)").remove();
    }
    $.each(data.list, function(i, item){
        var content = "<tr><input type='hidden' value='"+item.id+"'>";
        content+="<td  class='price'>"+item.infoPrice+"</td>";
        content+="<td>"+item.area.fullName+"</td>";
        content+="<td>"+item.community+"</td>";
        content+="<td>"+item.houseShape+"</td>";
        content+="<td>"+item.areaSize+"</td>";
        content+="<td>"+item.salePrice+"</td>";
        //content+="<td>"+item.floor+"</td>";
        //content+="<td>"+item.roomNumber+"</td>";
        content+="<td>"+item.ban+"</td>";
        content+="<td>"+item.name+"</td>";
        content+="<td>"+item.mobile+"</td>";
        content+="<td class=\"query operate\" onclick='queryData(this)'><u>查看数据</u></td><td class=\"collect operate\" onclick='cancleFav(this)'><u>取消收藏</u></td>";
        content+="</tr>";
        $("#favoritesTable").append(content);
    });
}
/**
 * 取消收藏
 */
function cancleFav(dom){
    var id=dom.parentElement.firstChild.value;
    var houseInfo_id={"houseInfo_id":id};
    getAjax("GET", houseInfo_id,"bfhouse/auth/cancleFavoriteHouseInfo?"+new Date(),cancleFavCallback,false);
    var r=dom.parentNode;
    var d=dom.parentNode.parentNode;
    d.removeChild(r);
}
function cancleFavCallback(data){
    alert(data.content);
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
        content+="<td  class='price'>"+item.infoPrice+"</td>";
        content+="<td>"+item.area.fullName+"</td>";
        content+="<td>"+item.community+"</td>";
        content+="<td>"+item.houseShape+"</td>";
        content+="<td>"+item.areaSize+"</td>";
        content+="<td>"+item.salePrice+"</td>";
        content+="<td>"+item.floor+"</td>";
        content+="<td>"+item.roomNumber+"</td>";
        content+="<td>"+item.ban+"</td>";
        content+="<td>"+item.name+"</td>";
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
}
//点击选项卡事件
$(function(){

    $(".list_total").show();
    $(".list_total").siblings().hide();
    $(".main_R_nav").show();
    $(".list_head").click(function(event) {
        
        $(this).addClass('main_R_nav_current');
        $(this).siblings().removeClass('main_R_nav_current');
        $(".main_R_list").eq($(this).index()).show();
        $(".main_R_list").eq($(this).index()).siblings().hide();
        $(".main_R_nav").show();
        $("#pageNumber").val("1");
        if($(this).index()==0){
            var a = $("#region_id").html();
            if(a.trim().length!=0){
                $(".region").show();
            }
            getHouseInfo();
        }else if($(this).index()==1){
            $(".region").hide();
            getBrowse();
        }else if($(this).index()==2){
            $(".region").hide();
            getRelease();
        }else if($(this).index()==3){
            $(".region").hide();
            getfavorites();
        }
    });

    

    /*区域板块部分售价户型面积下拉列表*/
      $(".down_list").hide();
      $(".drop_down").mouseover(function(){
        $(this).children("span.down_list").show();
      });
      $(".drop_down").mouseout(function(){
        $(this).children("span.down_list").hide();
      });
      /*切换城市*/
      $(".others").hide();
      $(".change").mouseover(function(){
        $(this).children(".others").show();
      });
      $(".change").mouseout(function(){
        $(this).children(".others").hide();


      });

      /*区域*/
     
      $(".list_head").click(function(event) {
        $(this).addClass('main_R_nav_current');
        $(this).siblings().removeClass('main_R_nav_current');
        $(".main_R_list").eq($(this).index()).show();
        $(".main_R_list").eq($(this).index()).siblings().hide();
        $(".main_R_nav").show();
        });
        /*侧边栏点击当前模块文字变色*/
        $(".datas_detail").click(function(event) {
            $(this).siblings().children('span.area').removeClass('area_current');
            $(this).children('span.area').addClass('area_current');
        });
        /*区域板块模块文字变色*/
    $(".region_center").children('span').click(function(event) {
        $(this).css("color","#3465CB;");
        $(this).siblings().css("color","#525252;");
    });

        /*区域板块切换*/

    $(".region").hide();
    $(".area").click(function(event) {
        $(".region").show();
    });
    $(".area_total").click(function(event) {
        $(".region").hide();
    });


    if (getUrlParam("type")==null) {
        $(".main_R_nav ul li").eq(0).click();
    };
    if (getUrlParam("type")==1) {
        $(".main_R_nav ul li").eq(1).click();
    };
    if (getUrlParam("type")==2) {

        $(".main_R_nav ul li").eq(2).click();
    };
    if (getUrlParam("type")==3) {

        $(".main_R_nav ul li").eq(3).click();
    };

});

