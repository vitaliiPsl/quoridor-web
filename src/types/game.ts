export type GameStatus = 'pending' | 'aborted' | 'in_progress' | 'completed'

export type Direction = 'horizontal' | 'vertical'

export type MoveType = 'move' | 'place_wall'

export interface Game {
	game_id: string
	status: GameStatus
	winner?: string
	turn: string
	player_1: Player
	player_2: Player
	walls: Wall[]
	moves: Move[]
	created_at: string
	updated_at: string
	completed_at?: string
}

export interface Player {
	user_id: string
	position: Position
	goal: number
	walls: number
}

export interface Wall {
	direction: Direction
	position_1: Position
	position_2: Position
}

export interface Move {
	user_id: string
	type: MoveType
	position?: Position
	wall?: Wall
	timestamp: string
}

export interface Position {
	x: number
	y: number
}
