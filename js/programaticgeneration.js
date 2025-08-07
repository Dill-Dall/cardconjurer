function parseCSV(text) {
	const rows = [];
	let currentRow = [];
	let currentCell = '';
	let insideQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const nextChar = text[i + 1];

		if (char === '"') {
			if (insideQuotes && nextChar === '"') {
				// Escaped quote
				currentCell += '"';
				i++; // Skip next quote
			} else {
				insideQuotes = !insideQuotes;
			}
		} else if (char === ',' && !insideQuotes) {
			currentRow.push(currentCell);
			currentCell = '';
		} else if ((char === '\n' || char === '\r') && !insideQuotes) {
			if (currentCell || currentRow.length) {
				currentRow.push(currentCell);
				rows.push(currentRow);
				currentRow = [];
				currentCell = '';
			}
			// Skip \r\n sequence
			if (char === '\r' && nextChar === '\n') i++;
		} else {
			currentCell += char;
		}
	}

	// Add final row if missing newline
	if (currentCell || currentRow.length) {
		currentRow.push(currentCell);
		rows.push(currentRow);
	}

	const headers = rows.shift().map(h => h.trim());
	return rows
		.filter(cols => cols.length === headers.length)
		.map(cols => Object.fromEntries(cols.map((val, i) => [headers[i], val.replace(/\r$/, '')])));
}


function formatManaCost(raw) {
	if (!raw) return '';
	return raw
		.trim()
		.match(/\{[^}]+}|[^{}]/g)  // Matches {X} or individual characters not in {}
		.map(c => c.startsWith('{') ? c : `{${c.toUpperCase()}}`)
		.join('');
}

function safeFilename(name) {
	return name.replace(/[^a-z0-9]/gi, '_');
}

function addToGallery() {
	const canvas = (typeof cardCanvas !== 'undefined') ? cardCanvas : document.querySelector('canvas');
	const dataURL = canvas.toDataURL('image/png');
	const imgElem = document.createElement('img');
	imgElem.src = dataURL;
	imgElem.alt = card.text.title.text || 'Card Image';
	imgElem.style = 'max-width: 250px; height: auto;';
	const gallery = document.getElementById('cardGallery');

	if (gallery) {
		gallery.appendChild(imgElem)
	}

	return dataURL;
}

async function applyCardArtFromCSVRow(row) {
	const customArtPath = row['image_file_path']?.trim();
	// ✅ Skip if no valid file path
	if (!customArtPath || customArtPath === 'assets/creatures/' || !customArtPath.match(/\.(png|jpg|jpeg|gif)$/i)) {
		console.warn('[SKIP] Invalid or empty art path:', customArtPath);
		return;
	}
	return new Promise((resolve) => {
		console.log(`[DEBUG] Applying custom art from path: ${customArtPath}`);
		art.onload = () => {

			art.src = fixUri(customArtPath);
			artEdited();
			console.log(`[DEBUG] Art loaded from path: ${customArtPath}`);
			resolve();
		};
		art.onerror = () => {
			if (!art.src.includes('/img/blank.png')) {
				art.src = fixUri('/img/blank.png');
			}
			resolve(); // fallback to blank
		};
		setImageUrl(art, customArtPath);
	});
}

function setDiStandard() {
	artistEdited("DTF");
}

