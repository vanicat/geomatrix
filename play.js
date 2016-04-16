/*
* @author             Rémi Vanicat <vanicat@debian.org>
* @copyright          2016 Rémi Vanicat
* @licence            {@link https://creativecommons.org/publicdomain/zero/1.0/deed.fr|CC0 1.0}
*/


var player;
var wall;
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
        player.body.collideWorldBounds = true;
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
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y += -100;
        }
    },
    setup: function () {
        //  Player physics properties.
        player.body.bounce.y = 0.9;
        player.body.bounce.x = 0.9;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
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

        //  The wall group contain ground and wall
        wall = game.add.group();
        wall.enableBody = true;     // For physics

        // Here we create the ground.
        var ground = wall.create(0, game.world.height - 64, 'ground');

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        var ledge = wall.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = wall.create(-150, 250, 'ground');
        ledge.body.immovable = true;


        // Dangerous stuff
        killing = game.add.group();
        killing.enableBody = true;

        // The bottom fire: it will kill you
        //  TODO: it doesn't
        fire = game.add.tileSprite(0,game.world.height-32,game.world.width,game.world.height,'fire');
        killing.add(fire);
        fire.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'rolling');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        shapeshift(square);

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function() {

        //  Collide the player and the stars with the wall
        game.physics.arcade.collide(player, wall);

        if (game.physics.arcade.collide(player, killing))
        {
            argg();                 // TODO: something...
        }

        player.moving();
    }
};
