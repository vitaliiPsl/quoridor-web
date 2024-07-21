import React from 'react'

interface StartGameFormProps {
	onSubmit: (e: React.FormEvent) => void
	setUserId: (userId: string) => void
}

const StartGameForm: React.FC<StartGameFormProps> = ({
	onSubmit,
	setUserId,
}) => {
	return (
		<form onSubmit={onSubmit} className='game-control flex gap-2 mb-4'>
			<input
				type='text'
				required
				placeholder='User ID'
				className='text-zinc-900 px-4 py-2 rounded'
				onChange={(e) => setUserId(e.target.value)}
			/>
			<button
				type='submit'
				className='bg-zinc-900 text-white border border-white hover:bg-white hover:text-zinc-900 px-4 py-2 rounded'
			>
				Start Game
			</button>
		</form>
	)
}

export default StartGameForm
