import { FaCircle } from 'react-icons/fa'

interface CellProps {
	x: number
	y: number
	isPlayer1: boolean
	isPlayer2: boolean
	isPossibleMove: boolean
	onCellClick: () => void
	onPlayerClick: () => void
}


const Cell: React.FC<CellProps> = ({
	isPlayer1,
	isPlayer2,
	isPossibleMove,
	onCellClick,
	onPlayerClick,
}) => (
	<div
		className={`h-14 w-14 flex justify-center items-center rounded-sm border relative
            ${isPossibleMove ? 'bg-green-300' : 'bg-white'}`}
		onClick={onCellClick}
	>
		{(isPlayer1 || isPlayer2) && (
			<div
				className={`player${isPlayer1 ? '1' : '2'} bg-transparent`}
				onMouseDown={onPlayerClick}
			>
				<FaCircle
					className={`w-10 h-10 ${isPlayer1 ? 'text-blue-500' : 'text-red-500'}`}
				/>
			</div>
		)}
	</div>
)

export default Cell