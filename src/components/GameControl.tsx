import React from 'react'
import { Game, Move } from '../types/game'
import { FaCircle } from 'react-icons/fa'

interface GameControlProps {
	gameState: Game
	onResign: () => void
}

const GameControl: React.FC<GameControlProps> = ({ gameState, onResign }) => {
	const renderCircle = (color: string, height: string, width: string) => {
		return <FaCircle className={`${height} ${width} ${color}`} />
	}

	const renderPlayer = (playerId: string) => {
		return playerId === gameState.player_1.user_id
			? renderCircle('text-blue-500', 'h-4', 'w-4')
			: renderCircle('text-red-500', 'h-4', 'w-4')
	}

	const renderMove = (index: number, move: Move) => {
		return (
			<div key={index} className='move flex items-center gap-2'>
				{renderPlayer(move.user_id)}
				<p>
					{move.type === 'move'
						? `Move to (${move.position?.x}, ${move.position?.y})`
						: `Placed wall at (${move.wall?.position_1.x}, ${move.wall?.position_1.y})`}
				</p>
			</div>
		)
	}

	const getPlayerColor = (playerId: string) => {
		if (playerId === gameState.player_1.user_id) return 'Blue'
		if (playerId === gameState.player_2.user_id) return 'Red'
		return 'Unknown'
	}

	const renderGameStatus = () => {
		if (gameState.winner) {
			const winnerColor =
				gameState.winner === gameState.player_1.user_id ? 'Blue' : 'Red'
			return <p className='text-lg font-bold'>{winnerColor} wins!</p>
		}
		return gameState.turn === gameState.player_1.user_id ? (
			<>
				{renderCircle('text-blue-500', 'h-6', 'w-6')}
				<p className='text-lg font-bold'>Blue to move</p>
			</>
		) : (
			<>
				{renderCircle('text-red-500', 'h-6', 'w-6')}
				<p className='text-lg font-bold'>Red to move</p>
			</>
		)
	}

	return (
		<div className='p-4 min-w-80 h-full flex flex-col gap-4 bg-white rounded-md text-zinc-800'>
			<div className='flex items-center gap-2'>{renderGameStatus()}</div>
			<div className='p-4 flex-1 flex flex-col bg-[#f1f1f1] border border-zinc-800 rounded-md overflow-y-auto'>
				<div className='flex-1 flex flex-col'>
					{gameState.moves?.length === 0 && (
						<div className='flex-1 flex justify-center items-center'>
							<p>No history</p>
						</div>
					)}
					{gameState.moves.map((move, index) =>
						renderMove(index, move)
					)}
				</div>
			</div>
			<button
				onClick={onResign}
				className='px-4 py-2 text-zinc-800 border border-zinc-800 rounded hover:text-white hover:bg-zinc-800'
			>
				Resign
			</button>
		</div>
	)
}

export default GameControl
