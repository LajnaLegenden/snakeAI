let safeZone: number = 200;
let size: number = 10;


class Food {

    posX: number;
    posY: number;
    eaten: boolean = false;
    closest: boolean = false;
    constructor() {
        this.posX = Math.round(Math.random() * (windowWidth - safeZone)) + (safeZone / 2);
        this.posY = Math.round(Math.random() * (windowHeight - safeZone)) + (safeZone / 2);
    }

    update(player: Player) {
        this.draw();
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

        rect(this.posX, this.posY, size, size); fill(0);
    }
}