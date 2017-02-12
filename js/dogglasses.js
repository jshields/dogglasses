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
    //this.scale = scale;
    //this.direction = directionVector;
};
var ImageObject = function (image, transform) {
    this.image = image;
    this.transform = transform;
    this.draw = function (canvasCtx) {
        canvasCtx.drawImage(
            this.image,
            this.transform.coords.x,
            this.transform.coords.y
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
});
addEventListener('mouseup', function (ev) {
    mouseX = ev.pageX;
    mouseY = ev.pageY;
    clicked = false;
});


var resolution = new Coords(640, 640);
var canvas = document.createElement('canvas');
canvas.innerText = 'Your browser does not support the canvas element.';
canvas.width = resolution.x;
canvas.height = resolution.y;
var ctx = canvas.getContext('2d', {'alpha': false});

window.onload = function () {
    document.body.appendChild(canvas);

    // dog buttons
    document.getElementById('dogFile').addEventListener('change', function (ev) {
        debugger;
        var files = this.files;
        var src = files[0].name;

        var dogImg = new Image();
        dogImg.src = src;
        setDog(dogImg);
    });
    document.getElementById('defaultDogBtn').addEventListener('click', function (ev) {
        var dogImg = new Image();
        dogImg.src = 'https://raw.githubusercontent.com/jshields/dogglasses.io/master/img/little_tootie.jpg';
        setDog(dogImg);
    });

    // glasses buttons
    document.getElementById('glassesFile').addEventListener('change', function (ev) {
        debugger;
        var files = this.files;
        var src = files[0].name;

        var glassesImg = new Image();
        glassesImg.src = src;
        setGlasses(glassesImg);
    });
    document.getElementById('defaultGlassesBtn').addEventListener('click', function (ev) {
        var glassesImg = new Image();
        glassesImg.src = 'https://raw.githubusercontent.com/jshields/dogglasses.io/master/img/dealwithit_glasses_front.png';
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

    dogImg.onload = function (ev) {
        main();
        // enable glasses picker
        debugger;
        document.getElementById('defaultGlassesBtn').removeAttribute('disabled');
    };

    dog = dogImg;
};
var setGlasses = function (glassesImg) {

    glassesImg.onload = function() {
        var transform = new Transform(new Coords());

        var glassesObj = new ImageObject(glassesImg, transform);
    };

    glasses = glassesObj;
};

var update = function () {
    if (clicked) {
        glasses.transform.coords.x = mouseX;
        glasses.transform.coords.y = mouseY;
    }
};

// Draw everything
var render = function () {
    // draw dog as a background
    ctx.drawImage(dog, 0, 0);

    // draw glasses
    if (glasses) {
        glasses.draw(ctx);
    }
};

var main = function () {
    update();
    render();

    // Call `main` again when the next frame is ready.
    requestAnimationFrame(main);
};

init();
