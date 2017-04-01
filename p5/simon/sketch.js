/**
 * Simon Memory Game
 * 
 * @author Adam Letch  
 **/
var gameState = gameView.GAME_START;

//preload variables
var buttons = [];
var sounds = [];
// #feda02 imgs
var loadingImg, userImg, computerImg, optionsImg;

//design variables
var minAlpha = 150,
    maxAlpha = 255;

//empty array list to store the queue of values
var moveHistory = [],
    userHistory = [];

//variables for scoring
var score = 0,
    highestScore,
    currentMove = 0;

var highscoreData;

//isSimulated boolean flag for when it is simulations turn
//isDrawLoopEnabled stops the simulation from repeating until last move complete
//isWaitingTurn displays the waiting gif if it is someone's turn
//isDialogSetup used for P5HTMLElements as they are different only requiring to be drawn once
var isSimulated = true,
    isDrawLoopEnabled = true,
    isWaitingTurn = false,
    isDialogSetup = false;

/**
 * Preloads all necessary images/sounds 
 * P5 objects before setup function is called
 **/
function preload() {
    //loading sounds
    sounds = [
        loadSound('sounds/btn1.wav'),
        loadSound('sounds/btn2.wav'),
        loadSound('sounds/btn3.wav'),
        loadSound('sounds/btn4.wav'),
        loadSound('sounds/success.wav'),
        loadSound('sounds/failure.wav')
    ];

    //uses p5.gif.js a p5 advertised exclusive library for loading gifs
    //via https://p5js.org/libraries/
    loadingImg = loadGif('images/loading.gif');

    //loading static images
    userImg = loadImage('images/user.png');
    computerImg = loadImage('images/computer.png');
    optionsImg = loadImage('images/options.png');

    highscoreData = loadJSON('data/highscores.json');

}

/**
 * P5 mandatory setup function runs initialisation code
 **/
function setup() {
    createCanvas(800, 800);
    fullscreen();
    frameRate(60);
    textSize(30);
    textAlign(CENTER, TOP);
    loadingImg.resize(50, 50);

    //object variable to manage design
    //TODO: will come bk to redesign this responsive
    var mainMenuHeight = 100;

    buttons = [
        new Button('btn1', color(0, 255, 0, minAlpha), sounds[0]),
        new Button('btn2', color(255, 0, 0, minAlpha), sounds[1]),
        new Button('btn3', color(255, 255, 0, minAlpha), sounds[2]),
        new Button('btn4', color(0, 0, 255, minAlpha), sounds[3])
    ];
    
    highestScore = highscoreData.highscores !== undefined ? highscoreData.highscores[highscoreData.highscores.length - 1].score : 0;

    clickEvents.options = {
        x: view.main_menu.x2 - 100,
        y: view.main_menu.y + (view.main_menu.y2 - view.main_menu.y) / 4,
        x2: view.main_menu.x2 - 100 + optionsImg.width,
        y2: view.main_menu.y + (view.main_menu.y2 - view.main_menu.y) / 4 + optionsImg.height
    };

    changeGameSetup(gameState);
}

/**
 * P5 mandatory draw function loops code every frame
 **/
function draw() {
    background(0);
    designMainMenu();
    changeGameDisplay(gameState);

    //only execute when game is playing
    if (gameState.value == 1 && isSimulated && isDrawLoopEnabled) {
        var randomId = 'btn' + Math.ceil(random(4));
        moveHistory.push(randomId);
        simulateEventsHistory();
    }
}

/**
 * function to be called from setup changes display
 **/
function changeGameSetup() {
    isDialogSetup = true;
    if (gameState.value == 1) { //PLAYING
        createButtons(); //re-create events on buttons
    } else {
        clickEvents.buttons = []; //remove button events
    }
}

/**
 * function to add filters and change display based on gameState
 **/
function changeGameDisplay() {
    //displays the background buttons for all gameStates
    displayButtons();
    if (gameState.value != 1) { //NOT PLAYING
        if (gameState.value == 2) { //GAME_END
            filter(GRAY, 3);
        } else {
            filter(BLUR, 3);
        }
        showDialog();
    }
}

