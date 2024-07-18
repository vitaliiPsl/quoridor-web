import { Game, Player, Position, Wall, Direction } from '../types/game'

function abs(x: number): number {
	return x < 0 ? -x : x
}

export interface GameEngine {
	isMoveValid(state: Game, playerId: string, newPosition: Position): boolean
	isWallPlacementValid(state: Game, wall: Wall): boolean
	getPossibleMoves(state: Game, playerId: string): Position[]
	isWallInBetween(existing: Wall, wall: Wall): boolean
}

export class GameEngineImpl implements GameEngine {
	isMoveValid(state: Game, playerId: string, newPosition: Position): boolean {
		const player = this.getPlayer(state, playerId)
		const opponent = this.getOpponent(state, playerId)

		if (this.positionsEqual(opponent.position, newPosition)) {
			return false
		}

		if (!this.isWithinBounds(newPosition)) {
			return false
		}

		if (this.isJumpOverOpponent(state, player, opponent, newPosition)) {
			return true
		}

		if (!this.positionsAdjacent(player.position, newPosition)) {
			return false
		}

		if (this.crossesWall(state, player.position, newPosition)) {
			return false
		}

		return true
	}

	isWallPlacementValid(state: Game, wall: Wall): boolean {
		if (this.positionsEqual(wall.position_1, wall.position_2)) {
			return false
		}

		if (!this.isWallWithinBounds(wall)) {
			return false
		}

		if (this.wallsOverlap(state, wall)) {
			return false
		}

		state.walls.push(wall)
		if (
			!this.hasPathToGoal(state, state.player_1) ||
			!this.hasPathToGoal(state, state.player_2)
		) {
			state.walls.pop()
			return false
		}
		state.walls.pop()

		return true
	}

	getPossibleMoves(state: Game, playerId: string): Position[] {
		const player = this.getPlayer(state, playerId)
		const opponent = this.getOpponent(state, playerId)

		const possibleMoves: Position[] = []

		for (let position of this.getAdjacentPositions(player.position)) {
			if (this.isMoveValid(state, playerId, position)) {
				possibleMoves.push(position)
			}
		}

		if (this.positionsAdjacent(player.position, opponent.position)) {
			for (let position of this.getAdjacentPositions(opponent.position)) {
				if (this.isMoveValid(state, playerId, position)) {
					possibleMoves.push(position)
				}
			}
		}

		return possibleMoves
	}

	isWallInBetween(existing: Wall, wall: Wall): boolean {
		if (
			existing.direction === wall.direction &&
			wall.direction === 'horizontal'
		) {
			return this.isHorizontalWallInBetween(
				existing,
				wall.position_1,
				wall.position_2
			)
		}

		if (
			existing.direction === wall.direction &&
			wall.direction === 'vertical'
		) {
			return this.isVerticalWallInBetween(
				existing,
				wall.position_1,
				wall.position_2
			)
		}

		return false
	}

	isHorizontalWallInBetween(
		wall: Wall,
		pos1: Position,
		pos2: Position
	): boolean {
		return (
			this.crossesHorizontalWall(wall, pos1, pos2) &&
			this.crossesHorizontalWallSpan(wall, pos1)
		)
	}

	isVerticalWallInBetween(
		wall: Wall,
		pos1: Position,
		pos2: Position
	): boolean {
		return (
			this.crossesVerticalWall(wall, pos1, pos2) &&
			this.crossesVerticalWallSpan(wall, pos1)
		)
	}

	getPlayer(state: Game, playerId: string): Player {
		return state.player_1.user_id === playerId
			? state.player_1
			: state.player_2
	}

	getOpponent(state: Game, playerId: string): Player {
		return state.player_1.user_id === playerId
			? state.player_2
			: state.player_1
	}

	getDirection(pos1: Position, pos2: Position): Direction {
		return pos1.x - pos2.x == 0 ? 'vertical' : 'horizontal'
	}

	positionsEqual(pos1: Position, pos2: Position): boolean {
		return pos1.x === pos2.x && pos1.y === pos2.y
	}

	isWithinBounds(pos: Position): boolean {
		return pos.x >= 0 && pos.x < 9 && pos.y >= 0 && pos.y < 9
	}

	positionsAdjacent(pos1: Position, pos2: Position): boolean {
		return (
			(Math.abs(pos1.x - pos2.x) === 1 && pos1.y === pos2.y) ||
			(Math.abs(pos1.y - pos2.y) === 1 && pos1.x === pos2.x)
		)
	}

	getAdjacentPositions(position: Position): Position[] {
		return [
			{ x: position.x - 1, y: position.y },
			{ x: position.x + 1, y: position.y },
			{ x: position.x, y: position.y - 1 },
			{ x: position.x, y: position.y + 1 },
		]
	}

	crossesWall(state: Game, pos1: Position, pos2: Position): boolean {
		const direction = this.getDirection(pos1, pos2)

		for (let wall of state.walls) {
			if (wall.direction == direction) {
				continue
			}

			if (
				direction == 'horizontal' &&
				this.crossesVerticalWall(wall, pos1, pos2) &&
				this.crossesVerticalWallSpan(wall, pos1)
			) {
				return true
			}

			if (
				direction == 'vertical' &&
				this.crossesHorizontalWall(wall, pos1, pos2) &&
				this.crossesHorizontalWallSpan(wall, pos1)
			) {
				return true
			}
		}

		return false
	}

	crossesHorizontalWall(wall: Wall, pos1: Position, pos2: Position): boolean {
		return (
			(wall.position_1.y == pos1.y && wall.position_2.y == pos2.y) ||
			(wall.position_1.y == pos2.y && wall.position_2.y == pos1.y)
		)
	}

