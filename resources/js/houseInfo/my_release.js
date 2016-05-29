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
    $("#cityName").html(getCookie("cityName"))
    getTown();
    getRelease();

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
 * 弹出框取消按钮
 */
function cancle(divid){
    document.getElementById(divid).style.display='none';
    document.getElementById('fade').style.display='none';
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
        content+="<td>"+new Date(parseInt(item.createDate)).format("yyyy-MM-dd hh:mm")+"</td>";
        content+="<td  class='price'>"+item.infoPrice+"元</td>";
        content+="<td>"+item.area.fullName+"</td>";
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
        var floor="";
        (item.floor == null)? floor="":floor=item.floor;
        content+="<td>"+floor+"</td>";
        content+="<td>"+item.roomNumber+"</td>";
        content+="<td>"+item.ban+"</td>";
        content+="<td>"+item.name+"</td>";
        content+="<td>"+item.mobile+"</td>";
        if(item.statusName.indexOf("失败")!=-1){
            if(item.statusName.indexOf("未接通3次")!=-1){
                //2015年12月2日15:02 未接通3次时获取disconTime的次数
                content+="<td class=\"operate\"><u>"+"审核中-未接通"+(item.disconTime+3)+"次</u></td>";
            }else{
                content+="<td class=\"operate\"><u>失败("+(item.checkContent==null?"无":item.checkContent)+")</u></td>";
            }
        }else if(item.statusName.indexOf("成功")!=-1){
            content+="<td style='color: red'>"+item.statusName+"</td>";
        }else{
            content+="<td>"+item.statusName+"</td>";
        }
        //content+="<td class=\"operate\" onclick='changeReleaseHouseInfo(this)'><u>修改</u></td>";
        if(item.statusName.indexOf("失败")!=-1&&item.statusName.indexOf("未接通3次")==-1){
            content+="<td class=\"operate\" onclick='stateHouseInfo(this)'><u>我要申诉</u></td>";
            //content+="<td class=\"operate\">申诉状态</td>";
        }else{
            content+="<td ></td>";
            //content+="<td class=\"operate\"></td>";
        }
        content+="<input type='hidden' id='checkContent' value='"+item.checkContent+"'></input></tr>";
        $("#releaseTable").append(content);
    });
}
/**
 * 审核失败时显示详细审核信息
 */
function showCheckDetail(dom){
    alert("审核失败原因：\n"+dom.parentElement.lastChild.value);
}



//2015年11月6日 添加失败房源申诉
var stateHouseInfo_id;
function stateHouseInfo(dom){
    //stateHouseInfo
    var stateHouseInfo_id=dom.parentElement.firstChild.value;
    var houseInfo_id={"houseInfo_id":stateHouseInfo_id};
    getAjax("get", houseInfo_id,"houseInfo/auth/checkStateStatus",checkStateStatusCallback,false);
}

function checkStateStatusCallback(data){
    if(data.canBeStated){
        document.getElementById('stateHouseInfo').style.display='block';
        document.getElementById('fade').style.display='block';
        $("#stateHouseId").val(data.houseInfo_id);
    }else{
        var st=data.statusFailReason;
        if(st.indexOf("该房源您已申诉")!=-1){
            st = st + "\n当前状态:"+data.currentStatus+"\n";
            st = st + ((data.currentStatus)=="待审核"?"请耐心等待客服审核哦！":"审结结果为:"+data.stateContent);
        }
        alert(st);
    }
}
/**
 * 确认提交申诉信息
 */
function stateEnsure(){
    var stateReason = $("#stateReason").val();
    if(stateReason.trim().length<=0){
        alert("请输入申诉原因！");
        return;
    }
    var data={"houseInfo_id":$("#stateHouseId").val(),"stateReason":stateReason};
    getAjax("POST", data,"houseInfo/auth/addStateInfo",addStateInfoCallback,false);
}

function addStateInfoCallback(data){
    alert(data.content);
    cancle('stateHouseInfo');
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
            //name:"required",
            community:"required",
            //ban:"required",
            //floor:"required",
            //roomNumber:"required",
            //areaSizes:"required",
            //salePrices:"required",
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

function cancle(divid){
    $("#stateReason").val("");
    document.getElementById(divid).style.display='none';
    document.getElementById('fade').style.display='none';
}





