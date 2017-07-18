// Variables globales
var realWindow = window.parent || window;	// Window Iframe
var canvas, stage;							// Canvas et scène
var canvasHeight, canvasWidth;				// Taille du canvas
var preload;								// Preload
var score = 0;								// Score
var pauseButton;							// Bouton de pause
var tetromino = false;						// Pièces de Tetris
var tetrominoHitbox;						// Hitbox de la pièce de Tetris (tetromino)
var tetrominoes = [];						// Pièces sur la scène
var tetrominoFalling;						// Chute de la pièce de Tetris (intervalle)
var level = 0;								// Niveau
var overlay = false;						// Overlay de pause
var pipe;									// Tuyau d'arrivée des pièces de Tetris
var tetrominoActionArea;					// Area d'action de la pièce de Tetris
var pauseTxt;								// Texte de pause
var scoreTxt;								// Texte de score
var logo;									// Logo du jeu
var loadTitle;								// Titre de chargement
var loadPercent = 0;						// Pourcentage de chargement
var tetrominoOrientation;					// Orientation du tetromino
var music;									// Musique de fond en cours de lecture

var tetrominoSpawn;							// Coordonnées d'apparition des pièces de Tetris

var tetrominoColors = [						// Liste des couleurs possibles pour les tetrominos
	'#0097D4',
	'#F42F1A',
	'#FFCE16'
];

var background = '#FFFFFF';
var backgroundIMG;

var src = [						// Liste des sources
	{id: 'logo', src: 'assets/img/logo.png'},
	{id: 'plateform', src: 'assets/img/plateform.png'},
	{id: 'pause', src: 'assets/img/pause.png'},
	{id: 'pipe', src: 'assets/img/pipe.png'},
	{id: 'map', src: 'assets/img/map.png'}
];

var musicSrc = [
	{id: 'menuMusic', src: 'assets/audio/Mirror\'s Edge - Still Alive 8-bit - Gregory Frasfert.mp3'},
	{id: 'gameMusic', src: 'assets/audio/I Took A Pill Ibiza - 8 Bit Universe.mp3'}
]

var soundSrc = [
	{id: 'rotate', src: 'assets/audio/rotate.ogg'},
	{id: 'move', src: 'assets/audio/move.ogg'},
	{id: 'fall', src: 'assets/audio/fall.ogg'},
	{id: 'out', src: 'assets/audio/out.wav'},
	{id: 'next', src: 'assets/audio/next.wav'},
	{id: 'loaded', src: 'assets/audio/loaded.mp3'},
];

var yeahSoundSrc = [
	{id: 'start', src: 'assets/audio/start.wav'},
	{id: 'wow', src: 'assets/audio/wow.wav'},
	{id: 'ok', src: 'assets/audio/ok.wav'},
	{id: 'okidoki', src: 'assets/audio/okidoki.wav'},
	{id: 'yaouw', src: 'assets/audio/yaouw.wav'},
	{id: 'wahaha', src: 'assets/audio/wahaha.wav'},
	{id: 'excellent', src: 'assets/audio/excellent.wav'},
]

var tetrominoesSrc = [			// Liste des sources de tetrominoes
	{id: 1, src: 'assets/img/tetrominoes/1.png'},
	{id: 2, src: 'assets/img/tetrominoes/2.png'},
	{id: 3, src: 'assets/img/tetrominoes/3.png'},
	{id: 4, src: 'assets/img/tetrominoes/4.png'},
	{id: 5, src: 'assets/img/tetrominoes/5.png'},
];

var tetrominoesAreaSrc = [		// Liste des sources de tetrominoes
	{id: '1_actionArea', src: 'assets/img/tetrominoes/area/1.png'},
	{id: '2_actionArea', src: 'assets/img/tetrominoes/area/2.png'},
	{id: '3_actionArea', src: 'assets/img/tetrominoes/area/3.png'},
	{id: '4_actionArea', src: 'assets/img/tetrominoes/area/4.png'},
	{id: '5_actionArea', src: 'assets/img/tetrominoes/area/5.png'},
];

var shapesSrc = [				// Liste des sources de formes
	{id: 'box', src: 'assets/img/shapes/box.png', px: 16},
	{id: 'mushroom', src: 'assets/img/shapes/mushroom.png', px: 8},
	{id: 'flappy', src: 'assets/img/shapes/flappy.png', px: 4},
	{id: 'coin', src: 'assets/img/shapes/coin.png', px: 4},
];

