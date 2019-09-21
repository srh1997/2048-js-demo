let size = 4;
let game = document.getElementsByClassName("tile-container")[0];
let tile = [];
let isWin=false;
let bestScore_item=document.getElementById('bestScore');
let parentScore_item=document.getElementById('parentScore');
let bestScore=0;
let parentScore=0;
function initGame() {
    for (let i = 0; i < size * size; i++) {
        let node = document.createElement("div");
        node.classList.add("tile");
        node.setAttribute("style", "top:0;left:0;")
        game.appendChild(node);
        tile[i] = {
            value: 0
        }
    }
    for (k in tile_node) {
        var x = parseInt(k % 4);
        var y = parseInt(k / 4);
        tile_node[k].style = "left:" + (20 * (x + 1) + 100 * x) + "px;" + "top:" + (20 * (y + 1) + 100 * y) + "px";
    }
    addRandomNumber();
    addRandomNumber();
    updateDOM();
    initScore();
}
function initScore() {
    bestScore=localStorage.getItem("BestScore") || 0;
    bestScore_item.innerHTML=bestScore;
}

var tile_node = document.getElementsByClassName("tile");

function addRandomNumber() {
    if(isFulled())return;
    while (1) {
        var index = parseInt(size * size * Math.random());
        if (tile[index].value == 0) {
            var ranNum=2*Math.random();
            tile[index].value = (ranNum>=0.5)?2:2;
            break;
        }
    }

}

function updateDOM() {
    for (let i = 0; i < size * size; i++) {
        //changecolor
        if (tile[i].value) {
            tile_node[i].innerHTML = tile[i].value;
            // tile_node[i].style.background = "#FFC43D"
            // tile_node[i].classList.add("tile--"+tile[i].value);
            switch (tile[i].value) {
                case 2:tile_node[i].style.background = "#FFC43D";break;
                case 4:tile_node[i].style.background = "#EF476F";break;
                case 8:tile_node[i].style.background = "#1B9AAA";break;
                case 16:tile_node[i].style.background = "#06D6A0";break;
                case 32:tile_node[i].style.background = "#f37694";break;
                case 64:tile_node[i].style.background = "#22c2d6";break;
                case 128:tile_node[i].style.background = "#17f8be";break;
                case 256:tile_node[i].style.background = "#ffd470";break;
                case 512:tile_node[i].style.background = "#eb184a";break;
                case 1024:tile_node[i].style.background = "#14727e";break;
                case 2048:tile_node[i].style.background = "#05a47b";break;
            }
        } else {
            tile_node[i].innerHTML="";
            tile_node[i].style.background = "#F8FFE5";
        }
    }

    parentScore_item.innerHTML=parentScore;
    if(parentScore>bestScore){
        localStorage.setItem('BestScore',parentScore);
        bestScore_item.innerHTML=parentScore;
    }
}


function isGameOver() {
    if (isWin) {
        alert("YOU WIN!");
        return true;
    }

   // var flag=true;
    if(!isFulled())return false;
    for (let i = 0; i < 4; i++) {
        for(let j=i;j!=i+size*3;j+=size){
            if(tile[j].value===tile[j+size].value)return false;
        }
        
    }
    for (let i = 0; i < 0+size*4; i+=size) {
        for(let j=i;j!=i+3;j++){
            if(tile[j].value===tile[j+1].value)return false;
        }
        
    }
    alert("GAME OVER~What an Idiot");
    return true;
}

function GameOverHandler() {
    document.onkeydown=undefined;

}
function KeyPressHandler() {

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == 37||e.keyCode == 38||e.keyCode == 39||e.keyCode == 40) {

            if (e.keyCode == 37) {
                MoveLeft();
                updateDOM();
            } else if (e.keyCode == 38) {
                MoveUp();
                updateDOM();
            } else if (e.keyCode == 39) {
                MoveRight();
                updateDOM();
            } else if (e.keyCode == 40) {
                MoveDown();
                updateDOM();
            }

            function MoveLeft() {
                let start = [0, 4, 8, 12];
                Move(start, 1);
            }

            function MoveUp() {
                let start = [0, 1, 2, 3];
                Move(start, 4);
            }

            function MoveRight() {
                let start = [3, 7, 11, 15];
                Move(start, -1);
            }

            function MoveDown() {
                let start = [12, 13, 14, 15];
                Move(start, -4);
            }

            function Move(start, distance) {
                for (let i = 0; i < size; i++) {
                    let cnt = 0;
                    let cnt1 = 0
                    let newArray = [0, 0, 0, 0];
                    for (let j = start[i]; j != start[i] + size * distance; j += distance) {
                        if (tile[j].value !== 0) {
                            newArray[cnt] = tile[j].value;
                            cnt++;
                        }
                    }
                    // console.log(newArray);
                    if (newArray[0] != 0) {
                        for (let i = 0; i < size; i++) {
                            if (newArray[i] === newArray[i + 1]) {
                                parentScore+=newArray[i];
                                newArray[i] *= 2;
                                if(newArray[i]==2048)isWin=true;
                                newArray[i + 1] = 0;
                            }
                        }
                        // console.log(newArray);
                        let moreNewArray = [0, 0, 0, 0];
                        for (let i = 0; i < size; i++) {
                            if (newArray[i] !== 0) {
                                moreNewArray[cnt1] = newArray[i];
                                cnt1++;
                            }
                        }
                        // console.log(moreNewArray);
                        for (k in newArray) {
                            newArray[k] = moreNewArray[k];
                        }
                    }
                    // console.log("第",i+1,"行：",newArray);
                    cnt = 0;
                    for (let j = start[i]; j != start[i] + size * distance; j += distance) {
                        tile[j].value = newArray[cnt];
                        cnt++;
                    }
                }

            }

            new Promise(function (resolve, reject) {
                setTimeout(function () {
                    addRandomNumber();
                    // addRandomNumber(); //想一次生成两个就把这个注释解掉 QwQ
                    updateDOM();
                    resolve();
                }, 200);
            }).then(function () {
                if (isGameOver()) {
                    GameOverHandler();
                }
            })
        }

    };
}
function isFulled(){
    for (k in tile){
        if(tile[k].value==0)return false;
    }
    return true;
}
function GameStart() {
    initGame();
    // while(1){
    KeyPressHandler();

    // }
}

GameStart();
