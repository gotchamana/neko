"use strict";

export default class Animation {

    constructor(duration, ...images) {
        this.images = images;
        this.image = null;

        this._avgDuration = duration / images.length;
        this._previousTimeStamp = 0;
        this._elapsedTime = 0;
    }

    update(timeStamp) {
        if (this._previousTimeStamp)
            this._elapsedTime += timeStamp - this._previousTimeStamp;

        this._previousTimeStamp = timeStamp;

        const index = Math.floor(this._elapsedTime / this._avgDuration) % this.images.length;
        this.image = this.images[index];
    }

    reset() {
        this._previousTimeStamp = 0;
        this._elapsedTime = 0;
    }
}
