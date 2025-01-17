import { Console } from 'node:console';
import * as ex from 'excalibur';

const armLength: number = 20;

const firstLilRadius: number = 5;
const firstLilColor: string = 'rgb(255, 0, 0) ';

const secondLilRadius: number = 5;
const secondLilColor: string = 'rgb(51, 255, 0) ';

const bigRadius: number = 20;
const bigColor: string = 'rgb(251, 0, 0) ';
const coreNumber: number = 1;

export class Octopus extends ex.Actor {
	firstArm: ex.Actor[] = [];
	centerPiece: ex.Actor[] = [];
	secondArms: ex.Actor[][] = [];

	constructor() {
		super({
			pos: new ex.Vector(0, 0),
		});

		// Initialize firstArm array
		for (let i = 0; i < armLength; i++) {
			const joint = new ex.Actor({
				pos: new ex.Vector(Math.random() * 100, Math.random() * 100),
				color: ex.Color.fromRGBString(firstLilColor),
				radius: firstLilRadius,
			});
			this.firstArm.push(joint);
			this.addChild(joint);
		}

		// Initialize centerPiece array
		for (let i = 0; i < coreNumber; i++) {
			const core = new ex.Actor({
				pos: new ex.Vector(Math.random() * 100, Math.random() * 100),
				color: ex.Color.fromRGBString(bigColor),
				radius: bigRadius,
			});

			this.centerPiece.push(core);
			this.addChild(core);
		};

		// Initialize secondArms array
		for (let i = 0; i < 7; i++) {
			const arm: ex.Actor[] = [];
			for (let j = 0; j < armLength; j++) {
				const joint = new ex.Actor({
					pos: new ex.Vector(Math.random() * 100, Math.random() * 100),
					color: ex.Color.fromRGBString(secondLilColor),
					radius: secondLilRadius,
				});
				arm.push(joint);
				this.addChild(joint);
			}
			this.secondArms.push(arm);
		}
	}

	isFirstArm(actor: ex.Actor): boolean {
		return this.firstArm.includes(actor);
	}

	isSecondArm(actor: ex.Actor): boolean {
		return this.secondArms.some(arm => arm.includes(actor));
	}

	updated(xPos: number, yPos: number) {
		this.updatePosition(xPos, yPos, this.firstArm, firstLilRadius);
		const finalFirstArm = new ex.Vector((this.firstArm[this.firstArm.length - 1].pos.x - this.firstArm[this.firstArm.length - 2].pos.x), (this.firstArm[this.firstArm.length - 1].pos.y - this.firstArm[this.firstArm.length - 2].pos.y));
		this.updatePosition(this.firstArm[this.firstArm.length - 1].pos.x + finalFirstArm.normalize().x * bigRadius, this.firstArm[this.firstArm.length - 1].pos.y + finalFirstArm.normalize().y * bigRadius, this.centerPiece, bigRadius);
		this.secondArms.forEach((arm, index) => {
			this.updatePosition(this.centerPiece[this.centerPiece.length - 1].pos.x + (Math.cos(Math.PI - index * 2 * Math.PI / 8) * bigRadius), this.centerPiece[this.centerPiece.length - 1].pos.y + (Math.sin(Math.PI - index * 2 * Math.PI / 8) * bigRadius), arm, secondLilRadius);
		});
	}

	updatePosition(x: number, y: number, actors: ex.Actor[], radius: number) {
		actors[0].pos.x = x;
		actors[0].pos.y = y;

		for (let i = 1; i < actors.length; i++) {
			const distance = actors[i - 1].pos.distance(actors[i].pos);
			actors[i].pos.x = actors[i - 1].pos.x + (actors[i].pos.x - actors[i - 1].pos.x) * radius / distance;
			actors[i].pos.y = actors[i - 1].pos.y + (actors[i].pos.y - actors[i - 1].pos.y) * radius / distance;
		}
	}
}
