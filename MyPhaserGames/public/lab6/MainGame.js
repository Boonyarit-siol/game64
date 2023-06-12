class MainGame extends Phaser.Scene {
    
    constructor() {
        super("MainGame");
    }
    
    preload() {
        
        this.load.image('sky', 'assets/sky.png'); 
        this.load.spritesheet('pokemon', 'assets/pokemon.png',
        { frameWidth: 64 , frameHeight: 72, startFrame:0, endFrame:15 } );
        this.load.image('block1', 'assets/block1.png');
        this.load.image('block2', 'assets/block2.png');
       this.load.image('block3', 'assets/block3.png');
       this.load.audio('forest', 'assets/forest.mp3');
       this.load.image("coin","assets/coin1.png");
       this.load.image("coins","assets/coin2.png");
       this.load.image("cactus","assets/cactus.png");

       this.load.image("pfront","assets/pfront.png");
       this.load.image("pmiddle","assets/pmiddle.png");
       this.load.image("pback","assets/pback.png");
       this.load.image("plight","assets/plight.png");
        
    }

    addPlatform(width, x, y, type) {

        let platform;
        if (type == 1) {
            platform = this.add.tileSprite(x+width/2, y, width, 32, "block1");
        }
        if (type == 2) {
            platform = this.add.tileSprite(x+width/2, y, width, 63, "block2");
        } 
        if (type == 3) {
            platform = this.add.tileSprite(x+width/2, y, width, 40, "block3");
        } 
       
       
        this.physics.add.existing(platform);
        platform.body.setVelocityX(-(300+ this.score));
        platform.body.setImmovable(true);
        this.platformGroup.add(platform);

        let coinChance = Phaser.Math.Between(0,100);
        let coinsChance = Phaser.Math.Between(0,100);
        if(coinChance < 40){
            let coin = this.add.sprite(x+20,y-100,"coin");
            this.physics.add.existing(coin);
            coin.body.setVelocityX(-(300+ this.score));
            this.coinGroup.add(coin);
            coin.setScale(0.5);
        }else if(coinChance < 50 ){
            let cactus = this.add.sprite(x+20,y-100,"cactus");
            this.physics.add.existing(cactus);
            cactus.body.setVelocityX(-(300+ this.score));
            this.cactusGroup.add(cactus);
            cactus.setScale(0.125);
        }else if(coinsChance < 40){
            let coins = this.add.sprite(x+20,y-100,"coins");
            this.physics.add.existing(coins);
            coins.body.setVelocityX(-(300+ this.score));
            this.coinsGroup.add(coins);
            coins.setScale(0.5);
        }
    }

    create() {
        this.score = 0;
        this.anims.create({
            key : 'right_anims',
            frames: this.anims.generateFrameNumbers('pokemon', { start: 8, end: 11 }),
            frameRate: 10, repeat: -1,
            
        });

        this.sound_forest = this.sound.add('forest');
        this.sound_forest.play({loop:true});
        
        //Smoothing
        this.cameras.main.roundPixels = true;

       // this.add.image(640, 360, "sky");
       this.bgBack = this.add.tileSprite(340,360,720,1280,'pback');
       this.bgBack.tileScaleX = 720/272;
       this.bgBack.tileScaleY = 1280/160;
       
       this.bgLight = this.add.tileSprite(340,360,720,1280,'plight');
       this.bgLight.tileScaleX = 720/272;
       this.bgLight.tileScaleY = 1280/160;

       this.bgMiddle = this.add.tileSprite(340,360,720,1280,'pmiddle');
       this.bgMiddle.tileScaleX = 720/272;
       this.bgMiddle.tileScaleY = 1280/160;

       this.bgFront = this.add.tileSprite(340,360,720,1280,'pfront');
       this.bgFront.tileScaleX = 720/272;
       this.bgFront.tileScaleY = 1280/160;
       


        this.platformGroup = this.add.group();
        this.coinGroup = this.add.group();
        this.coinsGroup = this.add.group();
        this.cactusGroup = this.add.group();


        this.addPlatform(1000, 10,  600, 1);
        
        this.pokemon = this.physics.add.sprite(200, 500, 'pokemon');
        this.pokemon.setGravityY(800);

        this.pokemon.play('right_anims');
        this.physics.add.collider(this.pokemon, this.platformGroup);

        this.physics.add.overlap(this.pokemon,this.coinGroup,(pokemon,coin) => {

            this.coinGroup.killAndHide(coin);
            this.coinGroup.remove(coin);
            this.score += 10;
        });
        this.physics.add.overlap(this.pokemon,this.coinsGroup,(pokemon,coins) => {

            this.coinsGroup.killAndHide(coins);
            this.coinsGroup.remove(coins);
            this.score += 10;
        });
        this.physics.add.overlap(this.pokemon,this.cactusGroup,(pokemon,cactus) => {

                this.scene.start("MainGame");
        });

        this.pokemonJump = 0;
        this.input.on("pointerdown", ()=> {
            if (this.pokemon.body.touching.down) {
                this.pokemonJump = 0
            }

            if (this.pokemonJump >= 0 && this.pokemonJump < 5) {
                this.pokemon.setVelocityY(-400);
                this.pokemonJump++;
            }
            
        });
        
    }


    update(time, delta) {
        this.pokemon.x = 200;

        if (this.pokemon.y > 720) {

            this.sound_forest.stop();
            this.sound.stopAll()
            this.scene.start("MainGame");

        }

        this.bgFront.tilePositionX +=0.1;
        this.bgMiddle.tilePositionX +=0.05;
        this.bgLight.tilePositionX +=0.0025;

        let minDistance = 1280;
              
        this.platformGroup.getChildren().forEach( (platform) => {
            let platformDistance = 1280 - platform.x - (platform.displayWidth / 2);
            minDistance = Math.min(minDistance, platformDistance);

            if (platform.x < - platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
                console.log("Kill");
            }

        });

        this.cactusGroup.getChildren().forEach((cactus) => {
            if(cactus.x < cactus.displayWidth/2){
                this.cactusGroup.killAndHide(cactus);
                this.cactusGroup.remove(cactus);
            }

    });

        this.coinGroup.getChildren().forEach((coin) => {
            if(coin.x < coin.displayWidth/2){
                this.coinGroup.killAndHide(coin);
                this.coinGroup.remove(coin);
            }

    });
        this.coinsGroup.getChildren().forEach((coins) => {
        if(coins.x < coins.displayWidth/2){
            this.coinsGroup.killAndHide(coins);
            this.coinsGroup.remove(coins);
        }

});
        if (minDistance > Phaser.Math.Between(100, 500)) {
            let platformWidth = Phaser.Math.Between(100, 500);
            this.addPlatform(platformWidth, 1280, 600, Phaser.Math.Between(1, 3) ); 
        }
        
        }
    }
