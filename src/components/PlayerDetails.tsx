import React from 'react'
import { FaCircle } from 'react-icons/fa'

interface PlayerDetailsProps {
	userId: string
	walls: number
	color: 'blue' | 'red'
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({
	userId,
	walls,
	color,
}) => {
	return (
		<div className='flex justify-between w-full p-2'>
			<div className='flex items-center gap-2 text-center'>
				<FaCircle className={`w-6 h-6 text-${color}-500`} />
				<p>{userId}</p>
			</div>
			<div className='flex'>Walls left: {walls}</div>
		</div>
	)
}

export default PlayerDetails
