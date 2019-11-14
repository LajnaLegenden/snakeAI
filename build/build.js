var safeZone = 200;
var size = 10;
var Food = (function () {
    function Food() {
        this.eaten = false;
        this.closest = false;
        this.posX = Math.round(Math.random() * (windowWidth - safeZone)) + (safeZone / 2);
        this.posY = Math.round(Math.random() * (windowHeight - safeZone)) + (safeZone / 2);
    }
    Food.prototype.update = function (player) {
        this.draw();
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
        rect(this.posX, this.posY, size, size);
        fill(0);
    };
    return Food;
}());
var Game = (function () {
    function Game() {
        this.player = new Player(windowWidth / 2, windowHeight / 2, 30);
        this.food = new Food();
    }
    Game.prototype.update = function () {
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
    };
    return Game;
}());
var speedMultiplyer = 0.01;
var speedDecrese = 0.02;
var bouncePenalty = 1;
var breakMultiplier = 0.05;
var lifeTimeOut = 1;
var startLives = 26;
var Player = (function () {
    function Player(posX, posY, size) {
        this.posX = posX;
        this.posY = posY;
        this.size = size;
        this.speedX = 0;
        this.speedY = 0;
        this.life = startLives;
        this.lifeTimer = 0;
        this.alive = true;
        this.bodyParts = [];
        this.score = 0;
        this.log = document.getElementById('log');
    }
    Player.prototype.draw = function () {
        this.bodyParts.push({ posX: this.posX, posY: this.posY });
        while (this.bodyParts.length > this.life)
            this.bodyParts.shift();
        for (var i = this.bodyParts.length - 1; i >= 0; i--) {
            var r = (255 / startLives) * i;
            fill(r, 0, 0);
            rect(this.bodyParts[i].posX, this.bodyParts[i].posY, this.size, this.size);
        }
    };
    Player.prototype.update = function (food) {
        this.deltaTime = 1000 / frameRate();
        this.lifeTimer = this.deltaTime + this.lifeTimer;
        if (this.alive) {
            this.handleInput();
            this.checkCollision();
            this.move();
            this.draw();
            this.setLog();
            this.checkLife();
            this.addToLog("Distance to food: " + this.distanceToFood(food));
            this.addToLog("Score: " + this.score);
        }
    };
    Player.prototype.handleInput = function () {
        if (keyIsDown(LEFT_ARROW)) {
            if (this.speedX < 0) {
                this.speedX -= speedMultiplyer * this.deltaTime;
            }
            else {
                this.speedX -= breakMultiplier * this.deltaTime;
            }
        }
        if (keyIsDown(RIGHT_ARROW)) {
            if (this.speedX > 0) {
                this.speedX += speedMultiplyer * this.deltaTime;
            }
            else {
                this.speedX += breakMultiplier * this.deltaTime;
            }
        }
        if (keyIsDown(DOWN_ARROW)) {
            if (this.speedY > 0) {
                this.speedY += speedMultiplyer * this.deltaTime;
            }
            else {
                this.speedY += breakMultiplier * this.deltaTime;
            }
        }
        if (keyIsDown(UP_ARROW)) {
            if (this.speedY < 0) {
                this.speedY -= 1 * speedMultiplyer * this.deltaTime;
            }
            else {
                this.speedY -= 1 * breakMultiplier * this.deltaTime;
            }
        }
        if (!keyIsPressed) {
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