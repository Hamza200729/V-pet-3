var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

var bedRoomImg , gardenImg , washRoomImg;

function preload(){

sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/happy dog.png");
bedRoomImg = loadImage("images/Bed Room.png");
gardenImg = loadImage("images/Garden.png");
washRoomImg = loadImage("images/Wash Room.png");

}


function setup() {
  database=firebase.database();

  readState = database.ref('gameState');
  readState.on("value" , function(data){
    gameState = data.val();
  });


  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

   currentTime = hour();
   if (currentTime==(lastFed+1)){
     update("playing");
     foodObj.gardenImg();
   }
   else if(currentTime==(lastFed+2)){
     update("sleeping");
     foodObj.bedRoomImg();
   }
   else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
     update("Bathing");
     foodObj.washRoomImg();
   }
   else{
     update("Hungry")
     foodObj.display();
   }

 
  drawSprites();
}


function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}