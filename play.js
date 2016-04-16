/*
* @author             Rémi Vanicat <vanicat@debian.org>
* @copyright          2016 Rémi Vanicat
* @licence            {@link https://creativecommons.org/publicdomain/zero/1.0/deed.fr|CC0 1.0}
*/


var player;
var walls;
var shifting;
var exit;
var map;
var killing;
var fire;
var cursors;
var accelerator = 0;
const accel_go  = 10;
const square_speed = 200;

const square = {
    frame: 1,
    moving: function () {
        if (! player.body.touching.none)
        {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
        }
        if(player.body.velocity.x == 0 && player.body.velocity.y == 0)
        {
            if (cursors.left.isDown)
            {
                //  Move to the left
                player.body.velocity.x = -square_speed;
            }
            if (cursors.right.isDown)
            {
                player.body.velocity.x += +square_speed;
            }

            if (cursors.up.isDown)
            {
                // up
                player.body.velocity.y = -square_speed;
            }
            if (cursors.down.isDown)
            {
                player.body.velocity.y += +square_speed;
            }
        }
    },
    setup: function () {
        //  Player physics properties.
        player.body.bounce.y = 0;
        player.body.bounce.x = 0;
        player.body.gravity.y = 0;
    }
};

const round = {
    frame: 0,
    moving: function () {
        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x += -1;
            if (accelerator > 0) accelerator = 0;
            else if (accelerator < -accel_go)
                player.body.velocity.x += -5;
            else accelerator--;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x += 1;
            if (accelerator < 0) accelerator = 0;
            else if (accelerator > -accel_go)
                player.body.velocity.x += 5;
            else accelerator++;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.blocked.down)
        {
            player.body.velocity.y += -100;
        }
    },
    setup: function () {
        //  Player physics properties.
        player.body.bounce.y = 0.9;
        player.body.bounce.x = 0.9;
        player.body.gravity.y = 300;
    }
};

function shapeshift(form) {
    player.frame = form.frame;
    player.moving = form.moving;
    form.setup();
}

var playState = {
    create: function() {
        //  A simple background for our game
        background.addToWorld();

        map = game.add.tilemap('level1');
        map.addTilesetImage('wallTile', 'gameTiles');

        map.setCollisionBetween(1, 16, true, 'walls');

        //create layer
        walls = map.createLayer('walls');
        walls.resizeWorld();
        // walls.debug = true;

        // Shifting stuff
        shifting = game.add.group();
        for(var i = 0; i < 7; i++)
        {
            map.createFromObjects('objects', 18 + i , 'objects', i, true, false, shifting);
        }

        // exit
        exit = game.add.group();
        exit.enableBody = true;
        map.createFromObjects('objects', 17, 'objects', 7, true, false, exit);

        // Dangerous stuff

        killing = game.add.group();
        killing.enableBody = true;

        map.createFromObjects('objects', 25, 'objects', 8, true, false, exit);

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'rolling');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        shapeshift(round);

        game.camera.follow(player); // Mmm...

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function() {
        //  Collide the player and the stars with the wall
        game.physics.arcade.collide(player, walls);

        if (game.physics.arcade.collide(player, killing))
        {
            game.state.start('menu');
        }

        if (game.physics.arcade.overlap(player, exit))
        {
            game.state.start('menu');
        }

        player.moving();
    }
};
