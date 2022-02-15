var canvas = document.getElementById("canvas");
var socket = io.connect('http://127.0.0.1:5000/');

var context = canvas.getContext("2d");

var panel = document.getElementById("panel");

var predict_text = document.getElementById("predict_text");
var emoji = document.getElementById("predict_emoji");
var close_btn = document.getElementById("close_button");

var buttons = document.getElementsByClassName("button")

socket.on('predict', function(dict){

    context.clearRect(0, 0, canvas.width, canvas.height)
    predict_text.innerHTML = `${dict["prediction"]}% OF HAPINESS`

    pred_val = parseFloat(dict["prediction"])
    
    canvas.classList.remove('enabled')

    emoji.style.display = 'block';
    close_btn.style.display = 'block';
    predict_text.style.display = 'block';

    for(let i = 0; i < buttons.length; i++){
        buttons[i].disabled = true;
        buttons[i].style.pointerEvents = 'none';
    }

    if (pred_val >= 50){
        canvas.classList.add('disabled_happy')
        close_btn.classList.add('enabled_close_happy')

        emoji.innerHTML = "😀"
    } else{
        canvas.classList.add('disabled_sad')
        close_btn.classList.add('enabled_close_sad')

        emoji.innerHTML = "😥"
    }

})

function _close(){

    for(let i = 0; i < buttons.length; i++){
        buttons[i].disabled = false;
        buttons[i].style.pointerEvents = 'all';
    }

    for(let i = 0; i < canvas.classList.length; i++){
        canvas.classList.remove(canvas.classList[i])
    }

    for(let i = 0; i < close_btn.classList.length; i++){
        close_btn.classList.remove(close_btn.classList[i])
    }

    emoji.style.display = 'none';
    close_btn.style.display = 'none';
    predict_text.style.display = 'none';

    canvas.classList.add("enabled");

}

function train(){
    socket.emit('train')
}

function download(happiness){
    socket.emit('download', {'image': canvas.toDataURL("image/jpg"), 'emoji': happiness}) 
}

function predict(){
    socket.emit('predict', {'image': canvas.toDataURL("image/jpg")})
}

function clear_canvas(){
    context.clearRect(0, 0, canvas.width, canvas.height)
}