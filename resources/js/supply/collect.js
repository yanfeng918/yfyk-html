
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
         * 获取我发起的征集数据list
         */
        getAjax("post", $("form").serialize(),"collection/auth/getMyCollectionList",getCallback,false);
        $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });

    })

    // 分页
    PageClick = function(pageclickednumber) {
        //序列化表格内容为字符串
        $("#pageNumber").val(pageclickednumber);
        getAjax("post", $("form").serialize(),"collection/auth/getMyCollectionList",getCallback,false);
        $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
    }

    /**
     * 获取我发起的征集数据list-回掉函数
     */
    function getCallback(data){
        pageCount=data.pageCount;
        if(data.type=="error"){
            alert(data.content);
            return;
        }else{
            $("table tbody tr").remove();
            $.each(data.list, function(i, item){

                var content = "<tr><input type='hidden' value='"+item.collection.id+"'>";
                /* content+="<td>"+new Date(parseInt(item.collection.createDate)).toLocaleString()+"</td>";*/
                content+="<td  class='price'>"+item.collection.collectPrice+"</td>";
                content+="<td>"+item.collection.area.fullName+"</td>";
                content+="<td>"+item.collection.community+"</td>";
                content+="<td>"+item.collection.address+"</td>";
                content+="<td>"+item.collection.houseShape+"</td>";
                content+="<td>"+item.collection.ban+"</td>";
                content+="<td>"+item.collection.areaSize+"</td>";
                content+="<td>"+item.collection.salePrice+"</td>";
/*                content+="<td>"+item.collection.ban+"</td>";
                content+="<td>"+item.collection.roomNumber+"</td>";*/
                content+="<td style='color: #0078D8' >"+item.collection.statusName+"</td>";

                if(item.responseCount!=0){
                    content += "<td class=\"query operate\" style='color: red' onclick='forwardUrl(this)'>" + item.responseCount + "人提交</td>";
                }else{
                    content += "<td class=\"query operate\" style='color: #464647' onclick='forwardUrl(this)'>" + item.responseCount + "人提交</td>";
                }
                if((item.collection.statusName).indexOf("关闭")!=-1){
                    content+="<td ></td>";
                }else{
                    content+="<td class=\"query operate\" onclick='delMyCollection(this)'>结束征集</td>";
                }
                content+="</tr>";
                $("table tbody").append(content);
            });


        }
    }

    function forwardUrl(dom){
        //获取当前征集信息的ID
        var id = $(dom).parent().children("input").eq(0).val();
        window.location.href='erji/detail.html?id='+id;
    }

    function delMyCollection(dom){
        document.getElementById('delCollection').style.display='block';
        document.getElementById('fade').style.display='block';
        $("#collection_id").val($(dom).parent().children("input").eq(0).val());
    }


    function delEnsure(){
        var data={"collection_id":$("#collection_id").val()};
        getAjax("POST", data,"/collection/auth/closeMyCollectionById",closeCollectionCallback,false);
    }
    function closeCollectionCallback(data){
        if(data==true){
            alert("结束成功！");
            cancle('delCollection');
            history.go(0);
        }else{
            alert("结束失败，请重新尝试！")
        }
    }

    /**
     * 弹出框取消按钮
     */
    function cancle(divid){
        document.getElementById(divid).style.display='none';
        document.getElementById('fade').style.display='none';
    }

