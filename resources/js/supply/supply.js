//var pageCount;

/**
 * 载入页面初始化数据
 */

$(".region").hide();
$().ready(function() {
    //获取区域
    $("#city_id").val(getCookie("cityId"));
    $("#cityName").html(getCookie("cityName"))
    getTown();
    getHouseInfo();

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
function getTown(){
    var data={"area_id": $("#city_id").val()};
    $("#area_id").val($("#city_id").val());
    getAjax("get", data,"collection/getAreaCollectionCountByCity?"+new Date(),getTownCallback,false);
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
            str += "</span><div class=\"num\"><span>"+item.collectionCount+"</span><span>套＞</span></div></li>";
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
    getHouseInfo();//重新加载信息
}
/**
 * 获取板块回调函数
 */
function getRegionInfoCallback(data){
    var str="";
    $.each(data, function(i, item){
        str +="<span onclick='regionInfoOnclick(this)' style='cursor: pointer'><input type='hidden'  value='"+i+"'>"+item+"</span>  ";
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
 * 搜索房源信息列表
 */
$(function(){
    $("#searchHouseInfo").click(function(){
        getHouseInfo();
    });
})

/**
 * 获取数据列表
 */
var pageCount;
function getHouseInfo(){
    $("#pageNumber").val(1);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"collection/getAllCollectionList",getHouseInfoCallback,false);
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
}
function PageClick(pageclickednumber){
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"collection/getAllCollectionList",getHouseInfoCallback,false);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
}

function getHouseInfoCallback(data) {
    pageCount = data.pageCount;
    if ($("#houseTable tr").length > 1) {
        $("#houseTable tr:gt(0)").remove();
    }
    $.each(data.list, function (i, item) {
        var content = "<tr><input class='collection_id_list' type='hidden' value='" + item.collection.id + "'>" +
            "<input class='collection_id_list' type='hidden' value='" + item.collection.collectPrice + "'>" +
            "<input class='collection_id_list' type='hidden' value='" + item.collection.community + "'>"+
        "<input class='collection_id_list' type='hidden' value='" + item.collection.address + "'>" +
            "<input class='collection_id_list' type='hidden' value='" + item.collection.area_id + "'>"+
            "<input class='collection_id_list' type='hidden' value='" + item.collection.ban + "'>"+
            "<input class='collection_id_list' type='hidden' value='" + item.collection.roomNumber + "'>"+
            "<input class='collection_id_list' type='hidden' value='" + item.collection.floor + "'>";
        content += "<td class='price'>" + item.collection.collectPrice + "元</td>";
        content += "<td>" + item.collection.area.fullName + "</td>";
        content += "<td>" + item.collection.community + "</td>";
        content += "<td>" + item.collection.address + "</td>";
        content += "<td>" + item.collection.ban + "</td>";
        content += "<td>" + item.collection.roomNumber + "</td>";
        content += "<td>" + item.collection.houseShape + "</td>";
        if(item.collection.areaSize==0){
            content += "<td>"+"不限"+"</td>";
        }else{
            content += "<td>" + item.collection.areaSize+ "</td>";
        }
        if(item.collection.salePrice==0){
            content += "<td>"+"不限"+"</td>";
        }else{
            content += "<td>" + item.collection.salePrice+ "</td>";
        }
        if(item.responseCount!=0){
            content += "<td class=\"query operate\" style='color: red' onclick='forwardUrl(this)'>" + item.responseCount + "人提交</td>";
        }else{
            content += "<td class=\"query operate\" style='color: #464647' onclick='forwardUrl(this)'>" + item.responseCount + "人提交</td>";
        }
        if (item.collection.member_id == getCookie("yjb_id")) {
            content += "<td style='color: red'>我的征集</td>";
        } else {
            content += "<td class=\"collect operate to_submit\" onclick='submitData(this)'>我要提交</td>";
        }
        content += "</tr>";
        $("#houseTable").append(content);
    });

}

    function forwardUrl(dom){
        //获取当前征集信息的ID
        var id = $(dom).parent().children("input").eq(0).val();
        window.location.href='erji/detail.html?id='+id;
    }
    //提交数据按钮，显示提交数据的对话框
    function submitData(dom){
        //this.css("background","red")
        //获取当前征集信息的ID
        var id = $(dom).parent().children("input").eq(0).val();
        var infoPrice = $(dom).parent().children("input").eq(1).val();
        var community = $(dom).parent().children("input").eq(2).val();
        var address = $(dom).parent().children("input").eq(3).val();
        var area_id = $(dom).parent().children("input").eq(4).val();
        var ban=$(dom).parent().children("input").eq(5).val();
        var floor=$(dom).parent().children("input").eq(7).val();
        var roomNumber=$(dom).parent().children("input").eq(6).val();
        $(".hide").show();
        $("#collection_id").val(id);
        $("#infoPrice").val(infoPrice);
        $("#community").val(community);
        $("#address").val(address);
        $("#area_ids").val(area_id);
        if(ban!="不限"){
            $("#ban").val(ban);
            document.getElementById("ban").setAttribute("readonly","true");
        }else{
            $("#ban").val("");
            document.getElementById("ban").removeAttribute("readonly");
        }
        if(floor!="不限"){
            $("#floor").val(floor);
            document.getElementById("floor").setAttribute("readonly","true");
        }else{
            $("#floor").val("");
            document.getElementById("floor").removeAttribute("readonly");
        }
        if(roomNumber!="不限"){
            $("#roomNumber").val(roomNumber);
            document.getElementById("roomNumber").setAttribute("readonly","true");
        }else{
            $("#roomNumber").val("");
            document.getElementById("roomNumber").removeAttribute("readonly");
        }
        $("#name").val("");
        $("#mobile").val("");
        $("#description").val("");
        $("#salePrice").val("");
        $("#areaSize").val("");
    }


$(function(){
    /**
     *  隐藏提交数据的对话框
     */
    $(".close").click(function(event) {
        $(".hide").hide();
    });

    //提交数据(应答征集信息)
    $("#releaseHouseInfo").validate({
        rules: {
            mobile: {
                required:true,
                number:true,
                minlength:8
            },
            //name: "required",
            community:"required",
            //ban: "required",
            //floor: "required",
            //roomNumber: "required",
            //room:"required",
            //office: "required",
            //areaSize: "required",
            //salePrice: "required",
            area_id_select:"required"
        },
        submitHandler: function() {
            getAjax("POST", $('#releaseHouseInfo').serialize(),"collection/auth/addResponseToCollection",releaseHouseInfoCallback,true);
        }
    });

    function releaseHouseInfoCallback(data){
        if(data.type=="success"){
            alert(data.content);
            window.setTimeout(function(){
                window.location.href="list.html";
            },500);

        }else{
            alert(data.content);
        }
    }


})


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
    content+="<tr><td>电话号码："+data.houseInfo.mobile+"</td></tr>";
    content+="<tr><td>联系人："+data.houseInfo.name+"</td></tr>";
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
    content+="<tr><td>电话号码："+data.mobile+"</td></tr>";
    content+="<tr><td>联系人："+data.name+"</td></tr>";
    $("#showData").append(content);
}
/**
 * 余额不足弹出框
 */
function notEnough(data){
    document.getElementById('light').style.display='block';
    document.getElementById('fade').style.display='block';
    $("#notEnough").val(data.houseInfo.infoPrice);
}


//点击选项卡事件
$(function(){

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

});