// Paramètres

var fps = 60;			// Nombre d'images par seconde
var gravity = 2;		// Gravité (px/frame)
var tetrominoSize = 20;	// Taille d'un bloc de Pièce de Tetris

//  Programme principal

function init( evt ) {
    // Easter Egg
    console.log('%cTetris Party', 'color: #45352E; font-size: 5em;');
    console.log('%cMaintenant c\'est à vous de jouer !', 'color: #f42f1a;');
    
	// Initialisation de la scène
	canvas = document.getElementById('canvas');
	stage = new createjs.Stage('canvas');

	// Taille et hauteur du Canvas
	canvasWidth = stage.canvas.width;
	canvasHeight = stage.canvas.height;

	tetrominoSpawn = {
		'y': tetrominoSize * 3,
		'x': canvasWidth / 2
	};

	// Fonctions
	preload = new createjs.LoadQueue();

	// Concaténation des sources
	src = src.concat(tetrominoesSrc);
	src = src.concat(tetrominoesAreaSrc);
	src = src.concat(shapesSrc);
	src = src.concat(musicSrc);
	src = src.concat(soundSrc);
	src = src.concat(yeahSoundSrc);

	createjs.Sound.alternateExtensions = ["mp3"];
	preload.installPlugin(createjs.Sound);

	// Gestion du preload
	preload.loadManifest(src);

	loading();

	preload.on('complete', handleLoaded);
	preload.on('progress', handleProgress);

	// Gestion du clavier
	realWindow.addEventListener('keydown', handleKeyDown);
	// window.addEventListener('keyup', handleKeyUp);

	// Boucle de rafraîchissement
	createjs.Ticker.setFPS(fps);
	createjs.Ticker.addEventListener('tick', tick);
}

function play() {
	createHUD(level); // Créer l'interface de jeu
	addTetromino(); // Ajoute la pièce de tetris
}

// Fonction de chargement
function loading() {

	// Chargement
	loadTitle = new createjs.Text();
	loadTitle.font = 'lighter ' + tetrominoSize * 1.2 + 'px Arial';
	loadTitle.color = '#45352E';
	loadTitle.textAlign = 'center';
	loadTitle.text = 'Chargement';
	loadTitle.x = canvasWidth / 2;
	loadTitle.y = canvasHeight / 2;

	// Pourcentage de chargement
	loadPercent = new createjs.Text();
	loadPercent.font = 'bolder ' + tetrominoSize * 1.5 + 'px Arial';
	loadPercent.color = loadTitle.color;
	loadPercent.textAlign = loadTitle.textAlign;
	loadPercent.text = score;
	loadPercent.x = loadTitle.x;
	loadPercent.y = loadTitle.y + tetrominoSize * 1.5;

	stage.addChild(loadTitle, loadPercent);

}

// Fonction de traitement du chargement
function handleLoaded() {

	// Bruitage de lancement
	sound = createjs.Sound.play('loaded');
	sound.volume = 0.06;

	// Chargement terminé
	loadTitle.text = 'Chargement terminé'
	loadPercent.text = 'Cliquez pour commencer';
	canvas.classList ? canvas.classList.add('loaded') : canvas.className += ' loaded';

	// Titres musiques
	musicTitle = new createjs.Text();
	musicTitle.font = 'lighter ' + tetrominoSize * .5 + 'px Arial';
	musicTitle.color = '#45352E';
	musicTitle.textAlign = 'center';
	musicTitle.text = 'Musiques utilisées : "Still Alive 8-bit - Gregory Frasfert" et "Tetris Theme - 8-Bit Universe"';
	musicTitle.x = canvasWidth / 2;
	musicTitle.y = canvasHeight - tetrominoSize;

	// Auteur et "copyright"
	authorTitle = new createjs.Text();
	authorTitle.font = 'lighter ' + tetrominoSize * .5 + 'px Arial';
	authorTitle.color = '#45352E';
	authorTitle.textAlign = 'center';
	authorTitle.text = 'Le jeu et le logo "TetrisParty" sont la propriété de Clément MOINE © 2017';
	authorTitle.x = canvasWidth / 2;
	authorTitle.y = canvasHeight - tetrominoSize * 2;

	// Logo du jeu
	logo = new createjs.Bitmap(preload.getResult('logo'));
	logo.regX = logo.image.width / 2;
	logo.regY = logo.image.height / 2;
	logo.x = canvasWidth / 2;
	logo.y = tetrominoSize * 8;
    
	// Fond du jeu
	backgroundIMG = new createjs.Bitmap(preload.getResult('map'));
	backgroundIMG.scaleY = backgroundIMG.scaleX = canvasHeight /backgroundIMG.image.height;
	backgroundIMG.regY = 0;
	backgroundIMG.regX = 0;
	backgroundIMG.x = 0;
	backgroundIMG.y = 0;
	backgroundIMG.alpha = 0;

	createjs.Tween.get(backgroundIMG).to({
        alpha: 1
    }, 200).call(animateBackground);
    
	// Ajout à la scène
	stage.addChild(backgroundIMG, logo, musicTitle, authorTitle);

	// Lancement de la musique du menu
	setTimeout( function() {
		music = createjs.Sound.play('menuMusic');
		music.volume = 0.7;
		music.loop = -1;
	}, 1000);

	// Au clic, lancer le jeu
	canvas.addEventListener('click', handleClick);
}

