class Level1 extends Phaser.Scene {
     constructor(){
         super("Level1");
     }

preload(){
  this.load.tilemapTiledJSON('map1','map1.json');
  this.load.image('key','assetsa/keyRed.png');
  this.load.image('terrain_image','assetsa/terrain_atlas.png');
  this.load.audio('opensa', 'assetsa/opensa.mp3');
  this.load.audio('battle', 'assetsa/battle.mp3');
  this.load.spritesheet('slime','assetsa/slime.png',
                        {frameWidth : 72, frameHeight :72 });
 this.load.spritesheet('players','assetsa/players.png',
                        {frameWidth : 64, frameHeight :64 });                      
}
        create(){
           
            //Initialize Game Value 

            this.keyCount =2 ;
            this.hpCount =5;
            this.hpDisplay = "*  *  *  *  * *";

            this.deltaNoDamageTime = 0 ;

            this.map1 = this.make.tilemap ( {key : 'map1'});
            this.tileset = this.map1.addTilesetImage('Terrain', 'terrain_image');

            this.floorLayer = this.map1.createLayer('Floor',this.tileset);
            this.worldLayer = this.map1.createLayer('World',this.tileset);
            this.worldLayer.setCollisionByProperty ( {Collision : true} );

            this.sound_opensa = this.sound.add('opensa');
            this.sound_opensa.play({loop : true});
            
            this.worldLayer.setTileLocationCallback(18,33,3,3,
                () => {
                    
                    
                    
                    this.scene.start("Level2", {hpCount : this.hpCount,
                                                hpDisplay : this.hpDisplay });
                                              
                    

                                
                }
          
            )
            this.anims.create({
                key : 'down_anim',
                frames : this.anims.generateFrameNumbers('players', {start: 0, and: 3}),
                frameRate : 10, repeat:-1,
            });

            this.anims.create({
                key : 'left_anim',
                frames : this.anims.generateFrameNumbers('players', {start: 4, and: 7}),
                frameRate : 10, repeat:-1,
            });

            this.anims.create({
                key : 'right_anim',
                frames : this.anims.generateFrameNumbers('players', {start: 8, and: 11}),
                frameRate : 10, repeat:-1,
            });

            this.anims.create({
                key : 'up_anim',
                frames : this.anims.generateFrameNumbers('players', {start: 12, and: 15}),
                frameRate : 10, repeat:-1,
            });

        //Player Sprite Handler
        const spawnPoint = this.map1.findObject("ObjectsLayer", obj =>obj.name == "spawnPoint");
       this.players = this.physics.add.sprite(spawnPoint.x , spawnPoint.y,'players');

        this.cameras.main.setBounds(0,0,1600,1600);
        this.cameras.main.startFollow(this.players);
        this.cameras.main.roundPixels = true ;

        //Key Sprite Handler
        const keyPoint1 = this.map1.findObject("ObjectsLayer", obj => obj.name == "keyPoint1");
        const keyPoint2 = this.map1.findObject("ObjectsLayer", obj => obj.name == "keyPoint2");

       this.keyGroup = this.physics.add.staticGroup();

        this.keyGroup.create(keyPoint1.x,keyPoint1.y,'key');
        this.keyGroup.create(keyPoint2.x,keyPoint2.y,'key');

        this.physics.add.overlap(this.players,this.keyGroup, (b1,b2) => {

                this.keyCount--;
                if(this.keyCount==0){
                    console.log("All keys are collected");
                    this.map1.fill(119,19,30,3,3);
                }
                    b2.destroy();
        })
        
        //Monster Spritew Handler 
        const monsterPoint1 = this.map1.findObject("MonsterLayer",obj => obj.name =="monsterPoint1");
        const monsterPoint2 = this.map1.findObject("MonsterLayer",obj => obj.name =="monsterPoint2");
        const monsterPoint3 = this.map1.findObject("MonsterLayer",obj => obj.name =="monsterPoint3");
        const monsterPoint4 = this.map1.findObject("MonsterLayer",obj => obj.name =="monsterPoint4");



   
        
        this.monsterGroup = this.physics.add.group();
        this.monsterGroup.add(new Slime(this,monsterPoint1.x,monsterPoint1.y,this.players) );
        this.monsterGroup.add(new Slime(this,monsterPoint2.x,monsterPoint2.y,this.players) );
        this.monsterGroup.add(new Slime(this,monsterPoint3.x,monsterPoint3.y,this.players) ); 
        this.monsterGroup.add(new Slime(this,monsterPoint4.x,monsterPoint4.y,this.players) ); 

        this.physics.add.collider(this.players,this.worldLayer);
        this.physics.add.collider(this.monsterGroup,this.worldLayer);


        this.physics.add.overlap(this.players,this.monsterGroup, (b1,b2)=> {
            if (this.deltaNoDamageTime >1000){
                this.hpCount--;
                this.hpDisplay="";
                
                this.sound_battle = this.sound.add('battle');
                this.sound_battle.play({loop : true});
                this.sound_opensa.stop();
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
       update(time , delta){
        let cursors = this.input.keyboard.createCursorKeys();
        this.processInput(cursors);
        this.deltaNoDamageTime += delta;
       }
    }