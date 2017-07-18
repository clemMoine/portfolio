// Fonction de création de la structure du jeu
	//	Boutons, Titres, Scores, Musiques ...

function createHUD( level ) {
	var level = level || 0;

	// Plate-forme sur laquelle se posent les pièces
	plateform = new createjs.Bitmap(preload.getResult('plateform'));
	plateform.regX = plateform.image.width / 2;
	plateform.regY = plateform.image.height;
	plateform.x = canvasWidth / 2;
	plateform.y = canvasHeight - 2 * tetrominoSize;
	plateform.scaleX = (shapesSrc[level].px * tetrominoSize) / plateform.image.width;

	// Tuyau d'apparition des pièces
	pipe = new createjs.Bitmap(preload.getResult('pipe'));
	pipe.regX = pipe.image.width / 2;
	pipe.regY = pipe.image.height;
	pipe.x = canvasWidth / 2;
	pipe.y = tetrominoSize * 6;

	// Forme de fond que l'on doit recopier
	shape = new createjs.Bitmap(preload.getResult(shapesSrc[level].id));
	shape.regX = shape.image.width / 2;
	shape.regY = shape.image.height;
	shape.scaleY = shape.scaleX = 1;
	shape.x = canvasWidth / 2;
	shape.y = plateform.y - tetrominoSize;
	shape.alpha = .3;
	// shapeBackground = shape.clone();
	// shapeBackground.alpha = 1;
	// shapeBackground.filters = [ new createjs.ColorFilter(0, 0, 0, 1, hexToRGB(background).r, hexToRGB(background).g, hexToRGB(background).b, 1) ];
	// shapeBackground.cache(0, 0, shapeBackground.image.width, shapeBackground.image.height);


	// Textes
	levelTxt = new createjs.Text();
	levelTxt.font = 'lighter ' + tetrominoSize * 1.2 + 'px Arial';
	levelTxt.color = background;
	levelTxt.textAlign = 'center';
	levelTxt.text = 'Niveau';
	levelTxt.x = canvasWidth / 2;
	levelTxt.y = tetrominoSize;
	levelTxt.shadow = new createjs.Shadow('rgba(61, 150, 0, 1)', 2 , 2 , 2);

	levelTxtCount = new createjs.Text();
	levelTxtCount.font = 'bolder ' + tetrominoSize * 1.5 + 'px Arial';
	levelTxtCount.color = levelTxt.color;
	levelTxtCount.textAlign = levelTxt.textAlign;
	levelTxtCount.text = level + 1;
	levelTxtCount.x = levelTxt.x;
	levelTxtCount.y = levelTxt.y + tetrominoSize * 1.5;
	levelTxtCount.shadow = new createjs.Shadow('rgba(61, 150, 0, 1)', 2 , 2 , 2);


	var scoreTitle = new createjs.Text();
	scoreTitle.font = 'lighter ' + tetrominoSize * 1.2 + 'px Arial';
	scoreTitle.color = '#45352E';
	scoreTitle.textAlign = 'left';
	scoreTitle.text = 'Score';
	scoreTitle.x = tetrominoSize;
	scoreTitle.y = tetrominoSize;

	scoreTxt = new createjs.Text();
	scoreTxt.font = 'bolder ' + tetrominoSize * 1.5 + 'px Arial';
	scoreTxt.color = scoreTitle.color;
	scoreTxt.textAlign = scoreTitle.textAlign;
	scoreTxt.text = score;
	scoreTxt.x = scoreTitle.x;
	scoreTxt.y = scoreTitle.y + tetrominoSize * 1.5;

	var levelTxtCount = new createjs.Text();
	levelTxtCount.font = 'bolder ' + tetrominoSize * 1.5 + 'px Arial';
	levelTxtCount.color = levelTxt.color;
	levelTxtCount.textAlign = levelTxt.textAlign;
	levelTxtCount.text = level + 1;
	levelTxtCount.x = levelTxt.x;
	levelTxtCount.y = levelTxt.y + tetrominoSize * 1.5;


	var arrowTxt = new createjs.Text();
	arrowTxt.font = 'lighter ' + 12 + 'px Arial';
	arrowTxt.color = '#45352E';
	arrowTxt.textAlign = 'left';
	arrowTxt.text = 'Déplacement : ←↓→ ou QSD';
	arrowTxt.x = tetrominoSize;
	arrowTxt.y = canvasHeight - (tetrominoSize * 2.5 + 12);

	var rotateTxt = new createjs.Text();
	rotateTxt.font = arrowTxt.font;
	rotateTxt.color = arrowTxt.color;
	rotateTxt.textAlign = arrowTxt.textAlign;
	rotateTxt.text = 'Rotation : Barre Espace';
	rotateTxt.x = arrowTxt.x;
	rotateTxt.y = arrowTxt.y - tetrominoSize;

	// Bouton de mise en pause du jeu
	pauseButton = new createjs.Bitmap(preload.getResult('pause'));
	pauseButton.regX = pauseButton.image.width;
	pauseButton.regY = pauseButton.image.height;
	pauseButton.scaleX = pauseButton.scaleY = tetrominoSize * 3 / (pauseButton.image.width);
	pauseButton.x = (canvasWidth + tetrominoSize * 2) - (pauseButton.image.width * pauseButton.scaleX);
	pauseButton.y = tetrominoSize * 3.5;

	pauseButton.addEventListener('click', pause);

	// Ajout des éléments à la scène
	stage.addChild(shape, plateform, pipe, levelTxt, levelTxtCount, scoreTitle, scoreTxt, arrowTxt, rotateTxt, pauseButton);
}