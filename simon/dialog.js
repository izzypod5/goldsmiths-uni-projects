/**
 * main function to open dialog screens
 **/
function showDialog() {
    fill(255);
    strokeWeight(2);
    rect(view.options.x, view.options.y, view.options.x2, view.options.y2);
    strokeWeight(1);
    fill(0);
    text(gameState.dialog.headerContent, view.options.x + (view.options.x2 / 2), view.options.y + 10);
    switch (gameState.dialog) {
        case (gameDialog.sound_settings):
            if (isDialogSetup) {
                showSoundSettingsContent();
            }
            text('Volume = ' + select('#sound_slider').value(),
                view.options.x + (view.options.x2 / 2),
                view.options.y + 200);
            select('#sound_slider').changed(changeGameVolume);
            break;
        case (gameDialog.highscore_settings):
            if (isDialogSetup) {
                showHighScoreContent();
            }
            break;
        case (gameDialog.game_end):
            if (isDialogSetup) {
                showGameEndContent();
            }
            break;
        default: // do nothing
            break;
    }

    if (isDialogSetup) {
        addMenuItems();
        //once all drawn once
        isDialogSetup = false;
    }
}

/**
 * displays content for sound page
 **/
function showSoundSettingsContent() {
    p5HTMLElements.push(createSlider(0, 1, getMasterVolume(), 0.1));
    var slider = p5HTMLElements[p5HTMLElements.length - 1];
    slider.position(view.options.x + 20, view.options.y + 100);
    slider.size(view.options.x2 - 40, slider.size().height);
    slider.id('sound_slider');
}

/**
 * allows change of volume based on slider
 **/
function changeGameVolume() {
    masterVolume(select('#sound_slider').value());
    sounds[0].play();
}

/**
 * displays content for highscore page
 **/
function showHighScoreContent() {
    if (highscoreData.highscores == undefined) {
        p5HTMLElements.push(createP('No Highscores to view here'));
        p5HTMLElements[p5HTMLElements.length - 1].position(view.options.x2 / 2 + 50, view.options.y + 100);
        return;
    }
    highscoreData.highscores.reverse();
    var tableContent = '<tr><th>Name</th><th>Score</th></tr>';
    for (var i = 0; i < highscoreData.highscores.length; i++) {
        tableContent += '<tr><td>' + highscoreData.highscores[i].name + '</td><td>' + highscoreData.highscores[i].score + '</td></tr>';
    }
    highscoreData.highscores.reverse();
    p5HTMLElements.push(createElement('table', tableContent));
    var highscoresTable = p5HTMLElements[p5HTMLElements.length - 1];
    highscoresTable.position(view.options.x + 10, view.options.y + 50);
    highscoresTable.size(view.options.x2 - 20, highscoresTable.size().height);
}

/**
 * function to submit new highscores to json file in data folder
 **/
function submitHighscore() {
    var highscore = select('#highscore_input');
    select('#highscore_submit').attribute('disabled', true);
    var name = highscore.value();
    var counter = highscore.attribute('counter');
    var jsonHighscores;
    if (counter === null) {
        highscoreData = {};
        highscoreData.highscores = [];
        highscoreData.highscores.push({
            "name": name,
            "score": score
        });
        jsonHighscores = JSON.stringify(highscoreData);
    } else {
        var json = highscoreData.highscores;
        highscoreData = {};
        highscoreData.highscores = json;
        highscoreData.highscores.splice(counter, 0, {
            "name": name,
            "score": score
        });
        if (highscoreData.highscores.length > 9) {
            highscoreData.highscores.shift();
        }
        jsonHighscores = JSON.stringify(highscoreData);
    }
    //save(jsonHighscores, 'highscores.json');
    download(jsonHighscores, 'highscores.json', 'application/json');
}

/**
 * solution to saving json, did try using save/saveJSON but they have bugs associated on editor and browser
 * due to security risks javascript only allows file save no paths
 **/
 function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {
        type: type
    });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

/**
 * displays content for game end screen
 **/
function showGameEndContent() {
    var counter;
    var isHighscore = false;
    if (score > 0) {
        if (highscoreData.highscores !== undefined) {
            for (var i = 0; i < highscoreData.highscores.length; i++) {
                if (score >= highscoreData.highscores[i].score) {
                    isHighscore = true;
                    counter = i + 1;
                    continue;
                }
                break;
            }
        }
        isHighscore = true;
    }
    if (isHighscore) {
        p5HTMLElements.push(createP('Congratulations you earned a spot on the highscores!'));
        p5HTMLElements[p5HTMLElements.length - 1].position(view.options.x2 / 2 - 20, view.options.y + 100);
        p5HTMLElements.push(createElement('label', 'Input Name:'));
        p5HTMLElements[p5HTMLElements.length - 1].position(view.options.x2 / 2 - 20, view.options.y + 150);
        p5HTMLElements.push(createInput(''));
        p5HTMLElements[p5HTMLElements.length - 1].id('highscore_input');
        p5HTMLElements[p5HTMLElements.length - 1].attribute('counter', counter);
        p5HTMLElements[p5HTMLElements.length - 1].position(view.options.x2 / 2 + 75, view.options.y + 150);
        p5HTMLElements.push(createButton('submit'));
        p5HTMLElements[p5HTMLElements.length - 1].id('highscore_submit');
        p5HTMLElements[p5HTMLElements.length - 1].position(view.options.x2 / 2 + 250, view.options.y + 150);
        p5HTMLElements[p5HTMLElements.length - 1].mousePressed(submitHighscore);
    } else {
        p5HTMLElements.push(createP('Better luck next time!'));
        p5HTMLElements[p5HTMLElements.length - 1].position(view.options.x2 / 2, view.options.y + 100);
    }
}

/**
 * adds menu items associated with the current dialog
 **/
function addMenuItems() {
    var menuItemY = 50;
    var sumMenuItemsY = gameState.dialog.menuItems.length * (menuItemY + padding);
    var dialogYSize = view.options.y2 - sumMenuItemsY;

    for (i = 0; i < gameState.dialog.menuItems.length; i++) {
        var currentItem = gameState.dialog.menuItems[i];

        dialogYSize += menuItemY;
        currentItem.x = view.options.x + 10;
        currentItem.y = dialogYSize;
        currentItem.x2 = view.options.x2 - 20;
        currentItem.y2 = menuItemY;
        dialogYSize += padding;

        //P5 Element DOM
        // http://p5js.org/reference/#/p5/createButton
        p5HTMLElements.push(createButton(currentItem.text));
        p5HTMLElements[p5HTMLElements.length - 1].class('menuItem');        
        p5HTMLElements[p5HTMLElements.length - 1].position(currentItem.x, currentItem.y);
        p5HTMLElements[p5HTMLElements.length - 1].size(currentItem.x2, currentItem.y2);
        p5HTMLElements[p5HTMLElements.length - 1].mousePressed(currentItem.action);
    }
}

/**
 * removes all html elements from screen after a game state change
 **/
function removeP5Elements() {
    for (i = 0; i < p5HTMLElements.length; i++) {
        p5HTMLElements[i].remove();
    }
}