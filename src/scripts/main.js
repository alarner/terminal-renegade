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
animate(); // kick off the animation loop (defined below)

function animate() {
	// start the timer for the next animation loop
	requestAnimationFrame(animate);

	// this is the main render call that makes pixi draw your container and its children.
	renderer.render(viewport);
}

// 
// // You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// // which will try to choose the best renderer for the environment you are in.
// var renderer = new PIXI.WebGLRenderer(800, 600);

// // // The renderer will create a canvas element for you that you can then insert into the DOM.


// // // You need to create a root container that will hold the scene you want to draw.
// var viewport = new PIXI.Container();
// var stage = new PIXI.Container();
// // var nodes = [];
// // var m = 1;
// // var k = 1;

// viewport.addChild(stage);

// // constructStage(map, null);

// // console.log(nodes);

// // // kick off the animation loop (defined below)
// animate();

// function animate() {
// 	// start the timer for the next animation loop
// 	requestAnimationFrame(animate);

// 	// this is the main render call that makes pixi draw your container and its children.
// 	renderer.render(viewport);
// }

// // function animate() {
// // 	for(var i=0; i<nodes.length; i++) {
// // 		var node = nodes[i];
// // 		node.acceleration.x = 0;
// // 		node.acceleration.y = 0;
// // 	}

// // 	for(var i=0; i<nodes.length-1; i++) {
// // 		for(var j=i+1; j<nodes.length; j++) {
// // 			var node1 = nodes[i];
// // 			var node2 = nodes[j];
// // 			var delA = {x: 0, y: 0};
// // 			var delS = {
// // 				x: node2.position.x - node1.position.x,
// // 				y: node2.position.y - node1.position.y
// // 			};

// // 			delA.x = 100/delS.x;
// // 			delA.y = 100/delS.y;

// // 			// if(node1.parentDisplayNode === node2 || node2.parentDisplayNode === node1) {
// // 			// 	delA.x -= (delS.x)/100;
// // 			// 	delA.y -= (delS.y)/100;
// // 			// }

// // 			if(node1.parentDisplayNode) {
// // 				node1.acceleration.x += delA.x;
// // 				node1.acceleration.y += delA.y;
// // 			}

// // 			if(node2.parentDisplayNode) {
// // 				node2.acceleration.x += delA.x;
// // 				node2.acceleration.y += delA.y;
// // 			}
// // 		}
// // 	}

// // 	for(var i=0; i<nodes.length; i++) {
// // 		var node = nodes[i];
// // 		node.velocity.x += node.acceleration.x;
// // 		node.velocity.y += node.acceleration.y;

// // 		node.position.x += node.acceleration.x;
// // 		node.position.y += node.acceleration.y;
// // 	}

// // 	// start the timer for the next animation loop
// // 	requestAnimationFrame(animate);

// // 	// this is the main render call that makes pixi draw your container and its children.
// // 	renderer.render(viewport);
// // }

// // function constructStage(node, parent) {
// // 	var displayNode = node.display();
// // 	displayNode.parentDisplayNode = parent;
// // 	displayNode.velocity = {x: 0, y: 0};
// // 	displayNode.acceleration = {x: 0, y: 0};
// // 	displayNode.position.x = 100+Math.random()*500;
// // 	displayNode.position.y = 100+Math.random()*500;
// // 	console.log(displayNode.position);
// // 	stage.addChild(displayNode);
// // 	nodes.push(displayNode);

// // 	for(var i=0; i<node.children.length; i++) {
// // 		constructStage(
// // 			node.children[i],
// // 			displayNode
// // 		);
// // 	}

// // 	// console.log(xOffset);
// // 	// var nodeContainer = new PIXI.Container();
// // 	// var nodeDisplay = node.display();
// // 	// console.log(nodeDisplay);
// // 	// xOffset = xOffset || 0;
// // 	// nodeContainer.addChild(nodeDisplay);
// // 	// if(parent) {
// // 	// 	nodeDisplay.position.y = parent.getBounds().height+globals.node.spacing.y;
// // 	// 	nodeDisplay.position.x = xOffset;
// // 	// }

// // 	// var childrenWidth =
// // 	// 	node.children.length*globals.node.size.width +
// // 	// 	(node.children.length-1)*globals.node.spacing.x;

// // 	// for(var i=0; i<node.children.length; i++) {
// // 	// 	constructStage(
// // 	// 		nodeContainer,
// // 	// 		node.children[i],
// // 	// 		nodeDisplay,
// // 	// 		i*(globals.node.size.width+globals.node.spacing.x) - childrenWidth/2
// // 	// 	);
// // 	// }

// // 	// container.addChild(nodeContainer);
// // }