import * as ex from 'excalibur';
import { Terrain } from './Terrain';

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
game.add(terrain);

const triangle = new ex.Polygon({
	points: [ex.vec(800, 100), ex.vec(0, 100), ex.vec(100, 0)],
	color: ex.Color.Yellow,
});

const triangleActor = new ex.Actor({
	x: 0,
	y: 0,
	anchor: ex.vec(0, 0),
	color: ex.Color.Red,
});

triangleActor.graphics.use(triangle);

game.add(triangleActor);
