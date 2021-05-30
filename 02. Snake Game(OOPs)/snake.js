// initialize variables
function init() {
    canvas = document.getElementById('mycanvas');
    W = H = canvas.width = canvas.height = 1000;
    pen = canvas.getContext('2d');
    cell_size = 66;
    food = getrandomfood(); // food object at random position
    game_over = false;
    score = 0;

    //Create a Image Object for food
    food_img = new Image();
    food_img.src = "Assets/apple.png";

    //Create a Image Object for Score
    trophy = new Image();
    trophy.src = "Assets/trophy.png";

    snake = {
        init_len: 4,
        color: "blue",
        cells: [],
        direction: "right",
        
        createSnake: function(){
            for (var i = this.init_len; i>0; i--){
                this.cells.push({x:i, y:0}); //ple face fr body
            }
        },

        drawSnake: function(){
            for(var i=0; i<this.cells.length; i++){
                pen.fillStyle = this.color;
                               // 4*66                                                 width        height       
                pen.fillRect(this.cells[i].x*cell_size, this.cells[i].y*cell_size, cell_size-2, cell_size-2);
            }
        },

        // food eat = new food + score inc || move forward logic || out = game over
        updateSnake: function(){
            console.log("Updating Snake. ");

            var headX = this.cells[0].x;   //4
            var headY = this.cells[0].y;   //0

            // if snakes gets food -> get new food position + increase score + size increase(don't pop -> don't erase last position)
            if (headX == food.x && headY == food.y){
                food = getrandomfood();  
                score += 1;
            }
            else{
                this.cells.pop(); // pop from back so that at next step cell is pushed so that size remains same
            }
            
            // popped cell 
            //    now
            // pushing cell 
            var nextX, nextY;

            if (snake.direction == 'right'){
                nextX = headX + 1;
                nextY = headY;
            }
            else if (snake.direction == 'left'){
                nextX = headX - 1;
                nextY = headY;
            }
            else if (snake.direction == 'down'){
                nextX = headX;
                nextY = headY + 1;
            }
            else{
                nextX = headX;
                nextY = headY - 1;
            }

            // adds a cell at front
            this.cells.unshift({x:nextX, y:nextY});

            /* Logic that prevents snake from going out*/
            var lastX = Math.round(W/cell_size);
            var lastY = Math.round(H/cell_size);

            if (this.cells[0].x > lastX || this.cells[0].y > lastY || 
                this.cells[0].x < 0 || this.cells[0].y < 0){
                game_over = true;
            }
        }
    };

    // snake array 
    snake.createSnake();
    //Add a Event Listener on the Document Object
    function keyPressed(e){
        if (e.key == 'ArrowRight'){
            snake.direction = 'right';
        }
        else if (e.key == 'ArrowLeft'){
            snake.direction = 'left';
        }
        else if (e.key == 'ArrowDown'){
            snake.direction = 'down';
        }
        else if(e.key == 'ArrowUp'){
            snake.direction = 'up';
        }
    }
    // movement 
    document.addEventListener('keydown', keyPressed);
}

// erase old frame + snake agya + display food,troffee,score
function draw(){
    //erase the old frame
    pen.clearRect(0,0,W,H);
    snake.drawSnake();

    // To display the food object/image
    pen.fillStyle = food.color;
    pen.drawImage(food_img, food.x*cell_size, food.y*cell_size, cell_size, cell_size);

    // To display the Score 
    pen.drawImage(trophy, 18, 20, cell_size, cell_size);
    pen.fillStyle ="black";
    pen.font = "25px Roboto";
    pen.fillText(score, 45, 50);
}

function update(){
    snake.updateSnake();
}

// returns random new position of food
function getrandomfood(){
    var foodX = Math.round( Math.random()*(W-cell_size) / cell_size); // us jgh ko chdke koi bhi jgh
    var foodY = Math.round( Math.random()*(H-cell_size) / cell_size); // us jgh ko exclude

    var food = {
        x: foodX,
        y: foodY,
        color: "red",
    }

    return food;
}

function gameloop(){
    if (game_over == true){
        clearInterval(f);
        alert("Game Over");
        return;
    }
    draw(); // erase old frame + snake agya + display food,troffee,score
    update(); // food eat = new food + score inc || move forward logic bs cell array update hti || out = game over
    // ab bs next time draw call hua to naye array pr snake bna dega
    
}

// 1. initialize variable 
init();
// 2. start game
var f = setInterval(gameloop, 100);