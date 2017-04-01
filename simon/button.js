/**
 * Represents a button.
 * @constructor
 * @param {string} id - The id of the button.
 * @param {p5} colour - p5 color object associated with the button.
 * @param {p5} sound - p5 sound object associated with the button. 
 */
"use strict"
class Button {
  constructor(id, colour, sound){
    this.sizeX = (view.game.x2 - view.game.x) / 2 - (padding * 2);
    this.sizeY = (view.game.y2 - view.game.y) / 2 - (padding * 2);
    this.x;
    this.y;
    this.id = id;
    this.colour = colour;
    this.sound = sound;
  }
  //renders the button onto canvas
  render(){
      var btnX = 50;
      var btnY = 50;
      switch (this.id) {
          case ('btn1'):
              this.x = padding;
              this.y = padding;
              break;
          case ('btn2'):
              this.x = (padding * 2) + this.sizeX;
              this.y = padding;
              break;
          case ('btn3'):
              this.x = padding;
              this.y = (padding * 2) + this.sizeY;
              break;
          case ('btn4'):
              this.x = (padding * 2) + this.sizeX;
              this.y = (padding * 2) + this.sizeY;
              break;
          default:
              break;
      }
      fill(this.colour);
      rect(this.x, this.y, this.sizeX, this.sizeY, 20);
  }
  
}