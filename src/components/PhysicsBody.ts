import type { Entity } from 'excalibur';
import { Component, TransformComponent } from 'excalibur';
import Matter from 'matter-js';

export default class PhysicsBody extends Component {
	public body!: Matter.Body;

	public constructor(public width: number, public height: number, public isStatic = false) {
		super();
	}

	public override onAdd(owner: Entity): void {
		const transform = owner.get(TransformComponent);
		if (transform) {
			this.body = Matter.Bodies.rectangle(
				transform.pos.x,
				transform.pos.y,
				this.width,
				this.height,
				{ isStatic: this.isStatic },
			);
		}
	}
}
