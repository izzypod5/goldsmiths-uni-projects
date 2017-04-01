"use strict";
class Player extends GameObject{
  constructor(position, size){
    super(position, size);
    this.lives = 3;
    this.score = 0;
    this.keyEvents = {};
    this.bullets = [];
    this.bulletSound = sounds.playerBullet;
    this.hitSound = sounds.playerHit;
  }
  
  //display
  display(){
    fill("green");
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
    //displays bullets
    for (var i=0;i<this.bullets.length; i++){
      this.bullets[i].display(-1);
      if(this.bullets[i].position.y < 0){
        this.bullets.splice(i, 1);
      }
    }
  }
  
  //shoots bullets
  shoot(){
    if (this.keyEvents[32] && this.bullets.length < 1){   
      this.bullets.push(
        new Bullet(dimensionObject(this.position.x+(this.size.x/2), this.position.y), dimensionObject(10, 10))
      );
      this.bulletSound.play();
    }
  }
  
  //moves player
  move(){
    //default
    if (this.keyEvents[LEFT_ARROW]){
      if(this.position.x - 5 >= 0){
        this.position.x -= 5;
      }
    }
    //default
    if (this.keyEvents[RIGHT_ARROW]){
      if(this.position.x + this.size.x + 5 <= width){      
        this.position.x += 5;
      }
    }
  }
  
}