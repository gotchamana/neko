"use strict";

import Animation from "./animation.js";
import { loadImage, Point } from "./util.js";
import { Neko, State } from "./neko.js";
import nekoImage from "./neko-image.js";

const mousePosition = new Point(16, 32);

document.addEventListener("mousemove", ({ pageX, pageY }) => {
    mousePosition.x = pageX;
    mousePosition.y = pageY;
});

const SpriteData = Object.freeze({
    IDLE0: new Point(0, 0),
    IDLE1: new Point(33, 0),

    MOVE_RIGHT0: new Point(132, 33),
    MOVE_RIGHT1: new Point(165, 33),

    MOVE_TOP_RIGHT0: new Point(198, 33),
    MOVE_TOP_RIGHT1: new Point(231, 33),

    MOVE_BOTTOM_RIGHT0: new Point(66, 33),
    MOVE_BOTTOM_RIGHT1: new Point(99, 33),

    MOVE_LEFT0: new Point(132, 66),
    MOVE_LEFT1: new Point(165, 66),

    MOVE_TOP_LEFT0: new Point(66, 66),
    MOVE_TOP_LEFT1: new Point(99, 66),

    MOVE_BOTTOM_LEFT0: new Point(198, 66),
    MOVE_BOTTOM_LEFT1: new Point(231, 66),

    MOVE_TOP0: new Point(0, 66),
    MOVE_TOP1: new Point(33, 66),

    MOVE_BOTTOM0: new Point(0, 33),
    MOVE_BOTTOM1: new Point(33, 33),

    CLAW_RIGHT0: new Point(66, 99),
    CLAW_RIGHT1: new Point(99, 99),

    CLAW_LEFT0: new Point(198, 99),
    CLAW_LEFT1: new Point(231, 99),

    CLAW_TOP0: new Point(132, 99),
    CLAW_TOP1: new Point(165, 99),

    CLAW_BOTTOM0: new Point(0, 99),
    CLAW_BOTTOM1: new Point(33, 99),

    SCRATCH0: new Point(66, 0),
    SCRATCH1: new Point(99, 0),

    SLEEP0: new Point(165, 0),
    SLEEP1: new Point(198, 0),

    ATTENTION: new Point(231, 0),
    YAWN: new Point(132, 0)
});

const spriteAnimation = new Map([
    [State.STAND, new Animation(1000, SpriteData.IDLE0)],
    [State.IDLE, new Animation(300, SpriteData.IDLE0, SpriteData.IDLE1)],

    [State.MOVE_RIGHT, new Animation(300, SpriteData.MOVE_RIGHT0, SpriteData.MOVE_RIGHT1)],
    [State.MOVE_TOP_RIGHT, new Animation(300, SpriteData.MOVE_TOP_RIGHT0, SpriteData.MOVE_TOP_RIGHT1)],
    [State.MOVE_BOTTOM_RIGHT, new Animation(300, SpriteData.MOVE_BOTTOM_RIGHT0, SpriteData.MOVE_BOTTOM_RIGHT1)],

    [State.MOVE_LEFT, new Animation(300, SpriteData.MOVE_LEFT0, SpriteData.MOVE_LEFT1)],
    [State.MOVE_TOP_LEFT, new Animation(300, SpriteData.MOVE_TOP_LEFT0, SpriteData.MOVE_TOP_LEFT1)],
    [State.MOVE_BOTTOM_LEFT, new Animation(300, SpriteData.MOVE_BOTTOM_LEFT0, SpriteData.MOVE_BOTTOM_LEFT1)],

    [State.MOVE_TOP, new Animation(300, SpriteData.MOVE_TOP0, SpriteData.MOVE_TOP1)],
    [State.MOVE_BOTTOM, new Animation(300, SpriteData.MOVE_BOTTOM0, SpriteData.MOVE_BOTTOM1)],

    [State.CLAW_RIGHT, new Animation(300, SpriteData.CLAW_RIGHT0, SpriteData.CLAW_RIGHT1)],
    [State.CLAW_LEFT, new Animation(300, SpriteData.CLAW_LEFT0, SpriteData.CLAW_LEFT1)],
    [State.CLAW_TOP, new Animation(300, SpriteData.CLAW_TOP0, SpriteData.CLAW_TOP1)],
    [State.CLAW_BOTTOM, new Animation(300, SpriteData.CLAW_BOTTOM0, SpriteData.CLAW_BOTTOM1)],

    [State.SCRATCH, new Animation(300, SpriteData.SCRATCH0, SpriteData.SCRATCH1)],
    [State.SLEEP, new Animation(1000, SpriteData.SLEEP0, SpriteData.SLEEP1)],
    [State.ATTENTION, new Animation(1000, SpriteData.ATTENTION)],
    [State.YAWN, new Animation(1000, SpriteData.YAWN)]
]);

const sprite = loadImage(nekoImage);

export class Oneko {

    #neko;
    #cube;
    #requestId;

    constructor(x = 0, y = 0) {
        this.#neko = new Neko({ x, y, width: 32, height: 32 });

        this.#cube = createCanvas();
        this.#cube.style.visibility = "hidden";
        document.body.appendChild(this.#cube);

        this.#requestId = requestAnimationFrame(this.#update.bind(this));
    }

    async #update(timeStamp) {
        this.#neko.moveTo(mousePosition.x, mousePosition.y);
        this.#neko.update(timeStamp);

        this.#cube.style.transform = `translate(${this.#neko.x}px, ${this.#neko.y}px)`;

        const context = this.#cube.getContext("2d");
        context.clearRect(0, 0, 32, 32);

        const animation = spriteAnimation.get(this.#neko.state);
        animation.update(timeStamp);

        const { x, y } = animation.image;
        context.drawImage(await sprite, x, y, 32, 32, 0, 0, 32, 32);

        this.#requestId = requestAnimationFrame(this.#update.bind(this));
    }

    get position() {
        return { x: this.#neko.x, y: this.#neko.y };
    }

    set position({ x, y }) {
        this.#neko.x = x;
        this.#neko.y = y;
    }

    show() {
        this.#cube.style.visibility = "visible";
    }

    hide() {
        this.#cube.style.visibility = "hidden";
    }

    destroy() {
        this.#cube.remove();
        cancelAnimationFrame(this.#requestId);
    }
}

function createCanvas() {
    const cube = document.createElement("canvas");

    cube.style.position = "absolute";
    cube.style.top = "0";
    cube.style.left = "0";
    cube.style.width = "32px";
    cube.style.height = "32px";

    cube.width = 32;
    cube.height = 32;

    return cube;
}
