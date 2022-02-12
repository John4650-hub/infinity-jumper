class FirstScene extends Phaser.Scene {
  constructor() {
    super('starting')
  }
  create() {
    this.add.text(200,150,'simple instruction',{font:'48px Arial',color:'#ff00ff'}).setOrigin(0,0);
    this.add.text(50,300,'Move by moving your finger on\nthe screen or use keyboard keys\n **Click to start**',{font:'48px Arial',color:'#ff0000'});
    this.input.on('pointerdown',()=>{
      this.scene.start('game-start');
    });
  }
  delayer(){
    
  }
}
