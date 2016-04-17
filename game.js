var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamediv');

game.state.add('boot',bootState);
game.state.add('init',initState);
game.state.add('play',playState);
game.state.add('menu',menuState);

game.state.start('boot');
