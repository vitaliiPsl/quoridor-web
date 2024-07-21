import React, { useEffect, useState } from 'react'

import { useWebsocket } from '../providers/WebsocketProvider'
import { Game, Position, Wall } from '../types/game'

import Board from '../components/Board'
import StartGameForm from '../components/StartGameForm'
import GameSearch from '../components/GameSearch'
import PlayerDetails from '../components/PlayerDetails'
import GameControl from '../components/GameControl'

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
		setSearching(false)
	}

	const makeMove = (position: Position) => {
		console.log('Making a move')
		if (gameState?.status === 'in_progress' && gameState?.turn === userId) {
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
		if (gameState?.status === 'in_progress' && gameState?.turn === userId) {
			sendMessage({
				event: 'place_wall',
				payload: {
					game_id: gameId,
					wall: wall,
				},
			})
		}
	}

	const resign = () => {
		console.log('Resigning')
		if (gameState) {
			sendMessage({
				event: 'resign',
				payload: {
					game_id: gameId,
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
			{searching && !gameState && (
				<GameSearch onCancel={handleDisconnect} />
			)}
			{gameState && (
				<div className='flex flex-col items-center gap-2 text-white'>
					<PlayerDetails
						userId={gameState.player_1.user_id}
						walls={gameState.player_1.walls}
						color='blue'
					/>
					<div className='board-section flex gap-4'>
						<Board
							playerId={userId}
							gameState={gameState}
							onMove={makeMove}
							onPlaceWall={placeWall}
						/>
						<GameControl gameState={gameState} onResign={resign} />
					</div>
					<PlayerDetails
						userId={gameState.player_2.user_id}
						walls={gameState.player_2.walls}
						color='red'
					/>
				</div>
			)}
		</div>
	)
}

export default GamePage