	crossesHorizontalWallSpan(wall: Wall, pos1: Position): boolean {
		return wall.position_1.x == pos1.x || wall.position_1.x + 1 == pos1.x
	}

	crossesVerticalWall(wall: Wall, pos1: Position, pos2: Position): boolean {
		return (
			(wall.position_1.x == pos1.x && wall.position_2.x == pos2.x) ||
			(wall.position_1.x == pos2.x && wall.position_2.x == pos1.x)
		)
	}

	crossesVerticalWallSpan(wall: Wall, pos1: Position): boolean {
		return wall.position_1.y == pos1.y || wall.position_1.y + 1 == pos1.y
	}

	isJumpOverOpponent(
		state: Game,
		player: Player,
		opponent: Player,
		newPosition: Position
	): boolean {
		if (
			!this.positionsAdjacent(player.position, opponent.position) ||
			this.crossesWall(state, player.position, opponent.position)
		) {
			return false
		}

		const behindOpponent: Position = {
			x: opponent.position.x + (opponent.position.x - player.position.x),
			y: opponent.position.y + (opponent.position.y - player.position.y),
		}
		if (!this.crossesWall(state, opponent.position, behindOpponent)) {
			return this.positionsEqual(newPosition, behindOpponent)
		}

		const adjacentPositions = this.getAdjacentPositions(opponent.position)
		for (let position of adjacentPositions) {
			if (
				this.isWithinBounds(opponent.position) &&
				this.positionsEqual(newPosition, position) &&
				!this.positionsEqual(player.position, position) &&
				!this.crossesWall(state, opponent.position, position)
			) {
				return true
			}
		}

		return false
	}

	isWallWithinBounds(wall: Wall): boolean {
		let deltaX = 0
		let deltaY = 0

		if (wall.direction == 'horizontal') {
			deltaX = 1
		} else if (wall.direction == 'vertical') {
			deltaY = 1
		} else {
			return false
		}

		return (
			this.isWithinBounds(wall.position_1) &&
			this.isWithinBounds(wall.position_2) &&
			this.isWithinBounds({
				x: wall.position_1.x + deltaX,
				y: wall.position_1.y + deltaY,
			}) &&
			this.isWithinBounds({
				x: wall.position_2.x + deltaX,
				y: wall.position_2.y + deltaY,
			})
		)
	}

	wallsOverlap(state: Game, wall: Wall): boolean {
		for (let existingWall of state.walls) {
			if (wall.direction != existingWall.direction) {
				continue
			}

			if (
				wall.direction == 'horizontal' &&
				this.wallsOverlapHorizontally(wall, existingWall)
			) {
				return true
			}

			if (
				wall.direction == 'vertical' &&
				this.wallsOverlapVertically(wall, existingWall)
			) {
				return true
			}
		}

		return false
	}

	/*
    Walls overlap horizontally if:
      - both have horizontal directoin
      - on the same horizontal line(y coordinates are equal)
      - horizontal lines overlap
    */
	wallsOverlapHorizontally(wall1: Wall, wall2: Wall): boolean {
		// horizontal direction
		if (
			!(
				wall1.direction == wall2.direction &&
				wall1.direction == 'horizontal'
			)
		) {
			return false
		}

		// on the same horizontal line
		if (
			!(
				(wall1.position_1.y == wall2.position_1.y &&
					wall1.position_2.y == wall2.position_2.y) ||
				(wall1.position_2.y == wall2.position_1.y &&
					wall1.position_1.y == wall2.position_2.y)
			)
		) {
			return false
		}

		// horizontal lines overlap
		if (
			!(
				wall1.position_1.x == wall2.position_1.x ||
				wall1.position_1.x + 1 == wall2.position_1.x ||
				wall2.position_1.x + 1 == wall1.position_1.x
			)
		) {
			return false
		}

		return true
	}

	/*
    Walls overlap vertically if:
      - both have vertical directoin
      - on the same vertical line(x coordinates are equal)
      - vertical lines overlap
    */
	wallsOverlapVertically(wall1: Wall, wall2: Wall): boolean {
		// vertical direction
		if (
			!(
				wall1.direction == wall2.direction &&
				wall1.direction == 'vertical'
			)
		) {
			return false
		}

		// on the same vertical line
		if (
			!(
				(wall1.position_1.x == wall2.position_1.x &&
					wall1.position_2.x == wall2.position_2.x) ||
				(wall1.position_2.x == wall2.position_1.x &&
					wall1.position_1.x == wall2.position_2.x)
			)
		) {
			return false
		}

		// vertical lines overlap
		if (
			!(
				wall1.position_1.y == wall2.position_1.y ||
				wall1.position_1.y + 1 == wall2.position_1.y ||
				wall2.position_1.y + 1 == wall1.position_1.y
			)
		) {
			return false
		}

		return true
	}

	hasPathToGoal(state: Game, player: Player): boolean {
		const visited: Record<string, boolean> = {}
		const queue: Position[] = [player.position]

		while (queue.length > 0) {
			const current = queue.shift()!
			if (current.y == player.goal) {
				return true
			}

			for (const neighbor of this.getAdjacentPositions(current)) {
				const key = `${neighbor.x},${neighbor.y}`

				if (
					!this.isWithinBounds(neighbor) ||
					visited[key] ||
					this.crossesWall(state, current, neighbor)
				) {
					continue
				}

				visited[key] = true
				queue.push(neighbor)
			}
		}

		return false
	}
}
