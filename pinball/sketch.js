var ball, paddle;

//setInterval checkDifficulty() 1000*60 every min if alive
//if dead clearInterval reset();

function setup() {
  createCanvas(800,600);
  frameRate(60);
  //ball = new Ball();
  paddle = new Paddle();
}

function draw() {
  background(0);
  paddle.draw();
  //rect(width/10, mouseY, width/20, 100);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    //paddle.dir(0,-1);
  } else if (keyCode === DOWN_ARROW) {
    //paddle.dir(0,1);
  } else if (keyCode === RIGHT_ARROW) {
    //paddle.dir(1,0);
  } else if (keyCode === LEFT_ARROW) {
    //paddle.dir(-1,0);
  }
}

function checkDifficulty(){
  //will use a timer to change speed of ball
  //ball.increaseSpeed();
}