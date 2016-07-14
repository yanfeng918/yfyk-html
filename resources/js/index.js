$(function(){
    $('.recharge').on('click', function(){

        //判断是否登录
        if(getCookie("yjb_token") == null||getCookie("yjb_token") == '') {
            layer.msg("请先登录!");
            return false;
        }
        window.location.href='finance/rechargeV2.html';
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

        //判断是否登录
        if(getCookie("yjb_token") == null||getCookie("yjb_token") == '') {
            layer.msg("请先登录!");
            return false;
        }

        window.location.href='finance/recharge_all.html';
    });


    $('.expense').on('click', function(){

        layer.alert('尽请期待，马上上线！', {
            skin: 'layui-layer-lan'
            ,closeBtn: 0
            ,shift: 4 //动画类型
        });
        //layer.msg("")

    });


})