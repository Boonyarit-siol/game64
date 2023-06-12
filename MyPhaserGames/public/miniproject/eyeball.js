class Eyeball extends Phaser.Physics.Arcade.Sprite {

    
    constructor (scene, x ,y ,target){
      super(scene, x, y ,"eyeball");
      scene.add.existing(this);
      scene.physics.add.existing(this);

          this.target = target;
          this.radius = 500;

          scene.events.on(Phaser.Scenes.Events.UPDATE,this.processMovement,this);
          scene.anims.create({
              key : "eyeball_walk",
              frames : scene.anims.generateFrameNumbers("eyeball",{start: 3,end:5 }),
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
                      this.play("eyeball_walk",true)

                  }else{
                      this.body.setVelocity(0);
                      this.stop();
                  }



      }





}