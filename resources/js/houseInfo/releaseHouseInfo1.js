/**
 * 新增房源信息
 */
$(function(){
    initStatus();
    $("#releaseHouseInfo").validate({
        rules: {
            infoPrice: {
                required:true,
                number:true,
                range:[10,2000]
            },
            mobile: {
                required:true,
                number:true,
                minlength:11,
                maxlength:11
            },
            ban:"required",
            roomNumber:"required",
            community:"required",
            area_id_select:"required"
        },
        submitHandler: function() {
            //处理楼栋号和房间号前面的0，yanfeng
            var roomNumber = $("#roomNumber").val();
            if(roomNumber.substr(0,1)==0){
                $("#roomNumber").val(roomNumber.substr(1,roomNumber.length))
            }
            var ban = $("#ban").val();
            if(ban.substr(0,1)==0){
                $("#ban").val(ban.substr(1,ban.length));
            }
            getAjax("POST", $('#releaseHouseInfo').serialize(),"houseInfo/auth/addHouseInfoV2",submitCallback,true);
        }
    });
})


/**
 * 新增房源信息回调函数
 * @param data
 */
function submitCallback(data){
    if(data.type=="error"){
        alert(data.content);
        return;
    }else{
        $(currentInput).parent().html("已导入");
        $(currentInput).remove();
        document.getElementById('afterHouseAdd').style.display='block';
        document.getElementById('fade').style.display='block';
    }
}
var base = setting.base;
$().ready(function() {
    var $areaId = $("#area_id");
    var $areaIdFixed = $("#area_id_Fixed");
    // 地区选择
    $areaId.lSelect({
        url: base+"/common/area"
    });
    $areaIdFixed.lSelect({
        url: base+"/common/area"
    });
})

function continueEnsure(){
    if($('table input').length>0){
        $(":text").val("");
        $("#mobile").val($('table input:eq(0)').val());
        currentInput= $('table input:eq(0)');
    }else{
        $("#afterHouseAdd").hide();
        $(".hide").hide();
        alert("通过手机号已录完");
    }

    document.getElementById('afterHouseAdd').style.display='none';
    document.getElementById('fade').style.display='none';
    //window.location.href="personal_center.html?type=releaseHouse";
	$("#infoPrice").val(10);
    if($("#type").val()!="zdy"){
        $("#selfInfoPrice").hide();
    }

    $("#addHouseStep2").hide();
    $("#validate1").show();
}

/**
 * 弹出框取消按钮
 */
function cancle(divid){
    document.getElementById(divid).style.display='none';
    document.getElementById('fade').style.display='none';
    //top.location.href="my_release.html";
    $(".hide").hide();
}

/**
 * 验证房源信息是否重复
 */
$(function(){
    $("#validate1").click(function(){
        var isOk=checkRequiredStatus();
        if(!isOk){
            return;
        }
        if($("#mobile").val().length!=11){
            $("#mobile").val("");
            alert("手机号不正确，大公盘只接收11位手机号！");
            return;
        }
        var data = {"mobile":$("#mobile").val(),"ban":$("#ban").val(),"roomNumber":$("#roomNumber").val(),"community":$("#community").val()};
        getAjax("POST", data,"houseInfo/auth/addHouseValidate",addHouseValidateCallback,true);
    })
})

function addHouseValidateCallback(data){
   if(data==false){
       $("#addHouseStep2").show();
       $("#validate1").hide();
   }else{
       alert("房源信息重复");
       initStatus();
   }
}

function initStatus(){
    document.getElementById('mobileRequired').style.visibility="hidden";
    document.getElementById('banRequired').style.visibility="hidden";
    document.getElementById('roomNumberRequired').style.visibility="hidden";
    document.getElementById('communityRequired').style.visibility="hidden";
    $("#mobile").val("");
    $("#mobile").focus();
    $("#ban").val("");
    $("#roomNumber").val("");
    $("#community").val("");
}

function checkRequiredStatus(){
    var isOk=true;
    if($("#mobile").val()==''){
        document.getElementById('mobileRequired').style.visibility="visible";
        isOk=false;
    }else{
        document.getElementById('mobileRequired').style.visibility="hidden";
    }
    if($("#ban").val()==''){
        document.getElementById('banRequired').style.visibility="visible";
        isOk=false;
    }else{
        document.getElementById('banRequired').style.visibility="hidden";
    }
    if($("#roomNumber").val()==''){
        document.getElementById('roomNumberRequired').style.visibility="visible";
        isOk=false;
    }else{
        document.getElementById('roomNumberRequired').style.visibility="hidden";
    }
    if($("#community").val()==''){
        document.getElementById('communityRequired').style.visibility="visible";
        isOk=false;
    }else{
        document.getElementById('communityRequired').style.visibility="hidden";
    }
    return isOk;
}
/**
 * 批量手机号码检查
 */
$(function () {
    $("#mobileList").val("");
    $("#checkMobiles").click(function () {
        var data= $("#mobileList").val().trim();
        var datas = new Array();
        if (data.length<=0) {
            alert("请输入手机号");
            return;
        }
        datas = data.split("\n");
        if (datas.length>20){
            alert("超过最大条数20条");
            return;
        }
        var e1;
        for (e1 in  datas) {
            if (datas[e1].length != 11) {
                alert(datas[e1]+ "不是手机号");
                return;
            }
        }
        var dataList={"dataList":datas};
        getAjax("POST", dataList, "houseInfo/auth/batchCheckMobile", batchCheckMobileBack,true);
    })
})
/**
 * 批量手机号码检查回掉函数
 * @param data
 */
function batchCheckMobileBack(data){
    if ($("#mobileListResult tr").length > 1) {
        $("#mobileListResult tr:gt(0)").remove();
    }
    $.each(data, function (i, item) {
        var content = "<tr>";
        content+="<td>"+item.mobile+"</td>";
        if(item.operate){
            content += "<td style='color:blue;'>" + item.reason + "</td>";
            content += "<td><input type='hidden' value='"+item.mobile+"'><a style='color:blue;cursor:pointer' onclick='clickRelease(this)'>点此导入</a></td>"
        }else{
            content += "<td style='color: red'>" + item.reason + "</td>";
            content += "<td></td>"
        }
        content+= "</tr>";
        $("#mobileListResult").append(content);
    });
}
/**
 * 点击号码发布数据
 */
var currentInput;
function clickRelease(dom){
    currentInput=dom.parentElement.firstChild;
    submitData(currentInput.value)
}
//点击导入的时候，显示发布房源图层
function submitData(mobile) {
    $(".hide").show();
    $(":text").val("");
    $("#mobile").val(mobile);

}
/**
 *  隐藏提交数据的对话框
 */
$(function () {
$(".close").click(function (event) {
    $(".hide").hide();
})
})


