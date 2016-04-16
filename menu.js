var menuState = {
    create: function () {
        var nameLabel = game.add.text(80,80, 'Geomatrix',
                                      { font: '50px Arial', fill: '#ffffff'});
        var startLabel = game.add.text(80,160, 'Click here to start',
                                       { font: '50px Arial', fill: '#ffffff'});
        startLabel.inputEnabled = true;
        startLabel.events.onInputDown.add(this.next, this);
    },
    next: function() {
        game.state.start('play');
    }
};
