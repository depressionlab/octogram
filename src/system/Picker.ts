import type {
	Engine,
	Entity,
	PointerEventReceiver,
	Query,
	World,
} from 'excalibur';
import {
	BoundingBox,
	ColliderComponent,
	CoordPlane,
	GraphicsComponent,
	Particle,
	ParticleEmitter,
	System,
	SystemType,
	TransformComponent,
} from 'excalibur';

export interface PickerFrameContext {
	transform?: TransformComponent;
	maybeCollider?: ColliderComponent;
	maybeGraphics?: GraphicsComponent;
}

export default class PickerSystem extends System {
	public override readonly systemType = SystemType.Update;
	public priority = 99;
	public query: Query<typeof TransformComponent>;

	public lastFrameEntityToPointers = new Map<number, number[]>();
	public currentFrameEntityToPointers = new Map<number, number[]>();

	private _engine: Engine;
	private _receiver: PointerEventReceiver;

	public constructor(world: World) {
		super();
		this.query = world.query([TransformComponent]);
		this._engine = world.scene.engine;
		this._receiver = this._engine.input.pointers;
	}

	public addPointerToEntity(entity: Entity, pointerId: number): void {
		if (!this.currentFrameEntityToPointers.has(entity.id)) {
			this.currentFrameEntityToPointers.set(entity.id, [pointerId]);
			return;
		}

		const pointers = this.currentFrameEntityToPointers.get(entity.id);
		this.currentFrameEntityToPointers.set(entity.id, pointers!.concat(pointerId));
	}

	private _processPointerToEntity(entities: Entity[]) {
		const frameContext: PickerFrameContext = {};

		entities.forEach((entity) => {
			if (entity instanceof Particle)
				return;
			frameContext.transform = entity.get(TransformComponent);
			frameContext.maybeCollider = entity.get(ColliderComponent);
			frameContext.maybeGraphics = entity.get(GraphicsComponent);

			if (frameContext.maybeCollider) {
				const geometry = frameContext.maybeCollider.get();
				if (geometry) {
					for (const [id, pos] of this._receiver.currentFramePointerCoords.entries()) {
						if (geometry.contains(frameContext.transform.coordPlane === CoordPlane.World ? pos.worldPos : pos.screenPos))
							this.addPointerToEntity(entity, id);
					}
				}
			}

			if (frameContext.maybeGraphics) {
				const graphicBounds = frameContext.maybeGraphics.localBounds.transform(frameContext.transform.get().matrix);
				for (const [id, pos] of this._receiver.currentFramePointerCoords.entries()) {
					if (graphicBounds.contains(frameContext.transform.coordPlane === CoordPlane.World ? pos.worldPos : pos.screenPos))
						this.addPointerToEntity(entity, id);
				}
			}

			if ((!(frameContext.maybeGraphics?.current?.height) && !(frameContext.maybeCollider.get())) || entity instanceof ParticleEmitter) {
				const bounds = BoundingBox.fromDimension(100, 100).transform(frameContext.transform.get().matrix);
				for (const [id, pos] of this._receiver.currentFramePointerCoords.entries()) {
					if (bounds.contains(frameContext.transform.coordPlane === CoordPlane.World ? pos.worldPos : pos.screenPos))
						this.addPointerToEntity(entity, id);
				}
			}
		});
	}

	update(_: number): void {
		this._processPointerToEntity(this.query.entities);
		this.lastFrameEntityToPointers.clear();
		this.lastFrameEntityToPointers = new Map(this.currentFrameEntityToPointers);
		this.currentFrameEntityToPointers.clear();
	}
}
