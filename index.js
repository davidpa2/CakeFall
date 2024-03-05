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
bgImg.src = "background.jpg";
var cakeImg = new Image();
cakeImg.src = "cake.png";
var cloudImg = new Image();
cloudImg.src = "cloud.png";

let theEnd = false;

var clouds = new Array();
let cloud = new Cloud(random(0, width - 220), height, 3, 220);
clouds.push(cloud);

const cloudFrequency = 400;
var generateCloud = 0;

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

// let moving = false;
// (function (element, events) {
//     events.forEach(e => element.addEventListener(e, click, false))
// })(document, ["mousedown", "mouseup"]) // pointerover

// function click(e) {
//     console.log(e);
//     switch (e.type) {
//         case "mousedown":
//             console.log("Pulsar");
//             moving = true;
//             move(e);

//         case "mouseup":
//             console.log("Soltar");
//             moving = false;
//             move(e);
//         }
// }

document.addEventListener("click", function (e) {
    console.log(e.y);
    console.log(height);
})

function move(e) {
    // e.preventDefault();
    console.log(e.x, e.y);
    while (moving) {
        if (e.x < canvas.width / 2) {
            console.log(e);
            if (x > 10) {
                x -= 20
            }
        } else {
            if (x + cakeSize + 10 < canvas.width) {
                x += 20
            }
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


function drawClouds() {
    clouds.forEach(cloud => {
        // console.log(cloud);
        ctx.beginPath();
        ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.size, cloud.size);
        ctx.closePath();
        cloud.y -= cloud.speed
    });

    if (generateCloud == cloudFrequency) {
        let cloud = new Cloud(random(0, width - 220), height, 3, 220);
        clouds.push(cloud);
        console.log(clouds);
    
        generateCloud = 0;
    }

    if (cloud.y < 0) {
        delete cloud
    }

    generateCloud++;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawClouds();

    // console.log(clouds);
    // drawBackground();
    // console.log(y);
    // if (y + cakeSize >= canvas.height) {
    //     console.log("Suuube");
    //     y -= 120
    // }

    drawCake();


    // y += dy
}





function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}