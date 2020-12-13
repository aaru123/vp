
var dog, dogimg, dog_happyimg, database, foodStock, foodCount, feedButton, addButton, food ;
var fedTime, lastFed;

function preload() {
  dogimg = loadImage("images/dogImg.png");
  dog_happyimg = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  food = new Food();
  
  dog = createSprite(850, 200, 34, 34);
  dog.addImage(dogimg);
  dog.scale = 0.3;

  foodStock = database.ref('Food');
  foodStock.on('value', readStock);

  addButton = createButton("Add Food To Stock");
  addButton.position(700, 95);
  addButton.mousePressed(addFood);
  
  feedButton = createButton("Feed the Dog");
  feedButton.position(850, 95);
  feedButton.mousePressed(feedDog);
}


function draw() {  
  background(46, 139, 87);
  food.display();

  fedTime = database.ref('Feedtime');
  fedTime.on("value", function(data) {
    lastFed = data.val();
  })
  
  fill(255, 255, 255);
  textSize(15);
  if(lastFed >= 12) {
    text("Last Fed : " + lastFed%12 + " PM", 350, 30);
  }else if(lastFed === 0) {
    text("Last Fed : 12 AM", 350, 30);
  }else {
    text("Last Fed : " + lastFed + "AM", 350, 30);
  }
  stroke("black");
  fill("black");
  textSize(22);
  if (foodCount === 0) {
    dog.addImage(dogimg);
    text("Alert! No food in stock! Add food now, ", 250, 250);
    text("using the 'Add Food' button. ", 250, 280);
  }
  drawSprites();
  
}
function readStock(data) {
  foodCount = data.val();
  food.updateFoodStock(foodCount);
}


function feedDog () {
  if (foodCount !== 0) {
    dog.addImage(dog_happyimg);

  food.updateFoodStock(food.getFoodStock() -1);
  database.ref('/').update({
    Food: food.getFoodStock(),
    FeedTime: hour()
  })
  }
}
function addFood() {
  dog.addImage(dogimg);
  foodCount++;
  database.ref('/').update({
    Food:foodCount
  })
}




