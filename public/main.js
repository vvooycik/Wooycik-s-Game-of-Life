const SIZE_X = Math.floor(board.clientWidth/20);
const SIZE_Y = Math.floor(board.clientHeight/20);
const boardState = Array.from({ length: SIZE_Y }, () => Array.from({ length: SIZE_X }, () => undefined));
const rules = { 
    alive: Array.from({length: 10}, () => false),
    dead: Array.from({length: 10}, () => false)
};
let currentState = Array.from({ length: SIZE_Y }, () => Array.from({ length: SIZE_X }, () => false));
let SPEED = 250;
document.getElementById("speedometer").textContent = "Speed: 1x";
let isIterating = false;

registerBoard();
registerRulesBox();


function registerBoard() {
    const board = document.querySelector("#board");
    let isDrawing = false;
    let isStaringDrawing = false;


    for (let y=0; y<SIZE_Y; y++) {
        for (let x=0; x<SIZE_X; x++) {
            const element = document.createElement("div");
            element.className = "checkbox";
            element.id = `[${y}, ${x}]`

            board.appendChild(element);
            boardState[y][x] = element;

            element.addEventListener("click", () => {
                let isChecked = element.classList.contains('checked');
                if (isChecked) {
                    element.classList.remove("checked");
                } else {
                    element.classList.add("checked");
                }
                currentState[y][x] = !isChecked;
                boardState[y][x] = element;
            });

            element.addEventListener("pointerdown", (e) => {
                isDrawing = true
                isStaringDrawing = true;
            });
            element.addEventListener("pointerup", (e) => {
                isDrawing = false;
                isStaringDrawing = false;
            });
            element.addEventListener("mouseleave", (e) => {
                if (isStaringDrawing) {
                    element.classList.add('checked');
                    currentState[y][x] = isStaringDrawing;
                    isStaringDrawing = false;
                }
            });
            element.addEventListener("mouseenter", (e) => {
                if (isDrawing) {
                    currentState[y][x] = isDrawing;
                    element.classList.add('checked');
                }
            });
        }
    }
}

function registerRulesBox() {
    const rulesBox = document.querySelector('#rulesBox');
    const aliveRow = document.createElement("div");
    aliveRow.setAttribute("id", "alive");
    aliveRow.style = "display: flex; align-items:center";
    for (let i=0; i<10; i++) {
        const checkbox = document.createElement("div");
        checkbox.classList.add("checkbox");
        if (i === 2 || i === 3) {
            checkbox.classList.add("checked");
            rules.alive[i] = true;
        }
        checkbox.setAttribute("data-id", `${i}`);
        checkbox.addEventListener("click", (event) => {
            let { id } = event.target.dataset;
            let isChecked = rules.alive[id];
            if (isChecked) {
                checkbox.classList.remove("checked");
                rules.alive[id] = false;
            } else {
                checkbox.classList.add("checked");
                rules.alive[id] = true;
            }
        });
        aliveRow.appendChild(checkbox);
    }
    const deadRow = document.createElement("div");
    deadRow.setAttribute("id", "dead");
    deadRow.style = "display: flex; align-items:center";
    for (let i=0; i<10; i++) {
        const checkbox = document.createElement("div");
        checkbox.classList.add("checkbox");
        if (i === 3) {
            checkbox.classList.add("checked");
            rules.dead[i] = true;
        }
        checkbox.setAttribute("data-id", `${i}`);
        checkbox.addEventListener("click", (event) => {
            let { id } = event.target.dataset;
            let isChecked = rules.dead[id];
            if (isChecked) {
                checkbox.classList.remove("checked");
                rules.dead[id] = false;
            } else {
                checkbox.classList.add("checked");
                rules.dead[id] = true;
            }
        });
        deadRow.appendChild(checkbox);
    }
    rulesBox.appendChild(aliveRow);
    rulesBox.appendChild(deadRow);
    ;
}

function play() {
    const runTimeout = () => {
        isIterating = true;
        iterate();
        playInterval = window.setTimeout(runTimeout, SPEED);
    };
    runTimeout();
};

function pause() {
    if (isIterating) {
        window.clearTimeout(playInterval);
        playInterval = undefined;
    }
};

function stop() {
    pause();
    resetBoard();
    resetRules();
    SPEED = 300;
}

function changeSpeed() {
    pause();
    const speedometer = document.getElementById("speedometer");
    switch(SPEED) {
        case 250:
            SPEED = 125;
            speedometer.textContent = "Speed: 2x"
            break;
        case 125:
            SPEED = 62;
            speedometer.textContent = "Speed: 4x"
            break;
        case 62:
            SPEED = 31;
            speedometer.textContent = "Speed: 8x"
            break;
        case 31:
            SPEED = 2000;
            speedometer.textContent = "Speed: 0.125x"
            break;
        case 2000:
            SPEED = 1000;
            speedometer.textContent = "Speed: 0.25x"
            break;
        case 1000:
            SPEED = 250;
            speedometer.textContent = "Speed: 1x"
            break;
    }
    play();
    
}

