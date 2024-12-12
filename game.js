let moves = 0;
let match = 0;
let layout = 15;
let gameMode = "camel";

function chooseGameMode(mode) {
  gameMode = mode.id;
  console.log(gameMode);
  if (gameMode === "camel") {
    document.getElementById("camel").classList.add("bold");
    document.getElementById("elephant").classList.remove("bold");
    document.getElementById("duck").classList.remove("bold");
    document.getElementById("cow").classList.remove("bold");
  } else if (gameMode === "elephant") {
    document.getElementById("elephant").classList.add("bold");
    document.getElementById("camel").classList.remove("bold");
    document.getElementById("duck").classList.remove("bold");
    document.getElementById("cow").classList.remove("bold");
  } else if (gameMode === "duck") {
    document.getElementById("duck").classList.add("bold");
    document.getElementById("elephant").classList.remove("bold");
    document.getElementById("camel").classList.remove("bold");
    document.getElementById("cow").classList.remove("bold");
  } else if (gameMode === "cow") {
    document.getElementById("cow").classList.add("bold");
    document.getElementById("duck").classList.remove("bold");
    document.getElementById("elephant").classList.remove("bold");
    document.getElementById("camel").classList.remove("bold");
  }
}

function createLayout() {
  // Create grid for the game
  document.getElementById("game-container").innerHTML = `
    <table id="game">
      <tr>
        <td id="1" class="grid"></td>
        <td id="2" class="grid"></td>
        <td id="3" class="grid"></td>
        <td id="4" class="grid"></td>
      </tr>
      <tr>
        <td id="5" class="grid"></td>
        <td id="6" class="grid"></td>
        <td id="7" class="grid"></td>
        <td id="8" class="grid"></td>
      </tr>
      <tr>
        <td id="9" class="grid"></td>
        <td id="10" class="grid"></td>
        <td id="11" class="grid"></td>
        <td id="12" class="grid"></td>
      </tr>
      <tr>
        <td id="13" class="grid"></td>
        <td id="14" class="grid"></td>
        <td id="15" class="grid"></td>
        <td id="16" class="grid"></td>
      </tr>
    </table>`;

  // Add click events to all tiles
  let grid = document.getElementsByClassName("grid");
  for (let i = 0; i < grid.length; i++) {
    grid[i].addEventListener("click", move);
  }

  shuffle(); // Shuffle the tiles right after generation
}

// Function to shuffle and ensure the puzzle is solvable - Written with help from ChatGPT
function shuffle() {
  let tiles = Array.from(document.getElementsByClassName("grid"));
  let tileNumbers = Array.from({ length: 15 }, (_, i) => i + 1); // Generate numbers 1 to 15
  tileNumbers.push(""); // Add an empty tile for the blank space

  // Shuffle the tile numbers until we find a solvable configuration
  do {
    for (let i = tileNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tileNumbers[i], tileNumbers[j]] = [tileNumbers[j], tileNumbers[i]];
    }
  } while (!isSolvable(tileNumbers)); // Continue shuffling until solvable

  // Assign shuffled numbers and labels to tiles
  tiles.forEach((tile, index) => {
    let tileNumber = tileNumbers[index];
    tile.innerHTML = ""; // Clear any existing content

    if (tileNumber) {
      // Add an image with the alt attribute
      tile.innerHTML = `
        <img src="images/${gameMode}/${tileNumber}.png" alt="${tileNumber}" class="tile">
        <div class="tile-label">${tileNumber}</div>
      `;
    }
  });

  checkMatch(); // Validate matches after shuffling
}

// Function to check if the puzzle is solvable - Written with help from ChatGPT
function isSolvable(puzzle) {
  let tiles = [];
  // Flatten the puzzle array (excluding the empty tile)
  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i] !== "") {
      tiles.push(puzzle[i]);
    }
  }

  // Count the number of inversions
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }

  // If the number of inversions is even, the puzzle is solvable
  return inversions % 2 === 0;
}

