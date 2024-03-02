var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

var cakeSize = 80;

// Posición de la tarta
var x = canvas.width / 2 - (cakeSize / 2);
var y = canvas.height / 4;
var dy = 1

var bgImg = new Image();
bgImg.src = "background.jpg"
var cakeImg = new Image();
cakeImg.src = "cake.png";

let theEnd = false;

draw();
var game = setInterval(draw, 10);


document.addEventListener("keydown", keyDown, false);
function keyDown(e) {
    switch (e.keyCode) {
        case 37: // Left arrow
            console.log("Izquierdo");
            if (x > 10) {
                x -= 20;
            }
            break;
        case 39: // Right arrow
            console.log("Derecho");
            if (x + cakeSize + 10 < canvas.width) {
                x += 20;
            }
            break;
    }
}

(function(element, events) {
    events.forEach(e => element.addEventListener(e, click, false))
}) (document, ["pointerover", "click"])

function click(e) {
    console.log(e);

    if (e.x < canvas.width / 2 ) {
        if (x > 10) {
            x -= 20
        }
    } else {
        if (x + cakeSize + 10 < canvas.width) {
            x += 20
        }
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
    // if (y + cakeSize >= canvas.height) {
    //     console.log("Suuube");
    //     y -= 120
    // }

    drawCake();

    // y += dy
}