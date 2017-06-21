$(function(){
    var $mainR = $(".main-r");
    $mainR.children().eq(0).siblings().hide();
    var $infoList = $('.infoList');
    $infoList.on('click','li',function(){
        console.log($(this).index());
        var index = $(this).index();
        $mainR.children().eq(index).show().siblings().hide();
    })
})