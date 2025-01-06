import type { Engine } from 'excalibur';
import { Actor } from 'excalibur';
import ResourceManager from './manager/ResourceManager';
import { vec } from './utils';

export class Player extends Actor {
	constructor() {
		super({
			name: 'Player',
			pos: vec(150, 150),
			width: 100,
			height: 100,
		});
	}

	public override onInitialize(_: Engine): void {
		this.graphics.add(ResourceManager.loadables.Sword.toSprite());
		this.actions.delay(2000);
		this.actions.repeatForever((ctx) => {
			ctx.moveBy({ offset: vec(100, 0), duration: 1000 });
			ctx.moveBy({ offset: vec(0, 100), duration: 1000 });
			ctx.moveBy({ offset: vec(-100, 0), duration: 1000 });
			ctx.moveBy({ offset: vec(0, -100), duration: 1000 });
		});

		this.on('pointerdown', (evt) => {
			// eslint-disable-next-line no-console
			console.log('You clicked the actor @', evt.worldPos.toString());
		});
	}
}
