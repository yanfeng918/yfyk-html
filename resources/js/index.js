$(function(){
    $('.recharge').on('click', function(){
        layer.open({
            type: 2,
            title: '账户充值',
            maxmin: true,
            shadeClose: true, //点击遮罩关闭层
            area : ['800px' , '520px'],
            content: 'finance/recharge.html'
        });
    });

    $('.rechargeAll').on('click', function(){
        layer.open({
            type: 2,
            title: '充值记录',
            maxmin: true,
            shadeClose: true, //点击遮罩关闭层
            area : ['800px' , '520px'],
            content: 'finance/recharge_all.html'
        });
    });
})