var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Plane dimension
var plane = new Plane(canvas.width / 2 - (100 / 2), canvas.height / 4, 13, 100)

var planeImg = new Image();
planeImg.src = "Dani.png";
var cloudImg = new Image();
cloudImg.src = "cloud.png";
var cakeImg = new Image();
cakeImg.src = "cake.png";

let theEnd = false;

var clouds = new Map();
var cloudIdGenerator = 0;
var generateCloud = 0;
var cloudFrequency = 300;

var cakes = new Map();
var cakeIdGenerator = 0;
var generateCakeChance = 20;
var eatenCakes = 0;
var cakesToEat = 35;

let movingLeft = false;
let movingRight = false;

var generateCloudSpeed = 4;
var minCloudSize = 210;
var maxCloudSize = 220;

draw();
var game = setInterval(draw, 10);

// KeyEvents
(function (element, events) {
    events.forEach(e => element.addEventListener(e, arrowEvent, false))
})(document, ["keydown", "keyup"])
function arrowEvent(e) {
    switch (e.keyCode) {
        case 37: // Left arrow
            if (e.type == "keydown") {
                movingLeft = true;
            } else if (e.type == "keyup") {
                movingLeft = false;
            }
            break;
        case 39: // Right arrow
            if (e.type == "keydown") {
                movingRight = true;
            } else if (e.type == "keyup") {
                movingRight = false;
            }
            break;
    }
    if (theEnd) {
        window.location.reload();
    }
}

// Pointer Events
(function (element, events) {
    events.forEach(e => element.addEventListener(e, clickEvent, false))
})(document, ["pointerdown", "pointerup"])
function clickEvent(e) {
    switch (e.type) {
        case "pointerdown":
            if (e.x < canvas.width / 2) {
                if (plane.x > 10) {
                    movingLeft = true;
                }
            } else {
                if (plane.x + plane.size + 10 < canvas.width) {
                    movingRight = true;
                }
            }
            break;
        case "pointerup":
            movingRight = false;
            movingLeft = false;
            break;
    }
    if (theEnd) {
        window.location.reload();
    }
}

function moving() {
    if (movingLeft) {
        if (plane.x > 10) {
            plane.x -= plane.speed;
        }
    }
    if (movingRight) {
        if (plane.x + plane.size + 10 < canvas.width) {
            plane.x += plane.speed;
        }
    }
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

        if (!theEnd) {
            theEnd = checkImpact(cloud);
        }
    }

    // Generate a cloud
    if (generateCloud == cloudFrequency) {
        let cloud = new Cloud(random(0, width - 220), height, generateCloudSpeed, random(minCloudSize, maxCloudSize));
        clouds.set(cloudIdGenerator, cloud);

        cloudIdGenerator++;
        generateCloud = 0;
    }

    generateCloud++;
}

function drawCakes() {
    for (const [key, cake] of cakes) {
        ctx.beginPath();
        ctx.drawImage(cakeImg, cake.x, cake.y, cake.size, cake.size);
        ctx.closePath();
        cake.y -= cake.speed // Increase its Y position to rise the cake

        // If the cake beats the top bound, delete it
        if (cake.y + cake.size < 0) {
            cakes.delete(key)
        }

        if (checkImpact(cake)) {
            cakes.delete(key)
            eatenCakes++;
            console.log(eatenCakes);
        }
    }

    // Generate a cake
    if (generateCakeChance > random(0, 10000)) {
        let cake = new Cake(random(0, width - 220), height, random(2, 5), 80);
        cakes.set(cakeIdGenerator, cake);

        cakeIdGenerator++;
    }
}

function drawCakeCounter() {
    ctx.beginPath();
    ctx.font = "60px Times";
    ctx.fillStyle = "white";
    ctx.fillText("Tartas comidas: " + eatenCakes, 25, 70);
    ctx.closePath();
}

function checkImpact(item) {
    let impact = false;

    // Top collision
    if (plane.y + plane.size > item.y && plane.y < item.y + item.size && plane.x + plane.size > item.x && plane.x < item.x + item.size) {
        impact = true;
        // console.log("Impacto Superior");
    }

    // if (plane.x + plane.size < cloud.x + plane.speed && plane.x + plane.size > cloud.x - plane.speed) {
    //     console.log("Oyeeeee");
    // }
    // Left collision
    if (plane.x + plane.size < item.x + plane.speed && plane.x + plane.size > item.x - plane.speed && plane.y < item.y + item.size && plane.y + plane.size > item.y) {
        impact = true;
        // console.log("Impacto lateral izquierdo con la nube");
    }

    // if (plane.x < cloud.x + cloud.size + plane.speed && plane.x > cloud.x + cloud.size - plane.speed) {
    //     console.log("Oyeeeee");
    // }
    // Right collision
    if (plane.x < item.x + item.size + plane.speed && plane.x > item.x + item.size - plane.speed && plane.y < item.y + item.size && plane.y + plane.size > item.y) {
        impact = true;
        // console.log("Impacto lateral derecho con la nube");
    }

    return impact;
}

function checkLevel() {
    switch (eatenCakes) {
        case 10:
            generateCloudSpeed = 5;
            break;

        case 20:
            cloudFrequency = 200;
            generateCloud = 180;
            maxCloudSize = 300;
            break;

        case 2:
            generateCloudSpeed = 7;
            cloudFrequency = 100;
            generateCloud = 80;
            maxCloudSize = 400;
            break;
    }
}

function win() {
    ctx.font = "8vw Times";
    ctx.textAlign = "center"
    ctx.fillStyle = "blue";
    ctx.fillText("¡Muchísimas felicidades!", canvas.width / 2, canvas.height / 2 - 50, canvas.width);
    ctx.fillText("¡35 tartas, 35 años!", canvas.width / 2, canvas.height / 2 + 50, canvas.width);
}

function lose() {
    ctx.font = "13vw Times";
    ctx.textAlign = "center"
    ctx.fillStyle = "blue";
    ctx.fillText("¡Has perdido!", canvas.width / 2, canvas.height / 2 - 20, canvas.width);
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawClouds();
    drawCakes();
    drawPlane();
    drawCakeCounter();

    checkLevel();

    moving();

    if (cakesToEat == eatenCakes) {
        win();
        clearInterval(game);
    }

    if (theEnd) {
        clearInterval(game);
        lose();
    }
}





function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}
