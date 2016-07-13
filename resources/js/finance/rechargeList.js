
/**
 * 新增充值记录
 */
$(function(){
    var _table = createDateTables();

})

var createDateTables = function () {

    var table = $('#rechargeTable').DataTable({
        language: {
            url: '../resources/dataTables/Chinese.json'
        },
        //responsive: true,
        colReorder: true,
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
            url: "/yjb/recharge/auth/getRechargeList",
            type: "GET",
            dataSrc: function (data) {
                data.recordsTotal = data.totalCount;
                data.recordsFiltered = data.totalCount;
                return data.data;
            }
        },
        "columns": [
            {"data": "createDateStr"},
            {"data": "amount"},
            {"data": "statsName"},
            {"data": null, className: "td-operation  text-center", orderable: false, width: "15%", defaultContent: "微信"}
        ]
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
            default:
                param.orderColumn = "name";
                break;
        }
        param.orderDir = data.order[0].dir;
    }
    //组装查询参数
    if ($("#salePrice").val())
        param.salePrice = $("#salePrice").val();
    if ($("#areaSize").val())
        param.areaSize = $("#areaSize").val();
    if ($("#searchCommunity").val())
        param.community = $("#searchCommunity").val();
    if ($("#area_id").val())
        param.area_id = $("#area_id").val();

    //组装分页参数
    param.pageOffset = data.start;
    param.pageSize = data.length;
    return param;
}

