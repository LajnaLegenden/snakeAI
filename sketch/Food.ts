let safeZone: number = 200;
let size: number = 10;


class Food {
    size: number = size;
    posX: number;
    posY: number;
    eaten: boolean = false;
    closest: boolean = false;
    constructor() {
        this.posX = Math.round(Math.random() * (windowWidth)) + (2 / 2);
        this.posY = Math.round(Math.random() * (windowHeight)) + (2 / 2);
    }

    update(player: Player) {
        if (player.posX + player.size > this.posX &&
            player.posY + player.size > this.posY &&
            !(player.posX > this.posX + size) &&
            !(player.posY > this.posY + size)) {
            this.eaten = true;
            player.score++
        }


    }

    draw() {
        if (this.closest) {
            fill(128, 34, 140);
        }
        fill(0);
        rect(this.posX, this.posY, size, size); fill(0);
    }
}