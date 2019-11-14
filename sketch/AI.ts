class AI {
    out: Inputs;
    constructor() {
        console.log(this.out)
    }
    update(player: Player, food: Food): Inputs {
        console.log(this.out);
        if (food.posX > player.posX) {
            this.out.xVal = 1;
        } else if (food.posX < player.posX) {
            this.out.xVal = -1;
        } else {
            this.out.xVal = 0;
        }

        if (food.posY > player.posY) {
            this.out.yVal = -1;
        } else if (food.posY < player.posY) {
            this.out.yVal = 1;
        } else {
            this.out.yVal = 0;
        }

        line(player.posX + player.size / 2, player.posY + player.size / 2, food.posX + food.size / 2, food.posY + food.size / 2)
        return this.out;
    }
}