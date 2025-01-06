import type { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';

class PlayerConnection {
	public hostEntities: Map<string, ServerEntity>;

	constructor(public socket: WebSocket, public playerEntity: ServerPlayer | null = null) {
		this.hostEntities = new Map();
	}
}

class ServerEntity<TState = object> {
	constructor(
		public uuid: string,
		public type: ActorType,
		public state: TState,
		public updateTime: number,
	) {}
}

class ServerPlayer extends ServerEntity<PlayerState> {
	constructor(
		public connection: PlayerConnection,
		uuid: string,
		state: PlayerState,
		updateTime: number,
	) {
		super(uuid, ActorType.Player, state, updateTime);
	}
}

const activePlayers = new Map<string, ServerPlayer>();
const gameEntities = new Map<string, ServerEntity>();

export function runGameServer(port?: number) {}
