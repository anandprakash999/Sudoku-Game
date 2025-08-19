var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}

var board = [[], [], [], [], [], [], [], [], []];

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].value = board[i][j]; // Use .value for input
			} else {
				arr[i][j].value = ''; // Set empty if 0
			}
		}
	}
}

// Update the board based on user input
function UpdateBoardFromInput() {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			board[i][j] = arr[i][j].value ? parseInt(arr[i][j].value) : 0;
		}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest();
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response);
		board = response.board;
		FillBoard(board);
	};
	xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy');
	xhrRequest.send();
};

SolvePuzzle.onclick = () => {
	UpdateBoardFromInput(); // Get current user input before solving
	sudukoSolver(board, 0, 0, 9);
};

// Helper functions remain unchanged
function isSafe(board, row, col, val, n) {
	for (let i = 0; i < n; i++) {
		if (board[row][i] == val || board[i][col] == val) return false;
	}
	let rn = Math.sqrt(n);
	let si = row - (row % rn);
	let sj = col - (col % rn);
	for (let x = si; x < si + rn; x++) {
		for (let y = sj; y < sj + rn; y++) {
			if (board[x][y] == val) return false;
		}
	}
	return true;
}

function sudukoSolver(board, row, col, n) {
	if (row == n) {
		FillBoard(board);
		return true;
	}
	if (col == n) {
		return sudukoSolver(board, row + 1, 0, n);
	}
	if (board[row][col] != 0) {
		return sudukoSolver(board, row, col + 1, n);
	}
	for (let val = 1; val <= 9; val++) {
		if (isSafe(board, row, col, val, n)) {
			board[row][col] = val;
			if (sudukoSolver(board, row, col + 1, n)) {
				return true;
			}
			board[row][col] = 0;
		}
	}
	return false;
}

// Function to validate a single input based on current board state
function validateInput(row, col, value) {
    // Convert the value to an integer
    const val = parseInt(value);

    // Check row and column for duplicates
    for (let i = 0; i < 9; i++) {
        if ((board[row][i] === val && i !== col) || (board[i][col] === val && i !== row)) {
            return false; // Duplicate found
        }
    }

    // Check 3x3 subgrid for duplicates
    let subgridRowStart = row - (row % 3);
    let subgridColStart = col - (col % 3);
    for (let i = subgridRowStart; i < subgridRowStart + 3; i++) {
        for (let j = subgridColStart; j < subgridColStart + 3; j++) {
            if (board[i][j] === val && (i !== row || j !== col)) {
                return false; // Duplicate found in subgrid
            }
        }
    }
    return true; // No duplicates
}

// Attach event listener to each cell for real-time validation
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        arr[i][j].addEventListener('input', function () {
            const cellValue = arr[i][j].value;

            // If the cell is empty, reset any highlighting and ignore further checks
            if (cellValue === "") {
                arr[i][j].style.backgroundColor = ""; // Reset background color
                board[i][j] = 0; // Reset board value
                return;
            }

            // Parse and validate input; if valid, update board, else highlight the cell
            if (cellValue >= 1 && cellValue <= 9 && validateInput(i, j, cellValue)) {
                arr[i][j].style.backgroundColor = ""; // Clear any previous error highlighting
                board[i][j] = parseInt(cellValue); // Update board with valid input
            } else {
                arr[i][j].style.backgroundColor = "red"; // Highlight invalid input
            }
        });
    }
}

