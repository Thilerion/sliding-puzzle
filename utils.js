//https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html

/*
Inversion: when a tile precedes another tile with a lower number
The solution has 0 inversions.
When, in a 4x4 grid, number 12 is in the top left, there are 11 inversions (as number 1-11 come after it).
*/

/* FORMULA ---
1.	Grid width odd? Number of inversions in solvable situation is even
2.	Grid width even? Blank on even row counting from bottom? Number of inversions in solvable situation is odd
		Even rows are: second-last, fourth-last, etc
3.	Grid width even? Blank on odd row counting from bottom? Number of inversions in solvable situation is even
		Odd rows are: last, third-last, etc.

Total formula for determining solvability:

((grid width odd) && (# of inversions even)) || ((grid width even) && ((blank on odd row from bottom) === (# of inversions even)))
*/

function generateTileArray(gridWidth) {
	let tiles = [...Array(gridWidth * gridWidth).keys()];
	tiles[0] = null;

	let solvableArray = [];

	do {
		solvableArray = shuffle([...tiles]);
	} while(!isSolvable(solvableArray, gridWidth) && getInversions(solvableArray) !== 0);

	return solvableArray;
}

function isSolvable(arr, gridWidth) {
	const inversions = getInversions(arr);
	const inversionsEven = inversions % 2 === 0;
	const widthOdd = gridWidth % 2 !== 0;
	const gridHeight = gridWidth;
	const blankRow = (gridHeight - Math.ceil(arr.findIndex(t => t === null) / gridWidth)) + 1;
	const blankRowOdd = blankRow % 2 !== 0;

	return (widthOdd && inversionsEven) || (!widthOdd && (blankRowOdd === inversionsEven));
}

function getInversions(arr) {
	let tiles = [...arr].filter(v => v !== null);
	let inversions = 0;
	
	for (let i = 0; i < tiles.length; i++) {
		for (let j = i + 1; j < tiles.length; j++) {
			if (tiles[i] > tiles[j]) {
				inversions++;
			}
		}
	}
	return inversions;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
  
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex -= 1;
  
	  // And swap it with the current element.
	  temporaryValue = array[currentIndex];
	  array[currentIndex] = array[randomIndex];
	  array[randomIndex] = temporaryValue;
	}
  
	return array;
  }

export {generateTileArray, isSolvable, getInversions};