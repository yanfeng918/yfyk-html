$(function(){
    $('.recharge').on('click', function(){
        layer.msg("尽请期待！")
        //layer.open({
        //    id:"layer-charge",
        //    type: 2,
        //    title: '账户充值',
        //    maxmin: true,
        //    shadeClose: true, //点击遮罩关闭层
        //    //area : ['800px' , '520px'],
        //    area : ['100%' , '420px'],
        //    content: 'finance/rechargeV2.html'
        //    ,success: function(layero, index){
        //        console.log(layero, index);
        //        $(layero).addClass("col-md-6 col-sm-10 col-xs-12")
        //    }
        //});
    });

    $('.rechargeAll').on('click', function(){
        layer.msg("尽请期待，马上上线！")
        //layer.open({
        //    type: 2,
        //    title: '充值记录',
        //    maxmin: true,
        //    shadeClose: true, //点击遮罩关闭层
        //    //area : ['800px' , '520px'],
        //    content: 'finance/recharge_all.html'
        //});
    });


})