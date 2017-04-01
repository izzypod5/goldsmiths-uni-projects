"use strict"; 
class Bullet extends GameObject {
  constructor(position, size){
    super(position, size);
    this.size = size;    
    this.position = position;
    this.speed = 20;//15
  }
  
  //display bullets based on if going forward or backward direction
  display(dir){
    this.position.y += dir * this.speed;
    fill("white");
    ellipse(this.position.x, this.position.y, this.size.x, this.size.y);
  }
  
  //can hit an enemy or wall
  hits(object){
    var distance = dist(this.position.x , this.position.y, object.position.x + (object.size.x/2), object.position.y + (object.size.y/2));
    //checking the bullet distance from object is less than 
    //the sum of the radius of the object and bullet
    if(distance < (this.size.x /2) + (object.size.x/2)){
      return true;
    }
    return false;
  }
}