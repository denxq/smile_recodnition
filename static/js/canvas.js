var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
    
var mouse = { x:0, y:0 };
var draw = false;

var ratio = 16, offset_x = 36, offset_y = 6;

context.strokeStyle = "#000";

canvas.addEventListener("mousedown", function(e){

    if (canvas.classList.contains('enabled')){
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        draw = true;
        context.beginPath();
        context.moveTo(mouse.x/ratio - offset_x, mouse.y/ratio - offset_y);
    }
    
});


canvas.addEventListener("mousemove", function(e){

    if (canvas.classList.contains('enabled')){
        if(draw==true){
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            context.lineTo(mouse.x/ratio - offset_x, mouse.y/ratio - offset_y);
            context.stroke();
        }
    }

});


canvas.addEventListener("mouseup", function(e){

    if (canvas.classList.contains('enabled')){
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
        context.lineTo(mouse.x/ratio - offset_x, mouse.y/ratio - offset_y);
        context.stroke();
        context.closePath();
        draw = false;
    }

});