//加载用户名称
//        var  uname = getCookie("yjb_username");
//        if(uname==null || uname.length==0){
//alert("未登录")
//            window.location=setting.baseHtml+"login.html";
//            $.delay(1000);
//        }
$(function () {
    var _table = createDateTables();

    $("#searchHouseInfo").click(function () {
        _table.draw();
    });
})

$(function () {
    var $areaId = $("#area_id");
    // 地区选择
    $areaId.lSelect({
        url: setting.base + "common/area"
    });

});


var createDateTables = function () {

    var table = $('#houseTable').DataTable({
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
            url: "/yjb/houseInfoValid/getHouseInfoList",
            type: "GET",
            dataSrc: function (data) {
                data.recordsTotal = data.totalCount;
                data.recordsFiltered = data.totalCount;
                return data.data;
            }
        },
        "columns": [
            {"data": "createDateStr"},
            {"data": "area_fullName"},
            {"data": "community"},
            {"data": "areaSize"},
            {"data": "salePrice"},
            {"data": "ban"},
            {"data": "roomNumber"},
            {"data": null, className: "td-operation  text-center", orderable: false, width: "15%", defaultContent: ""}
        ],
        "createdRow": function (row, data, index) {
            //不使用【render】，改用jquery文档操作呈现单元格  data.id
            var $btnEdit = $('<button type="button" class="btn btn-small btn-primary btn-edit" onclick="queryData(' + data.id + ')">查看数据</button>');
            $('td', row).eq(7).append($btnEdit);
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

var house_id_param;
/**
 * 查看数据
 */
function queryData(houseId) {
    //判断是否登录
    if(getCookie("yjb_token") == null||getCookie("yjb_token") == '') {
        layer.msg("请先登录!");
        return false;
    }
    house_id_param = houseId;
    var houseInfo_id = {"houseInfo_id": houseId};
    getAjax("GET", houseInfo_id, "houseInfoValid/auth/getBrowseHouseInfoVO?" + new Date(), queryDataCallback, true);
}

function queryDataCallback(data) {
    if (data.mine == true) {
        //showData(data);
        layer.msg(data);
    } else if (data.bought == true) {
        //showData(data);
        layer.msg(JSON.stringify(data.houseInfoValid.mobile));
    } else if (data.balanceEnough == true) {
        isPay(data);
    } else if (data.balanceEnough == false) {
        layer.msg('余额不足!');
    }
}

function isPay() {
    layer.msg('你确定购买吗？', {
        time: 0 //不自动关闭
        , btn: ['确认', '取消']
        , yes: function (index) {
            layer.close(index);
            ensure();
        }
    });
}

/**
 * 确定支付按钮
 * @param ensureId
 */
function ensure() {
    var houseInfo_id = {"houseInfo_id": house_id_param};
    getAjax("GET", houseInfo_id, "houseInfoValid/auth/browseHouseInfo?" + new Date(), payData, true);
}
/**
 * 确定支付信息弹出框
 * @param data
 */
function payData(data) {
    layer.msg(JSON.stringify(data.mobile));
}





