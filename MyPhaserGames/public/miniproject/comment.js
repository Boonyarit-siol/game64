class Comment extends Phaser.Scene  {

    constructor() {
        super("Comment");

    }
    init(data){
        this.displayMessage = data.message;
    }

    
    create() {
        
        
        this.commentHUD = this.add.text(450,300,this.displayMessage,

                                    {fontSize : '60px',fill :'#778899'} );

         
         this.commentagianHUD = this.add.text(500,50,'Instructions for Playing ' ,

                                    {fontSize : '20px',fill :'#008080'} );

        this.commentagianHUD = this.add.text(350,100,'First Step : Find the key to unlock the next level.' ,

                                    {fontSize : '20px',fill :'#00FF00'} );  

          this.commentagianHUD = this.add.text(350,150,'Two Step : Notice the HP at the top left.' ,

                                    {fontSize : '20px',fill :'#40E0D0'} );       
                                    
          this.commentagianHUD = this.add.text(350,200,'Three Step : Watch out for monsters attacking you..' ,

                                    {fontSize : '20px',fill :'#00FF00'} );         
                                     
          this.commentagianHUD = this.add.text(350,250,'Four Step : Watch out for monsters attacking you..' ,

                                    {fontSize : '20px',fill :'#40E0D0'} );  

         this.commentagianHUD = this.add.text(200,300,'Five Step : After collecting all the keys, notice the cat will open the exit to enter' ,

                                    {fontSize : '20px',fill :'#00FF00'} );    
                                    
        this.commentagianHUD = this.add.text(350,350,'Six Step :Find a way out. There is only one hole that can come out',

                                    {fontSize : '20px',fill :'#40E0D0'} );    

        this.commentagianHUD = this.add.text(350,400,'Tip milian :Notice the good path',

                                    {fontSize : '20px',fill :'#FF7F50'} );   

         this.commentagianHUD = this.add.text(350,450,'Tip Glass :Collect sugar and find a way out without a gatekeepe',
                             {fontSize : '20px',fill :'#FF7F50'} );   
        
                                    
        
                               
        
        this.playagainHUD = this.add.text(580,600,'Start Game ',

                                        {fontSize : '20px',fill :'#00FF7F'} );


        
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