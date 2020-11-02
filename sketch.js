var PLAY = 1;
var END = 0;
var gameState = PLAY;
var monkey , monkey_running;
var banana ,bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup,groundImage,invisibleGround,ground;
var survivalTime,score,restartImage,gameoverImage;
var jumpSound , checkPointSound, dieSound;


function preload(){
        monkey_running=loadAnimation("sprite_0.png","sprite_1.png",
 "sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png",   
 "sprite_6.png","sprite_7.png","sprite_8.png") ;
 
 bananaImage = loadImage("banana.png");
 obstacleImage = loadImage("obstacle.png");
  
 groundImage=loadImage("ground2.png");
 restartImage=loadImage("restart.png");
 gameoverImage=loadImage("gameOver.png");
 
  
 jumpSound = loadSound("jump.mp3")
 dieSound = loadSound("die.mp3")
 checkPointSound = loadSound("checkPoint.mp3")
 
}



function setup() {
  createCanvas(600,400);
  
   monkey=createSprite(80,315);
   monkey.addAnimation("running",monkey_running);
   monkey.scale=0.12;

   ground = createSprite(400,350,900,10);
   ground.addImage("ground",groundImage);
   ground.x = ground.width /2;
   ground.depth = monkey.depth;
   monkey.depth = monkey.depth + 1;
     
   gameover = createSprite(300,150);
   gameover.addImage(gameoverImage);
   gameover.scale = 0.5; 
   restart = createSprite(300,190);
   restart.addImage(restartImage);
   restart.scale = 0.5; 
  
   //create Obstacle and Cloud Groups
   FoodGroup = createGroup();
   obstacleGroup = createGroup();
  
   invisibleGround = createSprite(400,390,900,10);
   invisibleGround.visible = false;
  
  
   monkey.setCollider("rectangle",0,0,monkey.width,
                      monkey.height);
   
  
   survivalTime=0;
   score=0;
}


function draw() {
  
   background("lightblue");
   textSize=(20);
   stroke("black");
   fill("black");
   text("Survival Time: "+ survivalTime, 30,50);
   textSize=(20);
   stroke("black");
   fill("black");
   text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){

    gameover.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* survivalTime/100)
    //scoring
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    
    if(survivalTime>0 && survivalTime%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& monkey.y >= 250) {
        monkey.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8
  
    //spawn the bananas
    Banana();
  
    //spawn obstacles on the ground
    Obstacles();
    
    if(FoodGroup.isTouching(monkey)){
       FoodGroup.destroyEach();
       score=score+2;
    }
    
    if(obstacleGroup.isTouching(monkey)){
        //trex.velocityY = -12;        
        jumpSound.play();
        gameState = END;
        dieSound.play()
       
    }
  }
   else if (gameState === END) {
      gameover.visible = true;
      restart.visible = true;
          
      ground.velocityX = 0;
      monkey.velocityY = 0
      
      //set lifetime of the game objects so that they are never      destroyed
     obstacleGroup.setLifetimeEach(-1);
     FoodGroup.setLifetimeEach(-1);
     
     obstacleGroup.setVelocityXEach(0);
     FoodGroup.setVelocityXEach(0);
     //for restarting the game
     if(mousePressedOver(restart)) {
      reset();
     }
   }
  //for making the monkey collide with the invisible ground
   monkey.collide(invisibleGround);
        
 drawSprites();
}
//for resetting the game
function reset(){
  gameState=PLAY;
  gameover.visible=false;
  restart.visible=false;
  FoodGroup.destroyEach();
  obstacleGroup.destroyEach();
  monkey.changeAnimation("running",monkey_running);
  score=0;
  survivalTime=0;
}

//for making bananas
function Banana(){
  if(frameCount%100===0){
    banana=createSprite(400,200,20,20);
    banana.addImage(bananaImage);
    banana.y=Math.round(random(100,300));
    banana.velocityX=-5;
    //assign scale and lifetime to the banana  
    banana.setLifetime=50;
    banana.scale=0.1;
    //add each banana to the group
    FoodGroup.add(banana);                  
  }
}
//for presenting obstacles
function Obstacles(){
  if(frameCount % 80 === 0){
    var obstacle = createSprite(600,345,10,40);
    obstacle.velocityX = -(6 + score/100);
    obstacle.addImage(obstacleImage);
          //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
      //add each obstacle to the group
    obstacleGroup.add(obstacle);
    obstacle.setCollider("rectangle",0,0,450,300 );
  }
}
