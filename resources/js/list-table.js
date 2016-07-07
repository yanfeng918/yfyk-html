//加载用户名称
//        var  uname = getCookie("yjb_username");
//        if(uname==null || uname.length==0){
//alert("未登录")
//            window.location=setting.baseHtml+"login.html";
//            $.delay(1000);
//        }
$(function () {

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
//                param.fuzzySearch = userManage.fuzzySearch;
//                if (userManage.fuzzySearch) {
//                    param.fuzzy = $("#fuzzy-search").val();
//                }else{
//                    param.name = $("#name-search").val();
//                    param.position = $("#position-search").val();
//                    param.office = $("#office-search").val();
//                    param.extn = $("#extn-search").val();
//                    param.status = $("#status-search").val();
//                    param.role = $("#role-search").val();
//                }
        //组装分页参数
        param.pageOffset = data.start;
        param.pageSize = data.length;
        return param;
    }

    var table = $('#houseTable').DataTable({
        language: {
            url: '/resources/dataTables/Chinese.json'
        },
        colReorder: true,
        fixedHeader: true,
        searching: false,
        ordering: true,
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
            {
                "data": null,
                className: "td-operation  text-center",
                orderable: false,
                width : "15%",
                defaultContent: ""
            }
        ],
        "createdRow": function (row, data, index) {
            //不使用【render】，改用jquery文档操作呈现单元格
            var $btnEdit = $('<button type="button" class="btn btn-small btn-primary btn-edit">修改' + data.id + '+</button>');
            $('td', row).eq(7).append($btnEdit);
        }
    });


    $('#houseTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
})

