import type { ImageSource } from 'excalibur';
import { Actor, Animation, CollisionType, SpriteSheet, Vector } from 'excalibur';
import ResourceManager from '../manager/ResourceManager';

/**
 * The Octogram {@link Player} sprite.
 *
 * @see {@link Actor} for abstracts and implementations.
 */
export default class Player extends Actor {
	public constructor(pos: Vector) {
		super({ pos, width: 16, height: 16, collisionType: CollisionType.Active });
	}

	public override onInitialize(): void {
		const playerSpriteSheet = SpriteSheet.fromImageSource({
			image: ResourceManager.loadables.DADsasdasdj as unknown as ImageSource,
			grid: {
				spriteWidth: 16,
				spriteHeight: 16,
				rows: 8,
				columns: 8,
			},
		});

		const leftIdle = new Animation({
			frames: [
				{ graphic: playerSpriteSheet.getSprite(0, 1), duration: 10 },
			],
		});

		this.graphics.add(leftIdle);
	}

	public override onPreUpdate(): void {
		this.vel = Vector.Zero;
		this.graphics.use('left-idle');
	}
}
