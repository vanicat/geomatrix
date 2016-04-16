/*
* @author             Rémi Vanicat <vanicat@debian.org>
* @copyright          2016 Rémi Vanicat
* @licence            {@link https://creativecommons.org/publicdomain/zero/1.0/deed.fr|CC0 1.0}
*/

var cursors;
const accel_go  = 10;
const square_speed = 200;

const shape = {
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
                if (cursors.right.isDown)
                {
                    this.body.velocity.x += +square_speed;
                }

                if (cursors.up.isDown)
                {
                    // up
                    this.body.velocity.y = -square_speed;
                }
                if (cursors.down.isDown)
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
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
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
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.accelerator = 0;
        }
    }
};

var playState = {
    shapeshift: function (form) {
        this.player.frame = form.frame;
        this.player.moving = form.moving;
        this.player.setup = form.setup;
        this.player.setup();
    },

    create: function() {
        //  A simple background for our game
        background.addToWorld();

        var map = game.add.tilemap('level1');
        map.addTilesetImage('wallTile', 'gameTiles');

        map.setCollisionBetween(1, 16, true, 'walls');

        //create layer
        this.walls = map.createLayer('walls');
        this.walls.resizeWorld();
        // walls.debug = true;

        // Shifting stuff
        this.shifting = game.add.group();
        this.shifting.enableBody = true;
        for(var i = 0; i < 7; i++)
        {
            map.createFromObjects('objects', 18 + i , 'objects', i, true, false, this.shifting);
        }

        // exit
        this.exit = game.add.group();
        this.exit.enableBody = true;
        map.createFromObjects('objects', 17, 'objects', 7, true, false, this.exit);

        // Dangerous stuff

        this.killing = game.add.group();
        this.killing.enableBody = true;

        map.createFromObjects('objects', 25, 'objects', 8, true, false, this.killing);

        // The player and its settings
        this.player = game.add.sprite(32, game.world.height - 150, 'rolling');

        //  We need to enable physics on the player
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        this.shapeshift(shape['round']);

        game.camera.follow(this.player); // Mmm...

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function() {
        //  Collide the player and the stars with the wall
        game.physics.arcade.collide(this.player, this.walls);

        if (game.physics.arcade.collide(this.player, this.killing))
        {
            game.state.start('play');
        }

        if (game.physics.arcade.overlap(this.player, this.exit))
        {
             game.state.start('menu');
        }

        if (game.physics.arcade.overlap(this.player, this.shifting))
        {
            this.shifting.forEach(function(x)
                                  {
                                      if (! x.body.touching.none)
                                      {
                                          this.shapeshift(shape[x.transform_to]);
                                      }
                                  }, this);
        }

        this.player.moving();
    }
};
