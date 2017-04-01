"use strict";
class Bunkers extends GameObject {
    
  constructor(position, size){
    super(position, size);
    this.blocks = [];
  }
  
  //bunkers take up space of (384, 288) when 24 by 24
  init(){
    for(var i=0; i < 4; i++ ){
      for(var j = 0; j < 12; j++){
        //exclude the 9/10th positions to generate bunker shape
        if(j == 9 || j == 10){
          continue;
        }
        var divisionBy4 = (j-j%4) / 4;
        var xPos = currentX + (j%4) * 24;//divisionBy4 === 0 ? 100 : 100 + i * 24;
        var yPos = this.position.y + divisionBy4 * 24;
        this.blocks.push(new Block(dimensionObject(xPos, yPos), dimensionObject(blockSize, blockSize)));
      }
      //used for spacing
      currentX += this.size.x + totalBunkerSpacing;  
    }
  }
  
  display(){
    for (var i = 0; i < this.blocks.length; i++) {
      this.blocks[i].display();
    }
  }
}