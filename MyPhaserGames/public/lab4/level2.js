class Level2 extends Phaser.Scene {

    

    constructor () {
        super("Level2");
    }
    preload ( ){
        this.load.spritesheet('players','assetsa/players.png',
                                        {frameWidth : 64 , frameHeight : 64} ) ;
        this.load.image('terrain_image','assetsa/terrain_atlas.png');
        this.load.tilemapTiledJSON('map2','map2.json');
        this.load.audio('victory', 'assetsa/victory.mp3');
    }
    init (data) {
        this.hpCount = data.hpCount;
        this.hpDisplay = data.hpDisplay;
    }

    
    create() {
        
        this.map2 = this.make.tilemap({key : 'map2'})
        this.tileset = this.map2.addTilesetImage('Terrain','terrain_image');


          this.floorLayer = this.map2.createLayer('Floor',this.tileset);
          this.worldLayer = this.map2.createLayer('World',this.tileset);
          this.worldLayer.setCollisionByProperty ( { collide :  true});
        
        this.worldLayer.setTileLocationCallback(42,1,3,3,
                () => {
                  this.scene.start("GameOver", { message :  "End Game,Complete" } );
                  this.sound_victory.stop();
                 
                }
            )

        this.players = this.physics.add.sprite(50,50,'players');
        this.sound.stopAll();
        this.sound_victory = this.sound.add('victory');
        this.sound_victory.play();
       
        
        //1600 *1600 pixels
       
        this.cameras.main.setBounds(0,0,1600,1600);
        this.cameras.main.startFollow(this.players);
        this.cameras.main.roundPixels = true;

        //ตรวจสอบการชนระหว่าง player กับ world layer ได้
        this.physics.add.collider(this.players,this.worldLayer);
     

        
    
        /* const debugGraphics = this.add.graphics().setAlpha(0.75);

        this.worldLayer.renderDebug( debugGraphics, {
            tileColor : null,
            collidingTileColor : new Phaser.Display.Color(243,134,48,255),
            faceColor : new Phaser.Display.Color (40,39,37,255)
        })*/
        this.hp_HUD = this.add.text(16,16,"HP:"+this.hpDisplay,{fontSize : '32px',fill:'#000000'});
        this.hp_HUD.setScrollFactor(0);

    }
     processInput (cursors){
         var speed_constant = 500;
         var speed_constant = 500;
        var x_speed_vector = 0;
        var y_speed_vector = 0;

        this.players.body.setVelocity(0);


        if(cursors.left.isDown) {x_speed_vector -=1;}
        if(cursors.right.isDown) {x_speed_vector +=1;}
       

            if(cursors.up.isDown)       {
            y_speed_vector -= 1; 
            if(!(cursors.left.isDown || cursors.right.isDown)) {
                this.players.anims.play('up_anim',true);
            }
        }
            if (cursors.down.isDown)  {
                y_speed_vector += 1;
                if(!(cursors.left.isDown || cursors.right.isDown)) {
                    this.players.anims.play('down_anim',true);
                }
            }
        if(x_speed_vector !=0 || y_speed_vector !=0){
            this.players.body.setVelocityX(x_speed_vector * speed_constant);
            this.players.body.setVelocityY(y_speed_vector * speed_constant);
        }
    
     }

     update (time,delta) {

        let cursors = this.input.keyboard.createCursorKeys();
        this.processInput(cursors);

     }

}