import * as ex from 'excalibur';
import { Octopus } from './Octopus';

const numberEnimies: number = 10;

export class Enemy extends ex.Actor {
	enemies: ex.Actor[] = [];
	constructor(onCollision: (enemy: ex.Actor, part: string) => void, octopus: Octopus) {
		super({
			pos: new ex.Vector(0, 0),
			color: ex.Color.Green,

		});
		for (let i = 0; i < numberEnimies; i++) {
			const enemy = new ex.Actor({
				pos: new ex.Vector(Math.round(Math.random()) * 800, Math.random() * 600),
				vel: new ex.Vector(1, 1),
				color: ex.Color.Green,
				radius: 10,

			});
			this.enemies.push(enemy);
			this.addChild(enemy);

			enemy.on('collisionend', (evt: ex.Events.CollisionEndEvent) => {
				if (octopus.isFirstArm(evt.other)) {
					onCollision(enemy, 'firstArm');
				}
				if (octopus.isSecondArm(evt.other)) {
					onCollision(enemy, 'secondArm');
				}

				console.warn(evt.other);
				this.resetPosition(enemy);
			});
		}
	}

	getOctopus(actor: ex.Actor): Octopus | null {
		// Traverse up the actor hierarchy to find the Octopus instance
		let currentActor: ex.Actor | null = actor;
		while (currentActor) {
			if (currentActor instanceof Octopus) {
				return currentActor;
			}
			currentActor = currentActor.parent as ex.Actor | null;
		}
		return null;
	}

	resetPosition(enemy: ex.Actor) {
		enemy.pos = new ex.Vector(Math.round(Math.random()) * 800, Math.random() * 600);
		console.warn('nnu');
	}

	updateTarget(x: number, y: number) {
		for (let i = 0; i < numberEnimies; i++) {
			this.enemies[i].vel = new ex.Vector(x - this.enemies[i].pos.x, y - this.enemies[i].pos.y);
		}
	}
}
