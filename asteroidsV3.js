var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            fps: 60,
            gravity: { y: 0 },
            debug: true //debugging
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;
var cursors;
var text;

var bullets;
var lastFired = 0;
var speed;
var stats;


var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/images/ships/ship_blue_right.png');
    this.load.image('bullet', 'assets/games/sfx/bullets.png');
}

function create ()
{
    // var Bullet = new Phaser.Class({

    //     Extends: Phaser.GameObjects.Image,
  
    //     initialize:
  
    //     function Bullet (scene)
    //     {
    //         Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
  
    //         this.speed = Phaser.Math.GetSpeed(400, 1);
    //     },
  
    //     fire: function (x, y)
    //     {
    //         this.setPosition(x, y - 50);
  
    //         this.setActive(true);
    //         this.setVisible(true);
    //     },
  
    //     update: function (time, delta)
    //     {
    //         this.y -= this.speed * delta;
  
    //         if (this.y < -50)
    //         {
    //             this.setActive(false);
    //             this.setVisible(false);
    //         }
    //     }
  
    // });
  
    // bullets = this.add.group({
    //     classType: Bullet,
    //     maxSize: 10,
    //     runChildUpdate: true
    // });

    // bullets = this.add.group({
    //     classType: Bullet,
    //     maxSize: 10,
    //     runChildUpdate: true
    // });

    bullets = this.physics.add.group();


    sprite = this.physics.add.image(400, 300, 'ship');

    sprite.setDamping(true);
    sprite.setDrag(0.99);
    sprite.setMaxVelocity(200);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
    
}

function update (time, delta)
{
    if (cursors.up.isDown)
    {
        this.physics.velocityFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    }
    else
    {
        sprite.setAcceleration(0);
    }

    if (cursors.left.isDown)
    {
        sprite.setAngularVelocity(-300);
    }
    else if (cursors.right.isDown)
    {
        sprite.setAngularVelocity(300);
    } 
    else
    {
        sprite.setAngularVelocity(0);
    }

    // You can shoot while moving
    if (cursors.space.isDown && time > lastFired)
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(ship.x, ship.y);

            lastFired = time + 50;
        }
    }

    text.setText('Speed: ' + sprite.body.speed);


    this.physics.world.wrap(sprite, 32);

    // bullets.forEachExists(screenWrap, this);
}

function fireBullet() {
    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = sprite.rotation;
            game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
        }
    }
}
