class Level2 extends Phaser.Scene {

    

    constructor () {
        super("Level2");
    }
    preload ( ){
        this.load.spritesheet('player','assets/player.png',
                                        {frameWidth : 64 , frameHeight : 64} ) ;
        this.load.image('terrain_image','assets/terrain_atlas.png');
        this.load.tilemapTiledJSON('maps2','maps2.json');
        this.load.audio('echo', 'assets/echo.mp3');
    }
    init (data) {
        this.hpCount = data.hpCount;
        this.hpDisplay = data.hpDisplay;
    }

    
    create() {
        
        this.maps2 = this.make.tilemap({key : 'maps2'})
        this.tileset = this.maps2.addTilesetImage('Terrain','terrain_image');

          this.floorLayer = this.maps2.createLayer('Floor',this.tileset);
          this.worldLayer = this.maps2.createLayer('World',this.tileset);
          this.worldLayer.setCollisionByProperty ( { colliders :  true});

        this.worldLayer.setTileLocationCallback(26,25,3,3,
                () => {
                  this.scene.start("GameOver", { message :  "End Game,Complete" } );
                }
            )

        this.player = this.physics.add.sprite(50,50,'player');
        this.sound.stopAll();
        this.sound_echo = this.sound.add('echo');
        this.sound_echo.play({loop : true});
        
        //1600 *1600 pixels
        const spawnPoint1 = this.maps2.findObject("ObjectsLayer", obj =>obj.name == "spawnPoint");
        
        this.cameras.main.setBounds(0,0,1600,1600);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;

        //ตรวจสอบการชนระหว่าง player กับ world layer ได้
        this.physics.add.collider(this.player,this.worldLayer);
     

        
    
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

        this.player.body.setVelocity(0);


        if(cursors.left.isDown) {x_speed_vector -=1;}
        if(cursors.right.isDown) {x_speed_vector +=1;}
       

            if(cursors.up.isDown)       {
            y_speed_vector -= 1; 
            if(!(cursors.left.isDown || cursors.right.isDown)) {
                this.player.anims.play('up_anim',true);
            }
        }
            if (cursors.down.isDown)  {
                y_speed_vector += 1;
                if(!(cursors.left.isDown || cursors.right.isDown)) {
                    this.player.anims.play('down_anim',true);
                }
            }
        if(x_speed_vector !=0 || y_speed_vector !=0){
            this.player.body.setVelocityX(x_speed_vector * speed_constant);
            this.player.body.setVelocityY(y_speed_vector * speed_constant);
        }
    
     }

     update (time,delta) {

        let cursors = this.input.keyboard.createCursorKeys();
        this.processInput(cursors);

     }

}