function iterate() {
    currentState = updateState(currentState);
    drawState(currentState);
}

function updateState(oldState) {
    const newState = Array.from({ length: SIZE_Y }, () => Array.from({ length: SIZE_X }, () => false));
    for (let y=0; y<oldState.length; y++) {
        for (let x=0; x<oldState[y].length; x++) {
            const neighboursAmount = getBinaryState(getTopNeighbour(y,x), oldState) +
                getBinaryState(getTopRightNeighbour(y,x), oldState) +
                getBinaryState(getRightNeighbour(y,x), oldState) +
                getBinaryState(getBottomRightNeighbour(y,x), oldState) +
                getBinaryState(getBottomNeighbour(y,x), oldState) +
                getBinaryState(getBottomLeftNeighbour(y,x), oldState) +
                getBinaryState(getLeftNeighbour(y,x), oldState) +
                getBinaryState(getTopLeftNeighbour(y,x), oldState);
            if (oldState[y][x]) {
                newState[y][x] = rules.alive[neighboursAmount];
            } else {
                newState[y][x] = rules.dead[neighboursAmount];
            }
        }
    }
    return newState;
}

function drawState(state) {
    for (let y = 0; y < state.length; y++) {
        for (let x = 0; x < state[y].length; x++) {
            const element = state[y][x];
            if (element) {
                boardState[y][x].classList.add("checked");
            } else {
                boardState[y][x].classList.remove("checked");
            }
        }
    }
}

function getBinaryState(position, oldState) {
    return oldState[position[0]][position[1]] ? 1 : 0; 
}

function getTopNeighbour(y,x) {
    if (y === 0) {
        return [SIZE_Y - 1, x];
    }
    return [y - 1, x];
}

function getTopRightNeighbour(y,x) {
    let result = [y - 1, x + 1];
    if (y === 0) {
        result[0] = SIZE_Y - 1;
    }
    if (x === SIZE_X - 1) {
        result[1] = 0;
    }
    return result;
}


function getRightNeighbour(y,x) {
    if (x === SIZE_X - 1) {
        return [y, 0];
    }
    return [y, x + 1];
}


function getBottomRightNeighbour(y,x) {
    let result = [y + 1, x + 1];
    if (y === SIZE_Y - 1) {
        result[0] = 0;
    }
    if (x === SIZE_X - 1) {
        result[1] = 0;
    }
    return result;
}


function getBottomNeighbour(y,x) {
    if (y === SIZE_Y - 1) {
        return [0, x];
    }
    return [y + 1, x];
}


function getBottomLeftNeighbour(y,x) {
    let result = [y + 1, x - 1];
    if (y === SIZE_Y - 1) {
        result[0] = 0;
    }
    if (x === 0) {
        result[1] = SIZE_X - 1;
    }
    return result;
}


function getLeftNeighbour(y,x) {
    if (x === 0) {
        return [y, SIZE_X - 1];
    }
    return [y, x - 1];
}


function getTopLeftNeighbour(y,x) {
    let result = [y - 1, x - 1];
    if (y === 0) {
        result[0] = SIZE_Y - 1;
    }
    if (x === 0) {
        result[1] = SIZE_X - 1;
    }
    return result;
}

function resetBoard() {
    for (let y=0; y<boardState.length; y++) {
        for (let x=0; x<boardState[y].length; x++) {
            boardState[y][x].classList.remove("checked");
            currentState[y][x] = false;
        }
    }
   
}

function resetRules() {
    for (let i=0; i<10; i++) {
        if (i === 2) {
            rules.alive[i] = true;
            rules.dead[i] = false;
        } else if (i === 3) {
            rules.alive[i] = true;
            rules.dead[i] = true;
        } else {
            rules.alive[i] = false;
            rules.dead[i] = false;
        }
    }
    aliveCheckboxes = document.querySelectorAll("#alive div");
    aliveCheckboxes.forEach(element => {
        let { id } = element.dataset;
        if (rules.alive[id] && !element.classList.contains("checked")) {
            element.classList.add("checked");
        } else if (!rules.alive[id]) {
            element.classList.remove("checked");
        }
    })
    deadCheckboxes = document.querySelectorAll("#dead div");
    deadCheckboxes.forEach(element => {
        let { id } = element.dataset;
        if (rules.dead[id] && !element.classList.contains("checked")) {
            element.classList.add("checked");
        } else if (!rules.dead[id]) {
            element.classList.remove("checked");
        }
    })
    SPEED = 250;
    document.getElementById("speedometer").textContent = "Speed: 1x";
}