var pageCount;
/**
 * 载入页面初始化数据
 */

$().ready(function() {
    getHouseInfo();

    $("#release").click(function(){
        window.location.href="../login.html";
    })

})


/**
 * 获取数据列表
 */

function getHouseInfo(){
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"collection/getAllCollectionList",getHouseInfoCallback,false);
    $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
}
function PageClick(pageclickednumber){
    $("#pageNumber").val(pageclickednumber);
    var formParam = $("#houseFrom").serialize();
    getAjax("post", formParam,"collection/getAllCollectionList",getHouseInfoCallback,false);
    $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
}

function getHouseInfoCallback(data) {
    pageCount = data.pageCount;
    if ($("table tr").length > 1) {
        $("table tr:gt(0)").remove();
    }
    $.each(data.list, function (i, item) {

        var content = "<tr style=\"border-bottom: 1px solid #BABCBF; margin: 1% 0; height: 75px\">" ;

        //content += "<td class=\"blue\">"+item.collection.area.fullName+"</td>";



        content+= "<td class=\"td_collection_info\"><span class=\"supply_icon\">"+
            "<img src=\"../resources/images/supply.png\"  style=\"disply:inline-block;\"/>"+" </span>"
        +"<span class=\"blue\">"+item.collection.area.fullName+"</span></td>";

        content += "<td class=\"blue\">"+item.collection.community+"</td>";

        content += "<td class=\"td_collection_info\">辛苦费<span class=\"price\">"+item.collection.collectPrice+"元</span>&nbsp;求"
            +item.collection.area.fullName+
            item.collection.community+
            "房源<br/><span style='color: rgba(171, 167, 175, 0.99); font-size: small'>地址:"+item.collection.address+"<br/>备注:"+((item.collection.description).length>15
            ?((item.collection.description).substr(0, 40)+"……"):(item.collection.description))+"</span>";
        content += "<span class=\"note\"></span></td>";



        content += "<td>"+new Date(parseInt(item.collection.createDate)).toLocaleString()+"</td>";
        content += "</tr>";
        $("table").append(content);

    });

}












