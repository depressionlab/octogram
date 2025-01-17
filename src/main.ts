import * as ex from 'excalibur';
import { Enemy } from './Enemy';
import { Octopus } from './Octopus';
import { Terrain } from './Terrain';

let score: number = 0;

// const topVertex: number[] = [];

// const bottomVertex: number[] = [];

// Create an instance of the engine.
// I'm specifying that the game be 800 pixels wide by 600 pixels tall.
// If no dimensions are specified the game will fit to the screen.
const game = new ex.Engine({
	width: 800,
	height: 600,
});

game.start();

const terrain = new Terrain();
const octopus = new Octopus();

// Collision handler to update score
function handleCollision(enemy: ex.Actor, part: string) {
	if (part === 'firstArm') {
		score += 1;
	}
	else if (part === 'secondArm') {
		score += 2;
	}
	else if (part === 'octopus') {
		score += 3;
	}

	console.warn('Score:', score);
}

const enemy = new Enemy(handleCollision, octopus);

game.input.pointers.primary.on('move', (evt) => {
	octopus.updated(evt.worldPos.x, evt.worldPos.y);
	enemy.updateTarget(evt.worldPos.x, evt.worldPos.y);
});

game.add(terrain);
game.add(octopus);
game.add(enemy);
