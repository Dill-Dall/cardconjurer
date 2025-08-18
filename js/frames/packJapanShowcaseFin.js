//Create objects for common properties across available frames
var bounds = {x:0.7771, y:0.8876, width:0.1720, height:0.0593};
var boundsStamp = {x:0.4365, y:0.902, width:0.1264, height:0.0452};
var bounds3 = {x:0, y:0, width:1, height:1};

//defines available frames

availableFrames = [
	{name:'Collector Line', src:'/img/frames/m15/japanShowcase/mask/MaskBottom.png'},
];
//disables/enables the "Load Frame Version" button
document.querySelector('#loadFrameVersion').disabled = false;
//defines process for loading this version, if applicable
document.querySelector('#loadFrameVersion').onclick = async function() {
	//resets things so that every frame doesn't have to
	await resetCardIrregularities();
	//sets card version
	card.version = 'japanShowcase';
	//art bounds
	card.artBounds = {x:0, y:0, width:1, height:0.9224};
	autoFitArt();
	//set symbol bounds
	card.setSymbolBounds = {x:0.91, y:0.635, width:0.12, height:0.0410, vertical:'center', horizontal: 'right', outlineWidth:0.003, outlineColor:'black'};
	resetSetSymbol();
	//watermark bounds
	card.watermarkBounds = {x:0.5, y:0.7762, width:0.75, height:0.2305};
	resetWatermark();
	//text
	loadTextOptions({
		mana: {name:'Mana Cost', text:'', y:0.0683, width:0.9190, height:71/2100, oneLine:true, size:71/1638, align:'right', outlineWidth:0.010, manaCost:true, manaSpacing:0,},
		nickname: {name:'Nickname', text:'', x:0.090, y:0.0582, width:0.8292, height:0.0543, outlineWidth:0.008, oneLine:true, font:'belerenb', size:0.0381, color:'white',},
		title: {name:'Title', text:'', x:0.090, y:0.1200, width:0.768, height:0.0243, oneLine:true, outlineWidth:0.0065, font:'mplantini', size:0.0229, color:'white', align:'left'},
		type: {name:'Type', text:'', x:0.0854, y:0.612, width:0.71, height:0.0543, oneLine:true, font:'belerenb', size:0.0279, outlineWidth:0.008, color:'white'},
		rules: {name:'Rules Text', text:'', x:0.086, y:0.692, width:0.771, height:0.206, size:0.033, outlineWidth:0.008, font:'Plantin MT Pro', color:'white'},
		pt: {name:'Power/Toughness', text:'', x:0.804, y:0.866, width:0.1180, height:0.049, size:0.04,  outlineWidth:0.008, font:'belerenbsc', oneLine:true, align:'center', color:'white'}
	});
}
//loads available frames
loadFramePack();