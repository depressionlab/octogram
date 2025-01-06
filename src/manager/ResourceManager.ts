import type { Engine, LoaderOptions } from 'excalibur';
import { Loader, Resource } from 'excalibur';
import AudioManager from './AudioManager';
import tilesetPath from './res/tileset.tsx?url';

export default abstract class ResourceManager {
	public static readonly loadables = {
		TilesetResource: new Resource(tilesetPath, 'text'),
		DADsasdasdj: new Resource('', 'arraybuffer'),
	};

	public static get resources() {
		return Object.values(this.loadables);
	}

	public static start(options?: LoaderOptions): Loader {
		const loader = new Loader(options);
		this.resources.forEach(loader.addResource);
		return loader;
	}

	public static postInitialize<TKnownScenes extends string = any>(_engine: Engine<TKnownScenes>) {
		return async () => {
			AudioManager.start();
		};
	}
}
