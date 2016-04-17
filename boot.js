var background;
var music;
var sound = {};

var bootState = {
    preload: function () {
        game.load.image('ground', 'assets/platform.png');
        game.load.spritesheet('rolling', 'assets/rolling.png', 20, 20);

        game.load.tilemap('level1', 'assets/leve1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('gameTiles', 'assets/walls.png');
        game.load.spritesheet('objects', 'assets/walls.png', 16, 16);

        game.load.audio('music', ['assets/audio/music.mp3', 'assets/audio/music.ogg']);
        game.load.audio('bang', ['assets/audio/bang.mp3', 'assets/audio/bang.ogg']);
        game.load.audio('clang', ['assets/audio/clang.mp3', 'assets/audio/clang.ogg']);
        game.load.audio('bing', ['assets/audio/bing.mp3', 'assets/audio/bing.ogg']);
        game.load.audio('explo', ['assets/audio/explode.mp3', 'assets/audio/explode.ogg']);
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

        music = game.add.audio('music',1,true);
        music.play();

        sound.bang = game.add.audio('bang',1,false);
        sound.bing = game.add.audio('bing',1,false);
        sound.clang = game.add.audio('clang',1,false);
        sound.explosion = game.add.audio('explo',1,false);

        game.state.start('menu');
    }
};
