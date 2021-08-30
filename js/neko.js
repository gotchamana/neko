"use strict";

import { radiansToDegrees } from "./util.js";

export const State = Object.freeze({
    STAND: 1,
    IDLE: 2,
    MOVE_RIGHT: 3,
    MOVE_TOP_RIGHT: 4,
    MOVE_BOTTOM_RIGHT: 5,
    MOVE_LEFT: 6,
    MOVE_TOP_LEFT: 7,
    MOVE_BOTTOM_LEFT: 8,
    MOVE_TOP: 9,
    MOVE_BOTTOM: 10,
    ATTENTION: 11,
    SCRATCH: 12,
    YAWN: 13,
    SLEEP: 14,
    CLAW_RIGHT: 15,
    CLAW_LEFT: 16,
    CLAW_TOP: 17,
    CLAW_BOTTOM: 18
});

export class Neko {
    constructor({ x, y, width, height, moveFactor = 1 / 2 }) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.moveFactor = moveFactor;
        this.state = State.STAND;

        this._previousTimeStamp = 0;
        this._elapsedTime = 0;
    }

    update(timeStamp) {
        if (this._previousTimeStamp)
            this._elapsedTime += timeStamp - this._previousTimeStamp;

        this._previousTimeStamp = timeStamp;

        if (this.state == State.STAND && this._elapsedTime > 1000) {
            this._elapsedTime = 0;
            this.state = determineClawOrIdleState.call(this);
        }

        if ((this.state == State.IDLE || isClawing.call(this)) && this._elapsedTime > 3000) {
            this._elapsedTime = 0;
            this.state = State.SCRATCH;
        }

        if (this.state == State.SCRATCH && this._elapsedTime > 2000) {
            this._elapsedTime = 0;
            this.state = State.YAWN;
        }

        if (this.state == State.YAWN && this._elapsedTime > 1500) {
            this._elapsedTime = 0;
            this.state = State.SLEEP;
        }

        function determineClawOrIdleState() {
            if (this.x < 1)
                return State.CLAW_LEFT;
            else if (Math.abs(this.x + this.width - document.documentElement.clientWidth) < 1)
                return State.CLAW_RIGHT;
            else if (this.y < 1)
                return State.CLAW_TOP;
            else if (Math.abs(this.y + this.height - document.documentElement.clientHeight) < 1)
                return State.CLAW_BOTTOM;
            else
                return State.IDLE;
        }

        function isClawing() {
            return this.state == State.CLAW_RIGHT || this.state == State.CLAW_LEFT || this.state == State.CLAW_TOP ||
                this.state == State.CLAW_BOTTOM;
        }
    }

    moveTo(x, y) {
        const vector = calcMoveVector.call(this, x, y);

        if (!needMove(vector) && this.state != State.ATTENTION) {
            if (isMoving.call(this)) {
                this._elapsedTime = 0;
                this.state = State.STAND;
            }

            return;
        }

        if (!isMoving.call(this) && this.state != State.ATTENTION) {
            this._elapsedTime = 0;
            this.state = State.ATTENTION;
            return;
        }

        if (this.state == State.ATTENTION && this._elapsedTime < 500) return;

        const degrees = radiansToDegrees(Math.atan2(y - this.y, x - this.x));
        this.state = determineMoveState(degrees);

        const newPosition = calcNewPosition.call(this, vector);
        this.x = newPosition.x;
        this.y = newPosition.y;

        function calcMoveVector(x, y) {
            const vector = {
                x: x - this.x - this.width / 2,
                y: y - this.y - this.height
            };

            const length = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            if (length <= 3) return { x: 0, y: 0 };

            vector.x /= length * this.moveFactor;
            vector.y /= length * this.moveFactor;

            const newPosition = calcNewPosition.call(this, vector);
            if (Math.abs(newPosition.x - this.x) < 1 && Math.abs(newPosition.y - this.y) < 1)
                return { x: 0, y: 0 };

            return vector;
        }

        function calcNewPosition(vector) {
            let x = this.x + vector.x;
            let y = this.y + vector.y;

            if (x < 0)
                x = 0;
            else if (x + this.width > document.documentElement.clientWidth)
                x = document.documentElement.clientWidth - this.width;

            if (y < 0)
                y = 0;
            else if (y + this.height > document.documentElement.clientHeight)
                y = document.documentElement.clientHeight - this.height;

            return { x, y };
        }

        function needMove(vector) {
            return vector.x != 0 || vector.y != 0;
        }

        function isMoving() {
            return this.state == State.MOVE_RIGHT || this.state == State.MOVE_TOP_RIGHT || this.state == State.MOVE_BOTTOM_RIGHT ||
                this.state == State.MOVE_LEFT || this.state == State.MOVE_TOP_LEFT || this.state == State.MOVE_BOTTOM_LEFT ||
                this.state == State.MOVE_TOP || this.state == State.MOVE_BOTTOM;
        }

        function determineMoveState(degrees) {
            if ((degrees >= 0 && degrees <= 22.5) || (degrees <= 0 && degrees >= - 22.5))
                return State.MOVE_RIGHT;
            else if (degrees > -67.5 && degrees < -22.5)
                return State.MOVE_TOP_RIGHT;
            else if (degrees > 22.5 && degrees < 67.5)
                return State.MOVE_BOTTOM_RIGHT;
            else if ((degrees >= 157.5 && degrees <= 180) || (degrees <= -157.5 && degrees >= - 180))
                return State.MOVE_LEFT;
            else if (degrees > -157.5 && degrees < -112.5)
                return State.MOVE_TOP_LEFT;
            else if (degrees > 112.5 && degrees < 157.5)
                return State.MOVE_BOTTOM_LEFT;
            else if (degrees >= -112.5 && degrees <= -67.5)
                return State.MOVE_TOP;
            else
                return State.MOVE_BOTTOM;
        }
    }
}
