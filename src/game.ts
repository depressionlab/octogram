import type { Loader } from 'excalibur';
import { Color, DisplayMode, Engine, FadeInOut, Logger } from 'excalibur';
import { MyLevel } from './levels/MyLevel.ts';
import ResourceManager from './manager/ResourceManager.ts';
import SceneManager from './manager/SceneManager.ts';
import { isCanvasElement } from './utils.ts';

export type Scenes = 'start';

export default class Game {
	public static readonly LOGGER: Logger = Logger.getInstance();
	private static _INSTANCE: Game | null = null;

	public started: boolean = false;
	private _engine: Engine<Scenes> | null = null;
	private _loader: Loader | null = null;
	private _sceneManager: SceneManager<Scenes> | null = null;

	public start() {
		this.engine.start('start', {
			loader: this.loader,
			inTransition: new FadeInOut({
				duration: 1000,
				direction: 'in',
				color: Color.ExcaliburBlue,
			}),
		}).then(ResourceManager.postInitialize(this.engine));
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

	public get sceneManager(): SceneManager<Scenes> {
		if (this._sceneManager == null)
			this._sceneManager = new SceneManager(this.engine);
		return this._sceneManager;
	}

	public get engine(): Engine<Scenes> {
		if (this._engine == null) {
			this._engine = new Engine<Scenes>({
				canvasElement: Game.canvas,
				displayMode: DisplayMode.FitScreenAndFill,
				height: 800,
				width: 600,
				pixelArt: true,
				scenes: {
					start: MyLevel,
				},
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
