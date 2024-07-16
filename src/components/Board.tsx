import React from 'react'
import { FaCircle } from 'react-icons/fa'

import { Game, Position, Wall as WallType } from '../types/game'
import { isWallInBetween } from '../utils/wall_utils'

interface BoardProps {
	gameState: Game
	onMove: (userId: string, position: Position) => void
	onPlaceWall: (userId: string, wall: WallType) => void
}

interface CellProps {
	x: number
	y: number
	isPlayer1: boolean
	isPlayer2: boolean
}

interface WallProps {
	direction: 'horizontal' | 'vertical'
	pos1: Position
	pos2: Position
	isWall: boolean
	onPlaceWall: () => void
}

const Cell: React.FC<CellProps> = ({ x, y, isPlayer1, isPlayer2 }) => (
	<div className='h-14 w-14 flex justify-center items-center bg-white rounded-sm border border-gray-1700 relative'>
		{isPlayer1 && (
			<div className='player1 bg-transparent'>
				<FaCircle className='w-10 h-10 text-blue-500' />
			</div>
		)}
		{isPlayer2 && (
			<div className='player2 bg-transparent'>
				<FaCircle className='w-10 h-10 text-red-500' />
			</div>
		)}
	</div>
)

const Wall: React.FC<WallProps> = ({
	direction,
	pos1,
	pos2,
	isWall,
	onPlaceWall,
}) => (
	<div
		className={`
            ${direction === 'vertical' ? 'w-2 h-14' : 'h-2 w-14'}
            ${isWall ? 'bg-purple-500' : 'bg-transparent cursor-pointer '}
        `}
		onClick={!isWall ? onPlaceWall : undefined}
	/>
)

const Board: React.FC<BoardProps> = ({ gameState, onMove, onPlaceWall }) => {
	const isWallPlaced = (
		pos1: Position,
		pos2: Position,
		direction: 'horizontal' | 'vertical'
	) => {
		return gameState.walls.some(
			(wall) => isWallInBetween(wall, pos1, pos2, direction)
		)
	}

	const renderCell = (x: number, y: number) => {
		const isPlayer1 =
			gameState.player_1.position.x === x &&
			gameState.player_1.position.y === y
		const isPlayer2 =
			gameState.player_2.position.x === x &&
			gameState.player_2.position.y === y

		return (
			<Cell
				key={`cell-${x}-${y}`}
				x={x}
				y={y}
				isPlayer1={isPlayer1}
				isPlayer2={isPlayer2}
			/>
		)
	}

	const renderWall = (
		x: number,
		y: number,
		direction: 'horizontal' | 'vertical'
	) => {
		const pos1: Position = { x, y }
		const pos2: Position =
			direction === 'vertical' ? { x: x + 1, y } : { x, y: y + 1 }
		const isWall = isWallPlaced(pos1, pos2, direction)
		console.log(`Wall: {${direction} (${pos1.x}, ${pos1.y}) (${pos2.x}, ${pos2.y})`)

		return (
			<Wall
				key={`${direction}-${x}-${y}`}
				direction={direction}
				pos1={pos1}
				pos2={pos2}
				isWall={isWall}
				onPlaceWall={() => {}}
			/>
		)
	}

	const createWallRow = (y: number) => {
		const row = []
		for (let x = 0; x < 9; x++) {
			row.push(renderWall(x, y, 'horizontal'))
			if (x < 8) {
				row.push(
					<div
						key={`intersection-${x}-${y}`}
						className='w-2 h-2 bg-transparent'
					/>
				)
			}
		}
		return row
	}

	const createCellRow = (y: number) => {
		const row = []
		for (let x = 0; x < 9; x++) {
			row.push(renderCell(x, y))
			if (x < 8) {
				row.push(renderWall(x, y, 'vertical'))
			}
		}
		return row
	}

	const renderBoard = () => {
		const board = []
		for (let y = 0; y < 9; y++) {
			board.push(
				<div key={`row-${y}`} className='flex'>
					{createCellRow(y)}
				</div>
			)
			if (y < 8) {
				board.push(
					<div key={`wall-row-${y}`} className='flex'>
						{createWallRow(y)}
					</div>
				)
			}
		}
		return board
	}

	return (
		<div className='board-container flex flex-col justify-center items-center'>
			{renderBoard()}
		</div>
	)
}

export default Board
