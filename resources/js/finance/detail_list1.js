
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

    //初始化分页-收入记录
    var formParam = $("form").serialize();
    getAjax("post", formParam, "income/auth/getIncomeExpenseList", getIncomeListCallback, false);
    $("#incomePager").pager({pagenumber: 1, pagecount: incomeListPageCount, buttonClickCallback: IncomePageClick});

    //点击收入明细
    $(".recharge_want").click(function (event) {
        $("#pageNumber").val(1);
        var formParam = $("form").serialize();
        getAjax("post", formParam, "income/auth/getIncomeExpenseList", getIncomeListCallback, false);

        $("#incomePager").pager({pagenumber: 1, pagecount: incomeListPageCount, buttonClickCallback: IncomePageClick});
        $("#expensePager").hide();
        $("#incomePager").show();
    });

    //点击支出明细
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
     * 按照时间的起始条件进行搜索
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
 * 收入记录回调函数
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
            //houseInfo_id不等于0，代表与房源相关
            if (item.inOrNot) {
                //收入类型
                content += "<td style='color: red;'>+" +item.amount+"</td>";
                if(item.detailToString=='出售房源'){
                    //出售房源的收入只有70%
                    content += "<td  style='text-align: left; padding-left: 5%'>" + '出售房源收入'+item.houseInfo.infoPrice+'元，'+""+'扣除30%手续费'+
                        (item.houseInfo.infoPrice-item.amount)+'元，'+""+'账户收入'+item.amount+'元!';
                    content += "<a style='color: dodgerblue; cursor: pointer; margin-left: 5%' onclick='showData(this) ' >查看</a>";
                }else if(item.detailToString=='系统退款') {
                    //购买过的房源举报后系统退款
                    content += "<td >" + ('举报退款');
                }else if(item.detailToString=='推广福利'){
                    content += "<td style='text-align: left; padding-left: 5%'>" + ('您邀请的好友')+"<span style='color: #0078D8; font-weight: bold; border: none'>"
                        +item.houseInfo.member.username+"</span>发布【" +item.houseInfo.community+
                        "】房源，您获得分成"+item.amount+"元";
                }else if(item.detailToString=='系统月度奖励'){
                    content += "<td>"+item.detailToString;
                }
            } else {
                content += "<td style='color: red'>-" + item.amount + "</td>";
                content += "<td >" + (item.detailToString=='系统扣款'?'举报扣款':item.detailToString);
                content += "<p style='color: dodgerblue; cursor: pointer' onclick='showData(this) ' >查看</p>";
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
 * 信息弹出框
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
    content1 += "&nbsp&nbsp" + houseInfo.areaSize + "平</td></tr>";

    content1 += "<tr><td>楼层" + houseInfo.floor + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp房号" + houseInfo.roomNumber + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp楼栋号" + houseInfo.ban + "</td></tr>";

    content1 += "<tr><td >售价：<span style='color: red'>" + houseInfo.salePrice + "</span>万元</td></tr>";

    content1 += "<tr><td>业主：" + houseInfo.name + "&nbsp&nbsp";
    content1 += "&nbsp&nbsp电话：<span style='color: red'>" + houseInfo.mobile + "</span></td></tr>";
    $("#showData").append(content1);
}


/**
 * 支出记录回调函数
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

// 分页 收入记录
IncomePageClick = function (pageclickednumber) {
    //序列化表格内容为字符串
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("form").serialize();
    getAjax("post", formParam, "income/auth/getIncomeExpenseList", getIncomeListCallback, false);
    $("#incomePager").pager({
        pagenumber: pageclickednumber,
        pagecount: incomeListPageCount,
        buttonClickCallback: IncomePageClick
    });
}

// 分页 支出记录
ExpensesPageClick = function (pageclickednumber) {
    //序列化表格内容为字符串
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
 * 弹出框取消按钮
 */
function cancle(divid) {
    document.getElementById(divid).style.display = 'none';
    document.getElementById('fade').style.display = 'none';
}


