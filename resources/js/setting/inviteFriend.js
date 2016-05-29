var pageCount;

$(function () {

    //��ʼ����ҳ-�����¼
    var formParam = $("form").serialize();
    getAjax("get", formParam, "member/getMyInviterFriends", getMyInviterFriendsCallback, false);
    $("#pager").pager({pagenumber: 1, pagecount: pageCount, buttonClickCallback: incomePageClick});


})

/**
 * ֧����¼�ص�����
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

// ��ҳ �����¼
incomePageClick = function (pageclickednumber) {
    //���л��������Ϊ�ַ���
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("form").serialize();
    getAjax("get", formParam, "member/getMyInviterFriends", getMyInviterFriendsCallback, false);
    $("#pager").pager({
        pagenumber: pageclickednumber,
        pagecount: pageCount,
        buttonClickCallback: incomePageClick
    });
}





