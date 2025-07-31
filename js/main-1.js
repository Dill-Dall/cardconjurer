function convertCharsToSize(
	charCount,
	penaltyCeiling = 0,
	penaltyFloor = -30,         // Floor value (most negative allowed)
	accelerationRate = 0.15,    // How quickly penalty accelerates
	penaltyStartsAt = 25,       // Character count where penalty starts increasing
	curveExponent = 2,          // Polynomial curve steepness (higher = more curved)
	initialPenalty = 5,         // Base penalty value at the threshold
	scalingMode = 'aggressive' , // 'aggressive' for short text, 'gentle' for long text
) {
	if (charCount <= penaltyStartsAt) {
		return penaltyCeiling;
	}

	const excessChars = charCount - penaltyStartsAt;
	let penaltyIncrease;

	if (scalingMode === 'gentle') {
		// For long text: use square root scaling to reduce impact of large numbers
		penaltyIncrease = Math.sqrt(excessChars) * (1 + Math.pow(Math.sqrt(excessChars), curveExponent) * accelerationRate);
	} else {
		// For short text: original aggressive polynomial scaling
		penaltyIncrease = excessChars * (1 + Math.pow(excessChars - initialPenalty, curveExponent) * accelerationRate);
	}

	const totalPenalty = -initialPenalty - penaltyIncrease;

	return Math.min(penaltyCeiling, Math.max(Math.round(totalPenalty), penaltyFloor));
}

function getBaseSize(key, text) {
	switch(key) {
		case "title":
			return convertCharsToSize(text.length, -5,-30, 0.04);
		case "type":
			return convertCharsToSize(text.length, -5,-20, 0.005, 30);
		case "rules":
			const fontSize = convertCharsToSize(
				text.length,
				-12,
				-50,        // penaltyFloor: lower floor for longer text
				0.03,      // accelerationRate: very gentle curve
				80,        // penaltyStartsAt: start penalty much later
				1,          // curveExponent: nearly linear
				1,          // initialPenalty: minimal base penalty
				'gentle', // scalingMode: gentle for long text
			);

			console.log(fontSize);

			return fontSize;
		default:
			return -5;
	}
}

function toggleMenu() {
	if (document.querySelector('.hamburger').classList.contains('opened')) {
		document.querySelector('.hamburger').classList.remove('opened');
		Array.from(document.querySelectorAll('.menu-visible')).forEach(element => element.classList.remove('menu-visible'));
	} else {
		document.documentElement.style.setProperty('--window-diagonal-size', (Math.floor(Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)) + 100) + 'px');
		document.querySelector('.hamburger').classList.add('opened');
		document.querySelector('.menu').classList.add('menu-visible');
	}
}
function notify(message = '', seconds) {
	var notification = document.createElement('div');
	notification.classList = 'notification padding';
	var notificationMessage = document.createElement('h4');
	notificationMessage.innerHTML = message;
	notification.appendChild(notificationMessage);
	var close = document.createElement('h3');
	close.innerHTML = 'X';
	close.onclick = closeNotification;
	notification.appendChild(close);
	document.querySelector('.notification-container').appendChild(notification);
	if (seconds) {
		setTimeout(function () { close.click(); }, seconds * 1000)
	}
}
function closeNotification(event) {
	var target = event.target.closest('.notification');
	target.classList.add('hidden');
	setTimeout(function () { target.remove(); }, 500);
}
window.onload = function () {
	Array.from(document.querySelectorAll('input')).forEach(element => {
		element.autocomplete = 'off';
	});
}

// Drop to upload
const droppables = document.querySelectorAll('.drop-area');
Array.from(droppables).forEach(element => {
	element.addEventListener('dragenter', dropEnter, false);
	element.addEventListener('dragleave', dropLeave, false);
	element.addEventListener('dragover', dropOver, false);
	element.addEventListener('drop', dropDrop, false);
	element.children[1].addEventListener('click', function () {
		this.value = null;
	}, false);
})
function dropEnter(e) {
	e.preventDefault();
	e.stopPropagation();
	e.target.closest('.drop-area').classList.add('hover');
}
function dropLeave(e) {
	e.preventDefault();
	e.stopPropagation();
	e.target.closest('.drop-area').classList.remove('hover');
}
function dropOver(e) {
	e.preventDefault();
	e.stopPropagation();
	e.target.closest('.drop-area').classList.add('hover');
}
function dropDrop(e) {
	e.preventDefault();
	e.stopPropagation();
	e.target.closest('.drop-area').classList.remove('hover');
	destination = window[e.target.closest('.drop-area')?.querySelector("input").getAttribute('data-dropFunction')];
	otherParams = e.target.closest('.drop-area')?.querySelector("input").getAttribute('data-otherParams');
	uploadFiles(e.dataTransfer.files, destination, otherParams);
}
async function uploadFiles(filesRaw, destination, otherParams = '') {
	var files = ([...filesRaw]);
	if (files.length > 9) {
		if (!confirm('You are uploading ' + files.length + ' images. Would you like to continue?')) {
			return;
		}
	}
	files.forEach(file => {
		var reader = new FileReader();
		reader.onloadend = function () {
			if (otherParams.includes('filename')) {
				otherParams = 'filename=' + file.name;
			}
			destination(reader.result, otherParams);
		}
		reader.onerror = function () {
			destination('/img/blank.png', otherParams);
		}
		reader.readAsDataURL(file);
	})
}

//Collapsible elements
function toggleCollapse(event) {
	event.target.closest('.collapsible').classList.toggle('collapsed');
}

//Input same value still enters
const urlInputs = Array.from(document.querySelectorAll('input[type=url]'));
urlInputs.forEach(element => {
	element.addEventListener('keyup', function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			element.dispatchEvent(new Event('change'));
		}
	});
});

//bind two inputs to match values
function bindInputs(query1, query2, checkbox = false) {
	var e1 = document.querySelector(query1);
	var e2 = document.querySelector(query2);
	if (checkbox) {
		e1.oninput = (event) => { e2.checked = e1.checked; }
		e2.oninput = (event) => { e1.checked = e2.checked; }
	} else {
		e1.oninput = (event) => { e2.value = e1.value; }
		e2.oninput = (event) => { e1.value = e2.value; }
	}
}
