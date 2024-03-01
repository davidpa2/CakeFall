var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height / 2;
var dy = 1

var cakeSize = 30;

var bgImg = new Image();
bgImg.src = "background.jpg"
var cakeImg = new Image();
cakeImg.src = "cake.png";

let theEnd = false;

draw();
var game = setInterval(draw, 10);


document.addEventListener("keydown", click, false);
function click(e) {
    switch (e.keyCode) {
        case 37: // Left arrow
            console.log("Izquierdo");
            if (x > 0) {
                x -= 10;
            }
            break;
        case 39: // Right arrow
            console.log("Derecho");
            if (x + cakeSize < canvas.width) {
                x += 10;
            }
            break;
    }
}

function drawBackground() {
    ctx.beginPath();
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.closePath();
}

/**
 * Draw Cake
 */
function drawCake() {
    ctx.beginPath();
    ctx.drawImage(cakeImg, x, y, cakeSize, cakeSize);
    ctx.closePath();
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // drawBackground();
    // console.log(y);
    if (y + cakeSize >= canvas.height) {
        console.log("Suuube");
        y -= 80
    }

    drawCake();

    y += dy
}