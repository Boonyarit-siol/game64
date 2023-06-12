class GameOver extends Phaser.Scene  {

    constructor() {
        super("GameOver");

    }
    init(data){
        this.displayMessage = data.message;
    }

    create() {
        
        this.gameoverHUD = this.add.text(450,300,this.displayMessage,

                                    {fontSize : '60px',fill :'#FF0000'} );

        this.playagainHUD = this.add.text(580,400,'Click here',

                                        {fontSize : '20px',fill :'#00FFFF'} );

        
        this.playagainHUD .setInteractive();
        
        this.playagainHUD.on('pointerover', () => {

            this.playagainHUD.setStyle({fill : "#FF0000"} );
        });

        this.playagainHUD.on('pointerout', () => {

            this.playagainHUD.setStyle({fill : "#FF0000"} );
       });

        this.playagainHUD.on('pointerdown', () => {

           this.scene.start('Level1');
        });
       

    }
}