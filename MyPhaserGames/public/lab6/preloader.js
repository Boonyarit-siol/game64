class Preloader extends Phaser.Scene {

    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        this.facebook.once('startgame', this.startGame, this);
    
            this.load.spritesheet('pokemon', 'assets/pokemon.png',
            { frameWidth: 64 , frameHeight: 72, startFrame:0, endFrame:15 } );

          this.load.image('sky', 'assets/sky.png'); 

         this.load.image('block1', 'assets/block1.png');
         this.load.image('block2', 'assets/block2.png');
        this.load.image('block3', 'assets/block3.png');
        this.load.audio('forest', 'assets/forest.mp3');
        this.load.image("coin","assets/coin1.png");
        this.load.image("cactus","assets/cactus.png");

        this.load.image("pfront","assets/pfront.png");
        this.load.image("pmiddle","assets/pmiddle.png");
        this.load.image("pback","assets/pback.png");
        this.load.image("plight","assets/plight.png");

        this.facebook.showLoadProgress(this);

    }

    startGame ()
    {
        FBInstant.setLoadingProgress(100);
        this.scene.start('MainGame');
    }

}