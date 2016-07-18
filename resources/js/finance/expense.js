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
                    if(data==1){
                        return '消费';
                    }else{
                        return '消费';
                    }
                }
            },
            {"data": "houseType",
                "render" : function(data,type, row, meta) {
                    if(data==1){
                        return '有效';
                    }else if(data==2){
                        return '最新';
                    }else if(data==3){
                        return '物业';
                    }
                }
            },
            {"data": "amount"},
            {"data": null, className: "td-operation  text-center", orderable: false, width: "15%", defaultContent: ""}
        ],
        "createdRow": function (row, data, index) {
            //不使用【render】，改用jquery文档操作呈现单元格  data.id
            console.log(data)
            var $btnEdit = $('<button type="button" class="btn btn-small btn-primary btn-edit" onclick="queryHosue(' + data.houseType + ','+data.houseInfo_id+ ')">查看数据</button>');
            $('td', row).eq(4).append($btnEdit);
        }
    });
    return table;
}

function queryHosue(houseType,houseInfo_id){
    var param = {'houseInfo_id':houseInfo_id}
    var url;
    if (houseType==1){
        url="houseInfoValid/auth/getBoughtHouseInfo";
    }else if(houseType==2){
        url="houseInfoNew/auth/getBoughtHouseInfo";
    }else{
        return false;
    }

    getAjax("get", {"houseInfo_id":houseInfo_id}, url, getBoughtHouseInfoCallback, false);


}

function getBoughtHouseInfoCallback(data){

    var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
    layer.open({
        type: 1,
        title:'房源详情',
        area: ['500px', '300px'],
        fix: false, //不固定
        maxmin: true,
        content: '<table class="table table-striped">'
        +'<tr><td>小区名称:</td><td>'+data.community+'</td></tr>'
        +'<tr><td>楼栋号:</td><td>'+data.ban+'</td></tr>'
        +'<tr><td>房号:</td><td>'+data.roomNumber+'</td></tr>'
        +'<tr><td>面积:</td><td>'+data.areaSize+'</td></tr>'
        +'<tr><td>售价:</td><td>'+data.salePrice+'</td></tr>'
        +'<tr><td>手机:</td><td>'+data.mobile+'</td></tr>'
        +'</table>'
    });

    parent.layer.iframeAuto(index);
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
