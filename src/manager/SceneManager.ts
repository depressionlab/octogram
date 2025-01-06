import type { Engine, Scene, WithRoot } from 'excalibur';

export interface AsyncScene<TKnownScenes extends string = any> extends Scene {
	isAsyncInitialized: boolean;
	onAsyncInitialize: (engine: Engine<TKnownScenes>) => Promise<void>;
}

export function isAsyncScene(scene: AsyncScene | Scene): scene is AsyncScene {
	return 'isAsyncInitialized' in scene && 'onAsyncInitialize' in scene
		? scene.isAsyncInitialized !== undefined && scene.onAsyncInitialize !== undefined
		: false;
}

export default class SceneManager<TKnownScenes extends string = any> {
	public scenes = new Map<string, AsyncScene | Scene>();
	public constructor(public game: Engine<TKnownScenes>) {}

	public addScene<TScene extends string>(name: TScene, scene: AsyncScene | Scene) {
		this.scenes.set(name, scene);
		this.game.addScene(name, scene);
	}

	public async goToScene(name: WithRoot<TKnownScenes>) {
		const scene = this.scenes.get(name);
		if (scene && isAsyncScene(scene)) {
			if (!scene.isAsyncInitialized) {
				await scene.onAsyncInitialize(this.game);
				scene.isAsyncInitialized = true;
			}

			this.game.goToScene(name);
		}
	}
}
