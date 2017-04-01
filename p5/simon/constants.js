/**
 * File to handle all the bulky global variables
 **/
var padding = 10;
var view = {
    main_menu: {
        x: 0,
        y: 700,
        x2: 800,
        y2: 800
    },
    game: {
        x: 0,
        y: 0,
        x2: 800,
        y2: 700
    },
    options: {
        x: 150,
        y: 800 / 12,
        x2: 500,
        y2: 400
    }
};

//static list of menu items that can be used
var menuItems = {
    start_game: {
        icon: 'Start',
        text: 'Start Game',
        action: function() {
            removeP5Elements();
            gameState = gameView.PLAYING;
            setup();
        }
    },
    play_again: {
        icon: 'Play Again',
        text: 'Play Again',
        action: function() {
            removeP5Elements();
            gameState = gameView.PLAYING;
            score = 0;
            setup();
        }
    },
    sound: {
        icon: 'Sound',
        text: 'Sound',
        action: function() {
            removeP5Elements();
            gameState = gameView.SOUND_SETTINGS;
            setup();
        }
    },
    highscores: {
        icon: 'Highscores',
        text: 'Highscores',
        action: function() {
            removeP5Elements();
            gameState = gameView.HIGHSCORE_SETTINGS;
            setup();
        }
    },
    resume: {
        icon: 'Resume',
        text: 'Resume',
        action: function() {
            setTimeout(function() {
                removeP5Elements();
                gameState = gameView.PLAYING;
                setup();
            }, 100);
        }
    },
    back: {
        icon: 'Back',
        text: 'Back',
        action: function() {
            removeP5Elements();
            gameState = gameView.SETTINGS;
            setup();
        }
    }
};

//Event Handling Global object
var clickEvents = {
    buttons: [],
    options: []
};

var p5HTMLElements = [];
//game dialog options
var gameDialog = {
    settings: {
        headerContent: 'Settings',
        menuItems: [menuItems.sound, menuItems.highscores, menuItems.resume]
    },
    sound_settings: {
        headerContent: 'Sound',
        menuItems: [menuItems.back]
    },
    highscore_settings: {
        headerContent: 'Highscores',
        menuItems: [menuItems.back]
    },
    game_start: {
        headerContent: 'Game Start',
        menuItems: [menuItems.start_game]
    },
    game_end: {
        headerContent: 'Game Over',
        menuItems: [menuItems.play_again]
    }
};

//game status enum
var gameView = {
    GAME_START: {
        value: 0,
        dialog: gameDialog.game_start
    },
    PLAYING: {
        value: 1
    },
    GAME_END: {
        value: 2,
        dialog: gameDialog.game_end
    },
    SETTINGS: {
        value: 3,
        dialog: gameDialog.settings
    },
    SOUND_SETTINGS: {
        value: 4,
        dialog: gameDialog.sound_settings
    },
    HIGHSCORE_SETTINGS: {
        value: 5,
        dialog: gameDialog.highscore_settings
    }
};