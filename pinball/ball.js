function Ball(){

    this.x = 1;
    this.y = 1;
    this.xspeed = 1;
    this.yspeed = 1;
    //status of the ball
    // 0 = alive, 1 = dead, ....
    this.status = 0;
  
    //method to check status of the ball
    this.checkStatus = function(){
      
      //check if ball has gone past screen
      if(x <= 0){
        status = 1;
      }
      
      //reverse the yspeed based on if it hits either the top/bottom
      if(y >= 0 || y <= height){
        yspeed = -yspeed;
      }
      
      //performs actions based on the status property
      switch(this.status){
        case(0):
          this.alive;
          this.draw;
          break;
        case(1):
          this.reStart;
        default:
          break;
      }
  
  }
  
  this.draw(){
    
  }
  
}