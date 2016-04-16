/*
* @author             Rémi Vanicat <vanicat@debian.org>
* @copyright          2016 Rémi Vanicat
* @licence            {@link https://creativecommons.org/publicdomain/zero/1.0/deed.fr|CC0 1.0}
*/

function preload() {

    game.load.image('ground', 'assets/platform.png');
    game.load.image('rolling', 'assets/rolling.png');
    game.load.image('fire', 'assets/fire.png');

}

var player;
var round, square;
var wall;
var cursors;
var background;
var accelerator = 0;
const accel_go  = 10;

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    // TODO: maybe use another mode...
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    background = game.make.bitmapData(800, 600);
    background.addToWorld();
    var grd = background.context.createLinearGradient(400,0,400,600);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#003BA2');

    background.cls();
    background.rect(0,0,800,600, grd);
    background.fill();

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

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'rolling');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.9;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    //  Collide the player and the stars with the wall
    game.physics.arcade.collide(player, wall);

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

}
