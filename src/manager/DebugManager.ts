import type { Engine, Entity, Resolution, Scene, ViewportDimension } from 'excalibur';
import type { FolderApi, ListBladeApi, ListBladeParams, TabApi, TabPageApi, TextBladeApi, TextBladeParams } from 'tweakpane';
import { Actor, BodyComponent, ColliderComponent, CollisionGroup, CollisionGroupManager, CollisionType, Color, GraphicsComponent, MotionComponent, ParticleEmitter, TransformComponent } from 'excalibur';
import { BladeApi, Pane, SliderBladeApi } from 'tweakpane';
import PickerSystem from '~/system/Picker';

export interface SceneOption { text: string; value: string }
export type ArrayComparator<T> = (item: T, index: number, rest: T[]) => boolean;

export default class DebugManager {
	public pane: Pane;
	public tabs: TabApi;
	public pickerSystem: PickerSystem;
	public pointerPos: { x: number; y: number } = { x: 0, y: 0 };
	public highlightedEntities: number[] = [-1];
	public selectedEntity: ex.Actor | null = null;
	public selectedEntityId: number = -1;
	public currentResolution: Resolution;
	public currentViewport: ViewportDimension;
	public resolutionText: TextBladeApi<string>;
	public viewportText: TextBladeApi<string>;
	public screenFolder: FolderApi;
	public selectedEntityTab: TabPageApi;
	public selectedEntityFolder: FolderApi;
	public screenTab: TabPageApi;
	public cameraTab: TabPageApi;
	public timerTab: TabPageApi;
	public clockTab: TabPageApi;
	public physicsTab: TabPageApi;
	public debugTab: TabPageApi;
	public pointerPosInput: any;

	public constructor(public engine: Engine) {
		this.pane = new Pane({ title: 'Debugger', expanded: true });
		const style = document.createElement('style');
		style.textContent = '.debugger-tweakpane-custom { width: 405px; }';
		document.head.appendChild(style);
		this.pane.element.parentElement?.classList.add('debugger-tweakpane-custom');

		this._initialize();

		this.tabs = this.pane.addTab({
			pages: [
				{ title: 'Entity' },
				{ title: 'Screen' },
				{ title: 'Camera' },
				{ title: 'Clock' },
				{ title: 'Timers' },
				{ title: 'Physics' },
				{ title: 'Settings' },
			],
		});

		this.selectedEntityTab = this.tabs.pages[0];
		this.screenTab = this.tabs.pages[1];
		this.cameraTab = this.tabs.pages[2];
		this.clockTab = this.tabs.pages[3];
		this.timerTab = this.tabs.pages[4];
		this.physicsTab = this.tabs.pages[5];
		this.debugTab = this.tabs.pages[6];

		this._installPicker(engine.currentScene);
		engine.debug.transform.showPosition = true;
		engine.debug.entity.showName = true;
		this.selectedEntityFolder = this.selectedEntityTab.addFolder({ title: 'Selected' });

		this._buildScreenTab();
		this._buildCameraTab();
		this._buildClockTab();
		this._buildTimersTab();
		this._buildPhysicsTab();
		this._buildDebugSettingsTab();

		setInterval(() => this.update(this), 30);

		this.addListeners();
	}

	public addListeners(): void {
		const game = this.engine;
		game.canvas.addEventListener('click', () => {
			if (this.highlightedEntities[0] !== -1)
				this.selectEntityById(this.highlightedEntities[0]);
		});
	}

	public selectEntityById(id: number): void {
		this.selectedEntityId = id;
		this.selectedEntity = this.engine.currentScene.world.entityManager.getById(id) as Actor;
		this._buildEntityUI(this.selectedEntity);
		this._buildTransformUI(this.selectedEntity.get(TransformComponent));
		this._buildMotionUI(this.selectedEntity.get(MotionComponent));
		if (this.selectedEntity instanceof ParticleEmitter) {
			this._buildParticleEmitterUI(this.selectedEntity);
		}
		else {
			this._buildGraphicsUI(this.selectedEntity.get(GraphicsComponent));
			this._buildColliderUI(this.selectedEntity.get(ColliderComponent), this.selectedEntity.get(BodyComponent));
		}
	}

	public update(debug: DebugManager): void {
		this.pointerPos.x = debug.engine.input.pointers.primary.lastWorldPos.x;
		this.pointerPos.y = debug.engine.input.pointers.primary.lastWorldPos.y;
		this.pointerPosInput.refresh();

		const entityIds = [
			...this.pickerSystem.lastFrameEntityToPointers.keys(),
			...this.pickerSystem.currentFrameEntityToPointers.keys(),
		];
		if (entityIds.length === 0) {
			entityIds.push(-1);
			entityIds.push(this.selectedEntityId);
		}

		this.highlightedEntities = entityIds;
		debug.engine.debug.filter.useFilter = true;
		debug.engine.debug.filter.ids = entityIds;

		if (this.currentResolution.width !== debug.engine.screen.resolution.width
			|| this.currentResolution.height !== debug.engine.screen.resolution.height
			|| this.currentViewport.width !== debug.engine.screen.viewport.width
			|| this.currentViewport.height !== debug.engine.screen.viewport.height
		) {
			this.resolutionText.dispose();
			this.viewportText.dispose();
			this.resolutionText = this.screenFolder.addBlade({
				view: 'text',
				label: 'resolution',
				value: `(${debug.engine.screen.resolution.width}x${debug.engine.screen.resolution.height})`,
				parse: v => String(v),
				index: 0,
			} as TextBladeParams<string>) as TextBladeApi<string>;
			this.viewportText = this.screenFolder.addBlade({
				view: 'text',
				label: 'viewport',
				value: `(${debug.engine.screen.viewport.width.toFixed(0)}x${debug.engine.screen.viewport.height.toFixed(0)})`,
				parse: v => String(v),
				index: 1,
			} as TextBladeParams<string>) as TextBladeApi<string>;
		}
		this._buildTimersTab();
		this._buildSceneUI();
	}

