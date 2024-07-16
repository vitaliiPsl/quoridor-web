import { Direction, Position, Wall } from '../types/game'

export const isWallInBetween = (
	wall: Wall,
	pos1: Position,
	pos2: Position,
	direction: Direction
): boolean => {
	if (wall.direction == direction && direction === 'horizontal') {
		return (
			(wall.position_1.x === pos1.x &&
				wall.position_1.y === pos1.y &&
				wall.position_2.x === pos2.x &&
				wall.position_2.y === pos2.y) ||
			(wall.position_2.x === pos1.x &&
				wall.position_2.y === pos1.y &&
				wall.position_1.x === pos2.x &&
				wall.position_1.y === pos2.y) ||
			(wall.position_1.x + 1 === pos1.x &&
				wall.position_1.y === pos1.y &&
				wall.position_2.x + 1 === pos2.x &&
				wall.position_2.y === pos2.y) ||
			(wall.position_2.x + 1 === pos1.x &&
				wall.position_2.y === pos1.y &&
				wall.position_1.x + 1 === pos2.x &&
				wall.position_1.y === pos2.y)
		)
	}

	if (wall.direction == direction && direction === 'vertical') {
		return (
			(wall.position_1.x === pos1.x &&
				wall.position_1.y === pos1.y &&
				wall.position_2.x === pos2.x &&
				wall.position_2.y === pos2.y) ||
			(wall.position_2.x === pos1.x &&
				wall.position_2.y === pos1.y &&
				wall.position_1.x === pos2.x &&
				wall.position_1.y === pos2.y) ||
			(wall.position_1.x === pos1.x &&
				wall.position_1.y + 1 === pos1.y &&
				wall.position_2.x === pos2.x &&
				wall.position_2.y + 1 === pos2.y) ||
			(wall.position_2.x === pos1.x &&
				wall.position_2.y + 1 === pos1.y &&
				wall.position_1.x === pos2.x &&
				wall.position_1.y + 1 === pos2.y)
		)
	}

	return false
}

export const isWallAtTheBottom = (wall: Wall, x: number, y: number) => {
	return (
		(wall.position_1.y === y &&
			wall.position_1.x === x &&
			wall.position_2.y === y + 1) ||
		(wall.position_2.y === y &&
			wall.position_2.x === x &&
			wall.position_1.y === y + 1) ||
		(wall.position_1.y === y &&
			wall.position_1.x + 1 === x &&
			wall.position_2.y === y + 1) ||
		(wall.position_2.y === y &&
			wall.position_2.x + 1 === x &&
			wall.position_1.y === y + 1)
	)
}

export const isWallAtTheTop = (wall: Wall, x: number, y: number) => {
	return (
		(wall.position_1.y === y &&
			wall.position_1.x === x &&
			wall.position_2.y === y - 1) ||
		(wall.position_2.y === y &&
			wall.position_2.x === x &&
			wall.position_1.y === y - 1) ||
		(wall.position_1.y === y &&
			wall.position_1.x + 1 === x &&
			wall.position_2.y === y - 1) ||
		(wall.position_2.y === y &&
			wall.position_2.x + 1 === x &&
			wall.position_1.y === y - 1)
	)
}

export const isWallOnTheRightSide = (wall: Wall, x: number, y: number) => {
	return (
		(wall.position_1.y === y &&
			wall.position_1.x === x &&
			wall.position_2.x === x + 1) ||
		(wall.position_2.y === y &&
			wall.position_2.x === x &&
			wall.position_1.x === x + 1) ||
		(wall.position_1.x === x &&
			wall.position_1.y + 1 === y &&
			wall.position_2.x === x + 1) ||
		(wall.position_2.x === x &&
			wall.position_2.y + 1 === y &&
			wall.position_1.x === x + 1)
	)
}

export const isWallOnTheLeftSide = (wall: Wall, x: number, y: number) => {
	return (
		(wall.position_1.x === x &&
			wall.position_1.y === y &&
			wall.position_2.x === x - 1) ||
		(wall.position_2.x === x &&
			wall.position_2.y === y &&
			wall.position_1.x === x - 1) ||
		(wall.position_1.x === x &&
			wall.position_1.y + 1 === y &&
			wall.position_2.x === x - 1) ||
		(wall.position_2.x === x &&
			wall.position_2.y + 1 === y &&
			wall.position_1.x === x - 1)
	)
}
