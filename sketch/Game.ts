class Game {

    player: Player;
    food: Food;

    constructor() {
        let rdn = this.randomStartPos();
        this.player = new Player(rdn.w, rdn.h, 20)
        this.food = new Food();
    }

    update() {

        this.player.update(this.food);
        this.food.update(this.player);

        if (this.food.eaten) {
            this.player.life++;
            this.food = new Food();
        }
        if (!this.player.alive) {
            //this.player = new Player(windowWidth / 2, windowHeight / 2, 30);
            this.food.draw();
            this.player.draw();
        }


    }
    randomStartPos(): RandomStartPos {
        let h = Math.floor(Math.random() * windowHeight);
        let w = Math.floor(Math.random() * windowWidth);
        return { h, w }
    }
}