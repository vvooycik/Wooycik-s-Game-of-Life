const board = document.querySelector(".board");
console.log(board.clientHeight, board.clientWidth);
const SIZE_X = Math.floor(board.clientWidth/20);
const SIZE_Y = Math.floor(board.clientHeight/20);
console.log(SIZE_Y, SIZE_X);
let isDrawing = false;
let isStaringDrawing = false;
let drawingColor = false;
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