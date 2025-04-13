
let forceReloadForFrameFix = true;
let ubFullFrames = [];
let ubCrownFrames = [];



function sanitizeMasks(masks) {
    return (Array.isArray(masks) ? masks : []).filter(m => m?.src);
}

async function ensureUBFramesLoaded() {
	console.log(availableFrames.map(f => f.name));
	ubFullFrames = availableFrames.map(f => ({ ...f }));
	ubCrownFrames = availableFrames.map(f => ({ ...f }));
	console.log("[UB DEBUG] UB Full Frames:", ubFullFrames.map(f => f.name));
	console.log("[UB DEBUG] UB Crown Frames:", ubCrownFrames.map(f => f.name));
}

async function waitForFramesToBeReady({ timeout = 5000, pollInterval = 100 } = {}) {
	const start = Date.now();
	const allFrames = ubFullFrames.concat(ubCrownFrames);
	while (!allFrames || allFrames.length === 0) {
		if (Date.now() - start > timeout) throw new Error("Timeout waiting for frames to be ready");
		await new Promise(resolve => setTimeout(resolve, pollInterval));
	}
	await Promise.all(allFrames.map(frame => {
		return new Promise(resolve => {
			if (frame.image?.complete) return resolve();
			const img = new Image();
			img.onload = resolve;
			img.onerror = resolve;
			img.src = fixUri(frame.src);
		});
	}));
}

async function drawCardSafeWrapper() {
	const images = [];

	card.frames.forEach(frame => {
		if (frame.image) images.push(frame.image);
		if (frame.masks) {
			frame.masks.forEach(mask => {
				if (mask.image) images.push(mask.image);
			});
		}
	});
	if (art?.src) images.push(art);

	await Promise.all(
		images.map(img =>
			new Promise(resolve => {
				if (img.complete && img.naturalWidth > 0) return resolve();
				img.onload = resolve;
				img.onerror = () => {
					console.warn("[WARN] Failed to load image before draw:", img.src);
					resolve();
				};
			})
		)
	);

	if (!art.complete || art.naturalWidth === 0) {
		console.warn("[BLOCKED] Art image is not ready:", art.src);
		return;
	}
	drawCard();
}


function ensureGalleryExists() {
	let gallery = document.getElementById('cardGallery');
	if (!gallery) {
		gallery = document.createElement('div');
		gallery.id = 'cardGallery';
		gallery.style = 'margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 1rem;';
		const previewCanvas = document.querySelector('#previewCanvas');
		if (previewCanvas?.parentNode) {
			previewCanvas.parentNode.insertBefore(gallery, previewCanvas.nextSibling);
		} else {
			document.body.appendChild(gallery);
		}
	}
}