function animateBackground() {
	backgroundIMG.x = 0;
	backgroundIMG.y = 0;

    createjs.Tween.get(backgroundIMG).to({
        x: - (( backgroundIMG.image.width * backgroundIMG.scaleX ) - canvasWidth),
    }, 480000).call(animateBackground);    
}

// Fonction de traitement de la progression du chargement
function handleProgress() {
	loadPercent.text = Math.round(preload.progress*100) + '%';
}

// Fonction de traitement du clic
function handleClick() {
	music.stop(); // Stop la précédente musique

	// Lancement de la musique du jeu
	music = createjs.Sound.play('gameMusic');
	music.volume = .2;
	music.loop = -1;

	// Effet sonore
	sound = createjs.Sound.play('start');
	sound.volume = .2;

	stage.removeAllChildren();
	stage.addChild(backgroundIMG); // Affichage du fond
	
	canvas.removeEventListener('click', handleClick);

	// Démarrage du jeu
	play();	
}

// Ouverture du menu de pause
function openPauseMenu() {
	if ( ! overlay ) { // Si l'overlay n'existe pas déjà, autrement dit si le jeu n'est pas déjà en pause
		music.paused = true;
		overlay = new createjs.Shape();
	    overlay.graphics.beginFill('#45352E');
	    overlay.graphics.drawRect(0, 0, canvasWidth, canvasHeight);
	    overlay.graphics.endFill();
	    overlay.alpha = .3;

	    // Titre de pause
	    pauseTxt = new createjs.Text();
		pauseTxt.font = 'lighter ' + tetrominoSize * 1.2 + 'px Arial';
		pauseTxt.color = background;
		pauseTxt.textAlign = 'center';
		pauseTxt.text = 'Pause';
		pauseTxt.x = canvasWidth / 2;
		pauseTxt.y = canvasHeight / 2;
		pauseTxt.shadow = new createjs.Shadow('rgba(69, 53, 46, 1)', 2 , 2 , 2);

		stage.addChild(overlay, pauseTxt);
    	stage.setChildIndex(pauseButton, stage.getNumChildren()-1);
	}
}

// Fermeture du menu de pause
function closePauseMenu() {
	stage.removeChild(overlay);
	stage.removeChild(pauseTxt);
	music.paused = false;
	overlay = false;
}

// HEXA vers RGB
function hexToRGB( hex ) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

// Ajout d'un tetromino à la scene
function addTetromino() {

	// Création du tetromino
	tetromino = createTetromino();

	scoreTxt.text = score;

	if ( tetrominoActionArea !== false ) {
		stage.removeChild(tetrominoActionArea);
	}

	// Création de la hitbox du tetromino sur les bases du tetromino
	tetrominoHitbox = createTetromino(tetromino.id, '#000000', tetromino.orientation, false);
	tetrominoHitbox = tetrominoHitbox.object; // Affectation de l'objet retourné
	tetrominoHitbox.y += tetrominoSize; // Décalage d'un pixel pour créer une hitbox "prédictive"
	tetrominoHitbox.visible = false; // Masque la hitbox
	tetrominoOrientation = tetromino.orientation;

	tetrominoActionArea = tetromino.actionArea;

	tetromino = tetromino.object; // Affectation de l'objet retourné

	// Ajout à la scène
	stage.addChild(tetrominoActionArea, tetrominoHitbox, tetromino);

	// Ajustement du Z-INDEX
	stage.setChildIndex(tetromino, stage.getChildIndex(pipe));
	stage.setChildIndex( tetrominoActionArea, stage.getChildIndex(plateform));

	// Lance l'animation de déplacement
	drawToDown();
}

