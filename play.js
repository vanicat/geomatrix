/*
* @author             Rémi Vanicat <vanicat@debian.org>
* @copyright          2016 Rémi Vanicat
* @licence            {@link https://creativecommons.org/publicdomain/zero/1.0/deed.fr|CC0 1.0}
*/

var cursors;
var map;
const accel_go  = 10;
const square_speed = 200;
const star_speed = 30;
const levels = [
    "level1",
    "level2",
    "level3"
];
const nblevel = levels.length;
var cur_level = 0;


var playState = {
    shapeshift: function (form) {
        if (! (this.player.shape == form))
        {
            var shape = shapes[form];
            this.player.frame = shape.frame;
            this.player.moving = shape.moving;
            this.player.setup = shape.setup;
            this.player.bouncing = shape.bouncing;
            this.player.setup();
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.animations.stop();
            this.blocked = true;
            game.time.events.add(Phaser.Timer.SECOND * .25, function() this.blocked = false, this);
        }
    },

    create: function() {
        //  A simple background for our game
        background.addToWorld();

        map = game.add.tilemap(levels[cur_level]);
        map.addTilesetImage('wallTile', 'gameTiles');

        map.setCollisionBetween(1, 16, true, 'walls');

        //create layer
        this.walls = map.createLayer('walls');
        this.walls.resizeWorld();

        background.autoResize();

        // walls.debug = true;

        // Shifting stuff
        this.shiftingCreate();

        // exit
        this.exit = game.add.group();
        this.exit.enableBody = true;
        map.createFromObjects('objects', 17, 'objects', 16, true, false, this.exit);

        // Dangerous stuff
        this.killing = game.add.group();
        this.killing.enableBody = true;

        map.createFromObjects('objects', 25, 'objects', 24, true, false, this.killing);

        // OtherStuff
        this.stuff = game.add.group();
        this.stuff.enableBody = true;

        for(var i = 0; i<2; i++)
        {
            map.createFromObjects('objects', 64-i, 'objects', 63-i, true, false, this.stuff);
        }

        this.player_start_x = 32;
        this.player_start_y = game.world.height - 150;

        var obj = map.objects.objects;
        for(var i in obj)
        {
            if (obj[i].gid == 33)
            {
                this.player_start_x = obj[i].x;
                this.player_start_y = obj[i].y;
            }
        }

        this.player = game.add.sprite(this.player_start_x, this.player_start_y, 'rolling');

        // The player and its settings
        this.animate = {};
        this.animate.right = this.player.animations.add('right', [3,4,5,6,7,8], 10, true);
        this.animate.left = this.player.animations.add('left', [8,7,6,5,4,3], 10, true);


        //  We need to enable physics on the player
        game.physics.arcade.enable(this.player);
        this.player.body.setSize(14,14,1,1);
        this.player.body.collideWorldBounds = true;

        this.shapeshift('round');

        game.camera.follow(this.player); // Mmm...

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        cursors.enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        cursors.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    },

    update: function() {
        //  Collide the player with the wall
        if (game.physics.arcade.collide(this.player, this.walls))
        {
            this.player.bouncing();
        }

        game.physics.arcade.collide(this.player, this.stuff);
        game.physics.arcade.collide(this.stuff, this.walls);
        game.physics.arcade.collide(this.stuff, this.stuff);

        this.stuff.forEach(
            function(s) {
                if(s.slowdown) {
                    s.body.velocity.x *= s.slowdown;
                    s.body.velocity.y *= s.slowdown;
                }
            });

        if (game.physics.arcade.collide(this.player, this.killing))
        {
            sound.explosion.play();
            game.state.start('play');
        }

        if (game.physics.arcade.overlap(this.player, this.exit))
        {
            sound.clang.play();
            cur_level++;
            if (cur_level < nblevel)
            {
                game.state.start('play');
            }
            else
            {
                cur_level = 0;
                game.state.start('menu');
            }
        }

        for (var dest in this.shifting)
        {
            if (game.physics.arcade.overlap(this.player, this.shifting[dest]))
            {
                this.shapeshift(dest);
            }
        }

        if (! this.blocked)
        {
            this.player.moving();
        }

        if (cursors.enter.isDown) {
            game.state.start('play');
        };
        if (cursors.esc.isDown) {
            cur_level = 0;
            game.state.start('menu');
        };
    },

    shiftingCreate: function() {
        this.shifting = {};

        this.shifting.square = game.add.group();
        this.shifting.square.enableBody = true;
        for(var i = 0; i < 7; i++)
        {
            map.createFromObjects('objects', 18 + i , 'objects', 17+i, true, false, this.shifting.square);
        }

        this.shifting.round = game.add.group();
        this.shifting.round.enableBody = true;
        for(var i = 0; i < 7; i++)
        {
            map.createFromObjects('objects', 26 + i , 'objects', 25+i, true, false, this.shifting.round);
        }

        this.shifting.star = game.add.group();
        this.shifting.star.enableBody = true;
        for(var i = 0; i < 7; i++)
        {
            map.createFromObjects('objects', 34 + i , 'objects', 33+i, true, false, this.shifting.star);
        }

        // To not make shifting look like wall
        for(var dest in this.shifting)
        {
            this.shifting[dest].forEach(
                function(child) {
                    child.body.setSize(8,8,4,4);
                });
        }
    }
};
