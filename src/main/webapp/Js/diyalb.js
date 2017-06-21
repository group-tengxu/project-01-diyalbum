$(function(){
    var $canvas = $("#canvas");
    var height = $('.alb_edit').height();
    var width = $('.alb_edit').width();
    var stepArr = [];
    var step = -1;
    //更新画布宽高
    $canvas[0].width=width;
    $canvas[0].height=height;
    window.onresize = function(){
        $canvas[0].width=width;
        $canvas[0].height=height;
    };
    var ctx = $canvas[0].getContext('2d');
    var ox = $canvas.offset().left;
    var oy = $canvas.offset().top;
    //笔迹
    $canvas[0].onmousedown = function(e){
        var startX = e.pageX - ox;
        var startY = e.pageY - oy;
        ctx.beginPath();
        if(stepArr.length === 0){
            pushArr();
        }
        ctx.moveTo(startX,startY);
        this.onmousemove = function(evt){
            var endX = evt.pageX - ox;
            var endY = evt.pageY - oy;
            ctx.lineTo(endX,endY)
            ctx.stroke();
        }
    };
    $canvas[0].onmouseup = function(){
        $canvas[0].onmousemove = null;
        pushArr()
        
    }
    //清空画布
    $('.clear_all').click(function(){
        ctx.clearRect(0, 0, width, height)
        stepArr = [];
        step = -1;
    })

    //保存数组
    function pushArr(){
        step++;
        if (step < stepArr.length) { 
            stepArr.length = step; 
        }
        stepArr.push($canvas[0].toDataURL());
        if(stepArr.length >6){
            stepArr.shift();
            step--;
        }
        console.log(stepArr);
    }


    function preStep(){
        if(step > 0){
            step--; 
            var canvasPic = new Image();
            console.log(step)
            canvasPic.src = stepArr[step];
            
            console.log(stepArr);
            canvasPic.onload = function () { 
                ctx.clearRect(0, 0, width, height)
                ctx.drawImage(canvasPic, 0, 0); 
            }
        }
        
    }

    function nextStep() {
    if (step < stepArr.length-1) {
        step++;
        var canvasPic = new Image();
        console.log(step)
        canvasPic.src = stepArr[step];
        canvasPic.onload = function () { 
            ctx.clearRect(0, 0, width, height)
            ctx.drawImage(canvasPic, 0, 0); 
        }
    }
}

    $('.pre')[0].onclick = preStep;
    $('.next')[0].onclick = nextStep;
    

    
})