	private _installPicker(scene: Scene): void {
		const pickerSystem = scene.world.systemManager.get(PickerSystem);
		if (!pickerSystem) {
			this.pickerSystem = new PickerSystem(scene.world);
			scene.world.systemManager.addSystem(this.pickerSystem);
		}
		else {
			this.pickerSystem = pickerSystem;
		}
	}

	private _initialize(): void {
		this.pane.addBinding({ debug: false }, 'debug').on('change', () => this.engine.toggleDebug());
		this.pane.addBinding(this.engine.clock.fpsSampler, 'fps', { view: 'graph', readonly: true, label: 'fps (0 - 120)', min: 0, max: 120 });
		this._buildSceneUI();
		this.pointerPos = { x: 10, y: 10 };
		this.pointerPosInput = this.pane.addBinding(this, 'pointerPos', { label: 'pointer pos (world)' });
		this.pane.addBinding(this, 'selectedEntityId', { label: 'Select By Id' }).on('change', ev => this.selectEntityById(ev.value));
	}

	private _buildEntityUI(entity: Entity): void {
		if (this.selectedEntityFolder) {
			this.selectedEntityFolder.dispose();
			this.selectedEntityFolder = this.selectedEntityTab.addFolder({ title: 'Selected' });
		}

		this.selectedEntityFolder.addBlade({ view: 'text', label: 'id', value: entity.id.toString(), parse: v => String(v) } as TextBladeParams<string>) as TextBladeApi<string>;
		this.selectedEntityFolder.addBinding(this.selectedEntity!, 'name');
		this.selectedEntityFolder.addBlade({ view: 'text', label: 'tags', value: Array.from(entity.tags).join(',') || 'none', parse: v => String(v) } as TextBladeParams<string>) as TextBladeApi<string>;

		if (entity instanceof Actor && entity.color) {
			this.selectedEntityFolder.addBinding(this.selectedEntity!, 'color').on('change', (ev) => {
				entity.color = new Color(ev.value.r, ev.value.g, ev.value.b, ev.value.a);
			});
		}

		this.selectedEntityFolder.addBlade({ view: 'text', label: 'parent', value: entity.parent ? `(${entity.parent?.id}) ${entity.parent?.name}` : 'none', parse: v => String(v) } as TextBladeParams<string>) as TextBladeApi<string>;
		this.selectedEntityFolder.addBlade({ view: 'list', label: 'children', options: entity.children.map(c => ({ text: `(${c.id}) ${c.name}`, value: c.id })), value: entity.children.length ? entity.children[0].id : 'none' } as ListBladeParams<string | number>) as ListBladeApi<string | number>;
		this.selectedEntityFolder.addButton({ title: 'Kill Entity' }).on('click', (_) => {
			this.selectedEntity?.kill();
			this.selectedEntityFolder.dispose();
			this.selectedEntityFolder = this.selectedEntityTab.addFolder({ title: 'Selected' });
		});
	}

	private _buildColliderUI(colliderComponent: ColliderComponent, bodyComponent: BodyComponent): void {
		if (colliderComponent) {
			const collider = this.selectedEntityFolder.addFolder({ title: 'Collider & Body' });
			collider.addBlade({ view: 'text', label: 'type', value: (colliderComponent.get() as any)?.constructor.name ?? 'none', parse: (v: unknown) => String(v) } as TextBladeParams<string>) as TextBladeApi<string>;
			if (bodyComponent) {
				const collisionTypes = collider.addBlade({
					view: 'list',
					label: 'collisionType',
					options: [CollisionType.Active, CollisionType.Fixed, CollisionType.Passive, CollisionType.PreventCollision]
						.map(c => ({ text: c, value: c })),
					value: bodyComponent.collisionType,
				} as ListBladeParams<CollisionType>) as ListBladeApi<CollisionType>;
				collisionTypes.on('change', (ev) => {
					bodyComponent.collisionType = ev.value;
				});

				const collisionGroups = collider.addBlade({
					view: 'list',
					label: 'collisionGroup',
					options: [CollisionGroup.All, ...CollisionGroupManager.groups].map(c => ({ text: c.name, value: c })),
					value: bodyComponent.group,
				} as ListBladeParams<CollisionGroup>) as ListBladeApi<CollisionGroup>;
				collisionGroups.on('change', (ev) => {
					bodyComponent.group = ev.value;
				});
			}
		}
	}

	private _buildParticleEmitterUI(particles: ParticleEmitter) {
		const particlesFolder = this.selectedEntityFolder.addFolder({ title: 'Particles' });
		particlesFolder.addBinding(particles, 'isEmitting');
		particlesFolder.addBinding(particles, 'emitRate');
		particlesFolder.addBinding(particles, 'numParticles', {
			min: 100,
			max: 10000,
			step: 100,
		});
		particlesFolder.addBinding(particles, 'width');
		particlesFolder.addBinding(particles, 'height');
		particlesFolder.addBinding(particles, 'vel');
		particlesFolder.addBinding(particles, 'angularVelocity', {
			min: 0,
			max: Math.PI * 2,
			step: 0.1,
		});
		particlesFolder.addBinding(particles, 'scale');
		particlesFolder.addBinding(particles, 'color');
		particlesFolder.addBinding(particles, 'rotation');
		particlesFolder.addBinding(particles, 'globalRotation');
	}
}
