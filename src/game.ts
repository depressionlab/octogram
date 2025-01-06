import type { Loader } from 'excalibur';
import { DisplayMode, Engine, Logger } from 'excalibur';
import ResourceManager from './manager/ResourceManager.ts';
import SceneManager from './manager/SceneManager.ts';
import { isCanvasElement } from './utils.ts';

export default class Game<TKnownScenes extends string = any> {
	public static readonly LOGGER: Logger = Logger.getInstance();
	private static _INSTANCE: Game | null = null;

	public started: boolean = false;
	private _engine: Engine<TKnownScenes> | null = null;
	private _loader: Loader | null = null;
	private _sceneManager: SceneManager<TKnownScenes> | null = null;

	public start() {
		this.engine.start(this.loader)
			.then(ResourceManager.postInitialize(this.engine));
	}

	public static get instance(): Game {
		if (this._INSTANCE == null)
			this._INSTANCE = new this();
		return this._INSTANCE;
	}

	public static get canvas(): HTMLCanvasElement {
		const app = document.getElementById('app');
		if (!isCanvasElement(app))
			throw new TypeError('app element is not of type <canvas>!');

		return app;
	}

	public get loader(): Loader {
		if (this._loader == null)
			this._loader = ResourceManager.start();
		return this._loader;
	}

	public get sceneManager(): SceneManager<TKnownScenes> {
		if (this._sceneManager == null)
			this._sceneManager = new SceneManager(this.engine);
		return this._sceneManager;
	}

	public get engine(): Engine<TKnownScenes> {
		if (this._engine == null) {
			this._engine = new Engine<TKnownScenes>({
				canvasElement: Game.canvas,
				displayMode: DisplayMode.FitScreenAndFill,
				height: 800,
				width: 800,
				pixelArt: true,
				pixelRatio: 2,
				suppressConsoleBootMessage: true,
				suppressHiDPIScaling: false,
				suppressMinimumBrowserFeatureDetection: false,
				suppressPlayButton: true,
			});
		}

		return this._engine;
	}
}
