registerBoard();
registerRulesBox();


function registerBoard() {
    const board = document.querySelector("#board");
    const SIZE_X = Math.floor(board.clientWidth/20);
    const SIZE_Y = Math.floor(board.clientHeight/20);
    let isDrawing = false;
    let isStaringDrawing = false;
    let boardState = Array.from({ length: SIZE_Y }, () => Array.from({ length: SIZE_X }, () => false));


    for (let y=0; y<SIZE_Y; y++) {
        for (let x=0; x<SIZE_X; x++) {
            const element = document.createElement("div");
            element.className = "checkbox";
            element.id = `[${y}, ${x}]`

            board.appendChild(element);

            element.addEventListener("click", () => {
                let isChecked = element.classList.contains('checked');
                boardState[y][x] = !isChecked;
                if (isChecked) {
                    element.classList.remove("checked");
                } else {
                    element.classList.add("checked");
                }
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
                    isStaringDrawing = false;
                    boardState[y][x] = isStaringDrawing;
                }
            });
            element.addEventListener("mouseenter", (e) => {
                if (isDrawing) {
                    element.classList.add('checked');
                    boardState[y][x] = isDrawing;
                }
            });
        }
    }
}

function registerRulesBox() {
    const rulesBox = document.querySelector('#rulesBox');
    const rules = { 
        alive: new Array(10).fill(0), 
        dead: new Array(10).fill(0)
    };
    const aliveRow = document.createElement("div");
    aliveRow.setAttribute("id", "alive");
    aliveRow.style = "display: flex; align-items:center";
    for (let i=0; i<10; i++) {
        const checkbox = document.createElement("div");
        checkbox.classList.add("checkbox");
        if (i === 2 || i === 3) {
            checkbox.classList.add("checked");
            rules.alive[i] = 1;
        }
        checkbox.setAttribute("data-id", `${i}`);
        checkbox.addEventListener("click", (event) => {
            let { id } = event.target.dataset;
            let isChecked = rules.alive[id] === 1;
            if (isChecked) {
                checkbox.classList.remove("checked");
                rules.alive[id] = 0;
            } else {
                checkbox.classList.add("checked");
                rules.alive[id] = 1;
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
            rules.dead[i] = 1;
        }
        checkbox.setAttribute("data-id", `${i}`);
        checkbox.addEventListener("click", (event) => {
            let { id } = event.target.dataset;
            let isChecked = rules.dead[id] === 1;
            if (isChecked) {
                checkbox.classList.remove("checked");
                rules.dead[id] = 0;
            } else {
                checkbox.classList.add("checked");
                rules.dead[id] = 1;
            }
        });
        deadRow.appendChild(checkbox);
    }
    rulesBox.appendChild(aliveRow);
    rulesBox.appendChild(deadRow);
}