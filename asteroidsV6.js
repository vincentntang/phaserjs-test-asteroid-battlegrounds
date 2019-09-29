var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  // width: 800,
  // height: 600,
  width: 2400,
  height: 1800,
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
      gravity: { y: 0 },
      // debug: true, //debugging
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Make things globally available
var player;
var cursors;
var text;
var asteroids;
var lastFired = 0;
var hp = 2;

// var asteroidsHalf;
// var bullets;
// var speed;
// var stats;
// let calls = 0;

var game = new Phaser.Game(config);

/**
 * Component Created
 */
function preload() {
  this.load.image("ship", "assets/images/ships/ship_blue_right.png");
  // this.load.image("bullet", "assets/images/sfx/bullets.png");
  this.load.image("bullet", "assets/images/sfx/laser_bright.png");
  this.load.image("asteroid", "assets/images/asteroids/asteroid_brown.png");
  this.load.image(
    "asteroid_half",
    "assets/images/asteroids/asteroid_brown_0.5.png",
  );
  this.load.image('sky', 'assets/images/skies/background.jpg');
  // this.load.image('sky', 'assets/images/skies/deep-space.jpg');
  // this.load.image('sky', 'assets/images/skies/7000x4000.jpg');
  // this.load.image("sky", "assets/images/skies/5600x3100.jpg");

}

/**
 * ComponentDidMount
 */
function create() {
  this.add.image(400, 300, "sky");

  bullets = this.physics.add.group();

  asteroids = this.physics.add.group({
    key: "asteroid",
    repeat: 12,
    setXY: { x: 200, y: 200, stepX: 300, stepY: 300 },
  });

  asteroids.children.iterate(function(child) {
    child.setAngularVelocity(25);
    child.setVelocityX(Phaser.Math.FloatBetween(0, 100));
    child.setVelocityY(Phaser.Math.FloatBetween(0, 100));
  });

  player = this.physics.add.image(800, 1200, "ship");
  player.setDamping(true);
  player.setDrag(0.99);
  player.setMaxVelocity(200);
  player.setSize(40, 110, true);

  cursors = this.input.keyboard.createCursorKeys();

  text = this.add.text(10, 10, "", { font: "16px Courier", fill: "#00ff00" });

  // Collider stuff
  this.physics.add.overlap(bullets, asteroids, explodeAsteroid, null, this);
  this.physics.add.overlap(asteroids, asteroids, explodeAsteroid, null, this);
  this.physics.add.overlap(player, asteroids, explodePlayer, null, this);

  // Follow Player
  this.cameras.main.startFollow(player);
}

/**
 * ComponentDidUpdate
 */
function update(time) {
  // Calculates new playerbox changes
  let playerBoxX = 75 - 40 * Math.sin(1.57 + player.rotation * 2); // 1.57 is pi/2
  let playerBoxY = 75 + 40 * Math.cos(player.rotation * 2);

  console.log("hp", hp);

  if (cursors.up.isDown) {
    this.physics.velocityFromRotation(
      player.rotation,
      200,
      player.body.acceleration,
    );
  } else {
    player.setAcceleration(0);
  }

  if (cursors.left.isDown) {
    player.setAngularVelocity(-200);
    player.setSize(playerBoxX, playerBoxY, true);
  } else if (cursors.right.isDown) {
    player.setAngularVelocity(200);
    player.setSize(playerBoxX, playerBoxY, true);
  } else {
    player.setAngularVelocity(0);
  }

  // You can shoot while moving
  if (cursors.space.isDown && time > lastFired) {
    fireBullet(time);
  }

  text.setText("Speed: " + player.body.speed);

  this.physics.world.wrap(player, 32);
}

/**
 * Shoots bullet from ship
 */
function fireBullet(time) {
  let bulletSpeed = 300;

  let bullet = bullets.create(player.x, player.y, "bullet");
  bullet.setVelocityX(bulletSpeed * Math.cos(player.rotation));
  bullet.setVelocityY(bulletSpeed * Math.sin(player.rotation));
  lastFired = time + 550;
}

/**
 * Calculates most of hitbox scan
 */
function explodeAsteroid(bullet, asteroid) {
  //   calls = calls++;
  //   if (calls > 10) return;

  asteroid.disableBody(true, true);

  // Sample is an asteroid in this case, explodedTimes is a property I made up
  if (asteroid.explodedTimes !== 1) {
    for (let i = 1; i < 4; i++) {
      let sample = asteroids.create(
        asteroid.x + 35 * Math.cos(2.1 * i),
        asteroid.y + 35 * Math.sin(2.1 * i),
        "asteroid_half",
      );

      sample.setSize(50, 50);
      sample.setVelocityX(100 * Math.cos(2.1 * i)); // app using 6.28 divide by 3 for 120degrees * i
      sample.setVelocityY(100 * Math.sin(2.1 * i));
      sample.explodedTimes = 1; // I just made myself a new key-value prop
      sample.setAngularVelocity(100);
    }
  }
  bullet.disableBody(true, true);
}
/**
 * Blow up player
 */
function explodePlayer(player, asteroid) {
  asteroid.disableBody(true, true);
  player.disableBody(true, true);
}
