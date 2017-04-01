"use strict";
class Enemy extends GameObject {
  constructor(score, position, size){
    super(position, size);
    this.score = score;    
    this.size = size;    
    this.position = position;
    this.bulletSound = sounds.invaderBullet;
    this.hitSound = sounds.invaderHit;
  }
  
  //display
  display(){
    fill("white");
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}