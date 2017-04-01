const GAME_STATE = {
  GAME_START: 0,
  PLAYING: 1,
  GAME_END: 2
}

var currentGameState = GAME_STATE.GAME_START;

function objectsInit(){
    player = new Player(dimensionObject(width/2-25, height-100), dimensionObject(50,50));
    colony = new Colony();
    
    //using width to align bunkers with equal spacing there's 4 walls
    totalBunkerSpacing = (width - 4*xBunkerSize) / 5;
    currentX = totalBunkerSpacing;
    bunkers = new Bunkers(dimensionObject(undefined, height-250), dimensionObject(4*blockSize, 3*blockSize) );
    bunkers.init();
    //initialises enemies
    colony.init();
}

function displayObjects(){
  bunkers.display();
  //bullet handling code execute if enemies exist
  //TODO: game state end
  if(colony.enemies.length > 0){
    colony.display();  
    colony.update();
    colony.shoot();
    
    player.display(); 
    player.move();
    player.shoot();
    
    //bullet checking code for all objects
    checkBullets();
    
  }  
}

function designCanvas(){
  background(0);
  fill("white");
  textSize(30);
  text("score: " + player.score, 10, height - 10);
  text("lives: " + player.lives, width-100, height - 10);  
  stroke("green");
  strokeWeight(3);
  line(0, height - 40, width, height - 40);
  noStroke();
  
      switch(currentGameState){
      case 0:
        text(300, 300, "START GAME?");
        break;
      case 1:
        text(300, 300, "GAME STARTED?");
        break;
      case 2:
        text(300, 300, "GAME END?");
        break;        
    }
}

//used for position/size objects
function dimensionObject(init_x, init_y){
  result = {};
  if( typeof init_x == 'undefined'){
    result = {y:init_y};
  } else {
    result = {x:init_x, y:init_y};
  }
  return result;
}

function checkBullets(){
  var bulletHitObject = 
    {
    player: {
        bulletHolder: player,
        hitInstances: [{
                objectHit: colony.enemies,
                hitResult: enemyHitResult
            },
            {
                objectHit: bunkers.blocks,
                hitResult: bunkerHitResult
            }
        ]
    },
    colony: {
        bulletHolder: colony,
        hitInstances: [{
                objectHit: player,
                hitResult: playerHitResult
            },
            {
                objectHit: bunkers.blocks,
                hitResult: bunkerHitResult
            }
        ]
    }
}
  
  for (var key in bulletHitObject) {
    //player/colony
    var rootObjKey = bulletHitObject[key];
    var bulletHolder = rootObjKey.bulletHolder;
    //array of objects : objectHit/hitResult
    for (var i = 0; i < rootObjKey.hitInstances.length; i++) {    
      var currentObj = rootObjKey.hitInstances[i];
      var objectHit = currentObj.objectHit;
      var hitResult = currentObj.hitResult;
      bulletHit(bulletHolder, objectHit, hitResult);
    }
  }
  
}

function bulletHit(bulletHolder, objectHit, successCallback){
  for(var i = 0; i < bulletHolder.bullets.length; i++){
    //setting the current items as variables just to make it more readable
        var currentBullet = bulletHolder.bullets[i];
        
        //check if object is iterable no need to loop
        var isIterableObject = typeof objectHit[Symbol.iterator] === 'function';
        if(!isIterableObject){
            if (currentBullet.hits(objectHit)) {
                successCallback(bulletHolder, objectHit, i);
            }
        }else{
          for(var j = 0; j < objectHit.length; j++){
              var currentObject = objectHit[j];
              if (currentBullet.hits(currentObject)) {
                successCallback(bulletHolder, currentObject, i, j);
              }
          }
        }
      }
}

function playerHitResult(bulletHolder, player, bulletIndex){
              player.hitSound.play();
              player.lives -= 1;
              bulletHolder.bullets.splice(bulletIndex, 1);
}

function enemyHitResult(bulletHolder, currentEnemy, bulletIndex, enemyIndex){
              currentEnemy.hitSound.play();
              player.score += currentEnemy.score;
              player.bullets.splice(bulletIndex, 1);
              colony.enemies.splice(enemyIndex, 1);
}

function bunkerHitResult(bulletHolder, currentBlock, bulletIndex, blockIndex){
              currentBlock.hitSound.play();
              bulletHolder.bullets.splice(bulletIndex, 1);
              currentBlock.lives -= 1;
              if(currentBlock.lives < 1){
                bunkers.blocks.splice(blockIndex, 1);                
              }
}