/**
 * changes the cursor based on if the current mouse position resides
 * within the clickevent object's area given by its x/y/x2/y2 properties
 **/
function displayCursor() {
    var current;
    if (gameState.value == 1) { //PLAYING buttons active
        for (i = 0; i < clickEvents.buttons.length; i++) {
            current = clickEvents.buttons[i];
            //if betwen area of event perform action
            if (mouseX >= current.x && mouseX <= current.x2 + current.x &&
                mouseY >= current.y && mouseY <= current.y + current.y2) {
                cursor(HAND);
                return;
            }
        }

        if (mouseX >= clickEvents.options.x && mouseX <= clickEvents.options.x2 &&
            mouseY >= clickEvents.options.y && mouseY <= clickEvents.options.y2) {
            cursor(HAND);
            return;
        }
    }
    cursor(ARROW);

}

/**
 * draws the initial design of the mainMenu background with image display
 * based on if it is whos turn is being waited on
 **/
function designMainMenu() {
    fill(0);
    rect(view.main_menu.x, view.main_menu.y, view.main_menu.x2, view.main_menu.y2);

    image(optionsImg, view.main_menu.x2 - 100, view.main_menu.y + (view.main_menu.y2 - view.main_menu.y) / 4);

    //checks for wait between user choices
    if (isWaitingTurn) {
        image(loadingImg, (view.main_menu.x2 - view.main_menu.x) / 8, view.main_menu.y + (view.main_menu.y2 - view.main_menu.y) / 4);
    }

    if (isSimulated) {
        image(computerImg, 10, view.main_menu.y + (view.main_menu.y2 - view.main_menu.y) / 4);
    } else {
        image(userImg, 10, view.main_menu.y + (view.main_menu.y2 - view.main_menu.y) / 4);
    }

    fill(255);
    text('Score: ' + score, (view.main_menu.x2 - view.main_menu.x) / 3, view.main_menu.y + (view.main_menu.y2 - view.main_menu.y) / 2);
    text('Highest Score: ' + highestScore, (view.main_menu.x2 - view.main_menu.x) / 3 * 2, view.main_menu.y + (view.main_menu.y2 - view.main_menu.y) / 2);
}

/**
 * simply draws the buttons and makes use of the handy clickEvents object to
 * connect events to the buttons
 **/
function createButtons() {
    buttons.forEach(function(entry) {
        //must render first to initialise x and y values
        entry.render();
        //pass this a json object to include events
        clickEvents.buttons.push({
            id: entry.id,
            action: buttonClicked,
            param: entry,
            x: entry.x,
            y: entry.y,
            x2: entry.sizeX,
            y2: entry.sizeY
        });
    });
}

/**
 * will re-render the buttons within the p5 draw function
 **/
function displayButtons() {
    buttons.forEach(function(entry) {
        entry.render();
    });
}

/**
 * Function to be used by both the simultation and the user.
 * Iterates through the buttons array to match with the button passed as 
 * a param. 
 * Then change its color through the use of min/max alpha to 
 * give it the flash effect along with its sound to be played on click.
 * After the timeout of the flash if a recursive function is passed it will
 * be triggered until the last iteration else we empty the userHistory
 * and change the turn via the inverted isSimulated
 * 
 * @param  {Object}   button              button object to have the flash applied to it
 * @param  {Boolean}  isLastIteration     boolean value to check if last iteration
 * @param  {Function} [recursiveFunction] optional function to be used as a callback   
 **/
