/**
 * 新增银行卡
 */
$(function(){
    $("#bankAccountForm").validate({
        rules: {
            accountNum: "required",
            accountHolder:"required"
    },
        submitHandler: function() {
           getAjax("POST", $('#bankAccountForm').serialize(),"bankAccount/auth/addBankAccount",submitCallback,true);
        }
    });
})
/**
 * 新增银行卡回调函数
 * @param data
 */
function submitCallback(data){
    if(data.type=="error"){
        alert(data.content);
        return;
    }else{
        alert(data.content);
        getBankAccount();
        $('#accountHolder').val("");
        $('#accountNum').val("");
    }
}
/**
 * 获取用户有效银行卡列表
 */
function getBankAccount(){
    getAjax("GET","","bankAccount/auth/getBankList?"+new Date(),getDataCallback,true);
}

/**
 * 获取用户有效银行卡列表回调函数
 * @param data
 */
function getDataCallback(data){
    if(data.type=="error"){
        alert(data.content);
        return;
    }else{
        var str="";
        $.each(data,function(idx,item){
            str += "<tr>";
            str += "<td>"+item.accountHolder+"</td>";
            str += "<td>"+item.branchName+"</td>";
            str += "<td>"+item.accountNum+"</td>";
            str += "<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
            str += "<td><span  onclick='deleteBank(this)'><input type='hidden' value="+item.id+" />删除</span><span>修改</span></td>";
            str += "</tr>";
        })
        if($("#mytable tr").length>2) {
            $("#mytable tr:gt(1)").remove();
        }
        $("#mytable").append(str);
    }
}
/**
 * 删除银行卡回掉函数
 * @param data
 */
function deleteCallback(data){
    alert(data.content);
    getBankAccount();
}
/**
 * 删除银行卡
 * @param node
 */
function deleteBank(node) {
    var data={"id":node.firstChild.value,"isAvailable":false};
    getAjax("POST",data,"bankAccount/auth/updateBankAccount",deleteCallback,true);
}
/**
 * 申请提现页面
 */
function applyWithdraw(){
    getAjax("GET","","bankAccount/auth/getBankList?"+new Date(),applyWithdarwCallback,true);
    getAjax("GET","","member/info/getBalance?"+new Date(),applyGetbalanceCallback,true);
}
/**
 * 申请提现回调函数
 */
function applyWithdarwCallback(data){
    $("#bankAccount_id").empty();
    $.each(data,function(index,item){
        $("#bankAccount_id").append('<option value='+item.id+'>'+item.accountNum+'</option>');
    });
}
/**
 * 获取余额回调函数
 * @param data
 */
function applyGetbalanceCallback(data){
     $("#balance").html("￥"+data.content);
}
/**
 * 提交提现金额
 */
$(function(){
    $("#applyWithDraw").validate({
        rules: {
            bankAccount_id: "required",
            amount:{
                required:true,
                digits:true,
                min:50
            }

        },
        submitHandler: function() {
            getAjax("POST", $('#applyWithDraw').serialize(),"withDraw/auth/addWithDraw",applyWithDrawCallback,true);
        }
    });
})
/**
 * 提交申请提现回调函数页面
 */
function applyWithDrawCallback(data) {
      alert(data.content);
      applyWithdraw();
    $('#amount').val("");
}
/**
 * 提现记录列表查询
 */
var pageCount;
function getCashRecord(){
    //初始化分页的数据
    var formParam = $("#cashRecordFm").serialize();
    getAjax("post", formParam,"withDraw/auth/getWithDrawList",getCashRecordCallBack,false);
    //加载充值记录
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });

}
function PageClick(pageclickednumber){
    //序列化表格内容为字符串
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#cashRecordFm").serialize();
    getAjax("post", formParam,"withDraw/auth/getWithDrawList",getCashRecordCallBack,false);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
}
/**
 * 分页回掉函数
 */
function getCashRecordCallBack(data){
    pageCount=data.pageCount;
    if($("#recodeTable tr").length>1) {
        $("#recodeTable tr:gt(0)").remove();
    }
    $.each(data.list, function(i, item){
        var content = "<tr>";
        content+="<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
        content+="<td>"+item.amount+"</td>";
//        content+="<td>"+null+"</td>";
        content+="<td>"+item.accountNum+"</td>";
        content+="<td style='color: red'>"+item.statusName+"</td>";
        content+="</tr>";
        $("table tbody").append(content);
    });
}
$(function(){
    $("#search").click(function(){
        $("#pageNumber").val("1");
        getAjax("POST", $('#cashRecordFm').serialize(),"withDraw/auth/getWithDrawList",getCashRecordCallBack,false);
        $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
    });
})
/**
 * 载入页面初始化数据
 */
$().ready(function() {
    applyWithdraw();
})