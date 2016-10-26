function Paddle(){
  this.x = width/10;
  this.y = mouseY;
  this.padWidth = width/20;
  this.padHeight = 100;
  
  this.draw(){
    
    if(this.y < 0){
      this.y = 0;
    }
    
    if((this.y + padHeight)>height){
      this.y -= padHeight;
    }
    
    rect(this.x, this.y, padWidth, padHeight);
  }

}