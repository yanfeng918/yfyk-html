var pageCount;

$(function () {

    //初始化分页-收入记录
    var formParam = $("form").serialize();
    getAjax("get", formParam, "member/getMyInviterFriends", getMyInviterFriendsCallback, false);
    $("#pager").pager({pagenumber: 1, pagecount: pageCount, buttonClickCallback: incomePageClick});


})

/**
 * 支出记录回调函数
 * @param data
 */
function getMyInviterFriendsCallback(data) {
    $("#inviteCode").html(data.inviteCode);
    pageCount = data.myInviterFriends.pageCount;
    $("table tbody tr").remove();
    $.each(data.myInviterFriends.list, function (i, item) {

        var content = "<tr>";
        content += "<td>" + new Date(parseInt(item.createDate)).toLocaleString() + "</td>";
        content += "<td>" + item.username + "</td>";
        content += "</tr>";
        $("table tbody").append(content);
    });
}

// 分页 收入记录
incomePageClick = function (pageclickednumber) {
    //序列化表格内容为字符串
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("form").serialize();
    getAjax("get", formParam, "member/getMyInviterFriends", getMyInviterFriendsCallback, false);
    $("#pager").pager({
        pagenumber: pageclickednumber,
        pagecount: pageCount,
        buttonClickCallback: incomePageClick
    });
}





