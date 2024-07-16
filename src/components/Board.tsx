import React, { useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { Game, Position, Wall as WallType } from '../types/game'
import { getPossibleMoves } from '../utils/game_engine'
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
	isPossibleMove: boolean
	onCellClick: () => void
	onPlayerClick: () => void
}

interface WallProps {
	direction: 'horizontal' | 'vertical'
	pos1: Position
	pos2: Position
	isWall: boolean
	onPlaceWall: () => void
}

const Cell: React.FC<CellProps> = ({
	isPlayer1,
	isPlayer2,
	isPossibleMove,
	onCellClick,
	onPlayerClick,
}) => (
	<div
		className={`h-14 w-14 flex justify-center items-center rounded-sm border border-gray-1700 relative
            ${isPossibleMove ? 'bg-green-300' : 'bg-white'}`}
		onClick={onCellClick}
	>
		{(isPlayer1 || isPlayer2) && (
			<div
				className={`player${isPlayer1 ? '1' : '2'} bg-transparent`}
				onMouseDown={onPlayerClick}
			>
				<FaCircle
					className={`w-10 h-10 text-${
						isPlayer1 ? 'blue' : 'red'
					}-500`}
				/>
			</div>
		)}
	</div>
)

const Wall: React.FC<WallProps> = ({ direction, isWall, onPlaceWall }) => (
	<div
		className={`
            ${direction === 'vertical' ? 'w-2 h-14' : 'h-2 w-14'}
            ${isWall ? 'bg-purple-500' : 'bg-transparent cursor-pointer'}
        `}
		onClick={!isWall ? onPlaceWall : undefined}
	/>
)

const Board: React.FC<BoardProps> = ({ gameState, onMove, onPlaceWall }) => {
	const [activePlayer, setActivePlayer] = useState<string>('')
	const [possibleMoves, setPossibleMoves] = useState<Position[]>([])

	const handlePlayerClick = (playerId: string): void => {
		if (activePlayer === '') {
			const possibleMoves = getPossibleMoves(gameState, playerId)
			console.log(possibleMoves)
			setPossibleMoves(possibleMoves)
			setActivePlayer(playerId)
		} else {
			setPossibleMoves([])
			setActivePlayer('')
		}
	}

	const handleCellClick = (x: number, y: number) => {
		const position: Position = { x: x, y: y }
		if (
			activePlayer !== '' &&
			possibleMoves.some((pos) => pos.x === x && pos.y === y)
		) {
			onMove(activePlayer, position)
			setPossibleMoves([])
			setActivePlayer('')
		}
	}

	const isWallPlaced = (
		pos1: Position,
		pos2: Position,
		direction: 'horizontal' | 'vertical'
	) =>
		gameState.walls.some((wall) =>
			isWallInBetween(wall, pos1, pos2, direction)
		)

	const renderCell = (x: number, y: number) => {
		const isPlayer1 =
			gameState.player_1.position.x === x &&
			gameState.player_1.position.y === y
		const isPlayer2 =
			gameState.player_2.position.x === x &&
			gameState.player_2.position.y === y
		const isPossibleMove = possibleMoves.some(
			(pos) => pos.x === x && pos.y === y
		)

		return (
			<Cell
				key={`cell-${x}-${y}`}
				x={x}
				y={y}
				isPlayer1={isPlayer1}
				isPlayer2={isPlayer2}
				isPossibleMove={isPossibleMove}
				onCellClick={() => handleCellClick(x, y)}
				onPlayerClick={() => {
					if (isPlayer1) handlePlayerClick(gameState.player_1.user_id)
					if (isPlayer2) handlePlayerClick(gameState.player_2.user_id)
				}}
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

	const createRow = (y: number, isWallRow: boolean) => {
		return Array(9)
			.fill(null)
			.map((_, x) => (
				<React.Fragment
					key={`${isWallRow ? 'wall' : 'cell'}-${x}-${y}`}
				>
					{isWallRow
						? renderWall(x, y, 'horizontal')
						: renderCell(x, y)}
					{x < 8 &&
						(isWallRow ? (
							<div className='w-2 h-2 bg-transparent' />
						) : (
							renderWall(x, y, 'vertical')
						))}
				</React.Fragment>
			))
	}

	const renderBoard = () => {
		return Array(17)
			.fill(null)
			.map((_, index) => (
				<div key={`row-${index}`} className='flex'>
					{createRow(Math.floor(index / 2), index % 2 !== 0)}
				</div>
			))
	}

	return (
		<div className='board-container flex flex-col justify-center items-center'>
			{renderBoard()}
		</div>
	)
}

export default Board
