var arr = [[], [], [], [], [], [], [], [], []]
var temp = [[], [], [], [], [], [], [], [], []]
var temp_arr = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
        
        arr[i][j].addEventListener("keydown", function (e) {
            // console.log(e.key);
            let target = e.currentTarget;
            let x = target.getAttribute("id");
            let row = Math.floor(x/9);
            let col = x % 9;
            // console.log(row,col)
            
            if (e.key == 'ArrowRight') {
                if (col != 8) {
                    let y = document.getElementById(row * 9 + (col + 1)).focus();
                }
                
            }
            else if (e.key == 'ArrowLeft') {
                if(col!=0)
                    document.getElementById(row * 9 + (col-1)).focus();
            }
            else if (e.key == 'ArrowDown') {
                if(row!=8)
                    document.getElementById((row+1) * 9 + col).focus();
            }
            else if (e.key == 'ArrowUp') {
                if(row!=0)
                    document.getElementById((row-1) * 9 + col).focus();
            }
        })
    }
}

function initializeTemp(temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            temp[i][j] = false;
        }
    }
}

// temp = true -> ques values
function setTemp(board, temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                temp[i][j] = true;
            }
        }
    }
}


function setColor(temp) {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (temp[i][j] == true) {
                arr[i][j].style.color = "#DC3545";
                arr[i][j].setAttribute('contenteditable', 'false');
            } else {
                arr[i][j].setAttribute('contenteditable', 'true');
            }

        }
    }
}

function resetColor() {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].style.color = "green";
        }
    }
}

var board = [[], [], [], [], [], [], [], [], []]


let button = document.getElementById('generate-sudoku');
let solve = document.getElementById('solve');
let checkBtn = document.getElementById('check-btn');
function changeBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {

                arr[i][j].innerText = board[i][j];
            }

            else
                arr[i][j].innerText = '';
        }
    }
}
button.onclick = function () {
    var xhrRequest = new XMLHttpRequest()
    xhrRequest.onload = function () {
        var response = JSON.parse(xhrRequest.response)
        console.log(response)
        initializeTemp(temp)
        resetColor()

        board = response.board
        setTemp(board, temp)
        setColor(temp)
        changeBoard(board)
    }
    xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy')
    //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
    xhrRequest.send()
}
//to be completed by student
function isSafe(board, r, c, no) {
    for(var i=0;i<9;i++){
        if(board[i][c]==no || board[r][i]==no){
            return false;
        }
    }
    //subgrid
    var sx = r - r%3;
    var sy = c - c%3;

    for(var x=sx;x<sx+3;x++){
        for(var y=sy;y<sy+3;y++){
            if(board[x][y]==no){
                return false;
            }
        }
    }

    return true;
}
//to be completed by student
function solveSudokuHelper(board, r, c,flag) {
    // console.log("1234")
    if (r == 9) {
        console.log("flag")
        if (flag == true) {
            changeBoard(board);
        }
        return true;
    }
    //other cases 
    if(c==9){
        return solveSudokuHelper(board,r+1,0,flag);
    }
    //pre-filled cell, skip it
    if(board[r][c]!=0){
        return solveSudokuHelper(board,r,c+1,flag);
    }

    //there is 0 in the current location
    for(var i=1;i<=9;i++){

        if(isSafe(board,r,c,i)){
            board[r][c] = i;
            var success = solveSudokuHelper(board,r,c+1,flag);
            if(success==true){
                return true;
            }
            //backtracking step
            board[r][c] = 0;
        }

    }
    return false;
}
function solveSudoku(board) {
    solveSudokuHelper(board, 0, 0, true);
}
solve.onclick = function () {
    solveSudoku(board);
}
checkBtn.onclick = function () {
    solveSudokuHelper(board, 0, 0, false);
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            let cell = arr[i][j].innerText;
            if (cell != board[i][j]) {
                console.log("Wrong answer");
                let modal_container = document.querySelector(".modal_container");
                if (modal_container == null) {
                    modal_container = document.createElement("div");
                    modal_container.setAttribute("class", "modal_container");
                    modal_container.innerText = "Wrong Answer"
                    document.body.appendChild(modal_container);
                    modal_container.onclick=function(){
                        modal_container.remove();
                    }
                }
                return;
            }
        }
    }
    console.log("Correct answer");
    let modal_container = document.querySelector(".modal_container");
    if (modal_container == null) {
        modal_container = document.createElement("div");
        modal_container.setAttribute("class", "modal_container");
        modal_container.innerText = "Great ! You Did it"
        document.body.appendChild(modal_container);
        modal_container.onclick=function(){
            modal_container.remove();
        }
        modal_container.style.backgroundColor = "green";
    }

}