// Prise en charge de l'appui sur une touche
function handleKeyDown( evt ) {

	var key = evt.keyCode || evt.which;

	// Touches fléchées
	var arrow = {
		left: 37,
		up: 38,
		right: 39,
		down: 40
	};

	// Touches lettrées
	var letter = {
		q: 68,
		s: 83,
		d: 81,
		z: 90
	}

	// Touche Espace
	var spacebar = 32;

	if ( tetromino ) {
		switch ( key ) {
			// Déplacement sur la droite
			case arrow.right :
			case letter.q :
				// Déplacement de la hitbox (invisible) pour tester la collision avant déplacer la pièce
				tetrominoHitbox.x += tetrominoSize;
				tetrominoHitbox.y -= tetrominoSize;

				if (! collision(true) ) { // S'il n'y a pas de collision, faire avancer la pièce
					tetrominoActionArea.x = tetromino.x = tetrominoHitbox.x;
					drawToDown();
				}

				// Déplacement de la hitbox (invisible)
				tetrominoHitbox.x = tetromino.x;
				tetrominoHitbox.y += tetrominoSize;

				// Effet sonore
				sound = createjs.Sound.play('move');
				sound.volume = .2;

			break;

			// Déplacement sur la gauche
			case arrow.left :
			case letter.d :
				// Déplacement de la hitbox (invisible) pour tester la collision avant déplacer la pièce
				tetrominoHitbox.x -= tetrominoSize;
				tetrominoHitbox.y -= tetrominoSize;

				if (! collision(true) ) { // S'il n'y a pas de collision, faire avancer la pièce
					tetrominoActionArea.x = tetromino.x = tetrominoHitbox.x;
					drawToDown();
				}

				// Déplacement de la hitbox (invisible)
				tetrominoHitbox.x = tetromino.x;
				tetrominoHitbox.y += tetrominoSize;

				// Effet sonore
				sound = createjs.Sound.play('move');
				sound.volume = .2;

			break;

			// Déplacement vers le bas
			case arrow.down :
			case letter.s :
				if (! collision() ) { // S'il n'y a pas de collision, faire avancer la pièce
					tetromino.y += tetrominoSize;
					tetrominoHitbox.y = tetromino.y + tetrominoSize;
				} else { // Sinon ajouter une nouvelle pièce
					if (! outOfCanvas) {
						tetrominoes.push(tetromino);
					}
					addTetromino();
				}

				// Déplacement vers le bas
				drawToDown();

				// Points supplémentaires pour jeu rapide
				score += 1;
				scoreTxt.text = score;

				// Effet sonore
				sound = createjs.Sound.play('fall');
				sound.volume = .2;
			break;
			case spacebar :
				// Rotation de la pièce de tetris de 90°
				tetromino.rotation += 90;
				tetrominoActionArea.rotation = tetromino.rotation = tetrominoHitbox.rotation = ( tetromino.rotation == 360 ) ? 0 : tetromino.rotation; // Réinitialisation à 0 si 360°
				
				if ( tetromino.rotation == 90 || tetromino.rotation == 270 ) {
					tetrominoActionArea.scaleY = tetrominoSize / (tetrominoActionArea.image.height / 4);
					tetrominoActionArea.scaleX = 10000; // Fix pour le champ d'action qui est trop fin et pas suffissamment étiré
				} else {
					tetrominoActionArea.scaleX = tetrominoSize / (tetrominoActionArea.image.width / 4) * tetrominoOrientation;
					tetrominoActionArea.scaleY = 10000; // Fix pour le champ d'action qui est trop fin et pas suffissamment étiré
				}

				// Effet sonore
				sound = createjs.Sound.play('rotate');
				sound.volume = .7;
			break;
		}
	}
}

// Déplacement de la pièce et de sa Hitbox
function drawToDown() {
	clearInterval(tetrominoFalling); // Stoppe l'intervalle = arrête la descente de la pièce

	tetrominoFalling = setInterval( function() {
		if (! collision() ) { // S'il n'y a pas de collision continuer à faire descendre la pièce
			tetromino.y += tetrominoSize;
			tetrominoHitbox.y = tetromino.y + tetrominoSize;
		} else {
			addTetromino();
		}
	}, 200);
}

