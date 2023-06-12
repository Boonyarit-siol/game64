class MainGame extends Phaser.Scene {
    
    constructor() {
        super("MainGame");
    }
    
    preload() {
        
        this.load.spritesheet('pokemon', 'assets/pokemon.png',
                            { frameWidth: 64 , frameHeight: 72, startFrame:0, endFrame:15 } );

        this.load.image('sky', 'assets/sky.png'); 

        this.load.image('block1', 'assets/block1.png');
        this.load.image('block2', 'assets/block2.png');
        this.load.image('block3', 'assets/block3.png');
        this.load.audio('forest', 'assets/forest.mp3');

      
        
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
        platform.body.setVelocityX(-300);
        platform.body.setImmovable(true);
        this.platformGroup.add(platform);
    }

    create() {

        this.anims.create({
            key : 'right_anims',
            frames: this.anims.generateFrameNumbers('pokemon', { start: 8, end: 11 }),
            frameRate: 10, repeat: -1,
            
        });

        this.sound_forest = this.sound.add('forest');
        this.sound_forest.play({loop:true});
        
        //Smoothing
        this.cameras.main.roundPixels = true;

        this.add.image(640, 360, "sky");

        this.platformGroup = this.add.group();

        this.addPlatform(1000, 10,  600, 1);
        
        this.pokemon = this.physics.add.sprite(200, 500, 'pokemon');
        this.pokemon.setGravityY(800);

        this.pokemon.play('right_anims');
        this.physics.add.collider(this.pokemon, this.platformGroup);

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

        if (minDistance > Phaser.Math.Between(100, 500)) {
            let platformWidth = Phaser.Math.Between(100, 500);
            this.addPlatform(platformWidth, 1280, 600, Phaser.Math.Between(1, 3) ); 
        }
        
        }
    }
