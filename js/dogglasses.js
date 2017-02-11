'use strict';

var Vector2D = function (coords, scale) {
    this.coords = coords;
    this.scale = scale;
};
var Coords = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
};
var Transform = function (translationCoords, rotationRadians, scale, directionVector) {
    this.coords = translationCoords;
    //this.rotation = rotationRadians;
    this.scale = scale;
    this.direction = directionVector;
};
var ImageObject = function (image, transform) {
    this.image = image;
    this.transform = transform;
    this.draw = function (canvasCtx) {
        canvasCtx.drawImage(
            this.image,
            this.transform.coords.x,
            this.transform.coords.y,
            //this.transform.scale * this.image.width,
            //this.transform.scale * this.image.height,
        );
    };
};

// Handle click state tracking
var clicked = false;
var mouseX, mouseY;
addEventListener('mousedown', function (ev) {
    mouseX = ev.pageX;
    mouseY = ev.pageY;
    clicked = true;
}, false);
addEventListener('mouseup', function (ev) {
    mouseX = ev.pageX;
    mouseY = ev.pageY;
    clicked = false;
}, false);


var resolution = new Coords(640, 640);
var canvas = document.createElement('canvas');
canvas.innerText = 'Your browser does not support the canvas element.';
canvas.width = resolution.x;
canvas.height = resolution.y;
var ctx = canvas.getContext('2d', {'alpha': false});

window.onload = function () {
    document.body.appendChild(canvas);

    document.getElementByID('dogFile').addEventListener('click', function (ev) {
        var dogElement = document.getElementByID();
        var src = '';

        var dogImg = new Image();
        dogImg.src = src;
        setDog(dogImg);
    });
    document.getElementByID('defaultDogBtn').addEventListener('click', function (ev) {
        var dogImg = new Image();
        dogImg.src = 'img/little_tootie.jpg';
        setDog(dogImg);
    });

    // glasses buttons
    document.getElementByID('glassesFile').addEventListener('click', function (ev) {
        var glassesElement = document.getElementByID();
        var src = '';

        var glassesImg = new Image();
        glassesImg.src = src;
        setGlasses(glassesImg);
    });
    document.getElementByID('defaultGlassesBtn').addEventListener('click', function (ev) {
        var glassesImg = new Image();
        glassesImg.src = 'img/sunglasses.jpg';
        setGlasses(glassesImg);
    });
};

var init = function () {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#000';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Pick a dog to get started' + score, 16, 16);
};

var dog;
var glasses;

var setDog = function (dogImg) {
    canvas.width = dogImg.width;
    canvas.height = dogImg.height;

    lastTime = Date.now();
    dogImg.onload = function() {
        main();
        // enable glasses picker

    };

    dog = dogImg;
};
var setGlasses = function (glassesImg) {

    glassesImg.onload = function() {
        var transform = new Transform();

        var glassesObj = new ImageObject(glassesImg, transform);
    };

    glasses = glassesObj;
};

var update = function () {
    // Update game objects
    /*
    Calculate delta time, converting milliseconds to seconds.
    Speed units are in pixels per second.
    */
    var currentTime = Date.now();
    var deltaTime = (currentTime - lastTime) / 1000;

    if (clicked) {
        glasses.transform.coords.x = mouseX;
        glasses.transform.coords.y = mouseY;
    }

    // Set `lastTime` for the next pass
    lastTime = currentTime;
};
// Draw everything
var render = function () {
    // draw dog
    ctx.drawImage(dog, 0, 0);

    // draw glasses


};

var main = function () {
    update();
    render();

    // Call `main` again when the next frame is ready.
    requestAnimationFrame(main);
};

var lastTime;
init();