function collision( forTest ) {
	// forTest : Fonction uniquement déclenchée dans une condition (exemple : if ( collision() ));
	var forTest = forTest || false;

	if (! forTest ) {
		clearInterval(tetrominoFalling);
	}


	outOfCanvas = false;
	if ( tetromino.y >= canvasHeight + (5 * tetrominoSize) ) { // Descendu trop bas
		outOfCanvas = true;
		console.log('Sorti des limite du canvas ! - 50 points');
	}

	onOtherBlock = false;
	for ( var i = 0; i < tetrominoes.length; i += 1 ) {
		if ( tetrominoes[i] != tetromino ) {
			rectCollision = ndgmr.checkPixelCollision(tetrominoes[i], tetrominoHitbox, 0, true); // Collision entre la pièce de tetris et une autre
			onOtherBlock = ( rectCollision != false ) ? true : onOtherBlock;

			if ( onOtherBlock ) {
				console.log('Collision avec un autre bloc ! + 2 points');
			}	
		}
	}

	onPlateform = false;
	if ( ! onOtherBlock ) {
		rectCollision = ndgmr.checkPixelCollision(plateform, tetrominoHitbox, 0, true); // Collision entre la plate-forme et la pièce de tetris
		onPlateform = ( rectCollision != false ) ? true : onPlateform;

		if ( onPlateform ) {
			console.log('Sur la plate-forme ! + 1 point');
		}		
	}

	if (! forTest ) { // Si ce n'est pas pour le test uniquement lancer les action à suivre

		if ( onOtherBlock && tetromino.y - (tetromino.image.height * tetromino.scaleY) <= tetrominoSpawn.y ) {
			score += 1;
			gameOver();
		} else if ( onOtherBlock || outOfCanvas || onPlateform ) {
			if ( onOtherBlock || onPlateform ) {
				tetrominoes.push(tetromino); // Ajout à la liste des tetrominos encore sur la surface de jeu
				if ( onPlateform ) {
					score += 1;

					// Effet sonore
					sound = createjs.Sound.play(getRandomSound());
					sound.volume = .2;
				} else if ( onOtherBlock ) {
					score += 2;

					// Effet sonore
					sound = createjs.Sound.play(getRandomSound());
					sound.volume = .2;
				}
			} else if ( outOfCanvas ) {
				score -= 50;

				// Effet sonore
				sound = createjs.Sound.play('out');
				sound.volume = .3;
			}
			return true;
		} else {
			drawToDown();
		}
		
	} else if ( onOtherBlock || outOfCanvas || onPlateform ) {
		return true;
	}
}

function getRandomSound() {
	return yeahSoundSrc[Math.floor(Math.random() * yeahSoundSrc.length)].id;
}

function gameOverTest() { // Tentative de GameOver en faisant un masque à partir des pièces posées et l'image de fond, mais ça ne marche pas
	clearInterval(tetrominoFalling);
	shape.alpha = 1;

	image = canvas.getContext('2d');
	image.save();
	shape.cache(0, 0, shape.image.width, shape.image.height);
	image.drawImage(shape.cacheCanvas, shape.x, shape.y);
	image.globalCompositeOperation = 'destination-out';

	for ( var i = 0; i < tetrominoes.length; i += 1 ) {
		image.drawImage(tetrominoes[i].cacheCanvas, tetrominoes[i].x, tetrominoes[i].y);
		tetrominoes[i].alpha = 0;
	}

	shape.alpha = 0;

	image.restore();

}

function pause() {
	clearInterval(tetrominoFalling);

	openPauseMenu();

	pauseButton.removeEventListener();
	pauseButton.addEventListener('click', resume);
}

function resume() {
	closePauseMenu();

	stage.removeChild(overlay);
	overlay.alpha = 1;

	pauseButton.removeEventListener();
	pauseButton.addEventListener('click', pause);

	// Lance l'animation de déplacement
	drawToDown();
}

function gameOver() {
	tetrominoes = [];
	tetromino = false;
	stage.removeAllChildren();
	stage.addChild(backgroundIMG); // Affichage du fond
	clearInterval(tetrominoFalling);
	score = 0;

	if ( shapesSrc.length > level + 1 ) {
		level += 1;
	} else {
		level = 0;
	}

	// Effet sonore
	sound = createjs.Sound.play('next');
	sound.volume = .3;

	play();
}

function tick( evt ) {
	// Mise à jour de l'affichage
	stage.update();
}

window.onload = init;