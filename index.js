var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Plane dimension
var plane = new Plane(canvas.width / 2 - (80 / 2), canvas.height / 4, 20, 80)

var bgImg = new Image();
bgImg.src = "background.jpg";
var planeImg = new Image();
planeImg.src = "cake.png";
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
            if (plane.x > 10) {
                plane.x -= plane.speed;
            }
            break;
        case 39: // Right arrow
            if (plane.x + plane.size + 10 < canvas.width) {
                plane.x += plane.speed;
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
    console.log("X:" + e.x);
    console.log("Y:" + e.y);
    console.log("Avion X:" + plane.x);
    console.log("Avion Y:" + plane.y);
})

function move(e) {
    // e.preventDefault();
    console.log(e.x, e.y);
    while (moving) {
        if (e.x < canvas.width / 2) {
            console.log(e);
            if (plane.x > 10) {
                plane.x -= 20
            }
        } else {
            if (plane.x + plane.size + 10 < canvas.width) {
                plane.x += 20
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
 * Draw Plane
 */
function drawPlane() {
    ctx.beginPath();
    ctx.drawImage(planeImg, plane.x, plane.y, plane.size, plane.size);
    ctx.closePath();
}


function drawClouds() {
    for (const [key, cloud] of clouds) {
        ctx.beginPath();
        ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.size, cloud.size);
        ctx.closePath();
        cloud.y -= cloud.speed // Increase its Y position to rise the cloud

        // If the cloud beats the top bound, delete it
        if (cloud.y + cloud.size < 0) {
            clouds.delete(key)
        }

        theEnd = checkImpact(cloud);
    }

    // Generate a cloud
    if (generateCloud == cloudFrequency) {
        let cloud = new Cloud(random(0, width - 220), height, 3, 220);
        clouds.set(cloudIdGenerator, cloud);

        cloudIdGenerator++;
        generateCloud = 0;
    }

    generateCloud++;
}


function checkImpact(cloud) {
    let impact = false;

    // Top cloud collision
    if (plane.y + plane.size > cloud.y && plane.x + plane.size > cloud.x && plane.x < cloud.x + cloud.size) {
        hayImpacto = true;
        console.log("Impacto Superior");
    }

    // if (plane.x + plane.size < cloud.x + plane.speed && plane.x + plane.size > cloud.x - plane.speed) {
    //     console.log("Oyeeeee");
    // }
    // Left cloud collision
    if (plane.x + plane.size < cloud.x + plane.speed && plane.x + plane.size > cloud.x - plane.speed && plane.y < cloud.y + cloud.size && plane.y + plane.size > cloud.y) {
        hayImpacto = true;
        console.log("Impacto lateral izquierdo con la nube");
    }

    // if (plane.x < cloud.x + cloud.size + plane.speed && plane.x > cloud.x + cloud.size - plane.speed) {
    //     console.log("Oyeeeee");
    // }
    // Right cloud collision
    if (plane.x < cloud.x + cloud.size + plane.speed && plane.x > cloud.x + cloud.size - plane.speed && plane.y < cloud.y + cloud.size && plane.y + plane.size > cloud.y) {
        hayImpacto = true;
        console.log("Impacto lateral derecho con la nube");
    }

    return impact;
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawClouds();

    drawPlane();
}





function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}