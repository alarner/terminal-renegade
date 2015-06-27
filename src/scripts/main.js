// External Libraries
var PIXI = require('pixi.js');
var level1 = require('./maps/001_tutorial.js');
var globals = require('./globals');
var Game = require('./game');

// Global Variables
var renderer = new PIXI.WebGLRenderer(800, 600);
var viewport = new PIXI.Container();
var stage = new PIXI.Container();

// Initial Setup
document.body.appendChild(renderer.view);
viewport.addChild(stage);
var game = new Game(viewport, stage);
game.startLevel(level1);
 // kick off the animation loop (defined below)

var texture = PIXI.Texture.fromImage("../images/bunny.gif");
    // create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite t the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;


bunny.scale.x = 0.5;
bunny.scale.y = 0.5;


stage.addChild(bunny);

animate();

function animate() {
	// start the timer for the next animation loop
	requestAnimationFrame(animate);

	if(bunny.position.x < 500){
 		bunny.position.x += 2;
 		bunny.position.y += 2;
 	} else if(bunny.position.x > 502){
 		bunny.position.x -= 2;
 		bunny.position.y -= 2;
 	}
 	//bunny.acceleration.x += 4;
        // render the stage   
     renderer.render(stage);
	
	// this is the main render call that makes pixi draw your container and its children.
	renderer.render(viewport);
}