const shapes = {
    square: {
        frame: 1,
        moving: function () {
            if (Math.abs(this.body.velocity.x)<square_speed/2)
                this.body.velocity.x = 0;
            if (Math.abs(this.body.velocity.y)<square_speed/2)
                this.body.velocity.y = 0;

            if(this.body.velocity.x == 0 && this.body.velocity.y == 0)
            {
                if(this.x % 16 < 2)
                    this.x += 1 - this.x % 16;
                if(this.y % 16 < 2)
                    this.y += 1 - this.y % 16;
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
            this.body.gravity.x = 0;
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
            this.body.gravity.x = 0;
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
    },

    star : {
        frame: 2,
        moving: function () {
            if (cursors.left.isDown)
            {
                this.animations.play('left');
                this.direction = -1;
            }
            else if (cursors.right.isDown)
            {
                this.animations.play('right');
                this.direction = 1;
            }

            var touching = false;

            var vx = 0;
            var vy = 0;
            var gx = 0;
            var gy = 0;

            if (map.getTileWorldXY((this.left+this.right)/2,
                                   this.bottom+3))
            {
                // console.log('down');
                touching = true;
                vx += star_speed * this.direction;
                vy += 0  * this.direction;
                gx += 0;
                gy += 300;
            }
            if (map.getTileWorldXY(this.left-3,
                                   (this.top+this.bottom)/2))
            {
                // console.log('left');
                touching = true;
                vx += 0 * this.direction;
                vy += star_speed  * this.direction;
                gx += -300;
                gy += 0;
            }
            if (map.getTileWorldXY((this.left+this.right)/2,
                                   this.top-3))
            {
                // console.log('up');
                touching = true;
                vx += -star_speed * this.direction;
                vy += 0  * this.direction;
                gx += 0;
                gy += -300;
            }
            if (map.getTileWorldXY(this.right+3,
                                   (this.top+this.bottom)/2))
            {
                // console.log('right');
                touching = true;
                vx += 0  * this.direction;
                vy += -star_speed * this.direction;
                gx += 300;
                gy += 0;
            }

            if (!touching)
            {
                if (map.getTileWorldXY(this.left-3,
                                       this.bottom+3))
                {
                    // console.log('down left');
                    touching = true;
                    vx += Math.SQRT1_2 * star_speed * this.direction;
                    vy += Math.SQRT1_2 * star_speed * this.direction;
                    gx += - Math.SQRT1_2 * 300;
                    gy += Math.SQRT1_2 * 300;
                }
                if (map.getTileWorldXY(this.right+3,
                                       this.bottom+3))
                {
                    // console.log('down right', this.direction);
                    touching = true;
                    vx += Math.SQRT1_2 * star_speed * this.direction;
                    vy += - Math.SQRT1_2 * star_speed * this.direction;
                    gx += Math.SQRT1_2 * 300;
                    gy += Math.SQRT1_2 * 300;
                }
                if (map.getTileWorldXY(this.left-3,
                                       this.top-3))
                {
                    // console.log('top left');
                    touching = true;
                    vx += - Math.SQRT1_2 * star_speed * this.direction;
                    vy += Math.SQRT1_2 * star_speed * this.direction;
                    gx += - Math.SQRT1_2 * 300;
                    gy += - Math.SQRT1_2 * 300;
                }
                if (map.getTileWorldXY(this.right+3,
                                       this.top-3))
                {
                    // console.log('top right');
                    touching = true;
                    vx += - Math.SQRT1_2 * star_speed * this.direction;
                    vy += - Math.SQRT1_2 * star_speed * this.direction;
                    gx += Math.SQRT1_2 * 300;
                    gy += - Math.SQRT1_2 * 300;
                }
            }

            if (touching)
            {
                this.body.velocity.x = vx;
                this.body.velocity.y = vy;
                this.body.gravity.x = gx;
                this.body.gravity.y = gy;
            }

            if (cursors.up.isDown && touching)
            {
                this.body.velocity.x += Math.sign(this.body.gravity.x) * -150;
                this.body.velocity.y += Math.sign(this.body.gravity.y) * -150;
            }
        },
        setup: function () {
            //  Player physics properties.
            this.body.bounce.y = 0;
            this.body.bounce.x = 0;
            this.body.gravity.y = 0;
            this.body.gravity.y = 300;
            this.shape = 'star';
        },
        bouncing: function () {
        }
    }
};
