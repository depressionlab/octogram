import { Actor, Color, Polygon, vec, Vector } from 'excalibur';

const points: Vector[] = [];

const detail: number = 10;

export class Terrain extends Actor {
	constructor() {
		super({
			color: Color.Green,
			anchor: vec(0, 1),
		});

		for (let i = 0; i < detail; i++) {
			points.push(new Vector(i * 800 / detail, 600 - (Math.random() * 200)));
		}
		points.push(new Vector(800, 600));
		points.push(new Vector(800, 700));
		points.push(new Vector(0, 700));
		points.push(new Vector(0, 600));

		this.graphics.add(new Polygon({
			points,
			color: Color.Gray,

		}));
	}

	onInitialize(engine: ex.Engine) {
		// Set the position to the bottom-left corner of the screen
		this.pos = vec(0, engine.drawHeight);
	}
}
