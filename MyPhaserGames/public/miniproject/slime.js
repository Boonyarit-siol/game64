class Eyeball extends Phaser.Physics.Arcade.Sprite {

    
      constructor (scene, x ,y ,target){
        super(scene, x, y ,"slime");
        scene.add.existing(this);
        scene.physics.add.existing(this);

            this.target = target;
            this.radius = 200;

            scene.events.on(Phaser.Scenes.Events.UPDATE,this.processMovement,this);
            scene.anims.create({
                key : "slime_walk",
                frames : scene.anims.generateFrameNumbers("slime",{start: 0,end: 4}),
                frameRate : 10,
                repeat : -1
            });
    }
        processMovement(){
            if(this.body == null) return;  //Workaround for Phaser 3 Bug Physics Engine Loader
            if(Phaser.Math.Distance.BetweenPoints(
            
                    {x: this.x,  y:this.y},
                    {x: this.target.x,  y:this.target.y}) < this.radius) {
                        this.body.setVelocityX(this.target.x - this.x);
                        this.body.setVelocityY(this.target.y - this.y);
                        this.play("slime_walk",true)

                    }else{
                        this.body.setVelocity(0);
                        this.stop();
                    }



        }





}