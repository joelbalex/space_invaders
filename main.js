//boards
let tileSize= 32;
let rows = 16;
let coloumns=16;

let board;
let boardWidth = tileSize*coloumns; //32*16
let boardHeight = tileSize*rows; //32*16
let context;

//ship
let shipWidth=tileSize*2;
let shipHeight= tileSize;
let shipX = tileSize * coloumns/2 - tileSize;
let shipY= tileSize * rows - tileSize*2;


let ship={
    x:shipX,
    y:shipY,
    width:shipWidth,
    height:shipHeight
}

let shipImg;
let shipVelocityX =tileSize; //ship moving speed

//aliens
let alienArray=[];
let alienWidth =tileSize*2;
let alienHeight=tileSize;
let alienX=tileSize;
let alienY = tileSize;
let alienImg;


let alienRows=2;
let alienColumns=3;
let alienCount=0 //number of aliens to defeat
let alienVelocityX =1; //alien movinng speed

//bullets
let bulletArray=[];
let bulletVelocityY= -10; //bullet moving speed

let score=0;
let gameOver=false;

window.onload=function(){
    board=document.getElementById('board');
    board.width=boardWidth;
    board.height=boardHeight;
    context=board.getContext('2d') //used for drawing on the board


//draw initial ship
// context.fillStyle='green';
// context.fillRect(ship.x, ship.y, ship.width, ship.height);

//load images
shipImg= new Image();
shipImg.src= './ship.png';
shipImg.onload= function() {
    context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);
}
requestAnimationFrame(update);
document.addEventListener('keydown',moveShip);
document.addEventListener('keyup',shoot)

}

alienImg= new Image();
alienImg.src='./alien.png';
createAliens();


function update(){
requestAnimationFrame(update);

if(gameOver){
    return;
}

context.clearRect(0,0,boardWidth,boardHeight);

//ship
context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);

//aliens
for(let i=0;i<alienArray.length;i++){
    let alien=alienArray[i];
    if(alien.alive){
        alien.x+=alienVelocityX;

        //if alien touches the borders
        if(alien.x + alien.width>=boardWidth || alien.x<=0){
            alienVelocityX*=-1
            alien.x +=alienVelocityX*2 //to put aliens in sync

            //to move aliens up by one row
            for(let j=0;j<alienArray.length;j++){
                alienArray[j].y +=alienHeight;
            }
        }
        context.drawImage(alienImg,alien.x,alien.y,alien.width,alien.height);

        if(alien.y>=ship.y){
            gameOver=true;
        }
    }
} 

//bullets
for(let i=0;i<bulletArray.length;i++){
    let bullet=bulletArray[i];
    bullet.y+=bulletVelocityY;
    context.fillStyle ='white';
    context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height)

    //bullet collision with aliens
    for(let j=0;j<alienArray.length;j++){
        let alien=alienArray[j];
        if(!bullet.used && alien.alive && detectCollision(bullet,alien)){
            bullet.used=true;
            alien.alive=false;
            alienCount--;
            score+=100;
        }

    }
  }

  //clear bullets
  while(bulletArray.length>0 && (bulletArray[0].used || bulletArray[0].y<0)){
    bulletArray.shift();  //removes the first element of the array
  }

  //next level
  if(alienCount==0){
    // increase the number of aliens in rows and coloumns by 1
    alienColumns=Math.min(alienColumns + 1, coloumns/2 -2); //cap at 16/2 -2 =6
    alienRows =Math.min(alienRows + 1, rows-4)  //cap at 16-4=12
    alienVelocityX += 0.2; //increase alien movement speed
    alienArray=[];
    bulletArray=[];
    createAliens(); 
  }

  //score
  context.fillStyle='white';
  context.font='16px courier';
  context.fillText(score,5,20)
}


function moveShip(e){
    if(gameOver){
        return;
    }

    if(e.code=='ArrowLeft' && ship.x-shipVelocityX>=0){  // 0 is  the x coordinate of left axis
        ship.x -= shipVelocityX; //move left one title
    }else if(e.code=='ArrowRight' && ship.x+shipVelocityX+shipWidth<=boardWidth){
        ship.x += shipVelocityX; //move right one tile
    }
}

function createAliens(){
    for(let c=0;c<alienColumns;c++){
        for(let r=0;r<alienRows;r++){
            let alien ={
                img:alienImg,
                x: alienX + c*alienWidth,
                y: alienY + r*alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount=alienArray.length;
}

function shoot(e){
    if(gameOver){
        return;
    }

    if(e.code=='Space'){
        //shoot
        let bullet ={
            x: ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false 
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a,b){
    return a.x<b.x + b.width &&  //
           a.x + a.width>b.x && 
           a.y<b.y + b.height &&
           a.y+a.height > b.y;
}