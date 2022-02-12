class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }
  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.endMessage = this.add.text(150, 300, 'Game-over', { fontSize: 48 }).setOrigin(0,0);
    this.endMessage.text = 'click on the screen\nto restart or \n press SPACE ';
    this.input.on('pointerdown',()=>{
      this.scene.start('game-start');
    });
    this.input.keyboard.once('keydown-SPACE', () => { this.scene.start('game-start') });
  }
  
}