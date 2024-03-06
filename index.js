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

var clouds = new Map();
var cloudIdGenerator = 0;
var generateCloud = 0;
const cloudFrequency = 400;

draw();
var game = setInterval(draw, 10);


document.addEventListener("keydown", keyDown, false);
function keyDown(e) {
    switch (e.keyCode) {
        case 37: // Left arrow
            if (x > 10) {
                x -= 20;
            }
            break;
        case 39: // Right arrow
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
    for (const [key, cloud] of clouds) {
        ctx.beginPath();
        ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.size, cloud.size);
        ctx.closePath();
        cloud.y -= cloud.speed // Increase its Y position

        // If the cloud beats the top bound, delete it
        if (cloud.y + cloud.size < 0) {
            clouds.delete(key)
        }
    }

    // Generate a cloud
    if (generateCloud == cloudFrequency) {
        let cloud = new Cloud(random(0, width - 220), height, 3, 220);
        clouds.set(cloudIdGenerator, cloud);
        console.log(clouds);

        cloudIdGenerator++;
        generateCloud = 0;
    }

    generateCloud++;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawClouds();

    drawCake();

}





function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}