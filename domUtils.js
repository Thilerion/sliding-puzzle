function createTiles(parent, arr, board) {
	removeChildren(parent);
	for (let i = 0; i < arr.length; i++) {
		const item = document.createElement('div');
		if (arr[i] !== null) {
			const text = document.createTextNode(arr[i]);
			item.appendChild(text);
			item.className = "tile";
			item.dataset.tile = arr[i];
		} else {
			item.className = "tile empty";
			item.dataset.tile = 0;
		}

		item.addEventListener("touchstart", (e) => {
			e.preventDefault();
			e.stopPropagation();
			return board.swap(e.target.dataset.tile);
		});

		item.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			return board.swap(e.target.dataset.tile);
		});

		parent.appendChild(item);
	}
}

function updateTiles(parent, arr) {
	for (let t of parent.children) {
		const newPos = arr.findIndex(tile => {
			if (t.dataset.tile === 0) {
				return tile === null;
			}
			return tile - 0 === t.dataset.tile - 0;
		});

		if (!t.style.order || t.style.order * 1 !== newPos) {
			t.style.setProperty('order', newPos);
			t.classList.toggle('empty', t.dataset.tile == 0);
		}

	}
}

function removeChildren(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

function animateTile(parent, n, [dx, dy]) {
	// console.log(parent, n, dx, dy);
	const elIndex = Array.from(parent.children).findIndex(t => t.dataset.tile * 1 === n);
	// console.log(elIndex);
	const el = parent.children[elIndex];
	const pos = el.getBoundingClientRect();

	const animSpeed = 200 * pos.width / 160;
	console.log(animSpeed);

	el.animate([{
		transform: `
		translate(${dx * -1 * pos.width}px, ${dy * -1 * pos.height}px)`
	}, {
		transform: 'none'
	}], {
		duration: animSpeed,
		easing: 'ease-in-out',
		fill: 'both'
	});
}

function initControls(board) {
	const resetEl = document.getElementById('resetStats');
	resetEl.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		return board.resetStats();
	});


	const restartEl = document.getElementById('restart');
	restartEl.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		return board.restart();
	});
}

export {createTiles, updateTiles, animateTile, initControls};