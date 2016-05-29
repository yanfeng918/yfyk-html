    var pageCount;
    $().ready(function() {
        // 获取征集房源信息的ID
        var collectionId = getUrlParam("id");
        $("#collectionId").val(collectionId);
        // 根据collectionId获取征集信息
        getAjax("get", {"collectionId":collectionId},"collection/auth/getCollectionByCollectionId?"+new Date(),getCollectionCallback,false);

        // 根据collectionId获取征集信息的回答房源信息
        getAjax("post", $('form').serialize(),"collection/auth/getResponseHouseInfoByCollectionId?"+new Date(),getResponseHouseInfoCallback,false);
        $("#pager").pager({ pagenumber: 1, pagecount: pageCount, buttonClickCallback: PageClick });
    })

    function getCollectionCallback(data){

        $("#collectionTable tbody tr").remove();

        var content = "<tr><input id=\"collection_id\" type='hidden' value='"+data.collection.id+"'>";
        content+="<td>"+new Date(parseInt(data.collection.createDate)).toLocaleString()+"</td>";
        content+="<td>"+data.collection.collectPrice+"</td>";
        content+="<td>"+data.collection.area.fullName+"</td>";
        content+="<td>"+data.collection.community+"</td>";
        content+="<td>"+data.collection.houseShape+"</td>";
        content+="<td>"+data.collection.floor+"</td>";
        content+="<td>"+data.collection.areaSize+"</td>";
        content+="<td>"+data.collection.salePrice+"</td>";
        /*content+="<td class=\"query operate\" onclick='queryData(this)'>"+data.responseCount+"人提交</td>";*/
        content+="</tr>";
        $("#collectionTable tbody").append(content);

    }

    // 分页 充值记录
    PageClick = function(pageclickednumber) {
        //序列化表格内容为字符串
        $("#pageNumber").val(pageclickednumber);
        var formParam = $('form').serialize();
        getAjax("post", formParam,"collection/auth/getResponseHouseInfoByCollectionId",getResponseHouseInfoCallback,false);
        $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pageCount, buttonClickCallback: PageClick });
    }

    function getResponseHouseInfoCallback(data){
        pageCount=data.pageCount;
        $("#count").html(data.totalCount);
        $("#houseTable tbody tr").remove();
        $.each(data.list, function(i, item){

            var content = "<tr>";
            content+= "<input class='collection_id_list' type='hidden' value='" + item.id + "'>";
            content+="<td>"+new Date(parseInt(item.createDate)).toLocaleString()+"</td>";
            content+="<td>"+item.infoPrice+"</td>";
            content+="<td>"+item.area.fullName+"</td>";
            content+="<td>"+item.community+"</td>";
            //content+="<td>"+item.address+"</td>";
            content+="<td>"+item.houseShape+"</td>";
            content+="<td>"+item.areaSize+"</td>";

            content+="<td>"+item.salePrice+"</td>";

            //content+="<td>"+item.ban+"</td>";
            content+="<td>"+item.name+"</td>";
            content+="<td>"+item.mobile+"</td>";
            content+="<td class=\"query operate\" onclick='queryData(this)'>查看数据</td>";
            content+="</tr>";
            $("#houseTable tbody").append(content);
        });
    }


    /**
     * 查看数据
     */
    function queryData(dom){
        var id=dom.parentElement.firstChild.value;
        var houseInfo_id={"houseInfo_id":id};
        getAjax("GET", houseInfo_id,"houseInfo/auth/getBrowseHouseInfoVO?"+new Date(),queryDataCallback,true);
    }

    function queryDataCallback(data,houseInfo_id){
        if(data.mine==true){
            showData(data);
        }else if(data.bought==true){
            showData(data);
        }else if(data.balanceEnough==true){
            isPay(data);
        }else if(data.balanceEnough==false){
            notEnough(data);
        }
    }
    /**
     * 信息弹出框
     * @param data
     */
    function showData(data){
        $("#showData tr:gt(0)").remove();
        document.getElementById('light2').style.display='block';
        document.getElementById('fade').style.display='block';
        var content="";
        content+="<tr><td>"+data.houseInfo.area.fullName +"&nbsp&nbsp";
        content+="&nbsp&nbsp"+data.houseInfo.community+"&nbsp&nbsp";
        content+="&nbsp&nbsp"+data.houseInfo.houseShape+"&nbsp&nbsp";
        content+="&nbsp&nbsp"+data.houseInfo.areaSize+"平</td></tr>";

        content+="<tr><td>楼层"+data.houseInfo.floor+"&nbsp&nbsp";
        content+="&nbsp&nbsp房号"+data.houseInfo.roomNumber+"&nbsp&nbsp";
        content+="&nbsp&nbsp楼栋号"+data.houseInfo.ban+"</td></tr>";

        content+="<tr><td >售价：<span style='color: red'>"+data.houseInfo.salePrice+"</span>万元</td></tr>";

        content+="<tr><td>业主："+data.houseInfo.name+"&nbsp&nbsp";
        content+="&nbsp&nbsp电话：<span style='color: red'>"+data.houseInfo.mobile+"</span></td></tr>";

        $("#showData").append(content);
    }
    /**
     * 是否支付弹出框
     * @param data
     */
    function isPay(data){
        document.getElementById('light1').style.display='block';
        document.getElementById('fade').style.display='block';
        $("#needPayid").html(data.houseInfo.infoPrice);
        $("#houseId").val(data.houseInfo.id);
    }
    /**
     * 弹出框取消按钮
     */
    function cancle(divid){
        document.getElementById(divid).style.display='none';
        document.getElementById('fade').style.display='none';
    }
    /**
     * 确定支付按钮
     * @param ensureId
     */
    function ensure(ensureId){
        cancle(ensureId);
        var houseInfo_id={"houseInfo_id":$("#houseId").val()};
        var collection ={"houseInfo_id":$("#houseId").val(),"collection_id":$("#collection_id").val()};
        getAjax("GET", houseInfo_id,"houseInfo/auth/browseHouseInfo?"+new Date(),payData,true);
        getAjax("post", collection,"collection/auth/increaseReadTime?"+new Date(),function(){},true);
    }
    /**
     * 确定支付信息弹出框
     * @param data
     */
    function payData(data){
        $("#showData tr:gt(0)").remove();
        document.getElementById('light2').style.display='block';
        document.getElementById('fade').style.display='block';

        var content="";
        content+="<tr><td>"+data.area.fullName +"&nbsp&nbsp";
        content+="&nbsp&nbsp"+data.community+"&nbsp&nbsp";
        content+="&nbsp&nbsp"+data.houseShape+"&nbsp&nbsp";
        content+="&nbsp&nbsp"+data.areaSize+"平</td></tr>";

        content+="<tr><td>楼层"+data.floor+"&nbsp&nbsp";
        content+="&nbsp&nbsp房号"+data.roomNumber+"&nbsp&nbsp";
        content+="&nbsp&nbsp楼栋号"+data.ban+"</td></tr>";

        content+="<tr><td >售价：<span style='color: red'>"+data.salePrice+"</span>万元</td></tr>";

        content+="<tr><td>业主："+data.name+"&nbsp&nbsp";
        content+="&nbsp&nbsp电话：<span style='color: red'>"+data.mobile+"</span></td></tr>";

        $("#showData").append(content);
    }
    /**
     * 余额不足弹出框
     */
    function notEnough(data){
        document.getElementById('light').style.display='block';
        document.getElementById('fade').style.display='block';
        $("#notEnough").html(data.houseInfo.infoPrice);
    }








