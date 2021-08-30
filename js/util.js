"use strict";

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export function loadImage(path) {
    return new Promise(resolve => {
        const image = new Image();
        image.src = path;
        image.onload = () => resolve(image);
    });
}

export function radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
}
