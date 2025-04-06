let forceReloadForFrameFix = true;


async function waitForRender(timeout = 500) {
	return new Promise(resolve => setTimeout(resolve, timeout));
}

function waitForFrameLoaderComplete() {
	return new Promise(resolve => {
		const original = document.querySelector('#loadFrameVersion').onclick;
		document.querySelector('#loadFrameVersion').onclick = async function () {
			await original();
			resolve();
		};
	});
}

function parseCSV(text) {
	const rows = text.split('\n');
	const headers = rows.shift().split(',');
	return rows
		.map(row => row.split(/,(?=(?:[^"]*\"[^"]*\")*[^"]*$)/))
		.filter(cols => cols.length === headers.length)
		.map(cols => Object.fromEntries(cols.map((val, i) => [headers[i].trim(), val.replace(/^\"|\"$/g, '').replace(/\r$/, '')])));
}

function formatManaCost(raw) {
	if (!raw) return '';
	return raw.toUpperCase().split('').map(c => `{${c}}`).join('');
}

function extractColors(manaCost) {
	const colorMap = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green' };
	const seen = new Set();
	if (manaCost) {
		[...manaCost.toUpperCase()].forEach(c => { if (colorMap[c]) seen.add(colorMap[c]); });
	}
	return [...seen];
}

(function () {
	const previewCanvas = document.querySelector('#previewCanvas');
	let gallery = document.getElementById('cardGallery');
	if (!gallery) {
		gallery = document.createElement('div');
		gallery.id = 'cardGallery';
		gallery.style = 'margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 1rem;';
		if (previewCanvas && previewCanvas.parentNode) {
			previewCanvas.parentNode.insertBefore(gallery, previewCanvas.nextSibling);
		} else {
			document.body.appendChild(gallery);
		}
	}

	function safeFilename(name) {
		return name.replace(/[^a-z0-9]/gi, '_');
	}

	function getFramesMatchingNames(names) {
		return (typeof availableFrames !== 'undefined')
			? availableFrames.filter(f => names.includes(f.name))
			: [];
	}

	async function applyCardArtFromCSVRow(row) {
		const customArtPath = row['image_file_path']?.trim();
		if (!customArtPath) return;

		return new Promise((resolve, reject) => {
			art.onload = () => {
				artEdited();
				resolve();
			};
			art.onerror = () => {
				if (!art.src.includes('/img/blank.png')) {
					art.src = fixUri('/img/blank.png');
				}
				resolve(); // fallback to blank, continue
			};
			setImageUrl(art, customArtPath);
		});
	}



	async function generateCardsFromCSV(rows, { debugMode = true, skipDownload = true, forceDefaultFrame = false } = {}) {
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

				card.version = 'ubFull';
				const button = document.querySelector('#loadFrameVersion');
				if (button && typeof button.onclick === 'function') {
					button.disabled = false;
					await button.onclick();
				}

				while (!Array.isArray(availableFrames) || availableFrames.length === 0) {
					await new Promise(resolve => setTimeout(resolve, 100));
				}
				await applyCardArtFromCSVRow(row);
				const manaCostRaw = (row['Mana cost'] || '').toUpperCase().replace(/[^WUBRG]/g, '');
				const colorMap = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green' };
				const colors = [...manaCostRaw].map(c => colorMap[c]).filter(Boolean);
				const baseFrame = colors.length === 0 ? 'Artifact Frame' : colors.length > 1 ? 'Multicolored Frame' : `${colors[0]} Frame`;
				const legendCrown = (row['Type'] && row['Type'].toLowerCase().includes('legendary'))
					? (colors.length > 1 ? 'Multicolored Legend Crown' : `${colors[0]} Legend Crown`) : null;

				if (colors.length === 2 && !forceDefaultFrame && !debugMode) {
					const leftFrameName = `${colors[0]} Frame`;
					const leftFrame = getFramesMatchingNames([leftFrameName]);
					const rightFrameName = `${colors[1]} Frame`;
					const rightFrame = getFramesMatchingNames([rightFrameName]);
					card.frames = [
						...leftFrame.map(f => ({ ...f, x: 0, y: 0, width: 0.5, height: 1 })),
						...rightFrame.map(f => ({ ...f, x: 0.5, y: 0, width: 0.5, height: 1 }))
					];
					if (legendCrown) {
						console.log(`[${row['Cards']}] Legend Crown:`, legendCrown);
						card.frames.push(...getFramesMatchingNames([legendCrown]));
					}
				} else {
					console.log(`[${row['Cards']}] Single frame:`, baseFrame);
					card.frames = getFramesMatchingNames([baseFrame]);
					if (legendCrown) card.frames.push(...getFramesMatchingNames([legendCrown]));
				}

				card.frames.forEach(frame => {
					if (forceReloadForFrameFix || !frame.image) {
						frame.image = new Image();
						frame.image.crossOrigin = 'anonymous';
						frame.image.onload = drawFrames;
						frame.image.src = fixUri(frame.src);
					}

					if (frame.masks) {
						frame.masks.forEach(mask => {
							if (forceReloadForFrameFix || !mask.image) {
								mask.image = new Image();
								mask.image.crossOrigin = 'anonymous';
								mask.image.onload = drawFrames;
								mask.image.src = fixUri(mask.src);
							}
						});
					}
				});
				forceReloadForFrameFix = false;

				await autoFrame();
				drawCard();

				if (isFirstCard) {
					await new Promise(resolve => setTimeout(resolve, 1200));
					isFirstCard = false;
				}

				if (row['Image'] && row['Image'].trim() !== '') {
					await new Promise((resolve, reject) => {
						art.onload = () => resolve();
						art.onerror = err => reject(new Error(`Image load failed: ${row['Image']}`));
						setImageUrl(art, row['Image'].trim());
					});
					autoFitArt();
				}




				await drawText();
				await new Promise(r => requestAnimationFrame(r));

				const canvas = (typeof cardCanvas !== 'undefined') ? cardCanvas : document.querySelector('canvas');
				const dataURL = canvas.toDataURL('image/png');
				const imgElem = document.createElement('img');
				imgElem.src = dataURL;
				imgElem.alt = card.text.title.text || 'Card Image';
				imgElem.style = 'max-width: 250px; height: auto;';
				gallery.appendChild(imgElem);

				


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
})();





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