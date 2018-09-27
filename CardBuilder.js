var body = document.getElementById("_body");
var cardsData;
var settingsData;
var completedPreparationSteps = 0;
var TOTAL_PREP_STEPS = 4;
var canvases = [];
var cardArt = [];
var imgCardBorder = new Image();
imgCardBorder.src = "CardData/Components/cardBorder.png";
imgCardBorder.onload = function() {
	completedPreparationSteps++;
	if(completedPreparationSteps == TOTAL_PREP_STEPS) {
		BuildCards();
	}
};

// fetch file content
var readRequestCards = new XMLHttpRequest();
readRequestCards.overrideMimeType("application/json");
readRequestCards.open("GET", "CardData/Test/cards.json", true);
readRequestCards.onreadystatechange = function () {
	if (readRequestCards.readyState === 4) {
		if (readRequestCards.status === 200 || readRequestCards.status == 0) {
			cardsData = JSON.parse(readRequestCards.responseText);
			console.log(cardsData);

			completedPreparationSteps++;
			// this can't be the last operation, because we do another operation after this one
			loadCardArt();
		}
	}
};
readRequestCards.send(null);

var readRequestSettings = new XMLHttpRequest();
readRequestSettings.overrideMimeType("application/json");
readRequestSettings.open("GET", "CardData/Components/settings.json", true);
readRequestSettings.onreadystatechange = function() {
	if (readRequestSettings.readyState === 4) {
		if (readRequestSettings.status === 200 || readRequestSettings.status == 0) {
			settingsData = JSON.parse(readRequestSettings.responseText);
			console.log(settingsData);

			completedPreparationSteps++;
			if(completedPreparationSteps == TOTAL_PREP_STEPS) {
				BuildCards();
			}
		}
	}
};
readRequestSettings.send(null);

function loadCardArt() {
	for(var index in cardsData.cards) {
		var card = cardsData.cards[index];
		var img = new Image();
		img.src = "CardData/Test/".concat(card.img);

		cardArt.push(img);

		var loadedImages = 0;

		img.onload = function () {
			loadedImages++;
			if(loadedImages == cardsData.cards.length) {
				completedPreparationSteps++;
				if(completedPreparationSteps == TOTAL_PREP_STEPS) {
					BuildCards();
				}
			}
		}
	}
}

function BuildCards() {
	console.log("BUILDING");
	// slightly hack-y there is probably a more elegant way to do this
	for(var index in cardsData.cards) {
		var card = cardsData.cards[index];

		// create the canvas that holds the card
		var canvas = document.createElement("canvas");
		canvas.width = 200;
		canvas.height = 400;
		canvases.push(canvas);
		document.getElementById("_body").appendChild(canvas);

		var ccontext = canvas.getContext("2d");
		//contexts.push(ccontext);
		// construct the card on the canvas
		// 1) racial background
		if(card.race.length > 1) {
			var backgroundGradient = ccontext.createLinearGradient(0,0,200, 0);
			var point = 0.05; // if 200px is 1 then 10px is 0.05
			var colorBlockWidth = ((180-10*(card.race.length-1))/card.race.length)/200; // width of one full color block (10px is transition space)
			// add first color stop
			backgroundGradient.addColorStop(point, getColorFromRace(card.race[0]));
			// add color stops
			for(var i = 1; i < card.race.length; i++) {
				point += colorBlockWidth;
				backgroundGradient.addColorStop(point, getColorFromRace(card.race[i-1]));
				point += 0.05; // 10px of transition space
				backgroundGradient.addColorStop(point, getColorFromRace(card.race[i]));
			}
			// add last color stop
			point += colorBlockWidth;
			backgroundGradient.addColorStop(point, getColorFromRace(card.race[card.race.length - 1]));
			// set the fillStyle
			ccontext.fillStyle = backgroundGradient;
		}
		else {
			// one color
			ccontext.fillStyle = getColorFromRace(card.race[0]);
		}
		// draw the rect with the selected fillStyle
		ccontext.fillRect(0,0,200, 400);

		// 2) draw the card border on top of the background
		ccontext.drawImage(imgCardBorder, 0, 0, 200, 400);

		// 3) draw the card art
		ccontext.drawImage(cardArt[index], 10, 55, 90, 170);

		// 4) draw the card name
		

	}
}

function getColorFromRace(race) {
	if(settingsData.races.hasOwnProperty(race)) {
		return settingsData.races[race]; // bracket notation works with object properties as well!
	}
	else {
		return "#ffffff";
	}
}