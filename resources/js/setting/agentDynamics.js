var pageCount;

$(function () {

    //��ʼ����ҳ-�����¼
    var formParam = $("form").serialize();
    getAjax("post", formParam, "expenses/auth/getExpensesList", getAgentCallback, false);
    $("#pager").pager({pagenumber: 1, pagecount: pageCount, buttonClickCallback: incomePageClick});


})

/**
 * ֧����¼�ص�����
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
        ban = ban.indexOf("��")!=-1?ban:(ban+"��");
        var roomNumber = item.houseInfo.roomNumber;
        roomNumber = roomNumber.indexOf("��")!=-1?roomNumber:(roomNumber+"��");
        var houseDetail = community+ban+roomNumber;
        var content = "<tr>";
        content+="<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
        content+="<td>"+username+"</td>";
        content+="<td style='color: red'>"+item.amount+"Ԫ</td>";
//        content+="<td>"+null+"</td>";
        if(item.expensesType=="dealExpense"){
            content+="<td style='padding-left:10%;text-align: left'>�û� "+username+" ������"+houseDetail+"����Դ���"+item.amount+"Ԫ����</td>";
        }else if(item.expensesType=="promoteWelfare"){
            content+="<td style='padding-left:10%;text-align: left'>�û� "+username+" ����ĺ��ѷ�����"+houseDetail+"����Դһ������÷ֳ�"+item.amount+"Ԫ����</td>";
        }
        content+="</tr>";
        $("table tbody").append(content);
    });

}

// ��ҳ �����¼
incomePageClick = function (pageclickednumber) {
    //���л��������Ϊ�ַ���
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("form").serialize();
    getAjax("post", formParam, "expenses/auth/getExpensesList", getAgentCallback, false);
    $("#pager").pager({pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: incomePageClick});
}





