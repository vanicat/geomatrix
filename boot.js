var background;
var music;
var sound = {};

var bootState = {
    preload: function () {
    },

    create: function () {
        this.text = game.add.text(32, 32, 'loading', { fill: '#ffffff' });

        game.load.onFileComplete.add(this.fileComplete, this);
        game.load.onLoadComplete.add(this.loadComplete, this);

        game.load.image('ground', 'assets/platform.png');
        game.load.spritesheet('rolling', 'assets/rolling.png', 16, 16);

        game.load.tilemap('level1', 'assets/leve1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level2', 'assets/leve2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('level3', 'assets/leve3.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('sandbox', 'assets/sandbox.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('gameTiles', 'assets/walls.png');
        game.load.spritesheet('objects', 'assets/walls.png', 16, 16);

        game.load.audio('music', ['assets/audio/music.mp3', 'assets/audio/music.ogg']);
        game.load.audio('bang', ['assets/audio/bang.mp3', 'assets/audio/bang.ogg']);
        game.load.audio('clang', ['assets/audio/clang.mp3', 'assets/audio/clang.ogg']);
        game.load.audio('bing', ['assets/audio/bing.mp3', 'assets/audio/bing.ogg']);
        game.load.audio('explo', ['assets/audio/explode.mp3', 'assets/audio/explode.ogg']);
        game.load.audio('rol', ['assets/audio/rol.mp3', 'assets/audio/rol.ogg']);

        game.load.start();

    },

    fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
        this.text.setText("Loading: " + progress + "%");
    },

    loadComplete: function() {
        game.state.start('init');
    }
};

var initState = {
    create: function () {
        //  We're going to be using physics, so enable the Arcade Physics system
        // TODO: maybe use another mode...
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.make.bitmapData(800, 600);

        background.autoResize = function ()
        {
            background.resize(game.world.width,game.world.height);
            var grd = background.context.createLinearGradient(game.world.width/2,0,game.world.width/2,game.world.height);
            grd.addColorStop(0, '#8ED6FF');
            grd.addColorStop(1, '#003BA2');

            background.cls();
            background.rect(0,0,game.world.width,game.world.height, grd);
            background.fill();
        };

        music = game.add.audio('music',1,true);
        music.play();

        sound.bang = game.add.audio('bang',1,false);
        sound.bing = game.add.audio('bing',1,false);
        sound.clang = game.add.audio('clang',1,false);
        sound.explosion = game.add.audio('explo',1,false);
        sound.rolling = game.add.audio('rol',1,false);

        game.state.start('menu');
    }
};
