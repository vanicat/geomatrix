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
    "level3",
    "level4"
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
            this.player.play = shape.play;
            this.player.setup();
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.animations.stop();
            this.blocked = true;
            game.time.events.add(Phaser.Timer.SECOND * .25, function() {this.blocked = false; }, this);
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
        this.animate.right = this.player.animations.add('right', [6,7,8,9,10,11], 10, true);
        this.animate.left = this.player.animations.add('left', [11,10,9,8,7,6], 10, true);


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

        if (game.physics.arcade.collide(this.player, this.stuff))
        {
            this.player.play();
        }
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

        for (var dest in shapes)
        {
            this.shifting[dest] = game.add.group();
            this.shifting[dest].enableBody = true;
            var tileset = shapes[dest].tileset;
            for(var i = 0; i < 7; i++)
            {
                map.createFromObjects('objects', tileset + 1 + i , 'objects', tileset+i, true, false, this.shifting[dest]);
            }
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
