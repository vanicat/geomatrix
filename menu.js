var menuState = {
    create: function ()
    {
        var nameLabel = game.add.text(80,80, 'Geomatrix',
                                      { font: '50px Arial', fill: '#ffffff'});
        var startLabel = game.add.text(80,160, 'Click here to start',
                                       { font: '50px Arial', fill: '#ffffff'});
        game.add.text(80,80 * 3 + 40, 'Use arrows keys to move',
                      { font: '35px Arial', fill: '#ffffff'});
        game.add.text(80,80 * 3 + 40*2, 'Enter to restart a level',
                      { font: '35px Arial', fill: '#ffffff'});
        game.add.text(80,80 * 3 + 40*3, 'Esc or F5 for the menu',
                      { font: '35px Arial', fill: '#ffffff'});
        startLabel.inputEnabled = true;
        startLabel.events.onInputDown.add(this.next, this);
        var muteLabel = game.add.text(game.world.width - 160,game.world.height - 80, 'Mute Music',
                                       { font: '30px Arial', fill: '#ffffff'});
        muteLabel.inputEnabled = true;
        muteLabel.events.onInputDown.add(this.mute, this);
    },
    next: function()
    {
        sound.clang.play();
        game.state.start('play');
    },
    mute: function()
    {
        if(music.paused)
        {
            music.resume();
        }
        else
        {
            music.pause();
        }
    }
};
