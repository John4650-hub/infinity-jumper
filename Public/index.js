class MainScene extends Phaser.Scene {
  constructor(player, platforms, carrots) {
    super('game-start');

    this.player = player;
    this.platforms = platforms;
    this.carrotsCollected = 0;
    this.carrotsCollectedText;
    this.carrots;
    this.highestScore = this.carrotCollected;
    this.scores = [0];

  }
  init() {
    this.carrotsCollected = 0;
  }
  preload() {
    this.load.setPath('assets/')
    this.load.image('bg', 'bg_layer1.png');
    this.load.image('carrot', 'carrots.png');
    this.load.image('bunny-jump', 'bunny1_jump.png');
    this.load.image('bny1stand', 'bunny1_stand.png');
    this.load.image('platform', 'ground_grass.png');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.load.spritesheet('fullscreen', 'fullscreen.png', { frameWidth: 64, frameHeight: 64 });
    this.load.audio('jump', 'phaseJump1.ogg');
  }
  create() {
    this.add.image(240, 320, 'bg').setScrollFactor(1, 0);

    this.platforms = this.physics.add.staticGroup()
    for (let i = 0; i < 4; ++i) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;
      const platform = this.platforms.create(x, y, 'platform');
      platform.set = 0.5;
      const body = platform.body;
      body.updateFromGameObject();
    }
    this.player = this.physics.add.sprite(240, 320, 'bny1stand').setScale(0.5);
    this.physics.add.collider(this.player, this.platforms);
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.right = true;
    this.player.body.checkCollision.left = true;
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);
    this.carrots = this.physics.add.group({
      classType: Carrot
    });
    this.carrots.get(240, 320, 'carrot');
    this.physics.add.collider(this.carrots, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this
    );
    const style = { color: '#000000', fontSize: 24 };
    this.carrotsCollectedText = this.add.text(400, 10, 'carrots: 0', style).setScrollFactor(0).setOrigin(0.5, 0);


    let button = this.add.image(800, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive().setScrollFactor(0);
    button.on('pointerup', function() {

      if (this.scale.isFullscreen)
      {
        button.setFrame(0);

        this.scale.stopFullscreen();
      }
      else
      {
        button.setFrame(1);

        this.scale.startFullscreen();
      }

    }, this);


    this.input.on('pointermove', (pointer) => {
      this.player.x = pointer.x - 150;

    });
    // this.physics.world.setBounds(100,500,100,100);
    this.physics.world.checkCollision.left = true;
    this.physics.world.checkCollision.right = true;
    this.physics.add.collider(this.player, this);
    this.fScore = this.scores.sort(function(a, b) { return a - b });
    this.hScore = this.add.text(0, 10, `highest Score: ${this.fScore[this.fScore.length-1]}`, style).setScrollFactor(0).setOrigin(0, 0);


  }
  update(t, dt) {
    this.platforms.children.iterate(child => {
      const platform = child;
      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
        this.addCarrotAbove(platform)
      }
    });
    this.touchingDown = this.player.body.touching.down;

    if (this.touchingDown) {
      this.player.setVelocityY(-400);
      setTimeout(() => { this.player.setTexture('bunny-jump'); }, 2000)


      this.sound.play('jump')
    }
    if (!(this.touchingDown)) {
      setTimeout(() => { this.player.setTexture('bny1stand'); }, 3000)
    }
    if (this.cursors.left.isDown && !this.touchingDown) {
      this.player.setVelocityX(-200);
    }
    else if (this.cursors.right.isDown && !touchingDown) { this.player.setVelocityX(200); }
    else {
      this.player.setVelocityX(0);

    }
    this.horizontalWrap(this.player);
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 600) {
      this.scores.push(this.carrotsCollected);

      this.scene.start('game-over');
    }

  }
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;

    }
    else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;

    }

  }
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, 'carrot');
    carrot.setActive(true);
    carrot.setVisible(true);
    this.add.existing(carrot);
    carrot.body.setSize(carrot.width, carrot.height);
    this.physics.world.enable(carrot);
    return carrot;
  }
  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot);
    this.physics.world.disableBody(carrot.body);
    this.carrotsCollected++;
    const value = `Carrots: ${this.carrotsCollected}`;
    this.carrotsCollectedText.text = value;

  }
  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];
    for (let i = 0; i < platforms.length; ++i) {
      const platform = platforms[i];
      if (platform.y < bottomPlatform) {
        continue;
      }
      bottomPlatform = platform;
    }
    return bottomPlatform;
  }

}
let config = {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: [Loading,FirstScene, MainScene, GameOver]
}
let g = new Phaser.Game(config);