// Move the tile to a clear space adjacent when clicked
function move(e) {
  let target = e.target.closest(".grid");
  let gridPosition = parseInt(target.id);
  let row = Math.floor((gridPosition - 1) / 4); // Determine the row of the clicked tile

  // Calculate adjacent tile IDs
  let adjacentIds = [
    gridPosition - 1, // Left
    gridPosition + 1, // Right
    gridPosition - 4, // Above
    gridPosition + 4, // Below
  ];

  for (let i = 0; i < adjacentIds.length; i++) {
    let adjacentTile = document.getElementById(adjacentIds[i]);

    // Skip invalid moves
    if (!adjacentTile || adjacentTile.innerHTML !== "") continue;

    // Ensure left/right moves are within the same row
    if (i === 0 && Math.floor((gridPosition - 2) / 4) !== row) continue; // Left
    if (i === 1 && Math.floor(gridPosition / 4) !== row) continue; // Right

    // Perform the move if valid
    adjacentTile.innerHTML = target.innerHTML;
    target.innerHTML = "";
    moveCount();
    checkMatch();
    return;
  }
}

// Checks if the tile matches the grid ID (ie is in the right place)
function checkMatch() {
  let tiles = Array.from(document.getElementsByClassName("grid"));

  // Reset the match count for each check
  match = 0;

  tiles.forEach(tile => {
    let img = tile.querySelector("img"); // Get the image inside the tile
    let label = tile.querySelector(".tile-label"); // Get the label

    if (img) {
      // Extract the number from the alt value of the image
      let altValue = img.alt; // The alt value is the number (1, 2, etc.)

      // Check if the tile number matches its ID
      if (parseInt(altValue) === parseInt(tile.id)) {
        tile.classList.add("match"); // Add the "match" class if it's correct
        label.style.backgroundColor = "green";
        match++; // Increment the match counter
      } else {
        tile.classList.remove("match"); // Remove the "match" class if it's incorrect
        label.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      }

      // Update the label to show the correct alt number
      label.innerText = altValue; // The label shows the alt number for guidance
    } else {
      // For empty tiles, remove any match indication
      tile.classList.remove("match");
    }
  });

  // Update the match counter in the UI
  document.getElementById("match-display").innerText = `Matches: ${match}`;

  // Check if all tiles are matched (game won)
  gameWin(match);
}

// Updates the move counter and shows how many tiles are currently in the right place
function moveCount() {
  moves++;
  document.getElementById("moves-display").innerText = `Moves: ${moves}`;
  document.getElementById("match-display").innerText = `Matches: ${match}`;
}

// Checks for game win, all tiles in the right place
function gameWin(match) {
  if (match === layout) {
    document.getElementById("win-display").innerText = `You Win!`;
    let final = document.getElementById("16");
    final.innerHTML = `<img src="images/${gameMode}/16.png" alt="16" class="tile">`;
    // Iterate through each tile and remove the "match" class, and remove labels
    let finalGrid = document.getElementsByClassName("grid"); // Get all grid tiles
    for (let i = 0; i < finalGrid.length; i++) {
      finalGrid[i].classList.remove("match"); // Remove the match class
    }
    let finalLabel = document.getElementsByClassName("tile-label");
    for (let i = 0; i < finalLabel.length; i++) {
      finalLabel[i].innerHTML = "";
      finalLabel[i].style.backgroundColor = "rgba(0, 0, 0, 0.0)";
    }
  }
}

// Starts a new game
function newGame() {
  moves = 0;
  match = 0;
  layout = 15;
  document.getElementById("moves-display").innerText = `Moves: ${moves}`;
  document.getElementById("match-display").innerText = `Matches: ${match}`;
  document.getElementById("win-display").innerText = ``;
  createLayout();
  shuffle();
}

// Solves the puzzle, mainly for debugging
function solvePuzzle() {
  let tiles = Array.from(document.getElementsByClassName("grid"));

  // Assign images in correct order based on grid ID
  tiles.forEach((tile, index) => {
    let tileNumber = index + 1; // Grid IDs are 1-based
    if (tileNumber < 16) {
      tile.innerHTML = `<img src="images/${gameMode}/${tileNumber}.png" alt="${tileNumber}" class="tile">`;
    } else {
      tile.innerHTML = ""; // Empty the last cell
    }
  });

  // Update match count to reflect solved puzzle
  match = 15; // 15 tiles are matched, excluding the empty tile
  document.getElementById("moves-display").innerText = `Moves: ${moves}`;
  document.getElementById("match-display").innerText = `Matches: ${match}`;
  gameWin(match);
}