async function generateCardsFromCSV(rows, { debugMode = true, skipDownload = true, forceDefaultFrame = false } = {}) {
	await document.fonts.ready;

	enableNewCollectorInfoStyle();
	setDiStandard();

	setCollectorInfo({
		setCode: "DIN",
		lang: "EN",
		note: "D.I.",
		number: "2025"
	});

	console.log("[DEBUG] Available frame names (final):", availableFrames.map(f => f.name));

	const originalArtOnload = art.onload;

	for (const row of rows) {
		card.frames = [];
		try {
			if (!row['Cards']) {
				console.warn('[SKIP] No card name found in row:', row);
				continue;
			}

			if (row['Status'] === "Canceled") {
				console.warn('[SKIP] Canceled card detected, ignoring:', row);
				continue;
			}

			console.log(row['Cards']);

			card.text.title.text = (row['Cards'] || 'Untitled').trim();
			card.text.type.text = ((row['Type'] || '') + (row['Subtype'] ? ' — ' + row['Subtype'] : '')).trim();
			card.text.mana.text = formatManaCost(row['Mana cost']);
			card.text.pt.text = (row['p/t'] || '').trim();

			Object.entries(card.text).forEach(([key, textObject]) => {
				card.text[key].fontSize = getBaseSize(textObject.text.length);
			})

			const rarity = row['R']?.trim().toLowerCase() ?? "c";
			const setSymbolIcon = row['Set Symbol']?.trim().toLowerCase() ?? (['u', 'r', 'm'].includes(rarity) ? rarity : "c");
			const setSymbolUri = "/img/setSymbols/private/di-" + setSymbolIcon + ".svg";

			card.infoRarity = rarity.toUpperCase();

			console.log(`[DEBUG] Rarity image path: ${setSymbolUri}`);
			fetchDISetSymbol(setSymbolUri);

			let rulesText = '';
			['Ability', 'Passive', 'Active', 'Flavour Text'].forEach(key => {
				if (row[key]) {
					row[key] = row[key].replace(/"/g, "");

					rulesText = '';

					['Std Ability', 'Ability', 'Passive', 'Active', 'Flavour Text'].forEach(innerKey => {
						if (row[innerKey]) {
							let columnText = row[innerKey].trim();

							if (columnText) {
								switch (innerKey) {
									case 'Std Ability':
										rulesText += columnText + "\n{down30}";
										break;
									case 'Flavour Text':
										console.log(`[DEBUG] Flavour Text: ${columnText}`);
										rulesText = rulesText.trim(); // Remove previous "\n"
										rulesText += "{flavor}" + columnText;
										break;
									default:
										rulesText += columnText + '\n';
										break;
								}
							}
						}
					});
				}
			});

			card.text.rules.text = rulesText.trim();
			console.log(`[${row['Cards']}] Applied frames:`, card.frames.map(f => f.name));

			await Promise.all(
				card.frames.map(f => new Promise(async resolve => {
					// Load frame image
					await new Promise(frameResolve => {
						f.image = new Image();
						f.image.crossOrigin = 'anonymous';
						f.image.onload = frameResolve;
						f.image.onerror = () => {
							console.error('[ERROR] Failed to load frame:', f.name, f.src);
							frameResolve();
						};
						f.image.src = fixUri(f.src);
					});

					// Load masks sequentially (to ensure order)
					if (f.masks) {
						for (const mask of f.masks) {
							await new Promise(maskResolve => {
								mask.image = new Image();
								mask.image.crossOrigin = 'anonymous';
								mask.image.onload = maskResolve;
								mask.image.onerror = maskResolve;
								mask.image.src = fixUri(mask.src);
							});
						}
					}

					// Apply default bounds if not set
					if (!f.bounds) {
						f.bounds = { x: 0, y: 0, width: 1, height: 1 };
					}

					if (card.frames.length >= 2) {
						await new Promise(r => setTimeout(r, 500));
					}

					resolve();
				}))
			);

			await applyCardArtFromCSVRow(row);

			document.getElementById('savebutton').click();

			const dataURL = addToGallery();

			if (!skipDownload) {
				const fileName = safeFilename(card.text.title.text.replace(/\{[^}]+\}/g, '') || 'card');
				const downloadLink = document.createElement('a');
				downloadLink.href = dataURL;
				downloadLink.download = fileName + '.png';
				downloadLink.click();
			}
		} catch (err) {
			console.error('Error generating card:', err);
		}
	}

	art.onload = originalArtOnload;

	// Reload window
	window.location.reload();
}

window.generateCardsFromCSV = generateCardsFromCSV;

function importCsv() {
	const inputElement = document.createElement('import-csv-input');
	if (!inputElement) {
		throw new Error('CSV input is missing.');
	}

	document.getElementById('import-csv-input').click();
}

async function onImportCsv(event) {
	console.log('File selected:', event.target.files[0]);
	const file = event.target.files[0];
	if (!file) return;
	const text = await file.text();
	const data = parseCSV(text);
	await generateCardsFromCSV(data);
}

/*function downloadCardImage() {
	const link = document.createElement('a');
	link.download = getCardName().replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
	link.href = cardCanvas.toDataURL('image/png');
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}*/

document.addEventListener('DOMContentLoaded', function () {
	document.body.dispatchEvent(new Event('doCreate'));
});

document.onkeyup = function (e) {
	if (document.activeElement === document.getElementById('text-editor')) {
		if (e.ctrlKey && e.which == 73) {
			toggleTextTag('i');
			e.preventDefault();
		}
	}
}
