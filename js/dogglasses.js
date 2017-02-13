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
            // TODO
            //this.transform.scale * this.image.width,
            //this.transform.scale * this.image.height,
        );
    };
};

// Handle click state tracking
var clicked = false;
var mouseX, mouseY;
addEventListener('mousedown', function (ev) {
    // TODO update mouseX in real time
    mouseX = ev.pageX;
    mouseY = ev.pageY;
    clicked = true;
});
addEventListener('mouseup', function (ev) {
    mouseX = ev.pageX;
    mouseY = ev.pageY;
    clicked = false;
});

// FIXME: window.innerWidth includes width of vertical scrollbar (15 in Chrome), we don't want that
var resolution = new Coords(window.innerWidth - 15, window.innerHeight);

var canvas = document.createElement('canvas');
canvas.innerText = 'Your browser does not support the canvas element.';
canvas.width = resolution.x;
canvas.height = resolution.y;
var ctx = canvas.getContext('2d', {'alpha': false});

window.onload = function (ev) {
    document.getElementById('dogContainer').appendChild(canvas);

    // dog buttons
    document.getElementById('dogFile').addEventListener('change', function (ev) {
        debugger;
        var files = this.files;
        var dogImgPath = files[0].name;

        setDog(dogImgPath);
    });
    document.getElementById('defaultDogBtn').addEventListener('click', function (ev) {
        setDog('https://raw.githubusercontent.com/jshields/dogglasses.io/master/img/little_tootie.jpg');
    });

    // glasses buttons
    document.getElementById('glassesFile').addEventListener('change', function (ev) {
        debugger;
        var files = this.files;
        var src = files[0].name;

        var glassesImg = new Image();
        glassesImg.src = src;
        setGlasses(glassesImgPath);
    });
    document.getElementById('defaultGlassesBtn').addEventListener('click', function (ev) {
        setGlasses('https://raw.githubusercontent.com/jshields/dogglasses.io/master/img/dealwithit_glasses_front.png');
    });
};

var init = function () {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Pick a dog to get started', 16, 16);
};

var dog;
var glasses;

var setDog = function (dogImgPath) {
    var dogImg = new Image();
    dogImg.src = dogImgPath;
    dogImg.width = canvas.width;

    dogImg.addEventListener('load', function (ev) {
        dog = dogImg;

        //canvas.width = dogImg.width;
        //canvas.height = dogImg.height;
        // enable glasses picker
        document.getElementById('defaultGlassesBtn').removeAttribute('disabled');
        // start render loop
        main();
    });
};
var setGlasses = function (glassesImgPath) {
    var glassesImg = new Image();
    glassesImg.src = glassesImgPath;

    glassesImg.addEventListener('load', function (ev) {
        var transform = new Transform(new Coords(0, 0));
        var glassesObj = new ImageObject(glassesImg, transform);
        glasses = glassesObj;
    });
};

var update = function () {
    if (clicked && glasses) {
        glasses.transform.coords.x = mouseX;
        glasses.transform.coords.y = mouseY;
    }
};

// Draw everything
var render = function () {
    // draw dog as a background
    if (dog) {
        ctx.drawImage(dog, 0, 0, dog.width, dog.height);
    }
    // draw glasses
    if (glasses) {
        glasses.draw(ctx);
    } else {
        ctx.fillText('Now pick the glasses', 16, 16);
    }
};

var main = function () {
    update();
    render();

    // Call `main` again when the next frame is ready.
    requestAnimationFrame(main);
};

init();
