var pageCount;

$(function () {

    //初始化分页-收入记录
    var formParam = $("form").serialize();
    getAjax("post", formParam, "expenses/auth/getExpensesList", getAgentCallback, false);
    $("#pager").pager({pagenumber: 1, pagecount: pageCount, buttonClickCallback: incomePageClick});


})

/**
 * 支出记录回调函数
 * @param data
 */
function getAgentCallback(data) {
    pageCount = data.pageCount;
    $("table tbody tr").remove();

    $.each(data.list, function(i, item){
        var username=item.member.username;
        //var temp=username.charAt(0)+"*****"+username.charAt(username.length-1);
        var community=item.houseInfo.community;
        var ban=item.houseInfo.ban;
        ban = ban.indexOf("号")!=-1?ban:(ban+"号");
        var roomNumber = item.houseInfo.roomNumber;
        roomNumber = roomNumber.indexOf("室")!=-1?roomNumber:(roomNumber+"室");
        var houseDetail = community+ban+roomNumber;
        var content = "<tr>";
        content+="<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
        content+="<td>"+username+"</td>";
        content+="<td style='color: red'>"+item.amount+"元</td>";
//        content+="<td>"+null+"</td>";
        if(item.expensesType=="dealExpense"){
            content+="<td style='padding-left:10%;text-align: left'>用户 "+username+" 发布【"+houseDetail+"】房源获得"+item.amount+"元收入</td>";
        }else if(item.expensesType=="promoteWelfare"){
            content+="<td style='padding-left:10%;text-align: left'>用户 "+username+" 邀请的好友发布【"+houseDetail+"】房源一条，获得分成"+item.amount+"元收入</td>";
        }
        content+="</tr>";
        $("table tbody").append(content);
    });

}

// 分页 收入记录
incomePageClick = function (pageclickednumber) {
    //序列化表格内容为字符串
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("form").serialize();
    getAjax("post", formParam, "expenses/auth/getExpensesList", getAgentCallback, false);
    $("#pager").pager({pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: incomePageClick});
}





