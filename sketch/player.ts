let speedMultiplyer: number = 0.01;
let speedDecrese: number = 0.02;
let bouncePenalty: number = 1
let breakMultiplier: number = 0.1;
let lifeTimeOut: number = 1;
let startLives: number = 26;

class Player {

    speedX: any = 0
    speedY: any = 0
    log: HTMLElement;
    shouldLog: string;
    deltaTime: number = 1;

    life: number = startLives;
    lifeTimer: number = 0;

    alive: boolean = true

    bodyParts: Path[] = [];
    input: Inputs;

    ai: AI;


    score: number = 0;
    constructor(public posX: any, public posY: any, public size: number, ) {

        this.log = document.getElementById('log');
        this.ai = new AI();
    }

    draw() {
        this.bodyParts.push({ posX: this.posX, posY: this.posY });
        while (this.bodyParts.length > this.life)
            this.bodyParts.shift();
        for (let i = this.bodyParts.length - 1; i >= 0; i--) {
            let r = (255 / startLives) * i;
            let g = (128 / startLives) * i;
            let b = (64 / startLives) * i;
            fill(r, g, b)
            rect(this.bodyParts[i].posX, this.bodyParts[i].posY, this.size, this.size)
        }
    }

    update(food: Food) {
        this.deltaTime = 1000 / frameRate();
        if (this.deltaTime > 10000) {
            this.deltaTime = 10000;
        }
        this.lifeTimer = this.deltaTime + this.lifeTimer;
        if (this.alive) {
            this.input = this.ai.update(this, food)
            this.handleInput();
            this.checkCollision();
            this.move();
            this.draw();
            this.setLog();
            this.checkLife();
            this.checkCollision();
            this.addToLog(`Distance to food: ${this.distanceToFood(food)}`)
            this.addToLog(`Score: ${this.score}`);
        }
    }

    handleInput() {
        if (this.input.xVal < 0 || keyIsDown(LEFT_ARROW)) {
            if (this.speedX < 0) {
                this.speedX -= speedMultiplyer * this.deltaTime
            } else {
                this.speedX -= breakMultiplier * this.deltaTime
            }
        }

        if (this.input.xVal > 0 || keyIsDown(RIGHT_ARROW)) {
            if (this.speedX > 0) {
                this.speedX += speedMultiplyer * this.deltaTime
            } else {
                this.speedX += breakMultiplier * this.deltaTime
            }
        }
        if (this.input.yVal < 0 || keyIsDown(UP_ARROW)) {
            if (this.speedY > 0) {
                this.speedY += speedMultiplyer * this.deltaTime
            } else {
                this.speedY += breakMultiplier * this.deltaTime
            }
        }
        if (this.input.yVal > 0 || keyIsDown(DOWN_ARROW)) {
            if (this.speedY < 0) {
                this.speedY -= 1 * speedMultiplyer * this.deltaTime
            } else {
                this.speedY -= 1 * breakMultiplier * this.deltaTime
            }
        }
        if (this.input.xVal == 0 && this.input.yVal == 0) {
            if (Math.abs(this.speedX) < 0.1) {
                this.speedX = 0;
            } else {
                this.speedX -= this.speedX * (speedDecrese) * this.deltaTime;
            }
            if (Math.abs(this.speedY) < 0.1) {
                this.speedY = 0;
            } else {
                this.speedY -= this.speedY * (speedDecrese) * this.deltaTime;
            }
        }

        console.log(this.speedX)
        this.move();
        this.addToLog(`SpeedX: ${this.speedX.toFixed(4)} <br>SpeedY: ${this.speedY.toFixed(4)}`)
        this.addToLog(`PosX: ${this.posX.toFixed(4)} <br>PosY: ${this.posY.toFixed(4)}`)
        this.addToLog(`DeltaTime: ${this.deltaTime.toFixed(4)}`)
    }

    move() {
        this.posX += this.speedX;
        this.posY += this.speedY;
    }

    checkCollision() {
        if (this.posX < 0 || this.posX + this.size > windowWidth) {
            this.speedX *= -1;
            this.life--;
        }

        if (this.posY < 0 || this.posY + this.size > windowHeight) {
            this.speedY *= -1;
            this.life--;
        }
    }

    distanceToFood(food: Food): string {
        let x = Math.abs(food.posX - this.posX);
        let y = Math.abs(food.posY - this.posY);
        let dist = Math.sqrt((x * x + y * y));
        return dist.toFixed(4);
    }

    checkLife() {

        if (this.lifeTimer > lifeTimeOut * 1000) {
            this.life--;
            this.lifeTimer = 0;
        }
        if (this.life == 0) {
            this.alive = false;
        }
        this.addToLog(`Lifes: ${this.life}`)
    }

    addToLog(input: string) {
        this.shouldLog += input + "<br>"
    }

    setLog() {
        let tmp = this.shouldLog;
        this.shouldLog = "";
        this.log.innerHTML = tmp;
    }
}