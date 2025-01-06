import type { Engine } from 'excalibur';
import type { AsyncScene } from '../manager/SceneManager';
import { Logger, Scene } from 'excalibur';

export default class LoadingScene extends Scene implements AsyncScene {
	public isAsyncInitialized: boolean = false;
	public constructor() { super(); }

	public async onAsyncInitialize(engine: Engine<any>): Promise<void> {
		engine.onPostDraw = this.onPostDraw;
	};

	public override onInitialize(): void {

	}

	public override onActivate(): void {
		Logger.getInstance().info('sync activate started');
	}
}
