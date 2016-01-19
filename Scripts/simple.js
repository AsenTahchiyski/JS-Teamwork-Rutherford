var canvas = document.getElementById('myCanvas');
var stage = new createjs.Stage(canvas);
var img = new Image();
img.src = 'resources/back.png';
img.onload = function (e) {
    var title = new createjs.Bitmap(e.target);
    stage.addChild(title);
    stage.update();
};
img.onClick = mouseUp;

function mouseUp (e){
    var mx;
    var my;
    if(e.layerX>=0|| e.layerY>=0){
        mx = e.offsetX;
        my = e.offsetY;
    }
}