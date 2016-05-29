$(function(){
    /*$(".method_info").hide();*/
    $(".method_head").click(function(event) {
        $(".intro_info").hide();
        $(".method_info").show();
        $(this).addClass('li_current');
        $(this).siblings('selector').removeClass('li_current');
    });
    $(".intro_head").click(function(event) {
        $(".method_info").hide();
        $(".intro_info").show();
    });
    $(".intro_head").hover(function() {
        $(".intro_icon").addClass('intro_icon_hover');
    }, function(){
        $(".intro_icon").removeClass('intro_icon_hover');
    });
    $(".method_head").hover(function() {
        $(".method_icon").addClass('method_icon_hover');
    }, function() {
        $(".method_icon").removeClass('method_icon_hover');
    });
})