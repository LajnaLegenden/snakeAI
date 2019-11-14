var AI = (function () {
    function AI() {
        console.log(this.out);
    }
    AI.prototype.update = function (player, food) {
        console.log(this.out);
        if (food.posX > player.posX) {
            this.out.xVal = 1;
        }
        else if (food.posX < player.posX) {
            this.out.xVal = -1;
        }
        else {
            this.out.xVal = 0;
        }
        if (food.posY > player.posY) {
            this.out.yVal = -1;
        }
        else if (food.posY < player.posY) {
            this.out.yVal = 1;
        }
        else {
            this.out.yVal = 0;
        }
        line(player.posX + player.size / 2, player.posY + player.size / 2, food.posX + food.size / 2, food.posY + food.size / 2);
        return this.out;
    };
    return AI;
}());
var safeZone = 200;
var size = 10;
var Food = (function () {
    function Food() {
        this.size = size;
        this.eaten = false;
        this.closest = false;
        this.posX = Math.round(Math.random() * (windowWidth)) + (2 / 2);
        this.posY = Math.round(Math.random() * (windowHeight)) + (2 / 2);
    }
    Food.prototype.update = function (player) {
        if (player.posX + player.size > this.posX &&
            player.posY + player.size > this.posY &&
            !(player.posX > this.posX + size) &&
            !(player.posY > this.posY + size)) {
            this.eaten = true;
            player.score++;
        }
    };
    Food.prototype.draw = function () {
        if (this.closest) {
            fill(128, 34, 140);
        }
        fill(0);
        rect(this.posX, this.posY, size, size);
        fill(0);
    };
    return Food;
}());
var Game = (function () {
    function Game() {
        var rdn = this.randomStartPos();
        this.player = new Player(rdn.w, rdn.h, 20);
        this.food = new Food();
    }
    Game.prototype.update = function () {
        this.player.update(this.food);
        this.food.update(this.player);
        if (this.food.eaten) {
            this.player.life++;
            this.food = new Food();
        }
        if (!this.player.alive) {
            this.food.draw();
            this.player.draw();
        }
    };
    Game.prototype.randomStartPos = function () {
        var h = Math.floor(Math.random() * windowHeight);
        var w = Math.floor(Math.random() * windowWidth);
        return { h: h, w: w };
    };
    return Game;
}());
var speedMultiplyer = 0.01;
var speedDecrese = 0.02;
var bouncePenalty = 1;
var breakMultiplier = 0.1;
var lifeTimeOut = 1;
var startLives = 26;
var Player = (function () {
    function Player(posX, posY, size) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.speedX = 0;
        this.speedY = 0;
        this.deltaTime = 1;
        this.life = startLives;
        this.lifeTimer = 0;
        this.alive = true;
        this.bodyParts = [];
        this.score = 0;
        this.log = document.getElementById('log');
        this.ai = new AI();
    }
    Player.prototype.draw = function () {
        this.bodyParts.push({ posX: this.posX, posY: this.posY });
        while (this.bodyParts.length > this.life)
            this.bodyParts.shift();
        for (var i = this.bodyParts.length - 1; i >= 0; i--) {
            var r = (255 / startLives) * i;
            var g = (128 / startLives) * i;
            var b = (64 / startLives) * i;
            fill(r, g, b);
            rect(this.bodyParts[i].posX, this.bodyParts[i].posY, this.size, this.size);
        }
    };
    Player.prototype.update = function (food) {
        this.deltaTime = 1000 / frameRate();
        if (this.deltaTime > 10000) {
            this.deltaTime = 10000;
        }
        this.lifeTimer = this.deltaTime + this.lifeTimer;
        if (this.alive) {
            this.input = this.ai.update(this, food);
            this.handleInput();
            this.checkCollision();
            this.move();
            this.draw();
            this.setLog();
            this.checkLife();
            this.checkCollision();
            this.addToLog("Distance to food: " + this.distanceToFood(food));
            this.addToLog("Score: " + this.score);
        }
    };
    Player.prototype.handleInput = function () {
        if (this.input.xVal < 0 || keyIsDown(LEFT_ARROW)) {
            if (this.speedX < 0) {
                this.speedX -= speedMultiplyer * this.deltaTime;
            }
            else {
                this.speedX -= breakMultiplier * this.deltaTime;
            }
        }
        if (this.input.xVal > 0 || keyIsDown(RIGHT_ARROW)) {
            if (this.speedX > 0) {
                this.speedX += speedMultiplyer * this.deltaTime;
            }
            else {
                this.speedX += breakMultiplier * this.deltaTime;
            }
        }
        if (this.input.yVal < 0 || keyIsDown(UP_ARROW)) {
            if (this.speedY > 0) {
                this.speedY += speedMultiplyer * this.deltaTime;
            }
            else {
                this.speedY += breakMultiplier * this.deltaTime;
            }
        }
        if (this.input.yVal > 0 || keyIsDown(DOWN_ARROW)) {
            if (this.speedY < 0) {
                this.speedY -= 1 * speedMultiplyer * this.deltaTime;
            }
            else {
                this.speedY -= 1 * breakMultiplier * this.deltaTime;
            }
        }
        if (this.input.xVal == 0 && this.input.yVal == 0) {
            if (Math.abs(this.speedX) < 0.1) {
                this.speedX = 0;
            }
            else {
                this.speedX -= this.speedX * (speedDecrese) * this.deltaTime;
            }
            if (Math.abs(this.speedY) < 0.1) {
                this.speedY = 0;
            }
            else {
                this.speedY -= this.speedY * (speedDecrese) * this.deltaTime;
            }
        }
        console.log(this.speedX);
        this.move();
        this.addToLog("SpeedX: " + this.speedX.toFixed(4) + " <br>SpeedY: " + this.speedY.toFixed(4));
        this.addToLog("PosX: " + this.posX.toFixed(4) + " <br>PosY: " + this.posY.toFixed(4));
        this.addToLog("DeltaTime: " + this.deltaTime.toFixed(4));
    };
    Player.prototype.move = function () {
        this.posX += this.speedX;
        this.posY += this.speedY;
    };
    Player.prototype.checkCollision = function () {
        if (this.posX < 0 || this.posX + this.size > windowWidth) {
            this.speedX *= -1;
            this.life--;
        }
        if (this.posY < 0 || this.posY + this.size > windowHeight) {
            this.speedY *= -1;
            this.life--;
        }
    };
    Player.prototype.distanceToFood = function (food) {
        var x = Math.abs(food.posX - this.posX);
        var y = Math.abs(food.posY - this.posY);
        var dist = Math.sqrt((x * x + y * y));
        return dist.toFixed(4);
    };
    Player.prototype.checkLife = function () {
        if (this.lifeTimer > lifeTimeOut * 1000) {
            this.life--;
            this.lifeTimer = 0;
        }
        if (this.life == 0) {
            this.alive = false;
        }
        this.addToLog("Lifes: " + this.life);
    };
    Player.prototype.addToLog = function (input) {
        this.shouldLog += input + "<br>";
    };
    Player.prototype.setLog = function () {
        var tmp = this.shouldLog;
        this.shouldLog = "";
        this.log.innerHTML = tmp;
    };
    return Player;
}());
var game;
var ai;
function setup() {
    createCanvas(windowWidth, windowHeight);
    game = new Game();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    game.update();
}
//# sourceMappingURL=build.js.map