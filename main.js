let board;
$(document).ready(() => {
    board = $("#board");
    GenerateBoard("W"); // white starts
});

let queen_count = {B: 1, W: 1}; // not the actual number of queens, just incrementors for the respective queen IDs

// array of rows; row = array of cells; cell = TypeColorID
let board_data = [
    // Main
    ["CastleW0","KnightW0","BishopW0","QueenW0","KingW0","BishopW1","KnightW1","CastleW1"],
    ["PawnW0","PawnW1","PawnW2","PawnW3","PawnW4","PawnW5","PawnW6","PawnW7"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["PawnB0","PawnB1","PawnB2","PawnB3","PawnB4","PawnB5","PawnB6","PawnB7"],
    ["CastleB0","KnightB0","BishopB0","KingB0","QueenB0","BishopB1","KnightB1","CastleB1"]

    // Blank For Testing (Both kings required otherwise immediate game over)
    // ["","","","","","","",""],
    // ["","","","","","","",""],
    // ["","","","","","","",""],
    // ["","","","","","","",""],
    // ["","","","","","","",""],
    // ["","","","","","","",""],
    // ["","","","","","","",""],
    // ["KingW0","","","","","","","KingB0"],
];

function GenerateBoard(color_to_play) {
    let rows = []; // to store the tr elements
    board_data.forEach(row => { // for each row on the board
        const row_container = document.createElement("tr"); // create a tr container for the cells in this row
        rows.push(row_container); // add this row to the array
        row.forEach(cell => { // for each cell in the row
            const cell_element = document.createElement("td"); // create a td for this cell
            row_container.appendChild(cell_element); // add the cell to the container
            const piece_type = GetCellPieceType(cell);
            const piece_color = GetCellPieceColor(cell);
            //// CELL CONTENTS (either or both; if using both, you will probably want to adjust spacing and cell size)
            /// TEXT
            // cell_element.textContent = piece_type; // set the text to the piece type
            /// IMAGE
            if (piece_type !== "") { // if the cell contains a piece
                const image = document.createElement("img"); // create an image
                cell_element.appendChild(image); // add the image to the cell
                image.src = `pieces/${piece_type}_${piece_color}.svg`; // set the source to the correct piece and color
            }
            ////
            cell_element.className = piece_color; // set the class to W / B for white / black pieces
            if (color_to_play === piece_color) { // if the color of the piece is the current player's color
                cell_element.className += " pointer"; // add a pointer cursor on hover
                cell_element.onclick = () => {CellClicked(board_data.indexOf(row), cell);}; // add an onclick event
            }
        });
    });
    board[0].replaceChildren(...rows); // add the rows to the board
    CheckForWin();
}

function CellClicked(row_index, cell) {
    const cell_index = board_data[row_index].indexOf(cell); // get the index of the cell in the specified row
    const cell_type = GetCellPieceType(cell);
    const cell_color = GetCellPieceColor(cell);
    $("#board td.highlight").each((i, element) => element.onclick = () => {}); // remove any existing onclick function
    $("#board td").removeClass("highlight"); // remove highlights
    const opposite_color = cell_color === "W" ? "B" : "W";
    switch (cell_type) {
        case "Pawn":
            if (cell_color === "W") {
                const can_move_down = CellCheckAndEventHook(row_index, 1, cell_index, 0, [""], "B"); // down only if empty
                if (can_move_down && row_index === 1) {CellCheckAndEventHook(row_index, 2, cell_index, 0, [""], "B");} // can move 2 down on starting row
                CellCheckAndEventHook(row_index, 1, cell_index, 1, ["B"], "B"); // BR if black
                CellCheckAndEventHook(row_index, 1, cell_index, -1, ["B"], "B"); // BL if black
            }
            if (cell_color === "B") {
                const can_move_up = CellCheckAndEventHook(row_index, -1, cell_index, 0, [""], "W"); // up only if empty
                if (can_move_up && row_index === 6) {CellCheckAndEventHook(row_index, -2, cell_index, 0, [""], "W");} // can move 2 up on starting row
                CellCheckAndEventHook(row_index, -1, cell_index,  0, [""],  "W"); // up if empty
                CellCheckAndEventHook(row_index, -1, cell_index,  1, ["W"], "W"); // up, right if white
                CellCheckAndEventHook(row_index, -1, cell_index, -1, ["W"], "W"); // up, left if white
            }
            break;
        case "Castle": Straights(); break;
        case "Knight":
            CellCheckAndEventHook(row_index, -2, cell_index, -1, ["", opposite_color], opposite_color); // TL
            CellCheckAndEventHook(row_index, -2, cell_index,  1, ["", opposite_color], opposite_color); // TR
            CellCheckAndEventHook(row_index, -1, cell_index, -2, ["", opposite_color], opposite_color); // LT
            CellCheckAndEventHook(row_index, -1, cell_index,  2, ["", opposite_color], opposite_color); // RT
            CellCheckAndEventHook(row_index,  1, cell_index, -2, ["", opposite_color], opposite_color); // LB
            CellCheckAndEventHook(row_index,  1, cell_index,  2, ["", opposite_color], opposite_color); // RB
            CellCheckAndEventHook(row_index,  2, cell_index, -1, ["", opposite_color], opposite_color); // BL
            CellCheckAndEventHook(row_index,  2, cell_index,  1, ["", opposite_color], opposite_color); // BR
            break;
        case "Bishop": Diagonals(row_index, cell_index, opposite_color); break;
        case "Queen": Diagonals(row_index, cell_index, opposite_color); Straights(row_index, cell_index, opposite_color); break;
        case "King":
            CellCheckAndEventHook(row_index, -1, cell_index, -1, ["", opposite_color], opposite_color); // TL
            CellCheckAndEventHook(row_index, -1, cell_index,  0, ["", opposite_color], opposite_color); // TM
            CellCheckAndEventHook(row_index, -1, cell_index,  1, ["", opposite_color], opposite_color); // TR
            CellCheckAndEventHook(row_index,  0, cell_index, -1, ["", opposite_color], opposite_color); // ML
            CellCheckAndEventHook(row_index,  0, cell_index,  1, ["", opposite_color], opposite_color); // MR
            CellCheckAndEventHook(row_index,  1, cell_index, -1, ["", opposite_color], opposite_color); // BL
            CellCheckAndEventHook(row_index,  1, cell_index,  0, ["", opposite_color], opposite_color); // BM
            CellCheckAndEventHook(row_index,  1, cell_index,  1, ["", opposite_color], opposite_color); // BR
            break;
    }
}

function Straights(row_index, cell_index, opposite_color) {
    for (let i = 1; i <= row_index; i ++) { // up
        if (!CellCheckAndEventHook(row_index, -i, cell_index, 0, ["", opposite_color], opposite_color)) {break;}
    }
    for (let i = row_index + 1; i <= 7; i ++) { // down
        if (!CellCheckAndEventHook(row_index, i - row_index, cell_index, 0, ["", opposite_color], opposite_color)) {break;}
    }
    for (let i = 1; i <= cell_index; i ++) { // left
        if (!CellCheckAndEventHook(row_index, 0, cell_index, -i, ["", opposite_color], opposite_color)) {break;}
    }
    for (let i = cell_index + 1; i <= 7; i ++) { // right
        if (!CellCheckAndEventHook(row_index, 0, cell_index, i - cell_index, ["", opposite_color], opposite_color)) {break;}
    }
}

function Diagonals(row_index, cell_index, opposite_color) {
    let row_delta = 1, cell_delta = 1;
    while (CellCheckAndEventHook(row_index, row_delta, cell_index, cell_delta, ["", opposite_color], opposite_color)) {row_delta ++; cell_delta ++;} // BR
    row_delta = 1; cell_delta = -1;
    while (CellCheckAndEventHook(row_index, row_delta, cell_index, cell_delta, ["", opposite_color], opposite_color)) {row_delta ++; cell_delta --;} // BL
    row_delta = -1; cell_delta = -1;
    while (CellCheckAndEventHook(row_index, row_delta, cell_index, cell_delta, ["", opposite_color], opposite_color)) {row_delta --; cell_delta --;} // TL
    row_delta = -1; cell_delta = 1;
    while (CellCheckAndEventHook(row_index, row_delta, cell_index, cell_delta, ["", opposite_color], opposite_color)) {row_delta --; cell_delta ++;} // TR
}

function ClampIndex(index) {
    if (0 <= index && index <= 7) {return index;}
    else {return -1;}
}

function CellCheckAndEventHook(row_index, row_delta, cell_index, cell_delta, colors_to_check, next_color, return_if_non_empty = true) {
    const row_with_delta = ClampIndex(row_index + row_delta);
    const cell_with_delta = ClampIndex(cell_index + cell_delta);
    if (row_with_delta === -1 || cell_with_delta === -1) {return false;} // stop if requested cell is out of bounds
    const cell = board_data[row_with_delta][cell_with_delta];
    const cell_type = GetCellPieceType(cell);
    const piece_type = GetCellPieceType(board_data[row_index][cell_index]);
    const piece_color = GetCellPieceColor(board_data[row_index][cell_index]);
    if (colors_to_check.includes(GetCellPieceColor(cell))) { // if the color of the checked cell is in the colors_to_check array
        const cell_element = GetCellElement(row_with_delta, cell_with_delta); // retrieve that cell element
        cell_element.addClass("highlight"); // highlight it to show it can be clicked
        cell_element[0].onclick = () => { // add an onclick event for when the move-to cell is clicked
            MovePiece(row_index, cell_index, row_with_delta, cell_with_delta); // Move the piece
            if (piece_type === "Pawn") { // if the piece is a pawn, check if it has reached the respective end row and, if it has, promote it to a queen
                switch (piece_color) {
                    case "W": if (row_with_delta === 7) {board_data[row_with_delta][cell_with_delta] = "Queen" + piece_color + (queen_count[piece_color]++);} break;
                    case "B": if (row_with_delta === 0) {board_data[row_with_delta][cell_with_delta] = "Queen" + piece_color + (queen_count[piece_color]++);} break;
                }
            }
            GenerateBoard(next_color);
        };
    }
    if (return_if_non_empty && cell_type !== "") {return false;} // stop if the cell contains a piece
    return true;
}

function GetCellElement(row_index, cell_index) {return $(`#board tr:nth-of-type(${row_index + 1}) td:nth-of-type(${cell_index + 1})`);}
function GetCellPieceColor(cell) {return cell.slice(-2, -1);}
function GetCellPieceType(cell) {return cell.slice(0, -2);}

function MovePiece(from_row_index, from_cell_index, to_row_index, to_cell_index) {
    board_data[to_row_index][to_cell_index] = board_data[from_row_index][from_cell_index];
    board_data[from_row_index][from_cell_index] = "";
}

function CheckForWin() {
    let white_king_alive = false;
    let black_king_alive = false;
    board_data.forEach(row => {
        row.forEach(cell => {
            white_king_alive = white_king_alive || (GetCellPieceType(cell) === "King" && GetCellPieceColor(cell) === "W");
            black_king_alive = black_king_alive || (GetCellPieceType(cell) === "King" && GetCellPieceColor(cell) === "B");
        });
    });
    if (!white_king_alive || !black_king_alive) {
        const cells = $("#board td");
        cells.each((i, element) => {element.onclick = () => {};}); // remove all cell onclick functions to prevent further board interaction
        cells.removeClass("pointer").removeClass("highlight"); // remove classes other than color
        const winner_message = $("#winner")[0];
        if (!black_king_alive) {winner_message.textContent = "WHITE WON";}
        if (!white_king_alive) {winner_message.textContent = "BLACK WON";}
    }
}