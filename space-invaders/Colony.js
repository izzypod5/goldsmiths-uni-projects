"use strict";
class Colony {
    constructor() {
        this.enemies = [];
        // -1 for left, 1 for right
        this.dir = 1;
        this.speed = 15;
        //check for drop in colony
        this.isDropping = false;
        this.bullets = [];
    }

    //initialises colony
    init() {
        //check for row position to determine score
        for (var i = 0; i < 5; i++) {
            var score;          
            switch (i) {
                case (0):
                case (1):
                    score = 40;
                    break;
                case (2):
                case (3):
                    score = 20;
                    break;
                case (4):
                    score = 10;
                    break;
            }

            for (var j = 0; j <11; j++) {
                var enemy = new Enemy(score, dimensionObject(j * 25 + 20, i * 25 + 20), dimensionObject(20, 20));
                this.enemies.push(enemy);
            }
        }
    }
    
    //shoots bullets from random time on closest enemy
    shoot(){
      //random up to every 10 seconds
      if (frameCount % 90 == 0) {
        var selectedEnemy = selectRandomEnemy(this.enemies);
        //logic for choosing enemy to shoort with from colony
        this.bullets.push(
          new Bullet(dimensionObject(selectedEnemy.position.x+(selectedEnemy.size.x/2), selectedEnemy.position.y), dimensionObject(10,10))
        );
        selectedEnemy.bulletSound.play();
      }  
    }      

    //function shifts the colony in the position needed
    shift() {
        if (this.isDropping) {
            for (var i = 0; i < this.enemies.length; i++) {
                this.enemies[i].position.y += this.speed;
            }
            //reverses direction
            this.dir *= -1;
            this.isDropping = false;
        } else {
            for (var i = 0; i < this.enemies.length; i++) {
                    if (this.dir === -1) {
                        this.enemies[i].position.x -= this.speed;
                    }
                    if (this.dir === 1) {
                        this.enemies[i].position.x += this.speed;
                    }
            }
        }
    }

    //updates position of colony every half second
    update() {
        //since frameRate is set to 30 frames per second I use modulus
        // to check if a second has passed
        if (frameCount % 30 == 0) { //millis()-this.startTime>1000){
            for (var i = 0; i < this.enemies.length; i++) {
                    var currentEnemy = this.enemies[i];

                    //if conoly direction right check for boundary at width
                    if (this.dir === 1) {
                        if (currentEnemy.position.x + currentEnemy.size.x + this.speed >= width) {
                            this.isDropping = true;
                        }
                    }

                    //if conoly direction left check for boundary at 0
                    if (this.dir === -1) {
                        if (currentEnemy.position.x - this.speed <= 0) {
                            this.isDropping = true;
                        }
                    }

            }
            this.shift();
            //TODO: check correct image on move based on boolean this.shift(this.direct ? 1 : 0); 
        }
    }

    //triggers display for all enemies in colony
    display() {
      //display enemies
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].display();
        }
      //display bullets of enemies
        for (var j=0;j<this.bullets.length; j++){
          this.bullets[j].display(1);
          if(this.bullets[j].position.y > height){
            this.bullets.splice(j, 1);
          }
        }        
    }

}

    function selectRandomEnemy(enemies){
        //variable for readability
        var chosenEnemy;      
        //if length of chosen array is one then no array manipulation needed
        if(enemies.length === 1){
          chosenEnemy = enemies[0];
        } else {      
        //find the unique values of x values for enemies and store
        var tempChecks = [], output = [];
        for(var i = 0; i < enemies.length; i++){
          if(tempChecks[enemies[i].position.x]){
            continue;
          }
          tempChecks[enemies[i].position.x] = true;
          output.push(enemies[i].position.x);
        }
        
        //filter enemies into 2d array x position seperated
        var twoD_enemies = [];
        for(var i = 0; i < output.length; i++){
            twoD_enemies.push(enemies.filter(function(enemy){return enemy.position.x === output[i]}));
        }
        
        //randomises chosen column
          var randomEnemyColumn = Math.floor(Math.random() * twoD_enemies.length);

          //reduce chosen column to find max y value of enemy in array            
          chosenEnemy = twoD_enemies[randomEnemyColumn].reduce(function(prev, cur) {
            return prev.position.y > cur.position.y ? prev : cur;
          });          
        }
        return chosenEnemy;
        
    }