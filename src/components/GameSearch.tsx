import React, { useEffect, useState } from 'react'

interface GameSearchProps {
	onCancel: () => void
}

const GameSearch: React.FC<GameSearchProps> = ({ onCancel }) => {
	const [searchDuration, setSearchDuration] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			setSearchDuration((prev) => prev + 1)
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	return (
		<div className='flex flex-col items-center gap-6 text-white'>
			<div className='text-2xl'>Searching for a game...</div>
			<div className='text-6xl font-bold'>{searchDuration}s</div>
            <button
				onClick={onCancel}
				className='min-w-48 px-4 py-2 text-white border border-white rounded-md hover:text-zinc-800 hover:bg-white'
			>
				Cancel
			</button>
		</div>
	)
}

export default GameSearch
