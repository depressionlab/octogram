import { Sound } from 'excalibur';
import ResourceManager from './ResourceManager.ts';

export default abstract class AudioManager {
	public static readonly levels = new Map<Sound, number>([

	]);

	public static start() {
		(ResourceManager.resources as any).forEach((res: any) => {
			if (res instanceof Sound)
				res.volume = this.levels.get(res) ?? 1.0;
		});
	}

	public static toggleMute(shouldMute: boolean) {
		(ResourceManager.resources as any).forEach((res: any) => {
			if (res instanceof Sound)
				res.volume = shouldMute ? 0 : (this.levels.get(res) ?? 1.0);
		});
	}
}
