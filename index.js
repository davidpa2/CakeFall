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

var clouds = new Map();
var cloudIdGenerator = 0;
var generateCloud = 0;
var cloudFrequency = 300;

var cakes = new Map();
var cakeIdGenerator = 0;
var generateCakeChance = 20;
var eatenCakes = 0;
var cakesToEat = 35;
var cakeSize = 80;

let movingLeft = false;
let movingRight = false;

var generateCloudSpeed = 4;
var minCloudSize = 210;
var maxCloudSize = 220;

var showAdvice = true;
let theEnd = false;

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
            showAdvice = false;
            cakes.delete(key)
            eatenCakes++;
            console.log(eatenCakes);
        }
    }

    // Generate a cake
    if (generateCakeChance > random(0, 10000)) {
        let cake = new Cake(random(0, width - 220), height, random(2, 5), cakeSize);
        cakes.set(cakeIdGenerator, cake);

        cakeIdGenerator++;
    }
}

/**
 * Check impact on an cloud or a cake
 * @param {*} item The item that will be checked
 * @returns 
 */
function checkImpact(item) {
    let impact = false;
    let added = 0; // Variable to accurate the impact to a cloud

    // Just if the item is a cloud
    if (item.size > cakeSize) {
        added = item.size / 6;
    }

    // Top collision
    if (plane.y + plane.size > item.y + added && plane.y < item.y + item.size + added && plane.x + plane.size > item.x && plane.x < item.x + item.size) {
        impact = true;
    }

    // Left collision
    if (plane.x + plane.size < item.x && plane.x + plane.size > item.x && plane.y < item.y + item.size && plane.y + plane.size > item.y) {
        impact = true;
    }

    // Right collision
    if (plane.x < item.x + item.size && plane.x > item.x + item.size && plane.y < item.y + item.size && plane.y + plane.size > item.y) {
        impact = true;
    }

    return impact;
}

function checkLevel() {
    switch (eatenCakes) {
        case 10:
            generateCloudSpeed = 5;
            maxCloudSize = 250;
            break;

        case 20:
            cloudFrequency = 200;
            generateCloud = 180;
            maxCloudSize = 300;
            break;

        case 30:
            generateCloudSpeed = 7;
            cloudFrequency = 100;
            generateCloud = 80;
            maxCloudSize = 400;
            break;
    }
}

function drawCakeCounter() {
    ctx.beginPath();
    ctx.font = "60px Times";
    ctx.textAlign = "left"
    ctx.fillStyle = "white";
    ctx.fillText("Tartas comidas: " + eatenCakes, 25, 70);
    ctx.closePath();
}

function drawAdvice() {
    if (showAdvice) {
        ctx.beginPath();
        ctx.font = "7vw Times";
        ctx.textAlign = "center"
        ctx.fillStyle = "blue";
        ctx.fillText("¡Recoge tartas y esquiva nubes!", canvas.width / 2, canvas.height - 150, canvas.width);
        ctx.font = "5vw Times";
        ctx.fillText("Toca un lado u otro de la pantalla para moverte", canvas.width / 2, canvas.height - 50, canvas.width - 20);
        ctx.closePath();
    }
}

function win() {
    ctx.beginPath();
    ctx.font = "8vw Times";
    ctx.textAlign = "center"
    ctx.fillStyle = "blue";
    ctx.fillText("¡Muchísimas felicidades!", canvas.width / 2, canvas.height / 2 - 50, canvas.width);
    ctx.fillText("¡35 tartas, 35 años!", canvas.width / 2, canvas.height / 2 + 50, canvas.width);
    ctx.closePath();
}

function lose() {
    ctx.beginPath();
    ctx.font = "13vw Times";
    ctx.textAlign = "center"
    ctx.fillStyle = "blue";
    ctx.fillText("¡Has perdido!", canvas.width / 2, canvas.height / 2 - 20, canvas.width);
    ctx.closePath();
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawClouds();
    drawCakes();
    drawPlane();
    drawCakeCounter();

    drawAdvice();

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
