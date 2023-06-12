class Level1 extends Phaser.Scene {
     constructor(){
         super("Level1");
     }

preload(){
  this.load.tilemapTiledJSON('maps','maps.json');
  this.load.image('key','assets/key.png');
  this.load.image('terrain_image','assets/terrain_atlas.png');
  this.load.audio('soundsquid', 'assets/soundsquid.mp3');
  
  this.load.spritesheet('eyeball','assets/eyeball.png',
                        {frameWidth : 30, frameHeight :30 });
 this.load.spritesheet('player','assets/player.png',
 {frameWidth : 64 , frameHeight : 64, startFrame: 0, endFrame: 35 } );                  
}
        create(){
           
            //Initialize Game Value 

            this.keyCount =2 ;
            this.hpCount =100;
            this.hpDisplay = "*  *  *  *  * * * * * * *";

            this.deltaNoDamageTime = 0 ;

            this.maps = this.make.tilemap ( {key : 'maps'});
            this.tileset = this.maps.addTilesetImage('Terrain', 'terrain_image');
            this.floorLayer = this.maps.createLayer('Floor',this.tileset);
            this.worldLayer = this.maps.createLayer('World',this.tileset);
            this.worldLayer.setCollisionByProperty ( {collision : true} );

            this.sound_soundsquid = this.sound.add('soundsquid');
            this.sound_soundsquid.play({loop : true});

            this.worldLayer.setTileLocationCallback(29,12,3,3,
                () => {
                    
                    
                    
                    this.scene.start("Level2", {hpCount : this.hpCount,
                                                hpDisplay : this.hpDisplay });
                                              
                    

                                
                }
          
            )
            this.anims.create({
                key : 'down_anim',
                frames : this.anims.generateFrameNumbers('player', {start: 18, and: 27}),
                frameRate : 10, repeat:-1,
            });

            this.anims.create({
                key : 'left_anim',
                frames : this.anims.generateFrameNumbers('player', {start: 9, and: 18}),
                frameRate : 10, repeat:-1,
            });

            this.anims.create({
                key : 'right_anim',
                frames : this.anims.generateFrameNumbers('player', {start: 27, and: 35}),
                frameRate : 10, repeat:-1,
            });

            this.anims.create({
                key : 'up_anim',
                frames : this.anims.generateFrameNumbers('player', {start: 0, and: 8}),
                frameRate : 10, repeat:-1,
            });

        //Player Sprite Handler
        const spawnPoint = this.maps.findObject("ObjectsLayer", obj =>obj.name == "spawnPoint");
       this.player = this.physics.add.sprite(spawnPoint.x , spawnPoint.y,'player');

        this.cameras.main.setBounds(0,0,1600,1600);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true ;

        //Key Sprite Handler
        const keyPoint1 = this.maps.findObject("ObjectsLayer", obj => obj.name == "keyPoint1");
        const keyPoint2 = this.maps.findObject("ObjectsLayer", obj => obj.name == "keyPoint2");
        const keyPoint3 = this.maps.findObject("ObjectsLayer", obj => obj.name == "keyPoint3");
        const keyPoint4 = this.maps.findObject("ObjectsLayer", obj => obj.name == "keyPoint4");


       this.keyGroup = this.physics.add.staticGroup();

        this.keyGroup.create(keyPoint1.x,keyPoint1.y,'key');
        this.keyGroup.create(keyPoint2.x,keyPoint2.y,'key');
        this.keyGroup.create(keyPoint3.x,keyPoint3.y,'key');
        this.keyGroup.create(keyPoint4.x,keyPoint4.y,'key');

        this.physics.add.overlap(this.player,this.keyGroup, (b1,b2) => {

                this.keyCount--;
                if(this.keyCount==0){
                    console.log("All keys are collected");
                    this.maps.fill(119,26,12,1,3);
                }
                    b2.destroy();
        })
        
        //Monster Spritew Handler 
       
        const monsterPoint1 = this.maps.findObject("MonsterLayer",obj => obj.name =="monsterPoint1");
        const monsterPoint2 = this.maps.findObject("MonsterLayer",obj => obj.name =="monsterPoint2");
        const monsterPoint3 = this.maps.findObject("MonsterLayer",obj => obj.name =="monsterPoint3");
        const monsterPoint4 = this.maps.findObject("MonsterLayer",obj => obj.name =="monsterPoint4");
        const monsterPoint5 = this.maps.findObject("MonsterLayer",obj => obj.name =="monsterPoint5");
        const monsterPoint6 = this.maps.findObject("MonsterLayer",obj => obj.name =="monsterPoint6");
        



   
        
         
        this.monsterGroup = this.physics.add.group();
        this.monsterGroup.add(new Eyeball(this,monsterPoint1.x,monsterPoint1.y,this.player) );
        this.monsterGroup.add(new Eyeball(this,monsterPoint2.x,monsterPoint2.y,this.player) );
        this.monsterGroup.add(new Eyeball(this,monsterPoint3.x,monsterPoint3.y,this.player) ); 
        this.monsterGroup.add(new Eyeball(this,monsterPoint4.x,monsterPoint4.y,this.player) );
        this.monsterGroup.add(new Eyeball(this,monsterPoint5.x,monsterPoint5.y,this.player) ); 
        this.monsterGroup.add(new Eyeball(this,monsterPoint6.x,monsterPoint6.y,this.player) );  


        this.physics.add.collider(this.player,this.worldLayer);
        this.physics.add.collider(this.monsterGroup,this.worldLayer);


        this.physics.add.overlap(this.player,this.monsterGroup, (b1,b2)=> {
            if (this.deltaNoDamageTime >1000){
                this.hpCount--;
                this.hpDisplay="";
                
                
                for(let i=0;i<this.hpCount;i++){
                    this.hpDisplay +="*";

                }
                this.hp_HUD.setText("HP:"+this.hpDisplay);

                this.deltaNoDamageTime =0;
                if(this.hpCount ==0) {
                    this.scene.start("GameOver",{message : "You are dead"} );
                    this.sound.stopAll();
                }
            }
        });

        this.hp_HUD = this.add.text(16,16,"HP:"+this.hpDisplay,{fontSize : '32px',fill:'#000000'});
        this.hp_HUD.setScrollFactor(0);
    }
    processInput(cursors) {

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
       update(time , delta){
        let cursors = this.input.keyboard.createCursorKeys();
        this.processInput(cursors);
        this.deltaNoDamageTime += delta;
       }
    }