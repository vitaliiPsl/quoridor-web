import { Game, Position, Wall } from '../types/game'

export const isMoveValid = (
	state: Game,
	playerId: string,
	newPos: Position
): boolean => {
	const player =
		state.player_1.user_id === playerId ? state.player_1 : state.player_2
	if (!player) {
		return false
	}

	if (!isWithinBounds(newPos)) {
		return false
	}

	if (!isAdjacent(player.position, newPos)) {
		return false
	}

	if (crossesWall(state, player.position, newPos)) {
		return false
	}

	return true
}


export const isWithinBounds = (pos: Position): boolean => {
	return pos.x >= 0 && pos.x < 9 && pos.y >= 0 && pos.y < 9
}

export const isAdjacent = (pos1: Position, pos2: Position): boolean => {
	return (
		(Math.abs(pos1.x - pos2.x) === 1 && pos1.y === pos2.y) ||
		(Math.abs(pos1.y - pos2.y) === 1 && pos1.x === pos2.x)
	)
}

export const crossesWall = (
	state: Game,
	pos1: Position,
	pos2: Position
): boolean => {
	const playerDirection = getPlayerDirection(pos1, pos2)

	for (const wall of state.walls) {
		if (wall.direction === playerDirection) {
			continue
		}

		if (
			playerDirection === 'horizontal' &&
			crossesVerticalWall(wall, pos1, pos2) &&
			crossesVerticalWallSpan(wall, pos1)
		) {
			return true
		}

		if (
			playerDirection === 'vertical' &&
			crossesHorizontalWall(wall, pos1, pos2) &&
			crossesHorizontalWallSpan(wall, pos1)
		) {
			return true
		}
	}

	return false
}

export const getPlayerDirection = (pos1: Position, pos2: Position): string => {
	return pos1.x - pos2.x === 0 ? 'vertical' : 'horizontal'
}

const crossesHorizontalWall = (
	wall: Wall,
	pos1: Position,
	pos2: Position
): boolean => {
	return (
		(wall.position_1.y === pos1.y && wall.position_2.y === pos2.y) ||
		(wall.position_1.y === pos2.y && wall.position_2.y === pos1.y)
	)
}

const crossesHorizontalWallSpan = (wall: Wall, pos1: Position): boolean => {
	return wall.position_1.x === pos1.x || wall.position_1.x + 1 === pos1.x
}

const crossesVerticalWall = (
	wall: Wall,
	pos1: Position,
	pos2: Position
): boolean => {
	return (
		(wall.position_1.x === pos1.x && wall.position_2.x === pos2.x) ||
		(wall.position_1.x === pos2.x && wall.position_2.x === pos1.x)
	)
}

const crossesVerticalWallSpan = (wall: Wall, pos1: Position): boolean => {
	return wall.position_1.y === pos1.y || wall.position_1.y + 1 === pos1.y
}

export const getPossibleMoves = (state: Game, playerId: string): Position[] => {
	const player =
		state.player_1.user_id === playerId ? state.player_1 : state.player_2
	const possibleMoves = [
		{ x: player.position.x, y: player.position.y - 1 },
		{ x: player.position.x, y: player.position.y + 1 },
		{ x: player.position.x - 1, y: player.position.y },
		{ x: player.position.x + 1, y: player.position.y },
	]

	return possibleMoves.filter((pos) => isMoveValid(state, playerId, pos))
}
