
var incomeListPageCount;
var expensesListPageCount;

$(function () {
    $(".expense").hide();
    $(".recharge_record").click(function (event) {
        $(".income").hide();
        $(".expense").show();
        $(this).addClass('recharge_current');
        $(".recharge_want").removeClass('recharge_current');

        $("#type").val(2);
    });

    $(".recharge_want").click(function (event) {
        $(".expense").hide();
        $(".income").show();
        $(this).addClass('recharge_current');
        $(".recharge_record").removeClass('recharge_current');
        $("#type").val(1);
    });

    //��ʼ����ҳ-�����¼
    var formParam = $("form").serialize();
    getAjax("post", formParam, "income/auth/getIncomeExpenseList", getIncomeListCallback, false);
    $("#incomePager").pager({pagenumber: 1, pagecount: incomeListPageCount, buttonClickCallback: IncomePageClick});

    //���������ϸ
    $(".recharge_want").click(function (event) {
        $("#pageNumber").val(1);
        var formParam = $("form").serialize();
        getAjax("post", formParam, "income/auth/getIncomeExpenseList", getIncomeListCallback, false);

        $("#incomePager").pager({pagenumber: 1, pagecount: incomeListPageCount, buttonClickCallback: IncomePageClick});
        $("#expensePager").hide();
        $("#incomePager").show();
    });

    //���֧����ϸ
    $(".recharge_record").click(function (event) {
        $("#pageNumber").val(1);
        var formParam = $("form").serialize();
        getAjax("post", formParam, "expenses/auth/getExpensesList", getExpensesListCallback, false);

        $("#expensePager").pager({
            pagenumber: 1,
            pagecount: expensesListPageCount,
            buttonClickCallback: ExpensesPageClick
        });
        $("#incomePager").hide();
        $("#expensePager").show();
    });

    /**
     * ����ʱ�����ʼ������������
     */
    $("#search").click(function () {
        $("#pageNumber").val("1");
        var type = $("#type").val();
        if (type == 1) {
            getAjax("POST", $("form").serialize(), "income/auth/getIncomeExpenseList", getIncomeListCallback, false);
            $("#incomePager").pager({
                pagenumber: 1,
                pagecount: incomeListPageCount,
                buttonClickCallback: IncomePageClick
            });
            $("#expensePager").hide();
            $("#incomePager").show();
        } else if (type == 2) {
            getAjax("post", $("form").serialize(), "expenses/auth/getExpensesList", getExpensesListCallback, false);
            $("#expensePager").pager({
                pagenumber: 1,
                pagecount: expensesListPageCount,
                buttonClickCallback: ExpensesPageClick
            });
            $("#incomePager").hide();
            $("#expensePager").show();
        }
    });

})

/**
 * �����¼�ص�����
 * @param data
 */
