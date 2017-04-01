"use strict";
class Block extends GameObject {
  constructor(position, size){
    super(position, size);
    this.lives = 4;
    this.size = size;    
    this.position = position;
    this.hitSound = sounds.invaderHit;
  }
  
  display(){
    switch(this.lives){
      case 4:
        fill("rgb(0, 125, 0)");
        break;
      case 3:
        fill("rgb(60, 150, 60)");        
        break;
      case 2:
        fill("rgb(115, 200, 115)");        
        break;
      case 1:
        fill("rgb(115, 255, 115)");        
        break;
    }
    rect(this.position.x, this.position.y, this.size.x, this.size.y);    
  }
  
}