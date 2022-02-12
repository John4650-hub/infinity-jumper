class Loading extends Phaser.Scene {
  constructor() {
    super('loading')
  }
  preload() {
    this.load.setPath('./Loggo/')
    this.load.image('bgloading', 'phaser3-logo.png')
  }
  create() {
    this.add.text(250, 100, 'Powered\n     by', { font: '62px Arial', color: '#ff00ff' })
    this.add.image(200, 300, 'bgloading').setOrigin(0, 0)
    setTimeout(()=>{this.scene.start('starting');},3000)
  }
}