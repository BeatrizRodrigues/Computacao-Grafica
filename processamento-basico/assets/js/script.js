let image = document.getElementById('image');
image.crossOrigin = 'Anonymous';
let canvas = document.getElementById('canvas');
canvas.crossOrigin = 'Anonymous';
let context;

var rotated = false;

let load = async function (){
    original = image;
    context = canvas.getContext("2d");
    drawImage(canvas, context, image);
}

let drawImage = function(cv, ctx, img) {
    cv.width = img.width;
    cv.height = img.height;
    ctx.drawImage(img, 0, 0);
}

class RGBColor {
    constructor(r, g, b) {
        this.red = r;
        this.green = g;
        this.blue = b;
    }
}

class RGBAColor extends RGBColor {
    constructor(r, g, b, a) {
        super(r, g, b);
        this.alpha = a;
    }
}

class MatrixImage {
    constructor(imageData) {
        this.imageData = imageData;
        this.height = imageData.height;
        this.width = imageData.width;
    }
    getPixel(x, y) {
        let position = ((y * (this.width * 4)) + (x * 4));
        return new RGBAColor(
            this.imageData.data[position],  // red
            this.imageData.data[position + 1],  // green
            this.imageData.data[position + 2],  // blue
        );
    }
    setPixel(x, y, color) {
        let position = ((y * (this.width * 4)) + (x * 4));
        this.imageData.data[position] = color.red;
        this.imageData.data[position + 1] = color.green;
        this.imageData.data[position + 2] = color.blue;
    }
}

let grayScale = function() {
    load();
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i+2];
        const gray = (red + green + blue) / 3;
        data[i] = data[i+1] = data[i+2] = gray;
    }
    context.putImageData(imageData, 0, 0);
}

let grayScaleCIE = function() {
    load();
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        const red = data[i];
        const green = data[i+1];
        const blue = data[i+2];
        const gray = (red * 0.2126 + green * 0.7152 + blue * 0.0722);
        data[i] = data[i+1] = data[i+2] = gray;
    }
    context.putImageData(imageData, 0, 0);
}

let grayScaleNTSC = function() {
    load();
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        const red = data[i];
        const green = data[i+1];
        const blue = data[i+2];
        const gray = (red * 0.299 + green * 0.587 + blue * 0.144);
        data[i] = data[i+1] = data[i+2] = gray;
    }
    context.putImageData(imageData, 0, 0);
}

let red = function() {
    load();
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        data[i+1] = 0;
        data[i+2] = 0;
    }
    context.putImageData(imageData, 0, 0);
}

let green = function() {
    load();
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        data[i] = 0;
        data[i+2] = 0;
    }
    context.putImageData(imageData, 0, 0);
}

let blue = function() {
    load();
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4) {
        data[i] = 0;
        data[i+1] = 0;
    }
    context.putImageData(imageData, 0, 0);
}

let horizontal = function () {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);
    for (var i = 0; i < img.width / 2; i++) {
        for (var j = 0; j < img.height; j++) {
            var len = img.width - 1
            var aux = img.getPixel(i, j);
            img.setPixel(i, j, new RGBColor(img.getPixel(len - i, j).red, img.getPixel(len - i, j).green, img.getPixel(len - i, j).blue));
            img.setPixel(len - i, j, new RGBColor(aux.red, aux.green, aux.blue));
        }
    }
    context.putImageData(img.imageData, 0, 0);
}

let vertical = function () {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);
    for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height / 2; j++) {
            var len = img.height - 1
            var aux = img.getPixel(i, j);
            img.setPixel(i, j, new RGBColor(img.getPixel(i, len - j).red, img.getPixel(i, len - j).green, img.getPixel(i, len - j).blue));
            img.setPixel(i, len - j, new RGBColor(aux.red, aux.green, aux.blue));
        }
    }
    context.putImageData(img.imageData, 0, 0);
}


let flip90Degrees = function () {
    let drawHorizontally = rotated;
    if (!rotated) {
        drawImage(canvas, context, image, true);
        rotated = true;
    }
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);
    let imageDataRotate = context.getImageData(0, 0, canvas.width, canvas.height);
    let imgRotate = new MatrixImage(imageDataRotate);
    for (let i = 0; i < img.width; i++) {
        for (let j = 0; j < img.height; j++) {
            const pixel = img.getPixel(i, j);
            imgRotate.setPixel(j, i, pixel);
        }
    }
    if (drawHorizontally) {
        drawImage(canvas, context, image);
        rotated = false;
    }
    context.putImageData(imgRotate.imageData, 0, 0);
}

let brightnessPlus = function () {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);

    for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height; j++) {
            var pixel = img.getPixel(i, j);
            img.setPixel(i, j, new RGBColor(pixel.red * 1.1, pixel.green * 1.1, pixel.blue * 1.1));
        }
    }
    
    context.putImageData(img.imageData, 0, 0);
}

let brightnessMinus = function () {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);
    for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height; j++) {
            var pixel = img.getPixel(i, j);
            img.setPixel(i, j, new RGBColor(pixel.red / 1.1, pixel.green / 1.1, pixel.blue / 1.1));
        }
    }
    context.putImageData(img.imageData, 0, 0);
}

let contrast = function() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let redFactor = 0;
    let greenFactor = 0;
    let blueFactor = 0;

    for (let i = 0; i < data.length; i+=4) {
        redFactor += data[i];
        greenFactor += data[i+1];
        blueFactor += data[i+2];
    }

    redFactor = redFactor % 255 * 0.05;
    greenFactor = greenFactor % 255 * 0.05;
    blueFactor = blueFactor % 255 * 0.05;

    for (let i = 0; i < data.length; i+=4) {
        data[i] *= redFactor;
        data[i+1] *= greenFactor;
        data[i+2] *= blueFactor;
    }

    context.putImageData(imageData, 0, 0);
}