function buttonClicked(button, isLastIteration, recursiveFunction) {
    var previousColour = button.colour;
    buttons.forEach(function(entry) {
        if (entry.colour == previousColour) {
            var r = red(entry.colour);
            var g = green(entry.colour);
            var b = blue(entry.colour);
            var a = maxAlpha;
            entry.colour = color(r, g, b, a);
            setTimeout(function() {
                entry.colour = previousColour;
                //reset turn flag indicate the flash has ended
                isWaitingTurn = false;
                currentMove++;
                if (!isLastIteration) {
                    if (recursiveFunction !== undefined) {
                        recursiveFunction();
                    }
                } else {
                    currentMove = 0;
                    userHistory = [];
                    isSimulated = !isSimulated;
                    isDrawLoopEnabled = true;
                }
            }, 500);
        }
    });
    button.sound.play();
}

/**
 * To be called on a user's turn from within the mousePressed.
 **/
function checkMove() {
    var isLastIteration = false;
    //iterate event options click area
    var current;
    for (i = 0; i < clickEvents.buttons.length; i++) {
        current = clickEvents.buttons[i];
        //if betwen area of event perform action
        if (mouseX >= current.x && mouseX <= current.x2 + current.x &&
            mouseY >= current.y && mouseY <= current.y + current.y2) {
            isWaitingTurn = true;
            //show history moves
            userHistory.push(current.id);

            //start checking answer
            if (userHistory[currentMove] != moveHistory[currentMove]) {
                //game lost dialog
                sounds[5].play();
                reset();
            }

            //check if users last move matches last simulated move
            if (currentMove == (moveHistory.length - 1)) {
                if (userHistory[currentMove] == moveHistory[currentMove]) {
                    sounds[4].play();
                    isLastIteration = true;
                    score++;
                    if (score > highestScore) {
                        highestScore = score;
                    }
                }
            }

            current.action(current.param, isLastIteration);
            break;
        }
    }
}

/**
 * To be called on a simulation's turn from within the draw function based
 * on if the isSimulated flag is true.
 **/
function simulateEventsHistory() {
    //will stop the looping of the draw function
    //we create an artificial loop from buttonClick
    //action and current move global variable
    isDrawLoopEnabled = false;

    var isLastIteration = false;
    var currentHistory = moveHistory[currentMove];
    if (currentMove == (moveHistory.length - 1)) {
        isLastIteration = true;
    }

    //break loop once a button has been found that matches since there 
    //cannot be any more
    var currentEvent;
    for (j = 0; j < clickEvents.buttons.length; j++) {
        currentEvent = clickEvents.buttons[j];
        if (currentHistory == currentEvent.id) {
            break;
        }
    }

    currentEvent.action(currentEvent.param, isLastIteration, simulateEventsHistory);
}

/**
 * Personally don't like how p5 handles events on click through a singular
 * function much prefer event handling like I would do with html/p5 Elements
 * hence the use of clickEvents as an alternative solution to not have to use
 * multiple annoying if statements on x/y positions.
 * note: encapsulate logic in seperate functions to reduce clutter of code
 * being displayed in mousePressed
 **/
function mousePressed() {
    //add settings dialog on settings icon click
    if (gameState.value == 1) { //playing
        if (mouseX >= clickEvents.options.x && mouseX <= clickEvents.options.x2 &&
            mouseY >= clickEvents.options.y && mouseY <= clickEvents.options.y2) {
            openSettings();
        }
    }
    //if simulated or current turn is being processed then ignore click
    if (!isSimulated && !isWaitingTurn) {
        checkMove();
    }
}

/**
 * p5 function on mouse movement I check the cursor
 **/
function mouseMoved() {
    displayCursor();
}

/**
 * p5 function check for escape button press to open options
 **/
function keyPressed() {
    if (gameState.value === 1 && keyCode === ESCAPE && !isSimulated) {
        openSettings();
    }
}

/**
 * function to open settings dialog
 **/
function openSettings() {
    removeP5Elements();
    gameState = gameView.SETTINGS;
    setup();
}

/**
 * Will reset global variables to their default values and re-call 
 * the p5 setup function
 **/
function reset() {
    currentMove = 0;
    userHistory = [];
    moveHistory = [];
    clickEvents.buttons = [];
    buttons = [];
    isSimulated = true;
    isWaitingTurn = false;
    gameState = gameView.GAME_END;
    setup();
}