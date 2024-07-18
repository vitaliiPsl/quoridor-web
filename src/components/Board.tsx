import React, { useEffect, useState } from 'react'

import { Game, Position, Wall as WallType } from '../types/game'
import { GameEngineImpl } from '../utils/game_engine'

import Cell from './Cell'
import Wall from './Wall'

interface BoardProps {
	gameState: Game
	onMove: (userId: string, position: Position) => void
	onPlaceWall: (userId: string, wall: WallType) => void
}

const Board: React.FC<BoardProps> = ({ gameState, onMove, onPlaceWall }) => {
	const gameEngine = new GameEngineImpl()

	const [activePlayer, setActivePlayer] = useState<string>('')
	const [possibleMoves, setPossibleMoves] = useState<Position[]>([])
	const [hoveredWall, setHoveredWall] = useState<WallType | null>()

	const handlePlayerClick = (playerId: string): void => {
		if (activePlayer === '') {
			const possibleMoves = gameEngine.getPossibleMoves(
				gameState,
				playerId
			)
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

	const handleWallPlaceholderHover = (wall: WallType) => {
		if (
			activePlayer === '' &&
			gameEngine.isWallPlacementValid(gameState, wall)
		) {
			setHoveredWall(wall)
		}
	}

	const handleWallPlacement = (wall: WallType) => {
		if (
			activePlayer === '' &&
			gameEngine.isWallPlacementValid(gameState, wall)
		) {
			onPlaceWall(activePlayer, wall)
		}
	}

	const isWallPlaced = (wall: WallType) =>
		gameState.walls.some((existing) =>
			gameEngine.isWallInBetween(existing, wall)
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

		const wall: WallType = {
			direction: direction,
			position_1: pos1,
			position_2: pos2,
		}

		const isWall = isWallPlaced(wall)

		let isHovered = false
		if (hoveredWall) {
			isHovered = gameEngine.isWallInBetween(hoveredWall!, wall)
		}

		return (
			<Wall
				key={`${direction}-${x}-${y}`}
				wall={wall}
				isWall={isWall}
				isHovered={isHovered}
				onPlaceWall={handleWallPlacement}
				onHover={handleWallPlaceholderHover}
				onHoverEnd={() => setHoveredWall(null)}
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
