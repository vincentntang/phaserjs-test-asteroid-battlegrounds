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

// var bullets;
var lastFired = 0;
// var speed;
// var stats;


var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/images/ships/ship_blue_right.png');
    this.load.image('bullet', 'assets/images/sfx/bullets.png');
    this.load.image('asteroid', 'assets/images/asteroids/asteroid_brown.png');
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

    asteroids = this.physics.add.group();
    // scene = this;
    for(let i =0; i<3; i++){
        asteroids.create(100*i,100*i,'asteroid');
    }

    sprite = this.physics.add.image(400, 300, 'ship');


    sprite.setDamping(true);
    sprite.setDrag(0.99);
    sprite.setMaxVelocity(200);
    sprite.setSize(40,110,true);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    // Collider stuff
    this.physics.add.overlap(bullets, asteroids, explodeAsteroid, null, this);
    
}

function update (time)
{
    let spriteBoxX = 70 + 30 * Math.sin(sprite.rotation*2)
    let spriteBoxY = 70 + 30 * Math.cos(sprite.rotation*2)
    console.log(spriteBoxX,"spriteBoxX")
    // console.log(sprite.angle, "sprite Angle");
    if (cursors.up.isDown)
    {
        // console.log(this,"this??")
        this.physics.velocityFromRotation(sprite.rotation, 200, sprite.body.acceleration);
        // console.log("acce",sprite.body.acceleration)
        // this.physics.velocityFromRotation(0, 150, sprite.body.acceleration);
    }
    else
    {
        sprite.setAcceleration(0);
    }

    if (cursors.left.isDown)
    {
        sprite.setAngularVelocity(-300);
        sprite.setSize(spriteBoxX, spriteBoxY, true);
    }
    else if (cursors.right.isDown)
    {
        sprite.setAngularVelocity(300);
        sprite.setSize(spriteBoxX,spriteBoxY,true);
    } 
    else
    {
        sprite.setAngularVelocity(0);
    }

    // You can shoot while moving
    if (cursors.space.isDown && time>lastFired)
    {
        fireBullet(time);
        // var bullet = bullets.get();

        // if (bullet)
        // {
        //     bullet.fire(ship.x, ship.y);

        //     lastFired = time + 50;
        // }
    }

    text.setText('Speed: ' + sprite.body.speed);


    this.physics.world.wrap(sprite, 32);

    // bullets.forEachExists(screenWrap, this);
}

function fireBullet(time) {

    let bulletSpeed = 300;
    // let realAngle;
    
    // if (sprite.angle <0){
    //     realAngle = -sprite.angle
    // } else if (sprite.angle > 180) {
    //     realAngle = sprite.angle-180
    // }

    // console.log(realAngle,"relaAngle");
    // console.log(Math.cos(realAngle), "real angle")

    // console.log(realAngle,"realAngle");
    let bullet = bullets.create(sprite.x,sprite.y,'bullet');
    bullet.setVelocityX(bulletSpeed * Math.cos(sprite.rotation));
    bullet.setVelocityY(bulletSpeed * Math.sin(sprite.rotation));
    lastFired = time + 400;

    // scene.velocityFromRotation(0, 200, sprite.body.acceleration);


    // if (game.time.now > bulletTime)
    // {
    //     bullet = bullets.getFirstExists(false);

    //     if (bullet)
    //     {
    //         bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
    //         bullet.lifespan = 2000;
    //         bullet.rotation = sprite.rotation;
    //         game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
    //         bulletTime = game.time.now + 50;
    //     }
    // }
}

function explodeAsteroid (bullet, asteroid) {
    asteroid.disableBody(true,true);
    bullet.disableBody(true,true);
}