function getIncomeListCallback(data) {
    incomeListPageCount = data.pageCount;
    $("table tbody tr").remove();
    $.each(data.list, function (i, item) {
        var content = "<tr><input type='hidden' value='"+JSON.stringify(item.houseInfo)+"'/>";
        //var content = "<tr>";
        content += "<td>" + new Date(parseInt(item.createDate)).toLocaleString() + "</td>";
        content += "<td>" + item.mtype + "</td>";

        if (item.houseInfo_id != 0) {
            //houseInfo_id������0�������뷿Դ���
            if (item.inOrNot) {
                //��������
                content += "<td style='color: red;'>+" +item.amount+"</td>";
                if(item.detailToString=='���۷�Դ'){
                    //���۷�Դ������ֻ��70%
                    content += "<td  style='text-align: left; padding-left: 5%'>" + '���۷�Դ����'+item.houseInfo.infoPrice+'Ԫ��'+""+'�۳�30%������'+
                        (item.houseInfo.infoPrice-item.amount)+'Ԫ��'+""+'�˻�����'+item.amount+'Ԫ!';
                    content += "<a style='color: dodgerblue; cursor: pointer; margin-left: 5%' onclick='showData(this) ' >�鿴</a>";
                }else if(item.detailToString=='ϵͳ�˿�') {
                    //������ķ�Դ�ٱ���ϵͳ�˿�
                    content += "<td >" + ('�ٱ��˿�');
                }else if(item.detailToString=='�ƹ㸣��'){
                    content += "<td style='text-align: left; padding-left: 5%'>" + ('������ĺ���')+"<span style='color: #0078D8; font-weight: bold; border: none'>"
                        +item.houseInfo.member.username+"</span>������" +item.houseInfo.community+
                        "����Դ������÷ֳ�"+item.amount+"Ԫ";
                }else if(item.detailToString=='ϵͳ�¶Ƚ���'){
                    content += "<td>"+item.detailToString;
                }
            } else {
                content += "<td style='color: red'>-" + item.amount + "</td>";
                content += "<td >" + (item.detailToString=='ϵͳ�ۿ�'?'�ٱ��ۿ�':item.detailToString);
                content += "<p style='color: dodgerblue; cursor: pointer' onclick='showData(this) ' >�鿴</p>";
            }

            content += "</td></tr>";
        }else{
            if (item.inOrNot) {
                content += "<td style='color: red'>+" + item.amount + "</td>";
            } else {
                content += "<td style='color: red'>-" + item.amount + "</td>";
            }
            content += "<td style='color: red'>" + item.detailToString;
            content += "</td></tr>";
        }

        $("table tbody").append(content);
    });
}

/**
 * ��Ϣ������
 * @param item
 */
function showData(item) {
    $("#showData").empty();
    var houseInfo = JSON.parse(($(item).parent().parent().children().eq(0).val()));
    $("#showData tr:gt(0)").remove();
    document.getElementById('light2').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
    var content1 = "";
    content1 += "<tr><td>" + houseInfo.area.fullName + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp" + houseInfo.community + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp" + houseInfo.houseShape + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp" + houseInfo.areaSize + "ƽ</td></tr>";

    content1 += "<tr><td>¥��" + houseInfo.floor + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp����" + houseInfo.roomNumber + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp¥����" + houseInfo.ban + "</td></tr>";

    content1 += "<tr><td >�ۼۣ�<span style='color: red'>" + houseInfo.salePrice + "</span>��Ԫ</td></tr>";

    content1 += "<tr><td>ҵ����" + houseInfo.name + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp�绰��<span style='color: red'>" + houseInfo.mobile + "</span></td></tr>";
    $("#showData").append(content1);
}


/**
 * ֧����¼�ص�����
 * @param data
 */
function getExpensesListCallback(data) {
    expensesListPageCount = data.pageCount;
    $("table tbody tr").remove();
    $.each(data.list, function (i, item) {

        var content = "<tr>";
        content += "<td>" + new Date(parseInt(item.createDate)).toLocaleString() + "</td>";
        content += "<td>" + item.expensesType + "</td>";
        content += "<td>" + item.amount + "</td>";
        content += "<td></td>";
        content += "<td></td>";
        content += "</tr>";
        $("table tbody").append(content);
    });
}

// ��ҳ �����¼
IncomePageClick = function (pageclickednumber) {
    //���л��������Ϊ�ַ���
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("form").serialize();
    getAjax("post", formParam, "income/auth/getIncomeExpenseList", getIncomeListCallback, false);
    $("#incomePager").pager({
        pagenumber: pageclickednumber,
        pagecount: incomeListPageCount,
        buttonClickCallback: IncomePageClick
    });
}

// ��ҳ ֧����¼
ExpensesPageClick = function (pageclickednumber) {
    //���л��������Ϊ�ַ���
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("form").serialize();
    getAjax("post", formParam, "expenses/auth/getExpensesList", getExpensesListCallback, false);
    $("#expensePager").pager({
        pagenumber: pageclickednumber,
        pagecount: expensesListPageCount,
        buttonClickCallback: ExpensesPageClick
    });
}

/**
 * ������ȡ����ť
 */
function cancle(divid) {
    document.getElementById(divid).style.display = 'none';
    document.getElementById('fade').style.display = 'none';
}


