import type { Engine } from 'excalibur';
import { Scene } from 'excalibur';
import { Player } from '~/player';

export class MyLevel extends Scene {
	public override onInitialize(_: Engine): void {
		const player = new Player();
		this.add(player);
	}
}
