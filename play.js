/*
* @author             Rémi Vanicat <vanicat@debian.org>
* @copyright          2016 Rémi Vanicat
* @licence            {@link https://creativecommons.org/publicdomain/zero/1.0/deed.fr|CC0 1.0}
*/

var cursors;
const accel_go  = 10;
const square_speed = 200;
const nblevel = 2;
const levels = [
    "level1",
    "level2"
];
var cur_level = 0;

const shapes = {
    square: {
        frame: 1,
        moving: function () {
            if(this.body.velocity.x == 0 && this.body.velocity.y == 0)
            {
                if (cursors.left.isDown)
                {
                    //  Move to the left
                    this.body.velocity.x = -square_speed;
                }
                else if (cursors.right.isDown)
                {
                    this.body.velocity.x += +square_speed;
                }
                else if (cursors.up.isDown)
                {
                    // up
                    this.body.velocity.y = -square_speed;
                }
                else if (cursors.down.isDown)
                {
                    this.body.velocity.y += +square_speed;
                }
            }
        },
        setup: function () {
            //  This physics properties.
            this.body.bounce.y = 0;
            this.body.bounce.x = 0;
            this.body.gravity.y = 0;
            this.shape = 'square';
        },
        bouncing: function () {
            sound.bing.play();
        }
    },

    round : {
        frame: 0,
        moving: function () {
            if (cursors.left.isDown)
            {
                //  Move to the left
                this.body.velocity.x += -1;
                if (this.accelerator > 0) this.accelerator = 0;
                else if (this.accelerator < -accel_go)
                    this.body.velocity.x += -5;
                else this.accelerator--;
            }
            else if (cursors.right.isDown)
            {
                this.body.velocity.x += 1;
                if (this.accelerator < 0) this.accelerator = 0;
                else if (this.accelerator > -accel_go)
                    this.body.velocity.x += 5;
                else this.accelerator++;
            }

            //  Allow the this to jump if they are touching the ground.
            if (cursors.up.isDown && this.body.blocked.down)
            {
                this.body.velocity.y += -100;
            }
        },
        setup: function () {
            //  Player physics properties.
            this.body.bounce.y = 0.9;
            this.body.bounce.x = 0.9;
            this.body.gravity.y = 300;
            this.accelerator = 0;
            this.shape = 'round';
        },
        bouncing: function () {
            if ( (this.body.blocked.up && this.body.velocity.y > 10) ||
                 (this.body.blocked.down && this.body.velocity.y < -10) ||
                 (this.body.blocked.left && this.body.velocity.x > 10) ||
                 (this.body.blocked.right && this.body.velocity.x < -10) )
            sound.bang.play();
        }
    }
};

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
            this.blocked = true;
            game.time.events.add(Phaser.Timer.SECOND * .25, function() this.blocked = false, this);
        }
    },

    create: function() {
        //  A simple background for our game
        background.addToWorld();

        var map = game.add.tilemap(levels[cur_level]);
        map.addTilesetImage('wallTile', 'gameTiles');

        map.setCollisionBetween(1, 16, true, 'walls');

        //create layer
        this.walls = map.createLayer('walls');
        this.walls.resizeWorld();

        background.resize(game.world.width,game.world.height);
        var grd = background.context.createLinearGradient(game.world.width/2,0,game.world.width/2,game.world.height);
        grd.addColorStop(0, '#8ED6FF');
        grd.addColorStop(1, '#003BA2');

        background.cls();
        background.rect(0,0,game.world.width,game.world.height, grd);
        background.fill();

        // walls.debug = true;

        // Shifting stuff
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
        for(var dest in this.shifting)
        {
            this.shifting[dest].forEach(
                function(child) {
                    child.body.setSize(8,8,4,4);
                });
        }

        // exit
        this.exit = game.add.group();
        this.exit.enableBody = true;
        map.createFromObjects('objects', 17, 'objects', 16, true, false, this.exit);

        // Dangerous stuff

        this.killing = game.add.group();
        this.killing.enableBody = true;

        map.createFromObjects('objects', 25, 'objects', 24, true, false, this.killing);

        this.player_start_x = 32;
        this.player_start_y = game.world.height - 150;


        var obj = map.objects.objects;
        for(var i = 0 in obj)
        {
            if (obj[i].gid == 33)
            {
                this.player_start_x = obj[i].x;
                this.player_start_y = obj[i].y;
            }
        }

        this.player = game.add.sprite(this.player_start_x, this.player_start_y, 'rolling');

        // The player and its settings

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
    }
};
