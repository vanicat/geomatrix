var background;

var bootState = {
    preload: function () {
        game.load.image('ground', 'assets/platform.png');
        game.load.spritesheet('rolling', 'assets/rolling.png', 20, 20);
        game.load.image('fire', 'assets/fire.png');

        game.load.tilemap('level1', 'assets/leve1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('gameTiles', 'assets/walls.png');
    },

    create: function () {
        //  We're going to be using physics, so enable the Arcade Physics system
        // TODO: maybe use another mode...
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.make.bitmapData(800, 600);

        var grd = background.context.createLinearGradient(400,0,400,600);
        grd.addColorStop(0, '#8ED6FF');
        grd.addColorStop(1, '#003BA2');

        background.cls();
        background.rect(0,0,800,600, grd);
        background.fill();

        game.state.start('menu');
    }
};
