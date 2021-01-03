var PLAY = 1;
var END = 0;
var gameState = PLAY;
var desert
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var cam;

//localStorage["HighestScore"] = 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
 // desert=loadImage("beautiful desert.jpg");
    desert=loadImage("desert.jpg")

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50,height-80,20,50);
  console.log(windowHeight)
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth*5/2,height-75,displayWidth*5+200,2);
  //ground = createSprite(0,height-75,width,2);
ground.shapeColor=rgb(242,199,116)
//  ground.addImage("ground",groundImage);
  //groundImage.width=7000
 // ground.x = ground.width /2;
 // ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
 
  score = 0;
}

function draw() {
  //trex.debug = true;
 // background(242,199,116);
    background("powderblue");

  //image(desert,0,0,width*5,2*height-400)//,windowWidth*4,windowHeight)
  image(desert, 0,0,displayWidth*5, displayHeight);
//  image(desert, 0,-displayHeight*4,displayWidth, displayHeight*5);
//console.log(displayWidth*5)
    text(mouseX+","+mouseY,mouseX,mouseY)

    drawSprites();

  //  camera.on(mouseX,200,2)
 
  text("Score: "+ score, trex.x+250,displayHeight/2-400);
  if (gameState===PLAY){

    score = score + Math.round(getFrameRate()/60);
   // ground.velocityX = -(6 + 3*score/100);
    
      trex.velocityX=(6 + 3*score/100);
    camera.position.x= trex.x;
   // console.log(desert.width)
  //  camera.position.y=displayHeight/2;
 //console.log(trex.x)
    if((keyDown("space") || touches.length>0) && trex.y >= height-159) {
      trex.velocityY = -12;
      touches=[];
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    // if (ground.x < 0){
    //   ground.x = ground.width/2;
    // }
  
    trex.collide(ground);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
    
    if(trex.x>7200){
      gameState=END
    }
  }
  else if (gameState === END) {
     ground.velocityX = 0;
    trex.setVelocity(0,0);
    gameOver.x=trex.x;
    gameOver.y=trex.y-200;
     restart.x=trex.x;
    restart.y=trex.y-150;
    console.log(trex.x)
    gameOver.visible = true;
    restart.visible = true;
    
    
    //set velcity of each game object to 0
   
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 40 === 0) {
   
    y = Math.round(random(height-400,height-500));
        x = Math.round(random(0,displayHeight));
 var cloud = createSprite(x,y,40,10);
    cloud.addImage(cloudImage);
    cloud.scale = 1.5;
  // cloud.velocityX = -6;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth*5/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 40 === 0) {
    var obstacle = createSprite(Math.round(random(0,displayWidth*5)),height-90,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
   // obstacle.x=
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime =displayWidth*5/6;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.x=50;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 /* if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }*/
 // console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}