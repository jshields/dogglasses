'use strict';

/*
var Vector2D = function (coords, scale) {
    this.coords = coords;
    this.scale = scale;
};
*/
var Coords = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
};
var Transform = function (translationCoords, scale) {
    this.coords = translationCoords;
    //this.rotation = rotationRadians;
    this.scale = scale;
    //this.direction = directionVector;
};
var ImageObject = function (image, transform) {
    this.image = image;
    this.transform = transform;
    this.draw = function (canvasCtx) {
        canvasCtx.drawImage(
            this.image,
            this.transform.coords.x,
            this.transform.coords.y,
            this.transform.scale * this.image.width,
            this.transform.scale * this.image.height
        );
    };
};

// FIXME: window.innerWidth includes width of vertical scrollbar (15 in Chrome), we don't want that
var resolution = new Coords(window.innerWidth - 15, 640);

var canvas = document.createElement('canvas');
canvas.innerText = 'Your browser does not support the canvas element.';
canvas.width = resolution.x;
canvas.height = resolution.y;
var ctx = canvas.getContext('2d', {'alpha': false});

var clicked = false;
var mouseX, mouseY;

window.onload = function (ev) {

    // mouse state variables for canvas... Is there a better way?
    canvas.addEventListener('mousedown', function (ev) {
        clicked = true;
    });
    canvas.addEventListener('mouseup', function (ev) {
        clicked = false;
    });
    canvas.addEventListener('mousemove', function (ev) {
        /*
        FIXME
        mouse coords will be incorrect relative to canvas
        unless we draw canvas from top left corner of viewport

        FIXME dragging works in Chrome but not FF
        use drag event instead?
        */
        mouseX = ev.pageX;
        mouseY = ev.pageY;
    });

    document.getElementById('dogContainer').appendChild(canvas);

    // dog buttons
    document.getElementById('dogFile').addEventListener('change', function (ev) {
        // TODO support image URI input?

        var file = this.files[0];

        var reader = new FileReader();
        // set callback for when file is read
        reader.addEventListener('loadend', function (ev) {
            setDog(ev.target.result);
        });
        /*
        FIXME img src attr may be too long for large files when using data URL?
        Use object URL?
        img.src = URL.createObjectURL(file);
        img.onload = function (ev) {
            URL.revokeObjectURL(this.src);
        };
        */
        // start reading file
        if (file) {
            reader.readAsDataURL(file);    
        }
    });
    document.getElementById('defaultDogBtn').addEventListener('click', function (ev) {
        setDog('img/little_tootie.jpg');
    });

    // glasses buttons
    document.getElementById('glassesFile').addEventListener('change', function (ev) {
        console.error('not implemented');
    });
    document.getElementById('defaultGlassesBtn').addEventListener('click', function (ev) {
        setGlasses('img/dealwithit_glasses.png');
    });

    document.getElementById('glassesScale').addEventListener('input', function (ev) {
        glasses.transform.scale = this.value;
    });

    // save image
    document.getElementById('printBtn').addEventListener('click', function (ev) {
        ctx.fillText('Made using dogglasses.io', 64, 64);

        // Attribute length too long for browser to handle with large dogs,
        // use blob instead.
        //var imgUrl = canvas.toDataURL('image/png');

        canvas.toBlob(function (blob) {
            // Will user images cause Tainted Canvas error?
            var imgUrl = URL.createObjectURL(blob);

            var link = document.createElement('a');
            link.innerText = 'Download';
            link.setAttribute('href', imgUrl);
            link.setAttribute('download', 'dogglasses.png');

            // TODO after download is finished
            //URL.revokeObjectURL(imgUrl);

            document.getElementById('instructions').appendChild(link);
        });

        // TODO Chrome blocks un-trusted events, is there a work around?
        //var clickEvent = new Event('click');
        //link.dispatchEvent(clickEvent);
    });
};

var init = function () {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.font = '22px sans-serif';
    ctx.fillText('Pick a dog to get started', 96, 96);
};

var dog;
var glasses;

var setDog = function (dogImgPath) {

    var _resizeCanvas = function (canvas, dog) {
        // TODO resize dog+canvas to fit viewport better
        //dog.width = canvas.width;
        //

        // clamp canvas/dog size
        if (dog.width < canvas.width) {
            canvas.width = dog.width;
        } else {
            // dog larger than canvas
            dog.width = canvas.width;
        }
        canvas.height = dog.height;
    };

    var dogImg = new Image();
    dogImg.src = dogImgPath;

    dogImg.addEventListener('load', function (ev) {
        dog = dogImg;
        _resizeCanvas(canvas, dog);
        // enable glasses picker
        document.getElementById('glassesFile').removeAttribute('disabled');
        document.getElementById('defaultGlassesBtn').removeAttribute('disabled');
        // start render loop
        main();
    });
};

var setGlasses = function (glassesImgPath) {
    var glassesImg = new Image();
    glassesImg.src = glassesImgPath;

    glassesImg.addEventListener('load', function (ev) {
        var transform = new Transform(new Coords(0, 0), 1);
        var glassesObj = new ImageObject(glassesImg, transform);
        document.getElementById('glassesScale').removeAttribute('disabled');
        document.getElementById('printBtn').removeAttribute('disabled');
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
        //document.getElementById('helpText').innerText = '';
        // FIXME don't show this text on downloads
        ctx.font = '22px sans-serif';
        ctx.fillText('Click & drag glasses into place, use slider to scale', 96, 96);
    } else {
        // FIXME scale text relative to dog image resolution
        ctx.font = '22px sans-serif';
        ctx.fillText('Now pick the glasses', 96, 96);
    }
};

var main = function () {
    update();
    render();

    // Call `main` again when the next frame is ready.
    requestAnimationFrame(main);
};

init();
