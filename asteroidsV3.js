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

// Make things globally available
var sprite;
var cursors;
var text;
var asteroids;
// var asteroidsHalf;

// var bullets;
var lastFired = 0;
// var speed;
// var stats;

// Debugger
let calls = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/images/ships/ship_blue_right.png');
    this.load.image('bullet', 'assets/images/sfx/bullets.png');
    this.load.image('asteroid', 'assets/images/asteroids/asteroid_brown.png');
    this.load.image('asteroid_half', 'assets/images/asteroids/asteroid_brown_0.5.png');
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

    asteroids = this.physics.add.group({
        key: 'asteroid',
        repeat: 0,
        setXY:{x:12, y:0, stepX:150},
    });
    asteroids.children.iterate(function (child) {
        child.setAngularVelocity(25);
    
    });
    // asteroids_half = this.physics.add.group();

    // scene = this;
    // for(let i =0; i<3; i++){
    //     asteroids.create(100*i,100*i,'asteroid');
    // }
    asteroids.children.iterate(function(child){
        child.setVelocityX(Phaser.Math.FloatBetween(0,100));
        child.setVelocityY(Phaser.Math.FloatBetween(0,100));
    })

    sprite = this.physics.add.image(400, 300, 'ship');


    sprite.setDamping(true);
    sprite.setDrag(0.99);
    sprite.setMaxVelocity(200);
    sprite.setSize(40,110,true);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    // Collider stuff
    this.physics.add.overlap(bullets, asteroids, explodeAsteroid, null, this);
    this.physics.add.overlap(asteroids, asteroids, explodeAsteroid, null, this);
    this.physics.add.overlap(sprite, asteroids, explodePlayer, null, this);

    // Asteroids half
    // this.physics.add.overlap(asteroids, asteroids_half, explodeAsteroidHalf, null, this);
    // this.physics.add.overlap(asteroids_half, asteroids_half, explodeAsteroidHalf, null, this);
    // this.physics.add.overlap(asteroids_half, asteroids_half, explodeAsteroidHalf, null, this);
}

function update (time)
{
    // Kept playing with values to get this down
    let spriteBoxX = 75 - 40 * Math.sin(1.57+sprite.rotation*2)  // 1.57 is pi/2
    let spriteBoxY = 75 + 40 * Math.cos(sprite.rotation*2)
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
    calls = calls++;
    if(calls > 10) return;
    
    // disable game if infinite callback
    asteroid.disableBody(true,true);

    // Sample is an asteroid in this case, explodedTimes is a property I made up
    if(asteroid.explodedTimes !== 1){
        for(let i = 1; i<4; i++){
            let sample = asteroids.create(asteroid.x+ 35*Math.cos(2.1*i),asteroid.y+35*Math.sin(2.1*i),'asteroid_half');
            console.log(sample,"sample")
            sample.setSize(50,50);
            sample.setVelocityX(100* Math.cos(2.1*i)) // app using 6.28 divide by 3 for 120degrees * i
            sample.setVelocityY(100* Math.sin(2.1*i))
            sample.explodedTimes = 1; // I just made myself a new key-value prop
            sample.setAngularVelocity(100);
        }
    }
    bullet.disableBody(true,true);

}
function explodePlayer (sprite, asteroid) {

    // for(let i = 1; i<4; i++){
    //     let sample = asteroids.create(asteroid.x+ 35*Math.cos(2.1*i),asteroid.y+35*Math.sin(2.1*i),'asteroid_half');
    //     console.log(sample,"sample")
    //     sample.setSize(50,50);
    //     sample.setVelocityX(100* Math.cos(2.1*i)) // app using 6.28 divide by 3 for 120degrees * i
    //     sample.setVelocityY(100* Math.sin(2.1*i))
    // }

    asteroid.disableBody(true,true);
    sprite.disableBody(true,true);
}