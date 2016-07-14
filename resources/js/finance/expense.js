var post_Url= setting.base+"expenses/auth/getExpensesList";
$(function(){

    var _table = createDateTables();

    $("#searchInfo").click(function () {
        _table.draw();
    });
    /**
     * 重置表单
     */
    $("#resetBtn").click(function () {
        document.getElementById("inputForm").reset();
        $("#area_id").val("");
    });

    /**
     * 重置表单
     */
    getAjax("get", {}, "member/getBalance", getBalanceCallback, false);

})


function getBalanceCallback(data){
    $("#balance").html(data.content)
}
/**
 * 新增银行卡
 */var createDateTables = function () {

    var table = $('#listTable').DataTable({
        language: {
            url: '../resources/dataTables/Chinese.json'
        },
        //responsive: true,
        colReorder: true,
        fixedHeader: true,
        searching: false,
        ordering: false,
        "processing": true,
        "serverSide": true,
        "paging": true,
        "aLengthMenu": [[25, 50, -1], [25, 50, "显示所有"]], //这个是允许用户自定义每页数量的时候,下拉菜单的选项
        "bPaginate": true,      //显示分页器
        "bLengthChange": false, // 用户不可改变每页显示数量
        "iDisplayLength": 25,   //一页显示条数
        "ajax": {
            data: function (data) {
                return getQueryCondition(data)
            },
            url: post_Url,
            type: "GET",
            dataSrc: function (data) {
                data.recordsTotal = data.totalCount;
                data.recordsFiltered = data.totalCount;
                return data.data;
            }
        },
        "columns": [
            {"data": "createDateStr"},
            {"data": "expensesType",
                "render" : function(data,type, row, meta) {
                    if(data=="dealExpense"){
                        return '消费';
                    }else{
                        return '';
                    }
                }},
            {"data": "amount"},
            {"data": null, className: "td-operation  text-center", orderable: false, width: "15%", defaultContent: ""}
        ],
        "createdRow": function (row, data, index) {
            //不使用【render】，改用jquery文档操作呈现单元格  data.id
            console.log(data.houseInfo)
            var $btnEdit = $('<button type="button" class="btn btn-small btn-primary btn-edit" onclick="queryData(' + data.id + ')">查看数据</button>');
            $('td', row).eq(3).append($btnEdit);
        }
    });
    return table;
}

function getQueryCondition(data) {
    var param = {};
    //组装排序参数
    if (data.order && data.order.length && data.order[0]) {
        switch (data.order[0].column) {
            case 1:
                param.orderColumn = "name";
                break;
            case 2:
                param.orderColumn = "position";
                break;
            case 3:
                param.orderColumn = "status";
                break;
            case 4:
                param.orderColumn = "start_date";
                break;
            default:
                param.orderColumn = "name";
                break;
        }
        param.orderDir = data.order[0].dir;
    }
    //组装查询参数
    if ($("#beginDate").val())
        param.beginDate = $("#beginDate").val();
    if ($("#endDate").val())
        param.endDate = $("#endDate").val();


    //组装分页参数
    param.pageOffset = data.start;
    param.pageSize = data.length;
    return param;
}
