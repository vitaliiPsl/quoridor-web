import React, { useEffect, useState } from 'react'

import { useWebsocket } from '../providers/WebsocketProvider'
import { Game, Position, Wall } from '../types/game'

import { FaCircle } from 'react-icons/fa'
import Board from '../components/Board'
import StartGameForm from '../components/StartGameForm'

const GamePage: React.FC = () => {
	const { connect, sendMessage, onMessage } = useWebsocket()

	const [userId, setUserId] = useState('')
	const [gameId, setGameId] = useState('')
	const [gameState, setGameState] = useState<Game | null>(null)
	const [searching, setSearching] = useState(false)

	useEffect(() => {
		if (gameState != null) {
			setGameId(gameState.game_id)
			setSearching(false)
		}
	}, [gameState])

	const startGame = (e: React.FormEvent) => {
		e.preventDefault()
		connect(userId, handleConnect, handleDisconnect)
		setSearching(true)
	}

	const handleConnect = () => {
		console.log('Connected!')
		sendMessage({ event: 'start_game' })
	}

	const handleDisconnect = () => {
		console.log('Disconnected!')
	}

	const makeMove = (position: Position) => {
		console.log('Making a move')
		if (gameState?.turn === userId) {
			sendMessage({
				event: 'make_move',
				payload: {
					game_id: gameId,
					position: position,
				},
			})
		}
	}

	const placeWall = (wall: Wall) => {
		console.log('Placing a wall')
		if (gameState?.turn === userId) {
			sendMessage({
				event: 'place_wall',
				payload: {
					game_id: gameId,
					wall: wall,
				},
			})
		}
	}

	onMessage((message) => {
		console.log('Received message: ', message.event)
		if (message.event === 'game_state') {
			console.log(message)
			setGameState(message.payload)
		}
	})

	return (
		<div className='flex flex-col items-center'>
			{!searching && !gameState && (
				<StartGameForm onSubmit={startGame} setUserId={setUserId} />
			)}

			{gameState && (
				<div className='flex flex-col items-center gap-2 text-white'>
					<div className='w-full p-2 flex justify-between'>
						<div className='text-center flex gap-2 items-center'>
							<FaCircle className='w-6 h-6 text-blue-500' />
							<p>{gameState.player_1.user_id}</p>
						</div>

						{gameState.turn == gameState.player_1.user_id && (
							<div>Blue to move</div>
						)}

						<div className=''>
							<p>Walls left: {gameState.player_1.walls}</p>
						</div>
					</div>
					<Board
						playerId={userId}
						gameState={gameState}
						onMove={makeMove}
						onPlaceWall={placeWall}
					/>
					<div className='w-full p-2 flex justify-between'>
						<div className='text-center flex gap-2 items-center'>
							<FaCircle className='w-6 h-6 text-red-500' />
							<p>{gameState.player_2.user_id}</p>
						</div>

						{gameState.turn == gameState.player_2.user_id && (
							<div>Red to move</div>
						)}

						<div className=''>
							<p>Walls left: {gameState.player_2.walls}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default GamePage
