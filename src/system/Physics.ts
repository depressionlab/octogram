import type { Query, World } from 'excalibur';
import { System, SystemType, TransformComponent } from 'excalibur';
import Matter from 'matter-js';
import PhysicsBody from '../components/PhysicsBody';
import PhysicsConstraint from '../components/PhysicsConstraint';

export type PhysicsObjects = typeof PhysicsBody | typeof TransformComponent;
export default class PhysicsSystem extends System {
	public override readonly systemType: SystemType = SystemType.Update;
	public matterEngine: Matter.Engine = Matter.Engine.create();
	public priority = 99;
	public query: Query<PhysicsObjects>;

	public constructor(world: World) {
		super();
		this.matterEngine.gravity.y = 1;
		this.query = world.query([PhysicsBody, TransformComponent]);
		this.query.entityAdded$.subscribe((entity) => {
			const physicsBody = entity.get(PhysicsBody);
			const physicsConstraint = entity.get(PhysicsConstraint);

			if (physicsBody)
				Matter.Composite.add(this.matterEngine.world, physicsBody.body);

			if (physicsConstraint) {
				Matter.Composite.add(this.matterEngine.world, physicsConstraint.constraint);
				physicsConstraint.$removed.subscribe(() => {
					Matter.World.remove(this.matterEngine.world, physicsConstraint.constraint);
				});
			}
		});

		this.query.entityRemoved$.subscribe((_entity) => {
			// TODO
		});
	}

	public override update(delta: number): void {
		Matter.Engine.update(this.matterEngine, delta);
		this.query.entities.forEach((entity) => {
			const transform = entity.get(TransformComponent);
			const physicsBody = entity.get(PhysicsBody);
			if (physicsBody && transform) {
				transform.pos.x = physicsBody.body.position.x;
				transform.pos.y = physicsBody.body.position.y;
				transform.rotation = physicsBody.body.angle;
			}
		});
	}
}