function parseCSV(text) {
	const rows = text.split('\n');
	const headers = rows.shift().split(',');
	return rows
		.map(row => row.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/))
		.filter(cols => cols.length === headers.length)
		.map(cols => Object.fromEntries(cols.map((val, i) => [headers[i].trim(), val.replace(/^\"|\"$/g, '').replace(/\r$/, '')])));
}

function formatManaCost(raw) {
	if (!raw) return '';
	return raw.toUpperCase().split('').map(c => `{${c}}`).join('');
}

function safeFilename(name) {
	return name.replace(/[^a-z0-9]/gi, '_');
}

function getFrameFromList(name, list) {
	return list.find(f => f.name.toLowerCase() === name.toLowerCase());
}

function getUBFramesForCard({ manaCost, type }) {
	const colorMap = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green' };
	const colors = (manaCost || '')
		.toUpperCase()
		.replace(/[^WUBRG]/g, '')
		.split('')
		.map(c => colorMap[c])
		.filter(Boolean);

	const isLegendary = /\blegendary\b/i.test(type || '');
	const resultFrames = [];

	function cloneFrame(f) {
		return JSON.parse(JSON.stringify(f));
	}

	if (colors.length === 1) {
		const color = colors[0];
		const frame = getFrameFromList(`${color} Frame`, ubFullFrames);

		if (frame) resultFrames.push({ ...cloneFrame(frame), masks: [{ src: "/img/frames/maskLeftHalf.png", name: "Left Half" }] });
		if (frame) resultFrames.push({ ...cloneFrame(frame), masks: [{ src: "/img/frames/maskRightHalf.png", name: "Right Half" }] });

		if (isLegendary) {
			const crown = getFrameFromList(`${color} Legend Crown`, ubCrownFrames);
			if (crown) resultFrames.push(cloneFrame(crown));
			else console.warn(`[WARN] Crown not found for ${color} Legend Crown`);
		}
	} else if (colors.length === 2) {
		const [left, right] = colors;
		const leftFrame = getFrameFromList(`${left} Frame`, ubFullFrames);
		const rightFrame = getFrameFromList(`${right} Frame`, ubFullFrames);
		if (leftFrame) resultFrames.push({ ...cloneFrame(leftFrame), masks: [{ src: "/img/frames/maskLeftHalf.png", name: "Left Half" }] });
		if (rightFrame) resultFrames.push({ ...cloneFrame(rightFrame), masks: [{ src: "/img/frames/maskRightHalf.png", name: "Right Half" }] });

		if (isLegendary) {
			const leftCrown = getFrameFromList(`${left} Legend Crown`, ubCrownFrames);
			const rightCrown = getFrameFromList(`${right} Legend Crown`, ubCrownFrames);
			if (leftCrown) resultFrames.push({ ...cloneFrame(leftCrown), masks: [{ src: "/img/frames/maskLeftHalf.png", name: "Left Half" }] });
			if (rightCrown) resultFrames.push({ ...cloneFrame(rightCrown), masks: [{ src: "/img/frames/maskRightHalf.png", name: "Right Half" }] });
		}
	} else if (colors.length >= 3) {
		const frame = getFrameFromList('Multicolored Frame', ubFullFrames);
		if (frame) resultFrames.push(cloneFrame(frame));
		if (isLegendary) {
			const crown = getFrameFromList('Multicolored Legend Crown', ubCrownFrames);
			if (crown) resultFrames.push(cloneFrame(crown));
		}
	}

	return resultFrames.filter(Boolean);
}


async function loadFrameAssets(frame) {
	frame.image = new Image();
	frame.image.crossOrigin = 'anonymous';
	await new Promise(resolve => {
		frame.image.onload = resolve;
		frame.image.onerror = () => {
			console.warn('[WARN] Failed to load frame image:', frame.name);
			resolve();
		};
		frame.image.src = fixUri(frame.src);
	});

	if (frame.masks) {
		for (const mask of frame.masks) {
			mask.image = new Image();
			mask.image.crossOrigin = 'anonymous';
			await new Promise(resolve => {
				mask.image.onload = resolve;
				mask.image.onerror = resolve;
				mask.image.src = fixUri(mask.src);
			});
		}
	}

	if (!frame.bounds) {
		frame.bounds = { x: 0, y: 0, width: 1, height: 1 };
	}
}

window.generateCardsFromCSV = generateCardsFromCSV;


// The rest of your code remains unchanged from your message.
// For brevity, not repeating the full generateCardsFromCSV or UI setup here,
// since you only needed the frame loading + matching fixed.
// Let me know if you'd like the rest also dropped in!



async function applyCardArtFromCSVRow(row) {
	const customArtPath = row['image_file_path']?.trim();
	// ✅ Skip if no valid file path
	if (!customArtPath || customArtPath === 'img/private/' || !customArtPath.match(/\.(png|jpg|jpeg|gif)$/i)) {
		console.warn('[SKIP] Invalid or empty art path:', customArtPath);
		return;
	}
	return new Promise((resolve) => {
		console.log(`[DEBUG] Applying custom art from path: ${customArtPath}`);
		art.onload = () => {
			
			art.src = fixUri(customArtPath);
			artEdited("Dalle");
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

async function generateCardsFromCSV(rows, { debugMode = true, skipDownload = true, forceDefaultFrame = false } = {}) {
	await document.fonts.ready;
	await ensureUBFramesLoaded();
	setAutoFrame("Universes Beyond (Accurate)");
	ensureGalleryExists();
	console.log("[DEBUG] Available frame names (final):", availableFrames.map(f => f.name));

	const originalArtOnload = art.onload;
	let isFirstCard = true;

	for (const row of rows) {
		try {
			card.text.title.text = (row['Cards'] || 'Untitled').trim();
			card.text.type.text = ((row['Type'] || '') + (row['Subtype'] ? ' — ' + row['Subtype'] : '')).trim();
			card.text.mana.text = formatManaCost(row['Mana cost']);
			card.text.pt.text = (row['p/t'] || '').trim();

			let rulesText = '';
			['Ability', 'Passive', 'Active', 'Quote'].forEach(key => {
				if (row[key]) {
					rulesText += (rulesText ? '\n' : '') + (key === 'Quote' ? '{flavor}' : '') + row[key].trim();
				}
			});
			card.text.rules.text = rulesText;

			// ✅ Set frames AFTER UB frames are available
			card.frames = getUBFramesForCard({
				manaCost: row['Mana cost'],
				type: row['Type']
			});
			defaultFrame = card.frames[0];
			

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

			await autoFrame();
			//await drawFrames();
			await drawCardSafeWrapper(); // ✅ safe drawing after image load


			if (isFirstCard) {
				await new Promise(resolve => setTimeout(resolve, 1200));
				isFirstCard = false;
			}

			await new Promise(r => requestAnimationFrame(r));

			const dataURL = addToGallery();

			if (!skipDownload) {
				const fileName = safeFilename(card.text.title.text.replace(/\{[^}]+\}/g, '') || 'card');
				const downloadLink = document.createElement('a');
				downloadLink.href = dataURL;
				downloadLink.download = fileName + '.png';
				downloadLink.click();
			}

			document.getElementById('savebutton').click();
		} catch (err) {
			console.error('Error generating card:', err);
		}
	}

	art.onload = originalArtOnload;
}

window.generateCardsFromCSV = generateCardsFromCSV;


function addToGallery() {
	const canvas = (typeof cardCanvas !== 'undefined') ? cardCanvas : document.querySelector('canvas');
	const dataURL = canvas.toDataURL('image/png');
 	const imgElem = document.createElement('img');
	imgElem.src = dataURL;
	imgElem.alt = card.text.title.text || 'Card Image';
	imgElem.style = 'max-width: 250px; height: auto;';
	document.getElementById('cardGallery').appendChild(imgElem); 
	return dataURL;
}

function setupCSVImportUI() {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.csv';
	input.style = 'margin: 1rem;';

	const button = document.createElement('button');
	button.textContent = 'Import CSV Cards';
	button.style = 'margin: 1rem;';
	button.onclick = () => input.click();

	input.onchange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;
		const text = await file.text();
		const data = parseCSV(text);
		await generateCardsFromCSV(data);
	};

	document.body.appendChild(button);
	document.body.appendChild(input);
}

function downloadCardImage() {
	const link = document.createElement('a');
	link.download = getCardName().replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
	link.href = cardCanvas.toDataURL('image/png');
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

if (document.readyState !== 'loading') {
	setupCSVImportUI();
} else {
	document.addEventListener('DOMContentLoaded', setupCSVImportUI);
}

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
