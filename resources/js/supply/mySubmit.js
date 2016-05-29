
    $().ready(function() {
        //获取区域
        $("#city_id").val(getCookie("cityId"));
        $("#cityName").html(getCookie("cityName"))
        getTown();

    })

    function getTown(){
        var data={"area_id": $("#city_id").val()};
        $("#area_id").val($("#city_id").val());
        getAjax("get", data,"collection/getAreaCollectionCountByCity?"+new Date(),getTownCallback,false);
    }

    /**
     * 获取区域列表回掉函数
     */
    function getTownCallback(data){
        if(data.type=="error"){
            alert(data.content);
            return;
        }else{
            var str="";
            $.each(data,function(idx,item){
                str += "<li class=\"datas_detail\" onclick='onclickArea(this)'><input type='hidden' value='"+item.areaId+";"+item.areaName+"'><span class=\"area\">";
                str += item.areaName;
                str += "</span><div class=\"num\"><span>"+item.collectionCount+"</span><span>套＞</span></div></li>";
            })

            $("#city_view ul").remove();
            $("#city_view").append("<ul>"+str+"</ul>");
        }
    }
    var pageCount;

    $(function(){
        /**
         * 获取我提交的数据list
         */
        getAjax("post", $("form").serialize(),"collection/auth/getMyResponsedHouseInfoList",getCallback,false);
        $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });

    })

    // 分页
    PageClick = function(pageclickednumber) {
        //序列化表格内容为字符串
        $("#pageNumber").val(pageclickednumber);
        getAjax("post", $("form").serialize(),"collection/auth/getMyResponsedHouseInfoList",getCallback,false);
        $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
    }

    /**
     * 获取我发起的征集数据list-回掉函数
     */
    function getCallback(data){
         pageCount=data.pageCount;

            $("table tbody tr").remove();
            $.each(data.list, function(i, item){

                var content = "<tr><input type='hidden' value='"+item.id+"'>";
                /* content+="<td>"+new Date(parseInt(item.collection.createDate)).toLocaleString()+"</td>";*/
                content+="<td   class='price'>"+item.infoPrice+"</td>";
                content+="<td>"+item.fullName+"</td>";
                content+="<td>"+item.community+"</td>";
                content+="<td>"+item.houseShape+"</td>";

                content+="<td>"+item.areaSize+"</td>";
                content+="<td>"+item.salePrice+"</td>";
                content+="<td>"+item.ban+"</td>";
                content+="<td>"+item.floor+"</td>";
                content+="<td>"+item.roomNumber+"</td>";
                content+="<td>"+item.name+"</td>";
                content+="<td>"+item.mobile+"</td>";
                content+="<td >"+item.response_readTime+"人查看</td>";
                content+="</tr>";
                $("table tbody").append(content);
            });



    }