function createTetromino( id, color, orientation, zone ) {
	// Ajout de la zone de couverture du bloc ?
	var zone = zone || true;

	// Couleur du tetromino
	var tetrominoColor = color || hexToRGB(tetrominoColors[Math.floor(Math.random() * tetrominoColors.length)]); // Choix d'une couleur parmi celles disponibles

	// Choix aléatoire dans les tetrominos
	var tetrominoID = id || Math.floor(Math.random() * (tetrominoesSrc.length - 1 + 1)) + 1;
	// tetrominoID = 1;

	// Taille du tetromino
	var tetrominoPixNumber = 4;
	// tetrominoPixNumber = ( tetrominoID == 1 || tetrominoID == 2 ) ? 4 : tetrominoPixNumber;
	// tetrominoWidth = ( tetrominoID == 1 ) ? tetrominoSize : tetrominoSize * tetrominoPixNumber;

	// Orientation du tetromino
	var tetrominoOrientation = Math.random() < 0.5 ? -1 : 1;
	tetrominoOrientation = orientation || tetrominoOrientation;

	var tetromino = new createjs.Bitmap(preload.getResult(tetrominoID));

	tetromino.regX = tetromino.image.width / 2;
	tetromino.regY = tetromino.image.height / 2;
	tetromino.scaleY = tetromino.scaleX = tetrominoSize / (tetromino.image.width / tetrominoPixNumber);
	tetromino.scaleX *= tetrominoOrientation;
	tetromino.x = tetrominoSpawn.x;
	tetromino.y = tetrominoSpawn.y;

	// Teinte du tetromino
	tetromino.filters = [ new createjs.ColorFilter(0, 0, 0, 1, tetrominoColor.r, tetrominoColor.g, tetrominoColor.b, 1) ];
	tetromino.cache(0, 0, tetromino.image.width, tetromino.image.height);

	// Zone d'action de la pièce sous la forme d'un faisseau lumineux
	var actionArea = false;
	if ( zone ) {
		actionArea = new createjs.Bitmap(preload.getResult(tetrominoID+'_actionArea'));

		actionArea.regX = actionArea.image.width / 2;
		actionArea.regY = actionArea.image.height / 2;
		actionArea.scaleY = actionArea.scaleX = tetrominoSize / (actionArea.image.width / tetrominoPixNumber);
		actionArea.scaleX *= tetrominoOrientation;
		actionArea.scaleY = 10000;
		actionArea.x = canvasWidth / 2;
		actionArea.y = tetrominoSpawn.y;

		actionArea.filters = [ new createjs.ColorFilter(0, 0, 0, 1, tetrominoColor.r, tetrominoColor.g, tetrominoColor.b, 1) ];
		actionArea.alpha = .1;
		actionArea.cache(0, 0, actionArea.image.width, actionArea.image.height);
	}

 	tetromino = {
		'object': tetromino,
		'color': tetrominoColor,
		'id': tetrominoID,
		'orientation': tetrominoOrientation,
		'actionArea': actionArea
	};

	return tetromino;
}