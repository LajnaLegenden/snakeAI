class Game {

    player: Player;
    food: Food;

    constructor() {
        this.player = new Player(windowWidth / 2, windowHeight / 2, 30);
        this.food = new Food();
    }

    update() {
        clear();
        this.player.update(this.food);
        this.food.update(this.player);
        if (this.food.eaten) {
            this.player.life++;
            this.food = new Food();
        }

        if (!this.player.alive) {
            this.player = new Player(windowWidth / 2, windowHeight / 2, 30);
            this.food.draw();
            this.player.draw();
        }
    }
}