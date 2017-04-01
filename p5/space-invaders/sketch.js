var player, colony;
var blockSize = 24, xBunkerSize = blockSize * 4;
//using width to align bunkers with equal spacing there's 4 walls
var totalBunkerSpacing, currentX, bunkers;
    
function preload() {
    //loading sounds
    sounds = {
        "invaderBullet" : loadSound('sounds/InvaderBullet.wav'),
        "invaderHit" : loadSound('sounds/InvaderHit.wav'),
        "playerBullet" : loadSound('sounds/ShipBullet.wav'),
        "playerHit" : loadSound('sounds/ShipHit.wav')
    };
    images = {
      "invaderA" : {
        "image1" : loadImage('images/InvaderA_00.png'),
        "image2" : loadImage('images/InvaderA_01.png')        
      },
      "invaderB" : {
        "image1" : loadImage('images/InvaderB_00.png'),
        "image2" : loadImage('images/InvaderB_01.png')        
      },
      "invaderC" : {
        "image1" : loadImage('images/InvaderC_00.png'),
        "image2" : loadImage('images/InvaderC_01.png')        
      },
      "UFO" : loadImage('images/UFO.png')
    };
}

function setup() {
    frameRate(30);
    createCanvas(800, 800);
    objectsInit();
}

function draw() {
  designCanvas();
  displayObjects();
}

function keyPressed(){  
  //checking for start of movement
  if(keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW || keyCode == 32){ 
    player.keyEvents[keyCode] = true;
  }
}

function keyReleased(){
  //checking for end of movement
  //left, right, space
  if(keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW || keyCode == 32){    
    player.keyEvents[keyCode] = false;
  }
}