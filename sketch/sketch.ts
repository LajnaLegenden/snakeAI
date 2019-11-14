
let game: Game;


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