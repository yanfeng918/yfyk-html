/**
 * 新增征集信息
 */
$(function(){
    $("#releaseCollectionInfo").validate({
        rules: {
            collectPrice: {
                required:true,
                number:true,
                range:[10,2000]
            },
            address:"required",
            community:"required",
            area_id_select:"required"
        },
        submitHandler: function() {
            getAjax("POST", $('#releaseCollectionInfo').serialize(),"collection/auth/addCollection",submitCallback,true);
        }
    });
})

/**
 * 新增征集信息回调函数
 * @param data
 */
function submitCallback(data){
    if(data.type=="error"){
        alert(data.content);
        return;
    }else{
        document.getElementById('afterCollectionAdd').style.display='block';
        document.getElementById('fade').style.display='block';
    }
}
var base = setting.base;
$().ready(function() {
    var $areaId = $("#area_id");
    // 地区选择
    $areaId.lSelect({
        url: base+"/common/area"
    });
})

function continueEnsure(){
    $(":text").val("");
    document.getElementById('afterCollectionAdd').style.display='none';
    document.getElementById('fade').style.display='none';
}

/**
 * 弹出框取消按钮
 */
function cancle(divid){
    document.getElementById(divid).style.display='none';
    document.getElementById('fade').style.display='none';
    top.location.href="my_release.html";
}
